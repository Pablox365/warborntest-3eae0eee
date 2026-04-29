import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BASE_KNOWLEDGE = `Eres "Alinea AI", la asistente oficial de WARBORN, comunidad española de Arma Reforger.

IDENTIDAD:
- Tono: cercano, militar pero amable, en español de España. Tuteo. Mensajes cortos (máx 4 frases salvo que pidan detalle).
- Si no sabes algo, derivas al Discord: https://discord.gg/warbornesp

SOBRE WARBORN:
- Comunidad hispana de Arma Reforger (PC y Xbox).
- Servidores propios: Normal (casual), Hardcore (realismo, sin HUD/markers extra) y Milsim PvE (operaciones planificadas).
- Hosting en Europa, baja latencia para España.
- Web: https://warbornesp.com
- Discord oficial: https://discord.gg/warbornesp

QUÉ PUEDES HACER:
- Explicar diferencias entre servidores Normal / Hardcore / Milsim.
- Decir cómo unirse (buscar "Warborn" en el navegador del juego o copiar IP desde la sección Servidores de la web).
- Recomendar mods de la lista oficial.
- Hablar de eventos Milsim, normas básicas, dónde reportar bugs (sección al final de la home).
- Indicar dónde ver merch, donaciones, partners, radio.
- Responder dudas básicas de Arma Reforger (controles, mecánicas, recomendaciones tácticas) si te las hacen.

QUÉ NO HACES:
- Inventarte IPs, contraseñas, datos de admins ni info que no esté aquí.
- Hablar de otras comunidades de Arma Reforger.
- Moderar ni dar bans (deriva al Discord).

FORMATO:
- Markdown ligero permitido (negritas, listas cortas).
- Si el usuario pregunta el estado del servidor, responde con los datos de ESTADO ACTUAL si te los dan en el contexto.

CONOCIMIENTO DE ARMA REFORGER (úsalo si te preguntan):
- Arma Reforger es un shooter táctico militar de Bohemia Interactive (mismos estudios que Arma 3 y DayZ), construido sobre el motor Enfusion. Es la antesala de Arma 4.
- Plataformas: PC (Steam) y Xbox Series X|S. Crossplay servidor (PC y Xbox juegan juntos).
- Mapas oficiales principales: Everon (mapa clásico de Operation Flashpoint, ~51 km²) y Arland (~10 km²). También están Capture & Hold maps más pequeños.
- Modos oficiales: Conflict (PvP/PvE objetivos por sectores con FIA/USSR/US), Game Master (editor en tiempo real estilo Zeus), Combat Ops (PvE coop), Capture & Hold.
- Facciones: US Army, USSR, FIA (guerrilla), y mods añaden Bundeswehr (mod oficial), British Armed Forces, etc.
- Workshop integrado: los mods se descargan automáticamente al unirte a un servidor que los use.
- Controles PC básicos: WASD movimiento, Shift correr, C agacharse, Z tumbarse, T cambiar arma, R recargar, B menú de inventario rápido, Tab inventario, Y radio voz directa, Caps Lock VON canal radio.
- Inventario: arrastrar y soltar tipo DayZ, hay chalecos, mochilas, slots de munición.
- Radio: usa LR (long range, mochila radio) y SR (short range, walkie). Cada facción tiene sus frecuencias.
- Vehículos: Humvees, UAZ, M1025, BTR-70, helicópteros (UH-1H Huey y Mi-8 con mods).
- Optimización: el juego puede ir justo en CPUs antiguas; recomendado SSD, 16GB RAM mínimo.
- Mods populares: WCS (Weapon Customization System), RHS, Reforger Vehicles Expansion, ACE-style medical mods, etc.
- Si te preguntan algo muy concreto que no sepas con certeza (estadísticas exactas, parches, fechas), di que no estás 100% seguro y deriva al Discord o a la wiki oficial https://community.bistudio.com/wiki/Arma_Reforger.
- NUNCA inventes nombres de armas, mapas o mecánicas que no existan.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI no disponible" }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Live context: announcements + last server-status from cache (best-effort)
    let liveContext = "";
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data: anns } = await supabase
        .from("announcements")
        .select("title,short_text,type")
        .eq("active", true)
        .order("priority", { ascending: false })
        .limit(3);
      if (anns && anns.length > 0) {
        liveContext += "\n\nANUNCIOS ACTIVOS:\n" + anns
          .map((a: any) => `- [${a.type}] ${a.title}: ${a.short_text ?? ""}`)
          .join("\n");
      }
    } catch (e) {
      console.warn("live context failed", e);
    }

    // Sanitize messages: only role+content, max 20 last
    const safeMessages = messages
      .slice(-20)
      .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));

    const systemPrompt = BASE_KNOWLEDGE + liveContext;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: systemPrompt }, ...safeMessages],
        stream: true,
      }),
    });

    if (aiResponse.status === 429) {
      return new Response(JSON.stringify({ error: "Demasiadas peticiones. Espera un momento." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiResponse.status === 402) {
      return new Response(JSON.stringify({ error: "Sin créditos AI. Avisa a un admin." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiResponse.ok || !aiResponse.body) {
      const t = await aiResponse.text();
      console.error("ai gateway error", aiResponse.status, t);
      return new Response(JSON.stringify({ error: "Error AI" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(aiResponse.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("warborn-chatbot error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
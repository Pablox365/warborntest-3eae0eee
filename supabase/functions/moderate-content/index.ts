import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres el moderador automático de Warborn, una comunidad de Arma Reforger en español.

Tu trabajo es decidir si publicar un mensaje (reseña o respuesta) escrito por un usuario anónimo.

CONTEXTO IMPORTANTE — comunidad de gaming militar:
- Las quejas, críticas duras y opiniones negativas SON VÁLIDAS y deben publicarse. Ej: "el server es una mierda con lag" → APROBAR.
- Lenguaje fuerte normal de gaming (joder, mierda, coño, puta vida, hostia) es ACEPTABLE → APROBAR.
- Argot militar y de Arma Reforger es normal.

RECHAZA SOLO si el mensaje contiene:
1. Insultos personales graves dirigidos a otra persona ("eres un retrasado", "puto subnormal", etc.)
2. Discurso de odio (racismo, homofobia, antisemitismo, xenofobia, transfobia)
3. Amenazas de violencia reales
4. Spam: links sospechosos, promo de otros servidores/comunidades, anuncios
5. Datos personales de terceros (doxxing): teléfonos, direcciones, DNIs
6. Contenido sexual explícito o pornográfico
7. Mensajes vacíos o incoherentes ("asdfasdf", "aaaaaa", "test test test")
8. Agresividad gratuita extrema sin contenido (puro insulto sin reseña)

MARCA COMO "review" (revisión manual) si:
- Tienes dudas razonables
- El mensaje es ambiguo
- Podría ser una crítica legítima muy agresiva pero no estás seguro

APRUEBA todo lo demás, incluso si la reseña es muy negativa o usa palabrotas normales.

Devuelve siempre tu decisión vía la herramienta moderate.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, message, rating, kind } = await req.json();

    if (typeof message !== "string" || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: "message required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (message.length > 2000) {
      return new Response(JSON.stringify({ error: "message too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY missing");
      // Fail-open: if AI is unavailable, send to manual review
      return new Response(
        JSON.stringify({ decision: "review", reason: "AI no disponible — revisión manual" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = `Tipo: ${kind === "reply" ? "respuesta a una reseña" : "reseña principal"}
Nombre del autor: ${String(name ?? "(sin nombre)").slice(0, 80)}
${rating ? `Estrellas: ${rating}/5\n` : ""}Mensaje:
"""
${message.slice(0, 2000)}
"""`;

    const aiResponse = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "moderate",
                description: "Decide si publicar el mensaje y explica por qué",
                parameters: {
                  type: "object",
                  properties: {
                    decision: {
                      type: "string",
                      enum: ["approve", "reject", "review"],
                      description:
                        "approve = publicar inmediato; reject = ocultar; review = enviar a moderación manual",
                    },
                    category: {
                      type: "string",
                      enum: [
                        "ok",
                        "insultos",
                        "odio",
                        "amenazas",
                        "spam",
                        "doxxing",
                        "sexual",
                        "vacio",
                        "ambiguo",
                      ],
                    },
                    reason: {
                      type: "string",
                      description:
                        "Explicación clara y profesional en español (máx 120 caracteres). Habla como moderador humano, no como bot. Ejemplos buenos: 'Mensaje aprobado: crítica legítima sobre el rendimiento del servidor', 'Insulto personal grave dirigido a otro jugador', 'Pendiente de revisión por lenguaje muy agresivo aunque podría ser opinión válida'. NO uses jerga técnica.",
                    },
                  },
                  required: ["decision", "category", "reason"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "moderate" } },
        }),
      },
    );

    if (aiResponse.status === 429) {
      console.warn("Rate limit hit — sending to manual review");
      return new Response(
        JSON.stringify({ decision: "review", reason: "Rate limit — revisión manual" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiResponse.status === 402) {
      console.warn("Payment required — sending to manual review");
      return new Response(
        JSON.stringify({ decision: "review", reason: "Sin créditos AI — revisión manual" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiResponse.ok) {
      const txt = await aiResponse.text();
      console.error("AI gateway error", aiResponse.status, txt);
      return new Response(
        JSON.stringify({ decision: "review", reason: "Error AI — revisión manual" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiResponse.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in AI response", JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ decision: "review", reason: "Respuesta IA inválida" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const parsed = JSON.parse(toolCall.function.arguments);
    const decision: "approve" | "reject" | "review" =
      parsed.decision === "approve" || parsed.decision === "reject" || parsed.decision === "review"
        ? parsed.decision
        : "review";

    const reason = `[${parsed.category ?? "?"}] ${String(parsed.reason ?? "").slice(0, 200)}`;

    return new Response(JSON.stringify({ decision, reason }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    console.error("moderate-content error:", e);
    // Fail-open to manual review so users aren't blocked
    return new Response(
      JSON.stringify({ decision: "review", reason: "Error interno — revisión manual" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
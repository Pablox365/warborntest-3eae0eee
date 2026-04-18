import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type ModInput = { modId: string; name: string };
type Category = "VEHICULOS" | "ARMAS" | "MAPAS" | "SCRIPTS" | "OTROS";

const VALID: Category[] = ["VEHICULOS", "ARMAS", "MAPAS", "SCRIPTS", "OTROS"];

// Lightweight keyword classifier as fallback (and to skip AI when obvious)
function quickClassify(name: string): Category | null {
  const n = name.toLowerCase();
  if (/(vehicle|veh[ií]culo|tank|tanque|car|truck|cami[oó]n|jeep|humvee|btr|bmp|apc|helicopter|helicop|heli|plane|avi[oó]n|jet|boat|barco|aircraft|motor|mtvr)/i.test(n)) return "VEHICULOS";
  if (/(weapon|arma|rifle|pistol|pistola|gun|ak[- ]?\d|m4|m16|hk|sniper|francotir|knife|cuchillo|grenade|granad|ammo|munici|optic|scope|mira|holster|attachment|silenc|suppressor)/i.test(n)) return "ARMAS";
  if (/(map|mapa|terrain|terreno|island|isla|kolgujev|everon|arland|sahrani|chernarus|takistan)/i.test(n)) return "MAPAS";
  if (/(script|enhance|fix|patch|tweak|util|framework|core|api|hud|ui|menu|admin|moderation|server tools|reforger workshop tools)/i.test(n)) return "SCRIPTS";
  return null;
}

async function aiClassifyBatch(names: string[]): Promise<Record<string, Category>> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const system = `Eres un clasificador de mods de Arma Reforger. Para cada nombre devuelve UNA categoría exacta de: VEHICULOS, ARMAS, MAPAS, SCRIPTS, OTROS.

Guía:
- VEHICULOS: tanques, coches, camiones, helicópteros, aviones, barcos, vehículos militares.
- ARMAS: rifles, pistolas, cuchillos, granadas, ópticas/miras, accesorios, munición.
- MAPAS: mapas, terrenos, islas, escenarios.
- SCRIPTS: frameworks, fixes, utilidades, mejoras de UI/HUD, herramientas de admin/server, API.
- OTROS: facciones, uniformes, contenido genérico, packs misceláneos, todo lo que no encaje claro.

Responde llamando a la función classify_mods.`;

  const user = `Clasifica estos mods (responde con un objeto donde la clave es el nombre exacto del mod y el valor la categoría):\n${names.map((n) => `- ${n}`).join("\n")}`;

  const properties: Record<string, { type: string; enum: Category[] }> = {};
  for (const n of names) properties[n] = { type: "string", enum: VALID };

  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "classify_mods",
            description: "Devuelve la categoría de cada mod",
            parameters: {
              type: "object",
              properties: {
                classifications: {
                  type: "object",
                  properties,
                  required: names,
                  additionalProperties: false,
                },
              },
              required: ["classifications"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "classify_mods" } },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    console.error("AI gateway error", resp.status, text);
    throw new Error(`AI gateway ${resp.status}`);
  }
  const data = await resp.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("No tool_call args");
  const parsed = JSON.parse(args);
  const map: Record<string, Category> = {};
  for (const [k, v] of Object.entries(parsed.classifications ?? {})) {
    if (typeof v === "string" && VALID.includes(v as Category)) map[k] = v as Category;
  }
  return map;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mods } = (await req.json()) as { mods: ModInput[] };
    if (!Array.isArray(mods)) {
      return new Response(JSON.stringify({ error: "mods array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Load cached classifications
    const { data: setting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "mod_categories")
      .maybeSingle();

    const cache: Record<string, Category> = (setting?.value as any) ?? {};
    const result: Record<string, Category> = {};
    const toClassify: string[] = [];

    for (const m of mods) {
      if (!m?.name || !m?.modId) continue;
      // Cache key uses modId for stability
      if (cache[m.modId]) {
        result[m.modId] = cache[m.modId];
        continue;
      }
      const quick = quickClassify(m.name);
      if (quick) {
        result[m.modId] = quick;
        cache[m.modId] = quick;
      } else {
        toClassify.push(m.name);
      }
    }

    // Map name -> modId for unclassified
    const nameToId: Record<string, string[]> = {};
    for (const m of mods) {
      if (toClassify.includes(m.name)) {
        nameToId[m.name] ??= [];
        nameToId[m.name].push(m.modId);
      }
    }

    // Process in batches of 25 to keep prompts small
    const BATCH = 25;
    const uniqueNames = Object.keys(nameToId);
    for (let i = 0; i < uniqueNames.length; i += BATCH) {
      const batch = uniqueNames.slice(i, i + BATCH);
      try {
        const aiMap = await aiClassifyBatch(batch);
        for (const name of batch) {
          const cat = aiMap[name] ?? "OTROS";
          for (const id of nameToId[name]) {
            result[id] = cat;
            cache[id] = cat;
          }
        }
      } catch (e) {
        console.error("AI batch failed, marking as OTROS", e);
        for (const name of batch) {
          for (const id of nameToId[name]) {
            result[id] = "OTROS";
            cache[id] = "OTROS";
          }
        }
      }
    }

    // Upsert cache
    await supabase
      .from("site_settings")
      .upsert({ key: "mod_categories", value: cache }, { onConflict: "key" });

    return new Response(JSON.stringify({ categories: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-mods error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

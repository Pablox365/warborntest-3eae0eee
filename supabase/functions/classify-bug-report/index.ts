import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres el clasificador de reportes de Warborn (comunidad española de Arma Reforger).
Tu trabajo: leer un reporte enviado por un jugador (bug, queja, sugerencia) y devolver:
- severity: critical | high | medium | low
- category: una etiqueta corta en minúsculas (ej: "lag", "crash", "admin", "mods", "balance", "ui-web", "spawn", "audio", "milsim", "general")
- summary: resumen ejecutivo en 1 frase (máx 140 chars), neutro y profesional, en español.

Criterios de severidad:
- critical: server caído, exploit grave, pérdida de datos, abuso admin probado.
- high: crashes frecuentes, bugs que rompen partidas, lag generalizado, mod roto.
- medium: bugs molestos pero jugables, sugerencias importantes, quejas de balance.
- low: typos, mejoras visuales, sugerencias menores, dudas.

Devuelve SIEMPRE vía la herramienta classify.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { title, description, server, report_type } = await req.json();
    if (typeof description !== "string" || description.trim().length < 5) {
      return new Response(JSON.stringify({ error: "description required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ severity: "medium", category: "general", summary: title?.slice(0, 140) ?? "" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const userPrompt = `Servidor afectado: ${server ?? "?"}
Tipo: ${report_type ?? "?"}
Título: ${String(title ?? "").slice(0, 200)}
Descripción:
"""
${String(description).slice(0, 2000)}
"""`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              name: "classify",
              description: "Clasifica el reporte",
              parameters: {
                type: "object",
                properties: {
                  severity: { type: "string", enum: ["critical", "high", "medium", "low"] },
                  category: { type: "string" },
                  summary: { type: "string" },
                },
                required: ["severity", "category", "summary"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify" } },
      }),
    });

    if (aiResponse.status === 429 || aiResponse.status === 402 || !aiResponse.ok) {
      return new Response(
        JSON.stringify({ severity: "medium", category: "general", summary: String(title ?? "").slice(0, 140) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiResponse.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      return new Response(
        JSON.stringify({ severity: "medium", category: "general", summary: String(title ?? "").slice(0, 140) }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const parsed = JSON.parse(toolCall.function.arguments);
    const sev = ["critical", "high", "medium", "low"].includes(parsed.severity) ? parsed.severity : "medium";
    return new Response(
      JSON.stringify({
        severity: sev,
        category: String(parsed.category ?? "general").slice(0, 40),
        summary: String(parsed.summary ?? "").slice(0, 200),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("classify-bug-report error", e);
    return new Response(
      JSON.stringify({ severity: "medium", category: "general", summary: "" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
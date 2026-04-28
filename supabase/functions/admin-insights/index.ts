import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Eres el analista de datos de Warborn (comunidad española de Arma Reforger).
Recibes datos agregados de la última semana y devuelves un informe ejecutivo en MARKDOWN, en español, claro y útil para el admin.

ESTRUCTURA OBLIGATORIA:
## 📊 Resumen de la semana
(2-3 frases con lo más importante)

## 👥 Tráfico
(visitas totales, sesiones únicas, evolución)

## 🔥 Lo que más usan
(top páginas + secciones más visitadas)

## ⚠️ Quejas y problemas
(resumen de bug reports + reseñas negativas, agrupados por tema)

## 💡 Recomendaciones
(2-4 acciones concretas)

REGLAS:
- Si no hay datos, dilo claramente.
- Sé conciso, máximo 400 palabras.
- Usa números reales, no inventes.
- Tono profesional pero cercano.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check: only admins
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: roleRow } = await supabase
      .from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [eventsRes, bugsRes, feedbackRes] = await Promise.all([
      supabase.from("page_events").select("event_type,path,section,session_id,created_at").gte("created_at", since).limit(5000),
      supabase.from("bug_reports").select("server,report_type,severity,category,title,ai_summary,status,created_at").gte("created_at", since).limit(500),
      supabase.from("feedback").select("rating,name,message,created_at").gte("created_at", since).limit(200),
    ]);

    const events = eventsRes.data ?? [];
    const bugs = bugsRes.data ?? [];
    const reviews = feedbackRes.data ?? [];

    // Aggregate
    const pageviewEvents = events.filter((e: any) => e.event_type === "pageview");
    const uniqueSessions = new Set(events.map((e: any) => e.session_id).filter(Boolean)).size;
    const totalViews = pageviewEvents.length;
    const pathCounts: Record<string, number> = {};
    pageviewEvents.forEach((e: any) => { if (e.path) pathCounts[e.path] = (pathCounts[e.path] ?? 0) + 1; });
    const topPages = Object.entries(pathCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const sectionCounts: Record<string, number> = {};
    events.forEach((e: any) => { if (e.section) sectionCounts[e.section] = (sectionCounts[e.section] ?? 0) + 1; });
    const topSections = Object.entries(sectionCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

    const ctaCounts: Record<string, number> = {};
    events.filter((e: any) => e.event_type === "cta_click").forEach((e: any) => {
      const key = e.section ?? "unknown";
      ctaCounts[key] = (ctaCounts[key] ?? 0) + 1;
    });

    const bugSeverity: Record<string, number> = {};
    const bugCategory: Record<string, number> = {};
    bugs.forEach((b: any) => {
      if (b.severity) bugSeverity[b.severity] = (bugSeverity[b.severity] ?? 0) + 1;
      if (b.category) bugCategory[b.category] = (bugCategory[b.category] ?? 0) + 1;
    });

    const avgRating = reviews.length > 0
      ? (reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / reviews.length).toFixed(2)
      : "n/a";
    const lowReviews = reviews.filter((r: any) => r.rating && r.rating <= 3).slice(0, 10);

    const dataSummary = {
      periodo: "últimos 7 días",
      trafico: { vistas_pagina: totalViews, sesiones_unicas: uniqueSessions, eventos_totales: events.length },
      paginas_top: topPages,
      secciones_top: topSections,
      clicks_cta: ctaCounts,
      bug_reports: { total: bugs.length, por_severidad: bugSeverity, por_categoria: bugCategory, ultimos: bugs.slice(0, 10).map((b: any) => ({ titulo: b.title, severidad: b.severity, resumen: b.ai_summary })) },
      reseñas: { total: reviews.length, rating_medio: avgRating, criticas_recientes: lowReviews.map((r: any) => ({ rating: r.rating, mensaje: String(r.message ?? "").slice(0, 200) })) },
    };

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ insights: "AI no disponible.", raw: dataSummary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: "DATOS:\n```json\n" + JSON.stringify(dataSummary, null, 2) + "\n```" },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const t = await aiResponse.text();
      console.error("admin-insights AI error", aiResponse.status, t);
      return new Response(JSON.stringify({ insights: "Error generando informe.", raw: dataSummary }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await aiResponse.json();
    const insights = data.choices?.[0]?.message?.content ?? "Sin respuesta.";

    return new Response(JSON.stringify({ insights, raw: dataSummary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("admin-insights error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
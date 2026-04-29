import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Bug, Loader2, Send, ShieldAlert } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import alineaLogo from "@/assets/alinea-logo.png";
import { trackEvent } from "@/lib/tracking";

const schema = z.object({
  player_name: z.string().trim().min(1, "Pon tu nick").max(60),
  discord_id: z.string().trim().min(1, "Pon tu Discord").max(60),
  server: z.enum(["normal", "hardcore", "milsim", "web", "otros"]),
  report_type: z.enum(["bug", "sugerencia", "queja", "otro"]),
  title: z.string().trim().min(3, "Mínimo 3 caracteres").max(120),
  description: z.string().trim().min(10, "Cuenta más detalles (mín. 10 caracteres)").max(2000),
});

const SERVERS = [
  { v: "normal", l: "Normal" },
  { v: "hardcore", l: "Hardcore" },
  { v: "milsim", l: "Milsim" },
  { v: "web", l: "Web" },
  { v: "otros", l: "Otros" },
] as const;

const TYPES = [
  { v: "bug", l: "🐛 Bug" },
  { v: "queja", l: "⚠️ Queja" },
  { v: "sugerencia", l: "💡 Sugerencia" },
  { v: "otro", l: "📝 Otro" },
] as const;

const BugReportSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [form, setForm] = useState({
    player_name: "",
    discord_id: "",
    server: "normal" as "normal" | "hardcore" | "milsim" | "web" | "otros",
    report_type: "bug" as "bug" | "sugerencia" | "queja" | "otro",
    title: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse(form);
      if (!parsed.success) {
        const first = parsed.error.errors[0];
        throw new Error(first?.message ?? "Datos inválidos");
      }

      // 1) Classify with AI (best-effort)
      let severity: string | null = null;
      let category: string | null = null;
      let ai_summary: string | null = null;
      try {
        // Hard timeout (8s): si la IA tarda demasiado, guardamos el reporte igual sin clasificación
        const aiPromise = supabase.functions.invoke("classify-bug-report", {
          body: {
            title: parsed.data.title,
            description: parsed.data.description,
            server: parsed.data.server,
            report_type: parsed.data.report_type,
          },
        });
        const timeoutPromise = new Promise<{ data: null }>((resolve) =>
          setTimeout(() => resolve({ data: null }), 8000),
        );
        const { data: aiData } = (await Promise.race([aiPromise, timeoutPromise])) as { data: any };
        if (aiData) {
          severity = aiData.severity ?? null;
          category = aiData.category ?? null;
          ai_summary = aiData.summary ?? null;
        }
      } catch (e) {
        console.warn("classify failed", e);
      }

      const { error: insertErr } = await supabase.from("bug_reports").insert([
        {
          player_name: parsed.data.player_name,
          discord_id: parsed.data.discord_id,
          server: parsed.data.server,
          report_type: parsed.data.report_type,
          title: parsed.data.title,
          description: parsed.data.description,
          severity: severity ?? undefined,
          category: category ?? undefined,
          ai_summary: ai_summary ?? undefined,
        },
      ]);
      if (insertErr) throw insertErr;
    },
    onSuccess: () => {
      setSuccess(true);
      setError("");
      toast.success("Reporte enviado. Lo revisaremos pronto.");
      trackEvent("bug_report_submitted", { section: "bug-report" });
      setForm({
        player_name: "",
        discord_id: "",
        server: "normal",
        report_type: "bug",
        title: "",
        description: "",
      });
      setTimeout(() => setSuccess(false), 5000);
    },
    onError: (e: Error) => {
      setError(e.message);
      toast.error(e.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    submit.mutate();
  };

  return (
    <section
      id="reportar"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 md:py-28 bg-gradient-to-b from-background via-background to-card/30 border-t border-border/50"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeader
          visible={isVisible}
          label="REPORTES · INTERNO"
          title="REPORTAR BUG O QUEJA"
          subtitle="Solo lo ven los admins. Ayúdanos a mejorar Warborn — Alinea AI clasifica tu reporte."
        />

        <div
          className={`mt-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <img src={alineaLogo} alt="Alinea AI" className="w-8 h-8 opacity-80" />
              <div className="flex-1">
                <p className="font-heading text-xs tracking-[0.2em] text-primary">CANAL PRIVADO</p>
                <p className="text-xs text-muted-foreground font-body">
                  Tu reporte llega directo al panel admin. No se publica en la web.
                </p>
              </div>
              <ShieldAlert className="w-5 h-5 text-primary/70" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                    NICK INGAME *
                  </label>
                  <input
                    type="text"
                    value={form.player_name}
                    onChange={(e) => setForm((f) => ({ ...f, player_name: e.target.value }))}
                    maxLength={60}
                    className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                    placeholder="TuNick"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                    DISCORD *
                  </label>
                  <input
                    type="text"
                    value={form.discord_id}
                    onChange={(e) => setForm((f) => ({ ...f, discord_id: e.target.value }))}
                    maxLength={60}
                    className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                    placeholder="usuario#0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                    SERVIDOR
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVERS.map((s) => (
                      <button
                        type="button"
                        key={s.v}
                        onClick={() => setForm((f) => ({ ...f, server: s.v }))}
                        className={`px-3 py-1.5 rounded-md text-xs font-heading tracking-wider transition-all ${
                          form.server === s.v
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/60 border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s.l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                    TIPO
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES.map((t) => (
                      <button
                        type="button"
                        key={t.v}
                        onClick={() => setForm((f) => ({ ...f, report_type: t.v }))}
                        className={`px-3 py-1.5 rounded-md text-xs font-body transition-all ${
                          form.report_type === t.v
                            ? "bg-primary text-primary-foreground"
                            : "bg-background/60 border border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                  TÍTULO *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  maxLength={120}
                  className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ej: Lag al entrar a Hardcore"
                />
              </div>

              <div>
                <label className="block text-xs font-heading tracking-wider text-muted-foreground mb-1.5">
                  DESCRIPCIÓN *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  maxLength={2000}
                  rows={5}
                  className="w-full bg-background/60 border border-border rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Describe qué pasó, cuándo, cómo reproducirlo..."
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right font-body">
                  {form.description.length}/2000
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive font-body animate-fade-in">{error}</p>
              )}

              <button
                type="submit"
                disabled={submit.isPending}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-heading text-sm tracking-wider hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover-scale"
              >
                {submit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> ENVIANDO...
                  </>
                ) : success ? (
                  <>
                    <Bug className="w-4 h-4" /> ENVIADO ✓
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> ENVIAR REPORTE
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BugReportSection;
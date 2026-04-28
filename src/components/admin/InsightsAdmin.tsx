import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2, RefreshCw, BarChart3 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import alineaLogo from "@/assets/alinea-logo.png";
import { toast } from "sonner";

const InsightsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string>("");
  const [raw, setRaw] = useState<any>(null);

  const generate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-insights", { body: {} });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setInsights(data?.insights ?? "");
      setRaw(data?.raw ?? null);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Error generando insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <img src={alineaLogo} alt="Alinea AI" className="w-12 h-12" />
        <div className="flex-1">
          <h3 className="font-heading text-sm tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> ANÁLISIS IA — ÚLTIMOS 7 DÍAS
          </h3>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Tráfico, secciones más usadas, quejas y recomendaciones, todo en un informe ejecutivo.
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-heading text-xs tracking-wider hover:bg-primary/90 transition-all disabled:opacity-60 hover-scale"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> ANALIZANDO…
            </>
          ) : insights ? (
            <>
              <RefreshCw className="w-4 h-4" /> REGENERAR
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> GENERAR INFORME
            </>
          )}
        </button>
      </div>

      {loading && !insights && (
        <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="relative w-20 h-20 mb-4">
            <img src={alineaLogo} alt="" className="w-full h-full opacity-90 animate-pulse" />
            <span className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
          <p className="font-heading text-sm tracking-wider text-primary">ALINEA AI ESTÁ ANALIZANDO</p>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Cruzando tráfico, reseñas y reportes…
          </p>
        </div>
      )}

      {insights && (
        <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
          <div className="prose prose-sm prose-invert max-w-none prose-headings:font-heading prose-headings:tracking-wider prose-h2:text-base prose-h2:mt-6 prose-h2:mb-2 prose-a:text-primary prose-strong:text-primary">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        </div>
      )}

      {raw && (
        <details className="rounded-xl border border-border bg-card/50 p-4">
          <summary className="cursor-pointer text-xs font-heading tracking-wider text-muted-foreground flex items-center gap-2">
            <BarChart3 className="w-3 h-3" /> DATOS BRUTOS
          </summary>
          <pre className="mt-3 text-[10px] font-mono overflow-auto max-h-80 text-muted-foreground bg-background/50 p-3 rounded">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </details>
      )}

      {!insights && !loading && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Sparkles className="w-8 h-8 text-primary/40 mx-auto mb-3" />
          <p className="text-sm font-body text-muted-foreground">
            Pulsa <strong className="text-foreground">GENERAR INFORME</strong> para que Alinea AI analice los datos de la semana.
          </p>
        </div>
      )}
    </div>
  );
};

export default InsightsAdmin;
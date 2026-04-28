import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Bug, Trash2, AlertTriangle, Sparkles, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-destructive/20 text-destructive border-destructive/40",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
  low: "bg-primary/15 text-primary border-primary/30",
};

const STATUS_OPTIONS = ["new", "in_review", "resolved", "discarded"] as const;

const BugReportsAdmin = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bug-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bug_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const { error } = await supabase.from("bug_reports").update(patch as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bug-reports"] });
      toast.success("Actualizado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("bug_reports").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bug-reports"] });
      toast.success("Borrado");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const filtered = (data ?? []).filter((r) => {
    if (filter === "all") return true;
    if (filter === "open") return r.status === "new" || r.status === "in_review";
    return r.status === filter;
  });

  const counts = {
    total: data?.length ?? 0,
    new: data?.filter((r) => r.status === "new").length ?? 0,
    critical: data?.filter((r) => r.severity === "critical").length ?? 0,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-sm">
          <Bug className="w-4 h-4 text-primary" />
          <span className="font-heading tracking-wider text-xs">{counts.total} REPORTES</span>
          {counts.new > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-heading">
              {counts.new} NUEVOS
            </span>
          )}
          {counts.critical > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-heading flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {counts.critical} CRÍTICOS
            </span>
          )}
        </div>
        <div className="flex gap-1.5 ml-auto">
          {[
            { v: "all", l: "Todos" },
            { v: "open", l: "Abiertos" },
            { v: "new", l: "Nuevos" },
            { v: "in_review", l: "En revisión" },
            { v: "resolved", l: "Resueltos" },
            { v: "discarded", l: "Descartados" },
          ].map((f) => (
            <button
              key={f.v}
              onClick={() => setFilter(f.v)}
              className={`px-3 py-1 rounded-md text-[10px] font-heading tracking-wider transition-all ${
                filter === f.v
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/50 border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm font-body">
          Sin reportes en este filtro.
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  {r.severity && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-heading tracking-wider border ${
                        SEVERITY_COLORS[r.severity] ?? "bg-secondary border-border"
                      }`}
                    >
                      {r.severity.toUpperCase()}
                    </span>
                  )}
                  {r.category && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-body bg-secondary/50 border border-border text-muted-foreground">
                      {r.category}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-body bg-secondary/50 border border-border text-muted-foreground">
                    {r.report_type} · {r.server}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-body">
                    {new Date(r.created_at).toLocaleString("es-ES")}
                  </span>
                </div>
                <h3 className="font-heading text-sm tracking-wide">{r.title}</h3>
              </div>
              <select
                value={r.status}
                onChange={(e) => update.mutate({ id: r.id, patch: { status: e.target.value } })}
                className="px-2 py-1 bg-secondary/50 border border-border rounded text-[10px] font-heading tracking-wider focus:border-primary focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {r.ai_summary && (
              <div className="flex items-start gap-2 text-xs bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
                <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                <span className="font-body text-foreground/80">{r.ai_summary}</span>
              </div>
            )}

            <p className="text-sm font-body text-muted-foreground whitespace-pre-wrap">
              {r.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
              <div className="text-[11px] text-muted-foreground font-body flex items-center gap-3">
                <span>
                  👤 <strong className="text-foreground">{r.player_name}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" /> {r.discord_id}
                </span>
              </div>
              <button
                onClick={() => {
                  if (confirm("¿Borrar este reporte?")) remove.mutate(r.id);
                }}
                className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1 font-heading tracking-wider transition-colors"
              >
                <Trash2 className="w-3 h-3" /> BORRAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BugReportsAdmin;
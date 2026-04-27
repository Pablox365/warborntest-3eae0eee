import { useState, useMemo, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import { Star, Loader2, Quote, MessageCircle, Send, CornerDownRight, Upload, X, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { TestimonialsColumn, type Testimonial } from "@/components/ui/testimonials-column";
import alineaLogo from "@/assets/alinea-logo.png";
import ModerationOverlay, { type ModerationResult } from "@/components/ModerationOverlay";

const schema = z.object({
  name: z.string().trim().min(1, "Pon tu nombre").max(60),
  rating: z.number().int().min(1, "Selecciona estrellas").max(5),
  message: z.string().trim().min(5, "Mínimo 5 caracteres").max(1000),
});

const replySchema = z.object({
  name: z.string().trim().min(1, "Pon tu nombre").max(60),
  message: z.string().trim().min(2, "Mínimo 2 caracteres").max(500),
});

const FeedbackSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [overlay, setOverlay] = useState<ModerationResult | null>(null);

  const qc = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ["feedback-public-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("id,name,rating,message,created_at,avatar_url")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen debe ser menor de 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes");
      return;
    }
    setUploadingAvatar(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      toast.success("Foto subida");
    } catch (e: any) {
      toast.error("Error subiendo foto: " + (e.message ?? "intenta de nuevo"));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const submit = useMutation({
    mutationFn: async () => {
      const parsed = schema.safeParse({ name, rating, message });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);

      // Moderation with timeout + fail-open (manual review) so users never get stuck
      let decision: "approve" | "reject" | "review" = "review";
      let reason: string | null = "Pendiente de revisión";
      try {
        const modPromise = supabase.functions.invoke("moderate-content", {
          body: { name: parsed.data.name, message: parsed.data.message, rating: parsed.data.rating, kind: "review" },
        });
        const timeout = new Promise<{ data: any; error: any }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 8000),
        );
        const { data: mod, error: modError } = await Promise.race([modPromise, timeout]);
        if (!modError && mod?.decision) {
          decision = mod.decision;
          reason = mod.reason ?? null;
        }
      } catch (_) { /* fail-open */ }
      const approved = decision === "approve";

      const { error } = await supabase.from("feedback").insert({
        name: parsed.data.name,
        rating: parsed.data.rating,
        message: parsed.data.message,
        approved,
        avatar_url: avatarUrl,
        moderation_reason: reason,
      });
      if (error) throw error;
      return { decision };
    },
    onSuccess: (result) => {
      const decision = (result?.decision ?? "review") as ModerationResult;
      setOverlay(decision);
      if (decision === "approve") {
        setName(""); setRating(0); setMessage(""); setError(""); setAvatarUrl(null);
      }
      qc.invalidateQueries({ queryKey: ["feedback-public-all"] });
    },
    onError: (e: any) => setError(e.message ?? "Error al enviar"),
  });

  const avg = reviews && reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // Split into 3 columns for animated marquee
  const { col1, col2, col3 } = useMemo(() => {
    const list = (reviews ?? []) as Testimonial[];
    if (list.length === 0) return { col1: [], col2: [], col3: [] };
    // Need at least some items per column for nice loop; duplicate if very few
    const ensure = (arr: Testimonial[]) => arr.length > 0 && arr.length < 3 ? [...arr, ...arr, ...arr].slice(0, 3) : arr;
    const c1: Testimonial[] = [];
    const c2: Testimonial[] = [];
    const c3: Testimonial[] = [];
    list.forEach((r, i) => {
      if (i % 3 === 0) c1.push(r);
      else if (i % 3 === 1) c2.push(r);
      else c3.push(r);
    });
    return { col1: ensure(c1), col2: ensure(c2), col3: ensure(c3) };
  }, [reviews]);

  return (
    <section className="relative py-24 md:py-32 bg-card/20 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="COMUNIDAD" title="RESEÑAS" subtitle="Lo que dicen los miembros de Warborn." />

        {avg && (
          <div className={`flex items-center justify-center gap-3 mt-6 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="flex">
              {[1,2,3,4,5].map(n => (
                <Star key={n} className={`w-5 h-5 ${n <= Math.round(Number(avg)) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-xl font-heading font-bold">{avg}</span>
            <span className="text-xs text-muted-foreground font-body">({reviews?.length} reseñas)</span>
          </div>
        )}

        {/* Alinea AI supervision badge */}
        <div className={`flex items-center justify-center gap-2 mt-5 transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="font-heading text-[9px] md:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              Supervisado por
            </span>
            <img src={alineaLogo} alt="Alinea AI" className="h-4 md:h-5 w-auto object-contain" />
            <span className="font-heading text-[9px] md:text-[10px] tracking-[0.25em] text-primary uppercase">AI</span>
          </div>
        </div>

        {/* Animated columns FIRST */}
        {!showAll && reviews && reviews.length > 0 && (
          <div className="mt-12">
            <div
              className="relative flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
              style={{ maxHeight: "600px", overflow: "hidden" }}
            >
              <TestimonialsColumn testimonials={col1} duration={20} />
              <TestimonialsColumn testimonials={col2} duration={28} className="hidden md:block" />
              <TestimonialsColumn testimonials={col3} duration={24} className="hidden lg:block" />
            </div>
          </div>
        )}

        {!reviews && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {reviews && reviews.length === 0 && (
          <div className="max-w-md mx-auto mt-12 bg-card border border-border rounded-xl p-8 text-center">
            <Quote className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground font-body">Sé el primero en dejar una reseña</p>
          </div>
        )}

        {/* Show all toggle + full list with replies */}
        {reviews && reviews.length > 0 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(v => !v)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-secondary border border-border hover:border-primary rounded-lg font-heading tracking-[0.15em] text-xs font-bold text-foreground hover:text-primary transition-all"
            >
              {showAll ? "OCULTAR" : `VER TODAS (${reviews.length})`}
            </button>
          </div>
        )}

        {showAll && reviews && reviews.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 mt-10 animate-fade-up">
            {reviews.map((r, i) => (
              <ReviewCard key={r.id} review={r} index={i} />
            ))}
          </div>
        )}

        {/* Form AFTER reviews */}
        <div className={`max-w-2xl mx-auto mt-16 bg-card border border-border rounded-xl p-6 md:p-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h3 className="font-heading text-sm tracking-[0.2em] mb-1">DEJA TU RESEÑA</h3>
          <p className="text-xs text-muted-foreground mb-5 font-body">Tu opinión ayuda a mejorar Warborn.</p>

          <div className="flex items-center gap-1 mb-4">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(n)}
                className="p-1 transition-transform hover:scale-125"
                aria-label={`${n} estrellas`}
              >
                <Star className={`w-7 h-7 transition-colors ${(hover || rating) >= n ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`} />
              </button>
            ))}
            <span className="ml-2 text-xs text-muted-foreground font-body">{rating > 0 ? `${rating}/5` : "Selecciona"}</span>
          </div>

          {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs text-destructive">{error}</div>}

          <div className="space-y-3">
            {/* Avatar upload + name */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <div className="relative">
                    <img src={avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover border-2 border-primary" />
                    <button
                      type="button"
                      onClick={() => setAvatarUrl(null)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"
                      aria-label="Quitar foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="w-14 h-14 rounded-full border-2 border-dashed border-border hover:border-primary bg-secondary/30 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
                    aria-label="Subir foto de perfil"
                  >
                    {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarUpload(f);
                    e.target.value = "";
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={60}
                className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <p className="text-[10px] text-muted-foreground/70 font-body -mt-1">Foto opcional. Si no subes una, usaremos tu inicial.</p>
            <textarea
              placeholder="Cuenta tu experiencia..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              maxLength={1000}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
            />
            <button
              onClick={() => submit.mutate()}
              disabled={submit.isPending}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading tracking-[0.15em] text-xs font-bold hover:brightness-110 transition-all btn-military disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submit.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              ENVIAR RESEÑA
            </button>
          </div>
        </div>
      </div>
      {overlay && <ModerationOverlay result={overlay} onClose={() => setOverlay(null)} />}
    </section>
  );
};

const ReviewCard = ({ review, index }: { review: any; index: number }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [rName, setRName] = useState("");
  const [rMessage, setRMessage] = useState("");
  const [rError, setRError] = useState("");
  const qc = useQueryClient();

  const { data: replies } = useQuery({
    queryKey: ["feedback-replies", review.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback_replies")
        .select("id,name,message,created_at,avatar_url")
        .eq("feedback_id", review.id)
        .eq("approved", true)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const submitReply = useMutation({
    mutationFn: async () => {
      const parsed = replySchema.safeParse({ name: rName, message: rMessage });
      if (!parsed.success) throw new Error(parsed.error.issues[0].message);
      let decision: "approve" | "reject" | "review" = "review";
      let reason: string | null = "Pendiente de revisión";
      try {
        const modPromise = supabase.functions.invoke("moderate-content", {
          body: { name: parsed.data.name, message: parsed.data.message, kind: "reply" },
        });
        const timeout = new Promise<{ data: any; error: any }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: new Error("timeout") }), 8000),
        );
        const { data: mod, error: modError } = await Promise.race([modPromise, timeout]);
        if (!modError && mod?.decision) {
          decision = mod.decision;
          reason = mod.reason ?? null;
        }
      } catch (_) { /* fail-open */ }
      const approved = decision === "approve";
      const { error } = await supabase.from("feedback_replies").insert({
        feedback_id: review.id,
        name: parsed.data.name,
        message: parsed.data.message,
        approved,
        moderation_reason: reason,
      });
      if (error) throw error;
      return { decision };
    },
    onSuccess: (result) => {
      if (result?.decision === "approve") toast.success("Respuesta publicada");
      else if (result?.decision === "reject") toast.error("Tu respuesta no cumple las normas.");
      else toast("Pendiente de revisión por un moderador.", { icon: "⏳" });
      setRName(""); setRMessage(""); setRError(""); setReplyOpen(false);
      setShowReplies(true);
      qc.invalidateQueries({ queryKey: ["feedback-replies", review.id] });
    },
    onError: (e: any) => setRError(e.message ?? "Error al enviar"),
  });

  const replyCount = replies?.length ?? 0;

  return (
    <div className="bg-card border border-border rounded-xl p-5 card-hover" style={{ transitionDelay: `${index * 30}ms` }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {review.avatar_url ? (
            <img src={review.avatar_url} alt={review.name} className="w-9 h-9 rounded-full object-cover border border-primary/30 shrink-0" loading="lazy" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-xs font-bold shrink-0">
              {review.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-heading text-xs tracking-wider truncate">{review.name}</div>
            <div className="text-[9px] text-muted-foreground font-body">
              {new Date(review.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </div>
        </div>
        <div className="flex shrink-0">
          {[1,2,3,4,5].map(n => (
            <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"}`} />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground font-body leading-relaxed">{review.message}</p>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <button
          type="button"
          onClick={() => setReplyOpen(!replyOpen)}
          className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-muted-foreground hover:text-primary transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" /> RESPONDER
        </button>
        {replyCount > 0 && (
          <button
            type="button"
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1.5 text-[10px] font-heading tracking-wider text-primary/80 hover:text-primary transition-colors"
          >
            <CornerDownRight className="w-3.5 h-3.5" />
            {showReplies ? "OCULTAR" : "VER"} {replyCount} {replyCount === 1 ? "RESPUESTA" : "RESPUESTAS"}
          </button>
        )}
      </div>

      {replyOpen && (
        <div className="mt-3 p-3 bg-secondary/30 border border-border rounded-lg space-y-2 animate-fade-up">
          {rError && <div className="p-2 bg-destructive/10 border border-destructive/30 rounded text-[10px] text-destructive">{rError}</div>}
          <input
            type="text"
            placeholder="Tu nombre"
            value={rName}
            onChange={e => setRName(e.target.value)}
            maxLength={60}
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-xs focus:border-primary focus:outline-none transition-colors"
          />
          <textarea
            placeholder="Tu respuesta..."
            value={rMessage}
            onChange={e => setRMessage(e.target.value)}
            rows={2}
            maxLength={500}
            className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-xs focus:border-primary focus:outline-none transition-colors resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setReplyOpen(false); setRError(""); }}
              className="px-3 py-1.5 text-[10px] font-heading tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              CANCELAR
            </button>
            <button
              onClick={() => submitReply.mutate()}
              disabled={submitReply.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-heading tracking-wider font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {submitReply.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              ENVIAR
            </button>
          </div>
        </div>
      )}

      {showReplies && replies && replies.length > 0 && (
        <div className="mt-3 space-y-2 pl-3 border-l-2 border-primary/30 animate-fade-up">
          {replies.map((rp: any) => (
            <div key={rp.id} className="bg-secondary/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                {rp.avatar_url ? (
                  <img src={rp.avatar_url} alt={rp.name} className="w-5 h-5 rounded-full object-cover shrink-0" loading="lazy" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading text-[9px] font-bold shrink-0">
                    {rp.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-heading text-[10px] tracking-wider truncate">{rp.name}</span>
                <span className="text-[8px] text-muted-foreground font-body ml-auto">
                  {new Date(rp.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{rp.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;

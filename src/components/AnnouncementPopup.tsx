import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronRight } from "lucide-react";
import announcementSound from "@/assets/announcement-sound.mp3";

interface Announcement {
  id: string;
  emoji: string | null;
  short_text: string | null;
  detailed_description: string | null;
  title: string;
  content: string | null;
  type: string;
  play_sound: boolean;
  priority: number;
  starts_at: string | null;
  expires_at: string | null;
}

const AnnouncementPopup = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: announcement } = useQuery({
    queryKey: ["active-announcement"],
    queryFn: async () => {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("active", true)
        .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
        .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Announcement | null;
    },
    refetchInterval: 60_000, // recheck every minute (auto-expiration)
  });

  // Mount animation + sound
  useEffect(() => {
    if (!announcement || dismissed) return;
    const t = setTimeout(() => setMounted(true), 600); // small delay after page load
    return () => clearTimeout(t);
  }, [announcement, dismissed]);

  useEffect(() => {
    if (!mounted || !announcement) return;
    if (announcement.play_sound !== false) {
      const audio = new Audio(announcementSound);
      audio.volume = 0.5;
      audio.play().catch(() => {
        /* browser blocked autoplay — fail silently */
      });
    }
  }, [mounted, announcement]);

  if (!announcement || dismissed) return null;

  const shortText = announcement.short_text || announcement.title;
  const detailText = announcement.detailed_description || announcement.content || "";
  const emoji = announcement.emoji || "📢";

  return (
    <>
      {/* Popup banner */}
      <div
        className={`fixed top-20 md:top-28 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl transition-all duration-500 ease-out ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
        }`}
      >
        <div className="relative group">
          {/* Glow halo */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity animate-pulse-glow" />

          <button
            type="button"
            onClick={() => setShowDetail(true)}
            className="relative w-full text-left bg-card/95 backdrop-blur-xl border border-primary/40 rounded-2xl pl-5 pr-12 py-4 flex items-center gap-4 hover:border-primary transition-all hover:scale-[1.01]"
          >
            <span className="text-3xl flex-shrink-0 animate-bounce-subtle">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body text-foreground truncate">{shortText}</p>
              {detailText && (
                <span className="text-[10px] font-heading tracking-[0.2em] text-primary/80 flex items-center gap-1 mt-0.5">
                  VER MÁS <ChevronRight className="w-3 h-3" />
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            aria-label="Cerrar anuncio"
            className="absolute top-1/2 -translate-y-1/2 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-secondary/80 hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detail modal */}
      {showDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm animate-fade-scale"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="relative bg-card border border-primary/40 rounded-2xl p-8 max-w-lg w-full shadow-2xl glow-green"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDetail(false)}
              aria-label="Cerrar"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-destructive hover:text-destructive-foreground text-muted-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-5xl mb-4">{emoji}</div>
            <h3 className="font-heading text-xl tracking-wider mb-3 text-foreground">{shortText}</h3>
            {detailText ? (
              <p className="text-sm font-body text-muted-foreground whitespace-pre-line leading-relaxed">{detailText}</p>
            ) : (
              <p className="text-sm font-body text-muted-foreground italic">Sin descripción detallada.</p>
            )}
            {announcement.expires_at && (
              <p className="text-[10px] font-heading tracking-[0.2em] text-primary/60 mt-6">
                EXPIRA: {new Date(announcement.expires_at).toLocaleString("es-ES")}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AnnouncementPopup;
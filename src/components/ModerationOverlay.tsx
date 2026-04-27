import { useEffect } from "react";
import { Check, X, Clock } from "lucide-react";
import alineaLogo from "@/assets/alinea-logo.png";

export type ModerationResult = "approve" | "reject" | "review";

const COPY: Record<ModerationResult, { title: string; subtitle: string; accent: string; Icon: typeof Check }> = {
  approve: {
    title: "RESEÑA PUBLICADA",
    subtitle: "Alinea AI ha verificado tu mensaje y ya es visible para la comunidad.",
    accent: "text-primary",
    Icon: Check,
  },
  reject: {
    title: "RESEÑA RECHAZADA",
    subtitle: "Alinea AI ha detectado contenido que infringe las normas de la comunidad.",
    accent: "text-destructive",
    Icon: X,
  },
  review: {
    title: "EN REVISIÓN MANUAL",
    subtitle: "Alinea AI ha marcado tu mensaje como ambiguo. Un moderador lo revisará en breve.",
    accent: "text-yellow-400",
    Icon: Clock,
  },
};

const ModerationOverlay = ({
  result,
  onClose,
}: {
  result: ModerationResult;
  onClose: () => void;
}) => {
  const { title, subtitle, accent, Icon } = COPY[result];

  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] bg-background/95 flex flex-col items-center justify-center px-6 animate-fade-in"
      role="status"
      aria-live="polite"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.08), transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-md text-center animate-scale-in">
        {/* Logo + status badge */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-6">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="hsl(var(--primary))"
              strokeWidth="0.6"
              strokeDasharray="4 8"
              opacity="0.4"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              className={`${accent} animate-[dash_1s_ease-out_forwards]`}
              style={{ strokeDasharray: 289, strokeDashoffset: 289, animation: "dashIn 0.9s ease-out forwards" }}
            />
          </svg>
          <img
            src={alineaLogo}
            alt="Alinea AI"
            className="relative w-20 h-20 md:w-24 md:h-24 object-contain"
            draggable={false}
          />
          <div
            className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-card border-2 border-background flex items-center justify-center ${accent}`}
            style={{ animation: "popIn 0.3s 0.6s both" }}
          >
            <Icon className="w-5 h-5" strokeWidth={3} />
          </div>
        </div>

        <div className="font-heading text-[10px] tracking-[0.5em] text-muted-foreground mb-2">
          ALINEA · AI MODERATION
        </div>
        <h2 className={`font-heading text-2xl md:text-3xl font-black tracking-[0.1em] mb-3 ${accent}`}>
          {title}
        </h2>
        <p className="text-sm text-muted-foreground font-body leading-relaxed">{subtitle}</p>

        <button
          onClick={onClose}
          className="mt-8 px-6 py-2.5 text-[10px] font-heading tracking-[0.3em] border border-border hover:border-primary text-muted-foreground hover:text-primary rounded-lg transition-colors"
        >
          CONTINUAR
        </button>
      </div>

      <style>{`
        @keyframes dashIn {
          to { stroke-dashoffset: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ModerationOverlay;

import { useEffect, useState } from "react";
import { PerspectiveMarquee } from "@/components/ui/perspective-marquee";

const PHRASES = [
  "ARMA REFORGER",
  "WARBORN ESPAÑA",
  "NORMAL · HARDCORE · MILSIM",
  "COMUNIDAD HISPANA",
  "DESPLEGANDO TROPAS",
];

const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const total = 1800;
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / total) * 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setHiding(true);
        setTimeout(onDone, 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-busy="true"
      aria-label="Cargando Warborn"
    >
      {/* Background marquee */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none">
        <PerspectiveMarquee items={PHRASES} fontSize={120} pixelsPerFrame={1.2} rotateY={-25} rotateX={4} />
      </div>

      {/* Crosshair lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/20" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 border border-primary/30 rounded-full" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-32 md:h-32 border border-primary/40 rounded-full animate-pulse" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">
        <div className="font-heading tracking-[0.4em] text-[10px] md:text-xs text-primary/70 mb-2">
          [ INICIANDO SESIÓN ]
        </div>
        <h1 className="font-heading font-black tracking-[0.15em] text-4xl md:text-6xl text-foreground mb-2 text-center">
          WAR<span className="text-primary">BORN</span>
        </h1>
        <div className="font-body text-[10px] md:text-xs text-muted-foreground tracking-widest mb-8 uppercase text-center">
          Comunidad Arma Reforger España
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-secondary border border-border rounded-sm overflow-hidden">
          <div
            className="h-full bg-primary transition-[width] duration-100 ease-linear shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between w-full text-[9px] md:text-[10px] font-heading tracking-widest text-muted-foreground">
          <span>CARGANDO ASSETS</span>
          <span className="text-primary">{Math.floor(progress)}%</span>
        </div>
      </div>

      {/* Corner brackets */}
      {[
        "top-4 left-4 border-t border-l",
        "top-4 right-4 border-t border-r",
        "bottom-4 left-4 border-b border-l",
        "bottom-4 right-4 border-b border-r",
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute w-8 h-8 md:w-12 md:h-12 border-primary ${cls}`}
        />
      ))}
    </div>
  );
};

export default LoadingScreen;

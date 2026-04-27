import { useEffect, useState } from "react";
import alineaLogo from "@/assets/alinea-logo.png";

const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const total = 1600;
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(100, (elapsed / total) * 100);
      setProgress(p);
      if (p < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setHiding(true);
        setTimeout(onDone, 450);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center transition-opacity duration-500 overflow-hidden ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-busy="true"
      aria-label="Cargando — by Alinea"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, hsl(var(--primary)/0.08), transparent 60%)",
        }}
      />

      {/* Center: Alinea logo with breathing pulse */}
      <div className="relative z-10 flex flex-col items-center px-6">
        <div className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
          {/* Rotating ring */}
          <svg
            className="absolute inset-0 w-full h-full animate-[spin_2.4s_linear_infinite]"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="hsl(var(--primary))"
              strokeWidth="0.6"
              strokeDasharray="4 8"
              strokeLinecap="round"
              opacity="0.5"
            />
            <circle
              cx="50"
              cy="50"
              r="46"
              stroke="hsl(var(--primary))"
              strokeWidth="1.2"
              strokeDasharray={`${progress * 2.89} 999`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dasharray 0.1s linear" }}
            />
          </svg>

          {/* Logo with breathing animation */}
          <img
            src={alineaLogo}
            alt="Alinea"
            className="relative w-32 h-32 md:w-40 md:h-40 object-contain animate-[pulse_2s_ease-in-out_infinite]"
            draggable={false}
          />
        </div>

        {/* Progress text */}
        <div className="mt-6 font-heading text-[10px] md:text-xs tracking-[0.5em] text-muted-foreground">
          {Math.floor(progress)}%
        </div>

        {/* Footer credit */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <div className="font-heading text-[9px] md:text-[10px] tracking-[0.4em] text-muted-foreground/60 uppercase">
            Powered by <span className="text-primary/80">Alinea</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

"use client";
import { useEffect, useState } from "react";

export interface PerspectiveMarqueeProps {
  items?: string[];
  fontSize?: number;
  pixelsPerFrame?: number;
  rotateY?: number;
  rotateX?: number;
  perspective?: number;
  className?: string;
}

const DEFAULT_ITEMS = ["HOSTING", "MODS", "DESARROLLO", "MILSIM", "COMUNIDAD", "EVENTOS", "SOPORTE 24/7"];

export function PerspectiveMarquee({
  items = DEFAULT_ITEMS,
  fontSize = 56,
  pixelsPerFrame = 1.2,
  rotateY = -22,
  rotateX = 6,
  perspective = 1000,
  className,
}: PerspectiveMarqueeProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let raf = 0;
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      setFrame(f => f + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { mounted = false; cancelAnimationFrame(raf); };
  }, []);

  const itemPadding = fontSize * 0.9;
  const approxItemWidth = items.reduce(
    (acc, item) => acc + item.length * fontSize * 0.6 + itemPadding,
    0,
  );
  const offset = -((frame * pixelsPerFrame) % approxItemWidth);
  const rendered = [...items, ...items, ...items];

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: fontSize * 2.5,
        overflow: "hidden",
        perspective: `${perspective}px`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: 0,
            transform: `translateX(${offset}px)`,
            whiteSpace: "nowrap",
          }}
        >
          {rendered.map((item, i) => (
            <span
              key={i}
              style={{
                fontSize,
                fontWeight: 700,
                paddingRight: itemPadding,
                color: "hsl(var(--primary))",
                textShadow: "0 0 30px hsl(var(--primary) / 0.4)",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-heading, inherit)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      {/* Fades */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(to right, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)",
        }}
      />
    </div>
  );
}

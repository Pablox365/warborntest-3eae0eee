const particles = [
  { top: "15%", left: "8%", size: 6, opacity: 0.4, duration: "4s", delay: "0s" },
  { top: "70%", left: "5%", size: 4, opacity: 0.3, duration: "6s", delay: "1s" },
  { top: "25%", right: "12%", size: 8, opacity: 0.35, duration: "5s", delay: "0.5s" },
  { top: "80%", right: "8%", size: 5, opacity: 0.25, duration: "7s", delay: "2s" },
  { top: "45%", left: "3%", size: 3, opacity: 0.2, duration: "4.5s", delay: "1.5s" },
  { top: "55%", right: "5%", size: 4, opacity: 0.3, duration: "5.5s", delay: "0.8s" },
  { top: "35%", left: "92%", size: 5, opacity: 0.25, duration: "6s", delay: "3s" },
  { top: "10%", right: "30%", size: 3, opacity: 0.2, duration: "5s", delay: "2.5s" },
];

const Particles = () => (
  <>
    {particles.map((p, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary particle pointer-events-none"
        style={{
          top: p.top,
          left: p.left,
          right: p.right,
          width: p.size,
          height: p.size,
          opacity: p.opacity,
          "--duration": p.duration,
          "--delay": p.delay,
        } as React.CSSProperties}
      />
    ))}
  </>
);

export default Particles;

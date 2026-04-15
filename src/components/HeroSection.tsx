import { useEffect, useState } from "react";
import Particles from "./Particles";
import heroBg from "@/assets/hero-bg.jpg";
import warbornNormal from "@/assets/warborn-normal.png";
import warbornHardcore from "@/assets/warborn-hardcore.png";

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Particles */}
      <Particles />

      {/* Scanline */}
      <div className="absolute inset-0 scanline pointer-events-none" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 border border-primary/30 rounded-full mb-8 transition-all duration-700 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-status-pulse" />
            <span className="text-xs font-heading tracking-widest text-primary">SERVIDORES DE ARMA REFORGER</span>
          </div>

          {/* Logos */}
          <div
            className={`flex items-center gap-6 mb-8 transition-all duration-700 delay-100 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <img src={warbornNormal} alt="Warborn Normal" className="h-12 md:h-16" />
            <span className="text-muted-foreground text-2xl font-thin">/</span>
            <img src={warbornHardcore} alt="Warborn Hardcore" className="h-12 md:h-16" />
          </div>

          {/* Title */}
          <h1
            className={`text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-4 transition-all duration-700 delay-200 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            TU COMUNIDAD DE
            <br />
            <span className="text-primary text-glow-green">ARMA REFORGER</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-xs md:text-sm font-heading tracking-[0.3em] text-muted-foreground mb-4 transition-all duration-700 delay-300 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            SIMULACIÓN TÁCTICA · COMUNIDAD HISPANOHABLANTE
          </p>

          {/* Description */}
          <p
            className={`text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-8 transition-all duration-700 delay-400 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Únete a la experiencia definitiva de Arma Reforger. Dos servidores, una comunidad. 
            Desde partidas casuales hasta realismo táctico avanzado.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 delay-500 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <a
              href="#servers"
              onClick={(e) => { e.preventDefault(); document.querySelector("#servers")?.scrollIntoView({ behavior: "smooth" }); }}
              className="btn-military inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded font-heading tracking-widest text-sm font-bold hover:brightness-110 transition-all glow-green"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              CONECTARSE AL SERVIDOR
            </a>
            <a
              href="https://discord.gg/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-border rounded font-heading tracking-widest text-sm text-foreground hover:border-primary hover:text-primary transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg>
              DISCORD
            </a>
          </div>

          {/* Quick HUD status */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-600 ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <ServerQuickStatus name="NORMAL" players={24} maxPlayers={64} online />
            <ServerQuickStatus name="HARDCORE" players={18} maxPlayers={40} online />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-scroll-indicator">
        <span className="text-[10px] font-heading tracking-[0.3em] text-muted-foreground">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
    </section>
  );
};

const ServerQuickStatus = ({ name, players, maxPlayers, online }: { name: string; players: number; maxPlayers: number; online: boolean }) => (
  <div className="flex items-center gap-3 px-4 py-3 bg-card/80 backdrop-blur border border-border rounded animate-hud-flicker">
    <div className="flex flex-col">
      <span className="text-[10px] font-heading tracking-widest text-muted-foreground">SERVIDOR</span>
      <span className={`text-sm font-heading font-bold tracking-wider ${online ? "text-primary" : "text-destructive"}`}>
        {online ? "ONLINE" : "OFFLINE"}
      </span>
    </div>
    <div className="w-px h-8 bg-border" />
    <div className="flex flex-col">
      <span className="text-[10px] font-heading tracking-widest text-muted-foreground">{name}</span>
      <span className="text-sm font-heading font-bold">{players}/{maxPlayers}</span>
    </div>
    <span className={`w-2 h-2 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
  </div>
);

export default HeroSection;

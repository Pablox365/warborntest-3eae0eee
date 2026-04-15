import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import warbornNormal from "@/assets/warborn-normal.png";
import warbornHardcore from "@/assets/warborn-hardcore.png";

const servers = [
  {
    name: "WARBORN NORMAL",
    subtitle: "CASUAL / SEMI-REALISMO",
    logo: warbornNormal,
    description: "Partidas fluidas con un equilibrio entre diversión y realismo. Ideal para nuevos jugadores y sesiones casuales.",
    ip: "0.0.0.0:2001",
    players: 24,
    maxPlayers: 64,
    map: "Everon",
    online: true,
    accent: "primary",
  },
  {
    name: "WARBORN HARDCORE",
    subtitle: "REALISMO TÁCTICO AVANZADO",
    logo: warbornHardcore,
    description: "Experiencia militar inmersiva con comunicación táctica, mods avanzados y reglas estrictas de combate.",
    ip: "0.0.0.0:2002",
    players: 18,
    maxPlayers: 40,
    map: "Arland",
    online: true,
    accent: "destructive",
  },
];

const ServersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="servers" className="relative py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-50" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="SERVIDORES" title="ELIGE TU MODO" subtitle="Dos experiencias, una comunidad." />

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mt-12">
          {servers.map((s, i) => (
            <div
              key={s.name}
              className={`group relative bg-card border border-border rounded-lg overflow-hidden card-hover transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 200 + 300}ms` }}
            >
              {/* Top accent bar */}
              <div className={`h-1 ${i === 0 ? "bg-primary" : "bg-red-500"}`} />

              <div className="p-6 md:p-8">
                {/* Logo + status */}
                <div className="flex items-start justify-between mb-6">
                  <img src={s.logo} alt={s.name} className="h-10 md:h-14" />
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${s.online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
                    <span className={`text-xs font-heading tracking-widest ${s.online ? "text-primary" : "text-destructive"}`}>
                      {s.online ? "ONLINE" : "OFFLINE"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-heading font-bold mb-1">{s.name}</h3>
                <p className="text-[10px] font-heading tracking-[0.3em] text-muted-foreground mb-4">{s.subtitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{s.description}</p>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <StatBox label="JUGADORES" value={`${s.players}/${s.maxPlayers}`} />
                  <StatBox label="MAPA" value={s.map} />
                  <StatBox label="PING" value="32ms" />
                </div>

                {/* IP */}
                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded mb-6">
                  <span className="text-[10px] font-heading tracking-widest text-muted-foreground">IP:</span>
                  <code className="text-xs font-mono text-foreground">{s.ip}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(s.ip)}
                    className="ml-auto text-muted-foreground hover:text-primary transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                  </button>
                </div>

                {/* CTA */}
                <button className={`w-full btn-military py-3 rounded font-heading tracking-widest text-sm font-bold transition-all ${i === 0 ? "bg-primary text-primary-foreground glow-green-sm" : "bg-red-600 text-foreground"} hover:brightness-110`}>
                  CONECTARSE
                </button>
              </div>

              {/* HUD corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatBox = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center p-3 bg-secondary/30 rounded">
    <div className="text-[9px] font-heading tracking-widest text-muted-foreground mb-1">{label}</div>
    <div className="text-sm font-heading font-bold">{value}</div>
  </div>
);

export const SectionHeader = ({ visible, label, title, subtitle }: { visible: boolean; label: string; title: string; subtitle: string }) => (
  <div className="text-center">
    <span
      className={`inline-block text-[10px] font-heading tracking-[0.4em] text-primary mb-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      // {label}
    </span>
    <h2
      className={`text-3xl md:text-5xl font-heading font-bold mb-3 transition-all duration-700 delay-100 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {title}
    </h2>
    <p
      className={`text-sm text-muted-foreground transition-all duration-700 delay-200 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {subtitle}
    </p>
  </div>
);

export default ServersSection;

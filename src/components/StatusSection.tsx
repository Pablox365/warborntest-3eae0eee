import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";

const StatusSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="status" className="relative py-24 md:py-32" ref={ref}>
      <div className="absolute inset-0 grid-overlay pointer-events-none opacity-30" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="SISTEMA" title="ESTADO EN TIEMPO REAL" subtitle="Monitorización avanzada de la infraestructura." />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <ServerPanel
            name="NORMAL"
            online={true}
            players={24}
            maxPlayers={64}
            map="Everon"
            version="1.2.0.42"
            mods={6}
            uptime="99.8%"
            visible={isVisible}
            delay={300}
          />
          <ServerPanel
            name="HARDCORE"
            online={true}
            players={18}
            maxPlayers={40}
            map="Arland"
            version="1.2.0.42"
            mods={8}
            uptime="99.5%"
            visible={isVisible}
            delay={500}
          />
        </div>
      </div>
    </section>
  );
};

const ServerPanel = ({ name, online, players, maxPlayers, map, version, mods, uptime, visible, delay }: {
  name: string; online: boolean; players: number; maxPlayers: number; map: string; version: string; mods: number; uptime: string; visible: boolean; delay: number;
}) => (
  <div
    className={`relative bg-card border border-border rounded-lg overflow-hidden animate-hud-flicker transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {/* Header */}
    <div className="flex items-center justify-between p-5 border-b border-border">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${online ? "bg-primary animate-status-pulse" : "bg-destructive"}`} />
        <span className="font-heading tracking-widest text-sm font-bold">{name}</span>
      </div>
      <span className={`text-xs font-heading tracking-widest ${online ? "text-primary" : "text-destructive"}`}>
        {online ? "OPERATIVO" : "OFFLINE"}
      </span>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-px bg-border">
      <HudStat label="JUGADORES" value={`${players}/${maxPlayers}`} />
      <HudStat label="MAPA" value={map} />
      <HudStat label="VERSIÓN" value={version} />
      <HudStat label="MODS ACTIVOS" value={String(mods)} />
      <HudStat label="UPTIME" value={uptime} />
      <HudStat label="LATENCIA" value="32ms" />
    </div>

    {/* Player bar */}
    <div className="p-5">
      <div className="flex justify-between text-[10px] font-heading tracking-widest text-muted-foreground mb-2">
        <span>CAPACIDAD</span>
        <span>{Math.round((players / maxPlayers) * 100)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-1000"
          style={{ width: `${(players / maxPlayers) * 100}%` }}
        />
      </div>
    </div>

    {/* HUD corners */}
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/30" />
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/30" />
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/30" />
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/30" />
  </div>
);

const HudStat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card p-4">
    <div className="text-[9px] font-heading tracking-widest text-muted-foreground mb-1">{label}</div>
    <div className="text-sm font-heading font-bold">{value}</div>
  </div>
);

export default StatusSection;

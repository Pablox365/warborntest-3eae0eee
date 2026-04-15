import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";

const items = [
  { status: "done", title: "Servidor Normal", desc: "Lanzamiento del servidor casual/semi-realismo" },
  { status: "done", title: "Servidor Hardcore", desc: "Modo realismo táctico avanzado" },
  { status: "done", title: "Sistema de Mods", desc: "Workshop propio con mods curados" },
  { status: "testing", title: "Web Oficial", desc: "Plataforma central de la comunidad" },
  { status: "testing", title: "Bot Discord Avanzado", desc: "Gestión automática del estado de servidores" },
  { status: "dev", title: "Sistema de Eventos", desc: "Operaciones militares organizadas" },
  { status: "dev", title: "Panel de Usuario", desc: "Perfil, estadísticas y logros" },
  { status: "dev", title: "Tienda Avanzada", desc: "Merch con integración de pagos" },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  done: { label: "COMPLETADO", color: "text-primary", bg: "bg-primary" },
  testing: { label: "EN PRUEBAS", color: "text-yellow-400", bg: "bg-yellow-400" },
  dev: { label: "EN DESARROLLO", color: "text-blue-400", bg: "bg-blue-400" },
};

const RoadmapSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="roadmap" className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="PROGRESO" title="ROADMAP" subtitle="Nuestro plan de desarrollo activo." />

        {/* Legend */}
        <div className={`flex flex-wrap justify-center gap-6 mt-10 mb-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          {Object.entries(statusConfig).map(([, v]) => (
            <div key={v.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${v.bg}`} />
              <span className="text-[10px] font-heading tracking-widest text-muted-foreground">{v.label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative max-w-2xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {items.map((item, i) => {
            const cfg = statusConfig[item.status];
            const isLeft = i % 2 === 0;
            return (
              <div
                key={item.title}
                className={`relative flex items-start mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                style={{ transitionDelay: `${i * 150 + 400}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full border-2 border-background -translate-x-1/2 z-10" style={{ background: `var(--tw-${cfg.bg})` }}>
                  <div className={`w-3 h-3 rounded-full ${cfg.bg}`} />
                </div>

                {/* Card */}
                <div className={`ml-10 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                  <div className="bg-card border border-border rounded p-4 card-hover">
                    <span className={`text-[9px] font-heading tracking-widest ${cfg.color}`}>{cfg.label}</span>
                    <h4 className="text-sm font-heading font-bold tracking-wider mt-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;

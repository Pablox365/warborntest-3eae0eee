import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";

const categories = ["TODOS", "OBLIGATORIO", "MAPAS", "ARMAS", "VEHÍCULOS", "SCRIPTS"];

const modsData = [
  { name: "Everon Life", category: "MAPAS", required: true, img: "🗺️", desc: "Mapa principal del servidor Normal" },
  { name: "RHS Weapons", category: "ARMAS", required: true, img: "🔫", desc: "Pack de armas realistas" },
  { name: "ACE Advanced", category: "SCRIPTS", required: true, img: "⚙️", desc: "Sistema médico y balística avanzada" },
  { name: "RHS Vehicles", category: "VEHÍCULOS", required: true, img: "🚁", desc: "Vehículos militares realistas" },
  { name: "Arland Terrain", category: "MAPAS", required: false, img: "🏔️", desc: "Terreno alternativo para Hardcore" },
  { name: "Radio Mod", category: "SCRIPTS", required: false, img: "📡", desc: "Sistema de comunicación por radio" },
  { name: "NVG Enhanced", category: "ARMAS", required: false, img: "🌙", desc: "Visión nocturna mejorada" },
  { name: "Transport Pack", category: "VEHÍCULOS", required: false, img: "🚛", desc: "Vehículos de transporte adicionales" },
];

const ModsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [filter, setFilter] = useState("TODOS");

  const filtered = filter === "TODOS" ? modsData
    : filter === "OBLIGATORIO" ? modsData.filter(m => m.required)
    : modsData.filter(m => m.category === filter);

  return (
    <section id="mods" className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="WORKSHOP" title="MODS" subtitle="Consulta y gestiona los mods necesarios." />

        {/* Filters */}
        <div className={`flex flex-wrap justify-center gap-2 mt-10 mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 text-[10px] font-heading tracking-widest rounded border transition-all duration-300 ${
                filter === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((mod, i) => (
            <div
              key={mod.name}
              className={`group bg-card border border-border rounded-lg p-5 card-hover transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100 + 400}ms` }}
            >
              <div className="text-3xl mb-3">{mod.img}</div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-heading font-bold tracking-wider">{mod.name}</h4>
                {mod.required && (
                  <span className="px-2 py-0.5 text-[8px] font-heading tracking-widest bg-primary/20 text-primary rounded">REQ</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">{mod.desc}</p>
              <span className="text-[9px] font-heading tracking-widest text-muted-foreground">{mod.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModsSection;

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";

const FeedbackSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [type, setType] = useState("sugerencia");

  return (
    <section className="relative py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="COMUNIDAD" title="FEEDBACK" subtitle="Tu opinión mejora la experiencia de todos." />

        <div className={`max-w-lg mx-auto mt-12 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="bg-card border border-border rounded-lg p-6 md:p-8">
            {/* Type selector */}
            <div className="flex gap-2 mb-6">
              {["sugerencia", "bug", "opinión"].map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-[10px] font-heading tracking-widest rounded border transition-all duration-300 ${
                    type === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <textarea
                placeholder="Escribe tu mensaje..."
                rows={4}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors resize-none"
              />
              <button className="w-full py-3 bg-primary text-primary-foreground rounded font-heading tracking-widest text-sm font-bold hover:brightness-110 transition-all btn-military">
                ENVIAR FEEDBACK
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;

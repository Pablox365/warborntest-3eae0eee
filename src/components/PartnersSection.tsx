import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";
import hostingLogo from "@/assets/logowithtext.png";

const PartnersSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="partners" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="COLABORADORES" title="PARTNERS" subtitle="Empresas que hacen posible esta comunidad." />

        <div className="max-w-xl mx-auto mt-12">
          <div
            className={`bg-card border border-border rounded-lg p-8 text-center card-hover animate-border-glow transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="text-[10px] font-heading tracking-[0.4em] text-primary mb-4">HOSTING OFICIAL</div>
            <img src={hostingLogo} alt="Hosting Partner" className="h-12 md:h-16 mx-auto mb-6" />
            <p className="text-sm text-muted-foreground mb-6">
              Infraestructura de servidores dedicada de alto rendimiento para garantizar la mejor experiencia de juego.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#"
                className="px-6 py-3 border border-primary text-primary rounded font-heading tracking-widest text-xs hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                VER PLANES
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

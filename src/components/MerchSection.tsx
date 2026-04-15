import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { SectionHeader } from "./ServersSection";

const products = [
  { name: "Camiseta Warborn", price: "24.99€", type: "Camiseta", emoji: "👕" },
  { name: "Sudadera Tactical", price: "49.99€", type: "Sudadera", emoji: "🧥" },
  { name: "Gorra Operator", price: "19.99€", type: "Accesorio", emoji: "🧢" },
  { name: "Parche Warborn", price: "9.99€", type: "Accesorio", emoji: "🎖️" },
];

const MerchSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="merch" className="relative py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader visible={isVisible} label="TIENDA" title="MERCH" subtitle="Representa a la comunidad." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {products.map((p, i) => (
            <div
              key={p.name}
              className={`bg-card border border-border rounded-lg overflow-hidden card-hover transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${i * 100 + 300}ms` }}
            >
              <div className="aspect-square bg-secondary/30 flex items-center justify-center text-6xl">
                {p.emoji}
              </div>
              <div className="p-4">
                <span className="text-[9px] font-heading tracking-widest text-muted-foreground">{p.type}</span>
                <h4 className="text-sm font-heading font-bold tracking-wider mt-1">{p.name}</h4>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-heading font-bold text-primary">{p.price}</span>
                  <button className="px-3 py-1.5 text-[10px] font-heading tracking-widest bg-primary text-primary-foreground rounded hover:brightness-110 transition-all btn-military">
                    PEDIR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchSection;

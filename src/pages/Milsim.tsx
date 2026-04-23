import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import SeoContent from "@/components/SeoContent";
import MilsimSection from "@/components/MilsimSection";

const Milsim = () => (
  <SiteLayout>
    <Seo
      title="Milsim Arma Reforger España | Warborn Milsim PvE"
      description="Servidor Milsim PvE de Warborn para Arma Reforger en español. Operaciones tácticas, mods avanzados y simulación militar realista en la mejor comunidad hispana."
      path="/milsim"
    />
    <div className="pt-24">
      <SeoBreadcrumbs items={[{ name: "Milsim", path: "/milsim" }]} />
      <MilsimSection />
      <SeoContent
        h1="Milsim Arma Reforger en español — Warborn Milsim PvE"
        intro="Warborn Milsim es la experiencia más realista de Arma Reforger en español. Un servidor PvE dedicado a la simulación militar táctica con operaciones planificadas, jerarquía de mando, comunicación por radio y mods avanzados que llevan el realismo al máximo nivel."
        sections={[
          {
            h2: "¿Qué es un servidor Milsim de Arma Reforger?",
            body: "Un servidor Milsim (Military Simulation) es una modalidad donde los jugadores siguen procedimientos militares reales: organización en escuadras, uso de radio TFAR/ACRE, planificación de operaciones, reglas de combate estrictas y atención al detalle táctico. Warborn Milsim es uno de los pocos servidores Milsim de Arma Reforger en español.",
          },
          {
            h2: "Operaciones Milsim PvE",
            body: "Las operaciones de Warborn Milsim son escenarios PvE planificados donde la comunidad coopera contra IA en misiones de asalto, defensa, reconocimiento y rescate. Cada operación tiene briefing previo, roles asignados y un mando de operación.",
          },
        ]}
        faqs={[
          { q: "¿Cómo entro al servidor Milsim de Warborn?", a: "Necesitas unirte al Discord oficial y pasar una breve presentación. Esto garantiza un nivel táctico mínimo para todos los jugadores." },
          { q: "¿Hay horarios de operaciones?", a: "Sí, las operaciones Milsim se anuncian en Discord con días, horas y briefing previo." },
          { q: "¿Es solo para veteranos?", a: "No, aceptamos jugadores nuevos siempre que tengan ganas de aprender procedimientos tácticos básicos." },
        ]}
      />
    </div>
  </SiteLayout>
);

export default Milsim;
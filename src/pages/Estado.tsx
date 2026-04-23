import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import StatusSection from "@/components/StatusSection";

const Estado = () => (
  <SiteLayout>
    <Seo
      title="Estado en vivo de los servidores Warborn | Arma Reforger"
      description="Consulta en tiempo real el estado, jugadores online y disponibilidad de los servidores Warborn de Arma Reforger España."
      path="/estado"
    />
    <div className="pt-24">
      <StatusSection />
    </div>
  </SiteLayout>
);

export default Estado;
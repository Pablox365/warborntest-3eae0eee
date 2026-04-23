import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import ModsSection from "@/components/ModsSection";

const Mods = () => (
  <SiteLayout>
    <Seo
      title="Mods Arma Reforger España | Lista oficial Warborn"
      description="Lista completa y actualizada de mods de los servidores Warborn de Arma Reforger. Descarga e instala los mods necesarios para jugar en Normal, Hardcore y Milsim."
      path="/mods"
    />
    <div className="pt-24">
      <ModsSection />
    </div>
  </SiteLayout>
);

export default Mods;
import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import RadioSection from "@/components/RadioSection";

const Radio = () => (
  <SiteLayout>
    <Seo
      title="Radio Warborn | Música militar para Arma Reforger"
      description="Escucha la radio oficial de Warborn mientras juegas a Arma Reforger. Música militar, ambiente táctico y banda sonora para la comunidad española."
      path="/radio"
    />
    <div className="pt-24">
      <SeoBreadcrumbs items={[{ name: "Radio", path: "/radio" }]} />
      <RadioSection />
    </div>
  </SiteLayout>
);

export default Radio;
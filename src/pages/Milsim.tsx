import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import MilsimSection from "@/components/MilsimSection";

const Milsim = () => (
  <SiteLayout>
    <Seo
      title="Milsim Arma Reforger España | Warborn Milsim PvE"
      description="Servidor Milsim PvE de Warborn para Arma Reforger en español. Operaciones tácticas, mods avanzados y simulación militar realista en la mejor comunidad hispana."
      path="/milsim"
    />
    <div className="pt-24">
      <MilsimSection />
    </div>
  </SiteLayout>
);

export default Milsim;
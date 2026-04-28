import Seo from "@/components/Seo";
import SiteLayout from "@/components/SiteLayout";
import BugReportSection from "@/components/BugReportSection";

const Reportar = () => (
  <SiteLayout>
    <Seo
      title="Reportar bug o queja | Warborn"
      description="Canal privado de reportes de Warborn. Envía bugs, quejas o sugerencias sobre los servidores Normal, Hardcore o Milsim."
      path="/reportar"
    />
    <div className="pt-24">
      <BugReportSection />
    </div>
  </SiteLayout>
);

export default Reportar;
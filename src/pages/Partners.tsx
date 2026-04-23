import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import PartnersSection from "@/components/PartnersSection";
import DonationsSection from "@/components/DonationsSection";

const Partners = () => (
  <SiteLayout>
    <Seo
      title="Partners y Donaciones | Warborn Arma Reforger España"
      description="Conoce a los partners oficiales de Warborn y apoya la comunidad española de Arma Reforger con tus donaciones para mantener los servidores activos."
      path="/partners"
    />
    <div className="pt-24">
      <SeoBreadcrumbs items={[{ name: "Partners", path: "/partners" }]} />
      <PartnersSection />
      <DonationsSection />
    </div>
  </SiteLayout>
);

export default Partners;
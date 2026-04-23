import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import ServersSection from "@/components/ServersSection";
import StatusSection from "@/components/StatusSection";

const Servidores = () => (
  <SiteLayout>
    <Seo
      title="Servidores Arma Reforger España | Warborn Normal y Hardcore"
      description="Únete a los servidores oficiales de Warborn para Arma Reforger España: modo Normal casual y Hardcore táctico. IPs, players online y conexión directa."
      path="/servidores"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Servidores Warborn Arma Reforger",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Warborn Normal" },
          { "@type": "ListItem", position: 2, name: "Warborn Hardcore" },
        ],
      }}
    />
    <div className="pt-24">
      <ServersSection />
      <StatusSection />
    </div>
  </SiteLayout>
);

export default Servidores;
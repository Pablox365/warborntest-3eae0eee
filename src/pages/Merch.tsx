import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import MerchSection from "@/components/MerchSection";

const Merch = () => (
  <SiteLayout>
    <Seo
      title="Merchandising Warborn | Ropa y parches Arma Reforger España"
      description="Tienda oficial de Warborn: camisetas, parches y merchandising de la comunidad española de Arma Reforger. Pedidos por Discord."
      path="/merch"
    />
    <div className="pt-24">
      <MerchSection />
    </div>
  </SiteLayout>
);

export default Merch;
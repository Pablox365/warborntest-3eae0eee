import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import SeoContent from "@/components/SeoContent";
import ModsSection from "@/components/ModsSection";

const Mods = () => (
  <SiteLayout>
    <Seo
      title="Mods Arma Reforger España | Lista oficial Warborn"
      description="Lista completa y actualizada de mods de los servidores Warborn de Arma Reforger. Descarga e instala los mods necesarios para jugar en Normal, Hardcore y Milsim."
      path="/mods"
    />
    <div className="pt-24">
      <SeoBreadcrumbs items={[{ name: "Mods", path: "/mods" }]} />
      <ModsSection />
      <SeoContent
        h1="Mods de Arma Reforger — Lista oficial Warborn"
        intro="Aquí encontrarás todos los mods utilizados en los servidores Warborn de Arma Reforger, organizados por categoría y servidor (Normal, Hardcore, Milsim). Los mods se descargan automáticamente al conectar, pero puedes consultarlos aquí para conocer su contenido."
        faqs={[
          { q: "¿Tengo que descargar los mods manualmente?", a: "No, Arma Reforger descarga e instala automáticamente los mods al unirte a un servidor Warborn." },
          { q: "¿Los mods funcionan en Xbox?", a: "Sí, los mods de Arma Reforger son compatibles con PC y Xbox a través del Workshop oficial." },
          { q: "¿Puedo sugerir un mod?", a: "Sí, en nuestro Discord tenemos un canal de sugerencias donde la comunidad propone nuevos mods." },
        ]}
      />
    </div>
  </SiteLayout>
);

export default Mods;
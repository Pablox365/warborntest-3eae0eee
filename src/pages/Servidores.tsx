import SiteLayout from "@/components/SiteLayout";
import Seo from "@/components/Seo";
import SeoBreadcrumbs from "@/components/SeoBreadcrumbs";
import SeoContent from "@/components/SeoContent";
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
      <SeoBreadcrumbs items={[{ name: "Servidores", path: "/servidores" }]} />
      <ServersSection />
      <StatusSection />
      <SeoContent
        h1="Servidores de Arma Reforger en España"
        intro="Warborn ofrece los mejores servidores españoles de Arma Reforger con dos modalidades: Normal para jugadores casuales y Hardcore para los más tácticos. Toda la comunidad habla español, los servidores están alojados en Europa con baja latencia y los datos de jugadores se actualizan en tiempo real desde BattleMetrics."
        sections={[
          {
            h2: "Servidor Warborn Normal — Arma Reforger casual en español",
            body: "El servidor Normal de Warborn está pensado para jugadores que quieren disfrutar de Arma Reforger sin complicaciones extremas. Reglas equilibradas, mods esenciales y un ambiente cercano para nuevos jugadores que se inician en la simulación militar en español.",
          },
          {
            h2: "Servidor Warborn Hardcore — Realismo táctico avanzado",
            body: "Si buscas servidores de Arma Reforger españoles con realismo extremo, Warborn Hardcore es tu sitio. Comunicación táctica obligatoria, mods avanzados, reglas de combate estrictas y operaciones inmersivas con la comunidad hispana más activa.",
          },
          {
            h2: "¿Cómo conectar a los servidores Warborn?",
            body: "Pulsa el botón JUGAR en cada servidor para copiar la IP o lanzar el juego directamente. También puedes encontrarnos buscando 'Warborn' dentro del navegador de servidores de Arma Reforger.",
          },
        ]}
        faqs={[
          { q: "¿Los servidores de Warborn son gratuitos?", a: "Sí, jugar en los servidores Warborn de Arma Reforger es totalmente gratuito. Solo necesitas tener Arma Reforger en Steam o Xbox." },
          { q: "¿Hay servidores españoles de Arma Reforger 24/7?", a: "Sí, los servidores Warborn Normal y Hardcore están online 24/7 con monitorización en tiempo real desde BattleMetrics." },
          { q: "¿Necesito mods para jugar?", a: "Los mods se descargan automáticamente al conectar al servidor. Puedes consultar la lista completa en la sección de Mods." },
          { q: "¿Puedo jugar en Xbox?", a: "Sí, los servidores Warborn están disponibles tanto para PC como para Xbox. Busca 'Warborn' en el listado de servidores." },
        ]}
      />
    </div>
  </SiteLayout>
);

export default Servidores;
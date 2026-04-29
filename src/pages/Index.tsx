import Seo from "@/components/Seo";
import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import ServersSection from "@/components/ServersSection";
import MilsimSection from "@/components/MilsimSection";
import ModsSection from "@/components/ModsSection";
import RadioSection from "@/components/RadioSection";
import MerchSection from "@/components/MerchSection";
import DonationsSection from "@/components/DonationsSection";
import PartnersSection from "@/components/PartnersSection";
import FeedbackSection from "@/components/FeedbackSection";
import SeoContent from "@/components/SeoContent";

const Index = () => (
  <SiteLayout>
    <Seo
      title="Warborn España | Servidores Arma Reforger Normal, Hardcore y Milsim"
      description="Warborn: comunidad española de Arma Reforger. Servidores Normal, Hardcore y Milsim PvE en español. Únete a la mejor comunidad hispana de simulación táctica."
      path="/"
    />
    <HeroSection />
    <ServersSection />
    <MilsimSection />
    <ModsSection />
    <RadioSection />
    <MerchSection />
    <DonationsSection />
    <PartnersSection />
    <FeedbackSection />
    <SeoContent
      h1="Warborn — Comunidad española de Arma Reforger"
      intro="Warborn es la principal comunidad hispana de Arma Reforger, con servidores españoles dedicados en modo Normal, Hardcore y Milsim PvE. Si buscas servidores de Arma Reforger en España con jugadores que hablan español, baja latencia y una comunidad activa 24/7, este es tu sitio."
      sections={[
        {
          h2: "Servidores Arma Reforger España",
          body: "Disponemos de servidores Arma Reforger españoles para todos los perfiles: jugadores casuales en el servidor Normal, simulación táctica avanzada en el Hardcore y operaciones planificadas en Milsim PvE. Todos los servidores Warborn están alojados en Europa, monitorizados en tiempo real y abiertos a la comunidad hispana de Arma Reforger.",
        },
        {
          h2: "Por qué jugar Arma Reforger en Warborn",
          body: "Warborn España nació para reunir a los jugadores hispanohablantes de Arma Reforger en un solo lugar. Comunicación clara, mods curados, eventos semanales, soporte en Discord y un equipo dedicado a mantener los mejores servidores Arma Reforger en español.",
        },
      ]}
      faqs={[
        { q: "¿Qué es Warborn?", a: "Warborn es la comunidad española de Arma Reforger más grande, con servidores Normal, Hardcore y Milsim PvE en español." },
        { q: "¿Dónde encuentro los servidores Warborn de Arma Reforger?", a: "En el navegador de servidores de Arma Reforger busca 'Warborn'. También puedes copiar las IPs desde la sección Servidores de esta web." },
        { q: "¿Hay servidores españoles de Arma Reforger en Xbox?", a: "Sí, los servidores Warborn están disponibles para PC y Xbox." },
        { q: "¿Cómo me uno a la comunidad Warborn?", a: "Únete al Discord oficial en discord.gg/warbornesp para conectar con la comunidad, organizar partidas y recibir avisos de eventos." },
        { q: "¿Warborn tiene servidor Milsim de Arma Reforger?", a: "Sí, Warborn Milsim es uno de los pocos servidores Milsim de Arma Reforger en español, con operaciones PvE planificadas." },
      ]}
    />
  </SiteLayout>
);

export default Index;

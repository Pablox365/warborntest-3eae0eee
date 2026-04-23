import Seo from "@/components/Seo";
import SiteLayout from "@/components/SiteLayout";
import HeroSection from "@/components/HeroSection";
import ServersSection from "@/components/ServersSection";
import MilsimSection from "@/components/MilsimSection";
import ModsSection from "@/components/ModsSection";
import StatusSection from "@/components/StatusSection";
import RadioSection from "@/components/RadioSection";
import MerchSection from "@/components/MerchSection";
import DonationsSection from "@/components/DonationsSection";
import PartnersSection from "@/components/PartnersSection";
import FeedbackSection from "@/components/FeedbackSection";

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
    <StatusSection />
    <RadioSection />
    <MerchSection />
    <DonationsSection />
    <PartnersSection />
    <FeedbackSection />
  </SiteLayout>
);

export default Index;

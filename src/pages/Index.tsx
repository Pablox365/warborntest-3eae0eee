import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
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
import Footer from "@/components/Footer";
import HiddenAdminTrigger from "@/components/HiddenAdminTrigger";

const Index = () => (
  <>
    <Helmet>
      <title>Warborn España | Servidores Arma Reforger Normal, Hardcore y Milsim</title>
      <meta
        name="description"
        content="Warborn: comunidad española de Arma Reforger. Servidores Normal, Hardcore y Milsim PvE en español. Únete a la mejor comunidad hispana de simulación táctica."
      />
      <link rel="canonical" href="https://warborn.es/" />
    </Helmet>
    <main className="min-h-screen bg-background">
      <Navbar />
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
      <Footer />
      <HiddenAdminTrigger />
    </main>
  </>
);

export default Index;

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HiddenAdminTrigger from "@/components/HiddenAdminTrigger";
import AlineaChatbot from "@/components/AlineaChatbot";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-background">
    <Navbar />
    {children}
    <Footer />
    <HiddenAdminTrigger />
    <AlineaChatbot />
  </main>
);

export default SiteLayout;
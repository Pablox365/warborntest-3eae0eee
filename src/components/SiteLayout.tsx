import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HiddenAdminTrigger from "@/components/HiddenAdminTrigger";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-background">
    <Navbar />
    {children}
    <Footer />
    <HiddenAdminTrigger />
  </main>
);

export default SiteLayout;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RadioProvider } from "@/contexts/RadioContext";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import CookieConsent from "@/components/CookieConsent";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageTracking } from "@/hooks/usePageTracking";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import Servidores from "./pages/Servidores.tsx";
import Milsim from "./pages/Milsim.tsx";
import Mods from "./pages/Mods.tsx";
import Radio from "./pages/Radio.tsx";
import Merch from "./pages/Merch.tsx";
import Partners from "./pages/Partners.tsx";
import Reportar from "./pages/Reportar.tsx";

const queryClient = new QueryClient();

const RouteTracker = () => {
  usePageTracking();
  return null;
};

const App = () => {
  // Show on every full page load (refresh included). Skip only for very recent
  // loads (<60s) so SPA-like navigations don't re-trigger it.
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    const last = Number(sessionStorage.getItem("warborn-loaded-at") || 0);
    return Date.now() - last > 60_000;
  });

  useEffect(() => {
    if (!loading) return;
    // Safety net: ensure we never block forever
    const t = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(t);
  }, [loading]);

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RadioProvider>
          <BrowserRouter>
            <RouteTracker />
            {loading && (
              <LoadingScreen
                onDone={() => {
                  sessionStorage.setItem("warborn-loaded-at", String(Date.now()));
                  setLoading(false);
                }}
              />
            )}
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servidores" element={<Servidores />} />
              <Route path="/milsim" element={<Milsim />} />
              <Route path="/mods" element={<Mods />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/reportar" element={<Reportar />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AnnouncementPopup />
            <CookieConsent />
          </BrowserRouter>
        </RadioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;

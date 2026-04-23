import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RadioProvider } from "@/contexts/RadioContext";
import Index from "./pages/Index.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";
import Servidores from "./pages/Servidores.tsx";
import Milsim from "./pages/Milsim.tsx";
import Mods from "./pages/Mods.tsx";
import Estado from "./pages/Estado.tsx";
import Radio from "./pages/Radio.tsx";
import Merch from "./pages/Merch.tsx";
import Partners from "./pages/Partners.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <RadioProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servidores" element={<Servidores />} />
              <Route path="/milsim" element={<Milsim />} />
              <Route path="/mods" element={<Mods />} />
              <Route path="/estado" element={<Estado />} />
              <Route path="/radio" element={<Radio />} />
              <Route path="/merch" element={<Merch />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </RadioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

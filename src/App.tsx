import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLegalDocuments from "./pages/AdminLegalDocuments";
import GoogleAnalytics from "./components/GoogleAnalytics";
import CookieConsent, { CookiePreferences } from "./components/CookieConsent";
import { ReconsentModal } from "./components/ReconsentModal";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GoogleAnalytics 
            measurementId="G-YP5DGC4W74" 
            enabled={cookiePreferences.analytics} 
          />
          <CookieConsent onPreferencesChange={setCookiePreferences} />
          <ReconsentModal />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/cases" element={<CaseStudies />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/termos-de-uso" element={<TermsOfService />} />
              <Route path="/politica-de-privacidade" element={<PrivacyPolicy />} />
              <Route path="/admin/legal-documents" element={<AdminLegalDocuments />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;

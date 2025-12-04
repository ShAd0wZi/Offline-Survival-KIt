import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { InstallPrompt } from "@/components/InstallPrompt";
import { initializeDefaultSettings } from "@/db/database";
import Home from "./pages/Home";
import SurvivalGuides from "./pages/SurvivalGuides";
import GuideDetail from "./pages/GuideDetail";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Initialize database on app load
  useEffect(() => {
    initializeDefaultSettings().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <OfflineIndicator />
          <InstallPrompt />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/guides" element={<SurvivalGuides />} />
              <Route path="/guide/:id" element={<GuideDetail />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;

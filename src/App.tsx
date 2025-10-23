import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Customization from "./pages/Customization";
import Calendar from "./pages/Calendar";
import Credits from "./pages/Credits";
import Billing from "./pages/Billing";
import Analytics from "./pages/Analytics";
import Help from "./pages/Help";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/customization" element={<Customization />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/help" element={<Help />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

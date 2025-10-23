import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Notifications from "./pages/Notifications";
import Audience from "./pages/Audience";
import Campaigns from "./pages/Campaigns";
import Messages from "./pages/Messages";
import Discounts from "./pages/Discounts";
import Performance from "./pages/Performance";
import Billing from "./pages/Billing";
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
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/billing" element={<Billing />} />
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

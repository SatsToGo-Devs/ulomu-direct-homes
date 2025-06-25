
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import HowItWorks from "./pages/HowItWorks";
import LandlordDashboard from "./pages/LandlordDashboard";
import TenantPortal from "./pages/TenantPortal";
import MaintenanceHubPage from "./pages/MaintenanceHub";
import EscrowHubPage from "./pages/EscrowHub";
import AIInsights from "./pages/AIInsights";
import AIPredictionsPage from "./pages/AIPredictions";
import AddProperty from "./pages/AddProperty";
import ProfileSettingsPage from "./pages/ProfileSettings";
import SystemTest from "./pages/SystemTest";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
            <Route path="/tenant-portal" element={<TenantPortal />} />
            <Route path="/maintenance" element={<MaintenanceHubPage />} />
            <Route path="/escrow" element={<EscrowHubPage />} />
            <Route path="/ai-insights" element={<AIInsights />} />
            <Route path="/ai-predictions" element={<AIPredictionsPage />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/profile-settings" element={<ProfileSettingsPage />} />
            <Route path="/system-test" element={<SystemTest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

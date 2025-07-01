
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
import LandlordDashboard from "./pages/LandlordDashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import SystemTest from "./pages/SystemTest";
import AIInsights from "./pages/AIInsights";
import AIPredictions from "./pages/AIPredictions";
import MaintenanceHub from "./pages/MaintenanceHub";
import EscrowHubPage from "./pages/EscrowHub";
import TenantPortal from "./pages/TenantPortal";
import TenantsPage from "./pages/TenantsPage";
import HowItWorks from "./pages/HowItWorks";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/add-property" element={<AddProperty />} />
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/system-test" element={<SystemTest />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/ai-predictions" element={<AIPredictions />} />
              <Route path="/maintenance" element={<MaintenanceHub />} />
              <Route path="/escrow" element={<EscrowHubPage />} />
              <Route path="/tenant-portal" element={<TenantPortal />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

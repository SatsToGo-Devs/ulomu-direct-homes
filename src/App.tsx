
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import LandlordDashboard from "./pages/LandlordDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AddProperty from "./pages/AddProperty";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import SystemTest from "./pages/SystemTest";
import AIInsightsPage from "@/pages/AIInsightsPage";
import ChatAssistantPage from "@/pages/ChatAssistantPage";
import PredictionsPage from "./pages/AIPredictions";
import AIInsights from "./pages/AIInsights";
import MaintenanceHubPage from "./pages/MaintenanceHub";
import EscrowHub from "./pages/EscrowHub";
import TenantPortal from "./pages/TenantPortal";
import TenantsPage from "./pages/TenantsPage";
import HowItWorks from "./pages/HowItWorks";
import AIHub from "./pages/AIHub";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/property/:id" element={<PropertyDetail />} />
                <Route path="/add-property" element={<AddProperty />} />
                <Route path="/tenants" element={<TenantsPage />} />
                <Route path="/tenant-portal" element={<TenantPortal />} />
                <Route path="/maintenance" element={<MaintenanceHubPage />} />
                <Route path="/escrow" element={<EscrowHub />} />
                <Route path="/ai-insights" element={<AIInsightsPage />} />
                <Route path="/chat-assistant" element={<ChatAssistantPage />} />
                <Route path="/ai-predictions" element={<PredictionsPage />} />
                <Route path="/property-insights" element={<AIInsights />} />
                <Route path="/system-test" element={<SystemTest />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/ai-hub" element={<AIHub />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

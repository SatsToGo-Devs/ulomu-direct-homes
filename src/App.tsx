
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import MaintenanceHub from "./pages/MaintenanceHub";
import AIInsights from "./pages/AIInsights";
import AIPredictions from "./pages/AIPredictions";
import AddProperty from "./pages/AddProperty";
import TenantPortal from "./pages/TenantPortal";
import HowItWorks from "./pages/HowItWorks";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EscrowHub from "./pages/EscrowHub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/properties" element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              } />
              <Route path="/properties/:id" element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              } />
              <Route path="/maintenance" element={
                <ProtectedRoute>
                  <MaintenanceHub />
                </ProtectedRoute>
              } />
              <Route path="/ai-insights" element={
                <ProtectedRoute>
                  <AIInsights />
                </ProtectedRoute>
              } />
              <Route path="/ai-predictions" element={
                <ProtectedRoute>
                  <AIPredictions />
                </ProtectedRoute>
              } />
              <Route path="/add-property" element={
                <ProtectedRoute>
                  <AddProperty />
                </ProtectedRoute>
              } />
              <Route path="/tenant-portal" element={
                <ProtectedRoute>
                  <TenantPortal />
                </ProtectedRoute>
              } />
              <Route path="/escrow" element={
                <ProtectedRoute>
                  <EscrowHub />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

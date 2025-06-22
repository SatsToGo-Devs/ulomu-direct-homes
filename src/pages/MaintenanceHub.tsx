import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MaintenanceHub from "@/components/Maintenance/MaintenanceHub";
import ProtectedRoute from "@/components/ProtectedRoute";

const MaintenanceHubPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Maintenance Hub</h1>
            <p className="text-white/90">AI-powered maintenance management and predictions</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            <MaintenanceHub />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default MaintenanceHubPage;

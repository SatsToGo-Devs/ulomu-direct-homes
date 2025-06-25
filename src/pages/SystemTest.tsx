
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UlomuSystemTest from "@/components/SystemTest/UlomuSystemTest";
import ProtectedRoute from "@/components/ProtectedRoute";

const SystemTest = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">🧪 System Test Suite</h1>
            <p className="text-white/90">Comprehensive testing of all Ulomu features and integrations</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            <UlomuSystemTest />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default SystemTest;

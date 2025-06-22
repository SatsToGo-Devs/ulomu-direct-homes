import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EscrowHub from "@/components/Escrow/EscrowHub";
import ProtectedRoute from "@/components/ProtectedRoute";

const EscrowHubPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Escrow Hub</h1>
            <p className="text-white/90">Secure transactions and service charge management</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            <EscrowHub />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EscrowHubPage;


import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PredictionsPage from "@/components/AI/PredictionsPage";
import ProtectedRoute from "@/components/ProtectedRoute";

const AIPredictions = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">🔮 AI Predictions</h1>
            <p className="text-white/90">Predictive insights for property maintenance and management</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            <PredictionsPage />
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AIPredictions;

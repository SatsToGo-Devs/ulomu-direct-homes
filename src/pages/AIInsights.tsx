
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIInsightsDetailed from "@/components/Dashboard/AIInsightsDetailed";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AIInsight } from "@/hooks/useDashboardData";
import { useToast } from "@/hooks/use-toast";

const AIInsights = () => {
  const { aiInsights, loading } = useDashboardData();
  const { toast } = useToast();

  const handleActionClick = (insight: AIInsight) => {
    toast({
      title: "Action Noted",
      description: `Taking action on: ${insight.title}`,
    });
    // Here you would implement the specific action logic
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">AI Insights & Recommendations</h1>
            <p className="text-white/90">Smart analytics and actionable insights for your properties</p>
          </div>
        </div>
        <main className="flex-1 bg-beige/20">
          <div className="container mx-auto px-4 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
              </div>
            ) : (
              <AIInsightsDetailed insights={aiInsights} onActionClick={handleActionClick} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AIInsights;

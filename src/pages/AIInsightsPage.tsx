
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageCircle, Wrench, Eye, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChatAssistant from "@/components/AI/ChatAssistant";

const AIInsightsPage = () => {
  const navigate = useNavigate();

  const aiFeatures = [
    {
      title: "AI Chat Assistant",
      description: "Get instant help with property management, maintenance requests, and tenant inquiries",
      icon: MessageCircle,
      color: "bg-terracotta",
      action: () => navigate("/chat-assistant"),
      status: "Active"
    },
    {
      title: "Predictive Maintenance",
      description: "AI-powered predictions for potential property issues and maintenance needs",
      icon: Wrench,
      color: "bg-forest",
      action: () => navigate("/ai-predictions"),
      status: "Active"
    },
    {
      title: "Smart Property Insights",
      description: "Advanced analytics and recommendations for your property portfolio",
      icon: Eye,
      color: "bg-gold",
      action: () => navigate("/property-insights"),
      status: "Active"
    },
    {
      title: "Cost Optimization",
      description: "AI suggestions to reduce maintenance costs and improve efficiency",
      icon: TrendingUp,
      color: "bg-terracotta/80",
      action: () => {},
      status: "Coming Soon"
    }
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="bg-gradient-to-r from-terracotta to-forest text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="h-10 w-10" />
              <h1 className="text-4xl font-bold">AI-Powered Features</h1>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">
              Harness the power of artificial intelligence to streamline your property management,
              predict maintenance issues, and enhance tenant satisfaction.
            </p>
          </div>
        </div>

        <main className="flex-1 bg-beige/20 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            {/* AI Features Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="border-beige/50 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`${feature.color} p-3 rounded-lg`}>
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                      <Badge 
                        variant={feature.status === "Active" ? "default" : "secondary"}
                        className={feature.status === "Active" ? "bg-forest text-white" : ""}
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                    <Button 
                      onClick={feature.action}
                      disabled={feature.status !== "Active"}
                      className="w-full bg-terracotta hover:bg-terracotta/90 text-white"
                    >
                      {feature.status === "Active" ? "Launch Feature" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Live AI Chat Assistant */}
            <Card className="border-beige/50 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-gold" />
                  <CardTitle>Try AI Assistant Now</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ChatAssistant />
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AIInsightsPage;


import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Zap, Shield } from "lucide-react";

const UlomuHero = () => {
  return (
    <section className="bg-gradient-to-br from-beige to-beige/50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Meet <span className="text-terracotta">Ulomu</span>
                <br />
                Your AI Property Maintenance Assistant
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Transform property management with AI-powered predictive maintenance, 
                automated tenant communication, and intelligent scheduling. Keep your 
                properties in perfect condition while reducing costs and stress.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-terracotta hover:bg-terracotta/90 text-white">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-forest text-forest hover:bg-forest hover:text-white">
                Watch Demo
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-terracotta" />
                <span className="text-sm text-gray-600">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-gold" />
                <span className="text-sm text-gray-600">Automated</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-forest" />
                <span className="text-sm text-gray-600">Reliable</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-beige">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-forest rounded-full"></div>
                  <span className="text-sm font-medium">AI Maintenance Alert</span>
                </div>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Predictive Alert:</strong> HVAC system at Lekki Property 
                    shows efficiency drop. Schedule maintenance in next 5 days to 
                    prevent breakdown.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-terracotta hover:bg-terracotta/90 text-white">
                    Schedule Now
                  </Button>
                  <Button size="sm" variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UlomuHero;

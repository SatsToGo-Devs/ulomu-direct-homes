
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const CtaSection = () => {
  const benefits = [
    "Free 14-day trial",
    "No setup fees",
    "Cancel anytime",
    "24/7 support"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-terracotta to-terracotta/90">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Property Maintenance?
          </h2>
          <p className="text-xl text-terracotta-100 mb-8 leading-relaxed text-white/90">
            Join thousands of property owners who have reduced maintenance costs, 
            improved tenant satisfaction, and saved countless hours with Ulomu's 
            AI-powered platform.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center text-white/90">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-terracotta hover:bg-beige hover:text-terracotta">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-terracotta">
              Schedule a Demo
            </Button>
          </div>
          
          <p className="text-sm text-white/80 mt-6">
            No credit card required • Set up in under 5 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

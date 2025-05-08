
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="py-16 bg-terracotta text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Find Your Perfect Home?
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of Nigerians who have found their ideal homes without paying agent fees.
          Sign up today and start browsing properties directly from landlords.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="bg-white text-terracotta hover:bg-gray-100">
            <Link to="/properties">Browse Properties</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-terracotta/90">
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

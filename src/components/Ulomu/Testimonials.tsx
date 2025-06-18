
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Property Manager",
      location: "Lagos",
      rating: 5,
      text: "Ulomu has completely transformed how I manage my 15 properties. The AI predictions are incredibly accurate, and I've reduced my maintenance costs by 40% while keeping tenants happier than ever.",
      avatar: "AJ"
    },
    {
      name: "Sarah Okafor",
      role: "Real Estate Investor",
      location: "Abuja",
      rating: 5,
      text: "The escrow payment system gives me complete transparency over service charges. My tenants now trust that their money is being used properly, and contractors get paid fairly.",
      avatar: "SO"
    },
    {
      name: "Michael Ugwu",
      role: "Facility Manager",
      location: "Port Harcourt",
      rating: 5,
      text: "Before Ulomu, I was constantly dealing with emergency repairs. Now, the predictive maintenance alerts help me prevent issues before they become expensive problems.",
      avatar: "MU"
    }
  ];

  return (
    <section className="py-20 bg-beige/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Property Owners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of property owners who have transformed their maintenance operations with Ulomu
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="h-8 w-8 text-terracotta/20 absolute -top-2 -left-2" />
                  <p className="text-gray-700 leading-relaxed pl-6">
                    "{testimonial.text}"
                  </p>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-terracotta rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

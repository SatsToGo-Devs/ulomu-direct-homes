
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Property Developer",
      company: "Lagos Properties Ltd",
      content: "Ulomu has transformed how we maintain our 50+ properties. The AI predictions saved us from 3 major HVAC failures last month alone. Our maintenance costs dropped 35%.",
      rating: 5,
      avatar: "AJ"
    },
    {
      name: "Chioma Okafor",
      role: "Landlord",
      company: "Multiple Properties",
      content: "The tenant chatbot is incredible. It handles 80% of requests automatically, and I only get alerted for real issues. My tenants love the instant responses.",
      rating: 5,
      avatar: "CO"
    },
    {
      name: "Michael Adeleke",
      role: "Real Estate Manager",
      company: "Ikoyi Estates",
      content: "We manage 200+ units and Ulomu's AI scheduling has been a game-changer. No more double bookings or missed maintenance. Everything runs like clockwork.",
      rating: 5,
      avatar: "MA"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Property Owners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join hundreds of satisfied property owners who trust Ulomu to keep 
            their properties in perfect condition.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
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

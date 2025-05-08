
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Chidi Okonkwo",
    role: "Tenant",
    testimonial: "Ulomu saved me from paying exorbitant agent fees. I found my apartment in Lekki and dealt directly with the landlord. The process was smooth and transparent!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Amina Ibrahim",
    role: "Landlord",
    testimonial: "As a property owner, Ulomu has made it so easy to find responsible tenants. I no longer have to rely on agents who sometimes bring problematic tenants.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Tunde Adeyemi",
    role: "Tenant",
    testimonial: "The virtual tours feature saved me so much time. I viewed multiple properties from the comfort of my home before deciding on the one I wanted to visit physically.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-beige">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Hear from landlords and tenants who have experienced the Ulomu difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic text-gray-700">{testimonial.testimonial}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { propertiesData } from "@/data/properties";
import PropertyImages from "@/components/PropertyDetail/PropertyImages";
import PropertyHeader from "@/components/PropertyDetail/PropertyHeader";
import PropertyTabs from "@/components/PropertyDetail/PropertyTabs";
import LandlordCard from "@/components/PropertyDetail/LandlordCard";
import InquiryForm from "@/components/PropertyDetail/InquiryForm";
import PropertyNotFound from "@/components/PropertyDetail/NotFound";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = propertiesData.find((p) => p.id === id);

  if (!property) {
    return <PropertyNotFound />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Property Images */}
        <PropertyImages images={property.images} title={property.title} />
        
        {/* Property Info */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <PropertyHeader property={property} />
              <PropertyTabs 
                description={property.description} 
                amenities={property.amenities} 
              />
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Landlord Card */}
              <LandlordCard landlord={property.landlord} />
              
              {/* Inquiry Form */}
              <InquiryForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;

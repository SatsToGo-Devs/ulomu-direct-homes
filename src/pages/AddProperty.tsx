
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Building, MapPin, DollarSign, Users } from "lucide-react";

const AddProperty = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    propertyType: '',
    units: '',
    rentAmount: '',
    description: '',
    amenities: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Property data:', formData);
    // Handle form submission
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-white/90">Expand your property portfolio with AI-powered management</p>
        </div>
      </div>
      
      <main className="flex-1 bg-beige/20 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-beige/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-terracotta" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Property Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Marina Heights Apartment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Select onValueChange={(value) => handleInputChange('propertyType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="office">Office Building</SelectItem>
                        <SelectItem value="commercial">Commercial Space</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-terracotta" />
                    Location Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Lagos"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select onValueChange={(value) => handleInputChange('state', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lagos">Lagos</SelectItem>
                          <SelectItem value="abuja">Abuja</SelectItem>
                          <SelectItem value="rivers">Rivers</SelectItem>
                          <SelectItem value="ogun">Ogun</SelectItem>
                          <SelectItem value="kano">Kano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Financial & Capacity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gold" />
                    Financial & Capacity Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="units">Number of Units</Label>
                      <Input
                        id="units"
                        type="number"
                        value={formData.units}
                        onChange={(e) => handleInputChange('units', e.target.value)}
                        placeholder="e.g., 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentAmount">Monthly Rent (₦)</Label>
                      <Input
                        id="rentAmount"
                        type="number"
                        value={formData.rentAmount}
                        onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                        placeholder="500000"
                      />
                    </div>
                  </div>
                </div>

                {/* Description & Amenities */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-forest" />
                    Additional Information
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="description">Property Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the property features, location benefits, etc."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Textarea
                      id="amenities"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange('amenities', e.target.value)}
                      placeholder="List amenities separated by commas (e.g., Swimming pool, Gym, 24/7 Security)"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button type="submit" className="flex-1 bg-terracotta hover:bg-terracotta/90">
                    Add Property
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProperty;

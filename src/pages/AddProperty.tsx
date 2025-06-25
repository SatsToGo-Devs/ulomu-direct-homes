
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Building, MapPin, DollarSign, Users, Calendar, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProperties } from "@/hooks/useProperties";
import ImageUpload from "@/components/ImageUpload";
import { useToast } from "@/hooks/use-toast";

const AddProperty = () => {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    property_type: '',
    units_count: '',
    description: '',
    amenities: ''
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const amenitiesArray = formData.amenities 
        ? formData.amenities.split(',').map(item => item.trim()).filter(item => item)
        : [];

      await addProperty({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        property_type: formData.property_type,
        units_count: parseInt(formData.units_count) || 1,
        description: formData.description,
        amenities: amenitiesArray,
      }, imageFiles);

      toast({
        title: "Success!",
        description: "Property has been added successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setIsSubmitting(false);
    }
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
          <Card className="border-beige/50 mb-8">
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
                    <Label htmlFor="name">Property Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Marina Heights Apartment"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select onValueChange={(value) => handleInputChange('property_type', value)}>
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
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
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

                {/* Property Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gold" />
                    Property Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="units_count">Number of Units</Label>
                    <Input
                      id="units_count"
                      type="number"
                      value={formData.units_count}
                      onChange={(e) => handleInputChange('units_count', e.target.value)}
                      placeholder="e.g., 12"
                      min="1"
                    />
                  </div>
                </div>

                {/* Images Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Property Images</h3>
                  <ImageUpload 
                    onImagesChange={setImageFiles}
                    maxImages={5}
                  />
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-terracotta hover:bg-terracotta/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Adding Property..."
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Add Property
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-beige/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  className="h-20 flex-col bg-terracotta hover:bg-terracotta/90 text-white"
                  onClick={() => navigate('/maintenance')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  Schedule Maintenance
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-forest text-forest hover:bg-forest hover:text-white"
                  onClick={() => navigate('/ai-predictions')}
                >
                  <Brain className="h-6 w-6 mb-2" />
                  AI Predictions
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-gold text-gold hover:bg-gold hover:text-white"
                  onClick={() => navigate('/dashboard')}
                >
                  <Building className="h-6 w-6 mb-2" />
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
                  onClick={() => navigate('/tenant-portal')}
                >
                  <Users className="h-6 w-6 mb-2" />
                  Tenant Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AddProperty;

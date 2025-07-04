import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Award, 
  FileCheck, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Upload
} from 'lucide-react';

interface OnboardingData {
  step: string;
  profile_data: any;
  documents_uploaded: string[];
}

const VendorOnboarding: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  // Form data
  const [profileData, setProfileData] = useState({
    business_name: '',
    contact_person: '',
    phone: '',
    email: user?.email || '',
    business_address: '',
    years_experience: 0,
    specialties: [] as string[],
    service_areas: [] as string[],
    hourly_rate: 0,
    portfolio_description: '',
    business_license: '',
    insurance_cert: ''
  });

  const specialtyOptions = [
    'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 
    'Roofing', 'Landscaping', 'Cleaning', 'Appliance Repair', 
    'General Maintenance', 'Flooring', 'Tiling', 'Pest Control'
  ];

  const serviceAreaOptions = [
    'Lagos Island', 'Victoria Island', 'Ikoyi', 'Lekki', 'Ajah', 
    'Surulere', 'Ikeja', 'Maryland', 'Gbagada', 'Magodo'
  ];

  useEffect(() => {
    if (user) {
      fetchOnboardingData();
    }
  }, [user]);

  const fetchOnboardingData = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_onboarding' as any)
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOnboardingData(data as OnboardingData);
        setProfileData({ ...profileData, ...data.profile_data });
        
        // Set current step based on onboarding progress
        switch (data.step) {
          case 'PROFILE_INFO': setCurrentStep(1); break;
          case 'SPECIALTIES': setCurrentStep(2); break;
          case 'VERIFICATION': setCurrentStep(3); break;
          case 'COMPLETED': setCurrentStep(4); break;
          default: setCurrentStep(1);
        }
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  const updateOnboardingData = async (step: string, data: any) => {
    try {
      setLoading(true);
      
      if (onboardingData) {
        // Update existing record
        const { error } = await supabase
          .from('vendor_onboarding' as any)
          .update({
            step,
            profile_data: data,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user?.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('vendor_onboarding' as any)
          .insert({
            user_id: user?.id,
            step,
            profile_data: data
          });

        if (error) throw error;
      }

      await fetchOnboardingData();
      toast({
        title: "Progress Saved",
        description: "Your onboarding progress has been saved."
      });
    } catch (error) {
      console.error('Error updating onboarding:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    let stepName = '';
    let nextStep = currentStep + 1;

    switch (currentStep) {
      case 1:
        stepName = 'SPECIALTIES';
        break;
      case 2:
        stepName = 'VERIFICATION';
        break;
      case 3:
        stepName = 'COMPLETED';
        await submitApplication();
        break;
    }

    if (stepName) {
      await updateOnboardingData(stepName, profileData);
      setCurrentStep(nextStep);
    }
  };

  const submitApplication = async () => {
    try {
      const { error } = await supabase
        .from('vendor_applications' as any)
        .insert({
          user_id: user?.id,
          business_name: profileData.business_name,
          contact_person: profileData.contact_person,
          phone: profileData.phone,
          email: profileData.email,
          business_address: profileData.business_address,
          years_experience: profileData.years_experience,
          specialties: profileData.specialties,
          portfolio_description: profileData.portfolio_description
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your vendor application has been submitted for review."
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    const updatedSpecialties = profileData.specialties.includes(specialty)
      ? profileData.specialties.filter(s => s !== specialty)
      : [...profileData.specialties, specialty];
    
    setProfileData({ ...profileData, specialties: updatedSpecialties });
  };

  const handleServiceAreaToggle = (area: string) => {
    const updatedAreas = profileData.service_areas.includes(area)
      ? profileData.service_areas.filter(a => a !== area)
      : [...profileData.service_areas, area];
    
    setProfileData({ ...profileData, service_areas: updatedAreas });
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step <= currentStep 
              ? 'bg-terracotta text-white' 
              : 'bg-gray-200 text-gray-500'
          } ${step === currentStep ? 'ring-2 ring-terracotta ring-offset-2' : ''}`}>
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-12 h-1 mx-2 ${
              step < currentStep ? 'bg-terracotta' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-terracotta" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="business_name">Business Name *</Label>
            <Input
              id="business_name"
              value={profileData.business_name}
              onChange={(e) => setProfileData({...profileData, business_name: e.target.value})}
              placeholder="Your Business Name"
            />
          </div>
          <div>
            <Label htmlFor="contact_person">Contact Person *</Label>
            <Input
              id="contact_person"
              value={profileData.contact_person}
              onChange={(e) => setProfileData({...profileData, contact_person: e.target.value})}
              placeholder="Primary Contact Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              placeholder="+234 xxx xxx xxxx"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              placeholder="business@example.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="business_address">Business Address</Label>
          <Textarea
            id="business_address"
            value={profileData.business_address}
            onChange={(e) => setProfileData({...profileData, business_address: e.target.value})}
            placeholder="Complete business address"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="years_experience">Years of Experience</Label>
            <Input
              id="years_experience"
              type="number"
              value={profileData.years_experience}
              onChange={(e) => setProfileData({...profileData, years_experience: Number(e.target.value)})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="hourly_rate">Hourly Rate (₦)</Label>
            <Input
              id="hourly_rate"
              type="number"
              value={profileData.hourly_rate}
              onChange={(e) => setProfileData({...profileData, hourly_rate: Number(e.target.value)})}
              placeholder="5000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-terracotta" />
          Specialties & Service Areas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-base font-medium">Select Your Specialties *</Label>
          <p className="text-sm text-gray-600 mb-3">Choose all services you can provide</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {specialtyOptions.map((specialty) => (
              <div key={specialty} className="flex items-center space-x-2">
                <Checkbox
                  id={specialty}
                  checked={profileData.specialties.includes(specialty)}
                  onCheckedChange={() => handleSpecialtyToggle(specialty)}
                />
                <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium">Service Areas</Label>
          <p className="text-sm text-gray-600 mb-3">Areas where you can provide services</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={profileData.service_areas.includes(area)}
                  onCheckedChange={() => handleServiceAreaToggle(area)}
                />
                <Label htmlFor={area} className="text-sm">{area}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="portfolio_description">Portfolio Description</Label>
          <Textarea
            id="portfolio_description"
            value={profileData.portfolio_description}
            onChange={(e) => setProfileData({...profileData, portfolio_description: e.target.value})}
            placeholder="Describe your experience, notable projects, and what makes you unique..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-terracotta" />
          Document Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Business License</h3>
            <p className="text-sm text-gray-600 mb-3">Upload your business registration certificate</p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Insurance Certificate</h3>
            <p className="text-sm text-gray-600 mb-3">Upload your liability insurance certificate</p>
            <Button variant="outline" size="sm">
              Choose File
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Verification Requirements</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Valid business registration or CAC certificate</li>
            <li>• Current liability insurance (minimum ₦1,000,000 coverage)</li>
            <li>• Professional certifications (if applicable)</li>
            <li>• Portfolio images of recent work</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-900 mb-2">Review Process</h4>
          <p className="text-sm text-amber-800">
            Your application will be reviewed within 2-3 business days. You'll receive an email notification 
            once your vendor profile is approved and activated.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Application Submitted
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Thank you for your application!
        </h3>
        <p className="text-gray-600 mb-6">
          Your vendor application has been successfully submitted and is under review. 
          We'll notify you via email once the review is complete.
        </p>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-gray-900 mb-2">What's Next?</h4>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Our team will review your application within 2-3 business days</li>
            <li>• We may contact you for additional information if needed</li>
            <li>• Once approved, you'll receive login credentials for the vendor portal</li>
            <li>• You can start receiving and bidding on maintenance requests</li>
          </ul>
        </div>
        <Button className="bg-terracotta hover:bg-terracotta/90">
          Return to Dashboard
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Vendor Onboarding
        </h1>
        <p className="text-gray-600">
          Complete your vendor profile to start receiving maintenance requests
        </p>
      </div>

      {renderStepIndicator()}

      <div className="mb-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      {currentStep < 4 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={loading || (currentStep === 1 && !profileData.business_name)}
            className="bg-terracotta hover:bg-terracotta/90"
          >
            {loading ? 'Saving...' : currentStep === 3 ? 'Submit Application' : 'Next'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VendorOnboarding;

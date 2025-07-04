
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Circle, User, FileText, Building } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type VendorOnboarding = Tables<'vendor_onboarding'>;

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const VendorOnboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<VendorOnboarding | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: user?.email || '',
    phone: '',
    businessAddress: '',
    yearsExperience: '',
    specialties: [] as string[],
    portfolioDescription: ''
  });

  const availableSpecialties = [
    'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting',
    'Roofing', 'Flooring', 'Landscaping', 'Cleaning', 'Security',
    'Appliance Repair', 'General Maintenance'
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'PROFILE_INFO',
      title: 'Basic Information',
      description: 'Tell us about your business',
      completed: false
    },
    {
      id: 'SPECIALTIES',
      title: 'Specialties & Experience',
      description: 'What services do you offer?',
      completed: false
    },
    {
      id: 'PORTFOLIO',
      title: 'Portfolio & Description',
      description: 'Showcase your work',
      completed: false
    }
  ];

  useEffect(() => {
    if (user) {
      fetchOnboardingData();
    }
  }, [user]);

  const fetchOnboardingData = async () => {
    try {
      const { data, error } = await supabase
        .from('vendor_onboarding')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setOnboardingData(data);
        const profileData = data.profile_data as any;
        if (profileData) {
          setFormData({
            businessName: profileData.businessName || '',
            contactPerson: profileData.contactPerson || '',
            email: profileData.email || user?.email || '',
            phone: profileData.phone || '',
            businessAddress: profileData.businessAddress || '',
            yearsExperience: profileData.yearsExperience || '',
            specialties: profileData.specialties || [],
            portfolioDescription: profileData.portfolioDescription || ''
          });
        }
        setCurrentStep(steps.findIndex(step => step.id === data.step));
      }
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  const saveProgress = async (step: string, data: any) => {
    try {
      const upsertData = {
        user_id: user?.id,
        step,
        profile_data: data,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('vendor_onboarding')
        .upsert(upsertData);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      const stepId = steps[currentStep].id;
      
      await saveProgress(stepId, formData);
      
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await submitApplication();
      }
    } catch (error) {
      console.error('Error proceeding to next step:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitApplication = async () => {
    try {
      // Create vendor application
      const { error: applicationError } = await supabase
        .from('vendor_applications')
        .insert({
          user_id: user?.id,
          business_name: formData.businessName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          business_address: formData.businessAddress,
          years_experience: parseInt(formData.yearsExperience) || 0,
          specialties: formData.specialties,
          portfolio_description: formData.portfolioDescription,
          application_status: 'PENDING'
        });

      if (applicationError) throw applicationError;

      // Mark onboarding as completed
      await supabase
        .from('vendor_onboarding')
        .update({
          completed_at: new Date().toISOString(),
          step: 'COMPLETED'
        })
        .eq('user_id', user?.id);

      toast({
        title: "Application Submitted!",
        description: "Your vendor application has been submitted for review."
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Enter your business name"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+234 xxx xxx xxxx"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, businessAddress: e.target.value }))}
                placeholder="Enter your business address"
                rows={3}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="yearsExperience">Years of Experience</Label>
              <Input
                id="yearsExperience"
                type="number"
                value={formData.yearsExperience}
                onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                placeholder="How many years of experience do you have?"
              />
            </div>
            <div>
              <Label>Specialties</Label>
              <p className="text-sm text-gray-600 mb-3">Select all services you provide:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSpecialties.map((specialty) => (
                  <div
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.specialties.includes(specialty)
                        ? 'border-terracotta bg-terracotta/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {formData.specialties.includes(specialty) ? (
                        <CheckCircle className="h-4 w-4 text-terracotta" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="text-sm font-medium">{specialty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="portfolioDescription">Portfolio Description</Label>
              <Textarea
                id="portfolioDescription"
                value={formData.portfolioDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, portfolioDescription: e.target.value }))}
                placeholder="Describe your experience, notable projects, and what sets you apart..."
                rows={6}
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Review Your Information</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Business:</strong> {formData.businessName}</p>
                <p><strong>Contact:</strong> {formData.contactPerson}</p>
                <p><strong>Experience:</strong> {formData.yearsExperience} years</p>
                <p><strong>Specialties:</strong> {formData.specialties.join(', ')}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <User className="h-5 w-5" />;
      case 1: return <Building className="h-5 w-5" />;
      case 2: return <FileText className="h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.businessName && formData.contactPerson && formData.email && formData.phone;
      case 1:
        return formData.yearsExperience && formData.specialties.length > 0;
      case 2:
        return formData.portfolioDescription.length > 50;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Onboarding</h1>
        <p className="text-gray-600">Complete your profile to start receiving job assignments</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-terracotta text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {getStepIcon(index)}
              </div>
              <p className={`mt-2 text-sm font-medium ${
                index <= currentStep ? 'text-terracotta' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-1 mx-4 ${
                index < currentStep ? 'bg-terracotta' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid() || loading}
            >
              {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorOnboarding;

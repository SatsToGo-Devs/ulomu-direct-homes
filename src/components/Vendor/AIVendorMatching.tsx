
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot,
  Star, 
  MapPin, 
  Clock, 
  DollarSign,
  Zap,
  Target,
  TrendingUp,
  CheckCircle
} from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimated_cost: number;
  property_id: string;
  properties?: { address: string; city: string };
}

interface VendorMatch {
  id: string;
  name: string;
  company_name: string;
  rating: number;
  experience_years: number;
  specialties: string[];
  hourly_rate: number;
  city: string;
  match_score: number;
  availability_score: number;
  proximity_score: number;
  expertise_score: number;
  cost_score: number;
  reasons: string[];
}

interface AIVendorMatchingProps {
  maintenanceRequest: MaintenanceRequest;
  onVendorSelect: (vendorId: string) => void;
}

const AIVendorMatching: React.FC<AIVendorMatchingProps> = ({ 
  maintenanceRequest, 
  onVendorSelect 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [matches, setMatches] = useState<VendorMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (maintenanceRequest) {
      findVendorMatches();
    }
  }, [maintenanceRequest]);

  const findVendorMatches = async () => {
    try {
      setLoading(true);
      setAnalyzing(true);

      // Call AI matching edge function
      const { data: aiMatches, error: aiError } = await supabase.functions.invoke('ai-vendor-matching', {
        body: {
          maintenanceRequest,
          userLocation: maintenanceRequest.properties?.city || 'Lagos'
        }
      });

      if (aiError) {
        // Fallback to basic matching if AI fails
        await basicVendorMatching();
        return;
      }

      setMatches(aiMatches.matches || []);
      setAnalyzing(false);

      toast({
        title: "AI Analysis Complete",
        description: `Found ${aiMatches.matches?.length || 0} qualified vendors`
      });

    } catch (error) {
      console.error('Error finding vendor matches:', error);
      await basicVendorMatching();
    } finally {
      setLoading(false);
    }
  };

  const basicVendorMatching = async () => {
    try {
      // Basic fallback matching
      const { data: vendors, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('verified', true)
        .contains('specialties', [maintenanceRequest.category])
        .order('rating', { ascending: false })
        .limit(5);

      if (error) throw error;

      const basicMatches: VendorMatch[] = (vendors || []).map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        company_name: vendor.company_name || '',
        rating: vendor.rating,
        experience_years: vendor.experience_years,
        specialties: vendor.specialties,
        hourly_rate: vendor.hourly_rate || 0,
        city: vendor.city || '',
        match_score: calculateBasicMatchScore(vendor),
        availability_score: 85,
        proximity_score: 70,
        expertise_score: calculateExpertiseScore(vendor),
        cost_score: calculateCostScore(vendor.hourly_rate || 0),
        reasons: generateMatchReasons(vendor)
      }));

      setMatches(basicMatches);
      setAnalyzing(false);
    } catch (error) {
      console.error('Error in basic matching:', error);
      toast({
        title: "Matching Error",
        description: "Failed to find vendor matches",
        variant: "destructive"
      });
    }
  };

  const calculateBasicMatchScore = (vendor: any): number => {
    let score = 0;
    
    // Specialty match
    if (vendor.specialties.includes(maintenanceRequest.category)) {
      score += 40;
    }
    
    // Rating score
    score += (vendor.rating / 5) * 30;
    
    // Experience score
    score += Math.min(vendor.experience_years / 10, 1) * 20;
    
    // Verification status
    if (vendor.verified) {
      score += 10;
    }
    
    return Math.round(score);
  };

  const calculateExpertiseScore = (vendor: any): number => {
    const specialtyMatch = vendor.specialties.includes(maintenanceRequest.category) ? 50 : 0;
    const experienceScore = Math.min(vendor.experience_years / 10, 1) * 30;
    const ratingScore = (vendor.rating / 5) * 20;
    return Math.round(specialtyMatch + experienceScore + ratingScore);
  };

  const calculateCostScore = (hourlyRate: number): number => {
    const avgRate = 8000; // Average hourly rate in Naira
    const costRatio = avgRate / (hourlyRate || avgRate);
    return Math.round(Math.min(costRatio * 100, 100));
  };

  const generateMatchReasons = (vendor: any): string[] => {
    const reasons = [];
    
    if (vendor.specialties.includes(maintenanceRequest.category)) {
      reasons.push(`Specialized in ${maintenanceRequest.category}`);
    }
    
    if (vendor.rating >= 4.5) {
      reasons.push('Highly rated by customers');
    }
    
    if (vendor.experience_years >= 5) {
      reasons.push(`${vendor.experience_years}+ years of experience`);
    }
    
    if (vendor.verified) {
      reasons.push('Verified professional');
    }
    
    return reasons;
  };

  const assignVendor = async (vendorId: string, vendorName: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({
          vendor_id: vendorId,
          status: 'ASSIGNED',
          updated_at: new Date().toISOString()
        })
        .eq('id', maintenanceRequest.id);

      if (error) throw error;

      toast({
        title: "Vendor Assigned",
        description: `${vendorName} has been assigned to this maintenance request`
      });

      onVendorSelect(vendorId);
    } catch (error) {
      console.error('Error assigning vendor:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign vendor",
        variant: "destructive"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto mb-4"></div>
            <h3 className="text-lg font-medium mb-2">
              {analyzing ? 'AI is analyzing vendors...' : 'Finding the best vendors...'}
            </h3>
            <p className="text-gray-600">
              {analyzing ? 'Using AI to match skills, availability, and location' : 'Please wait while we search'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI-Powered Vendor Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>Analyzing {matches.length} qualified vendors</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span>Matching skills & availability</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Optimizing for cost & quality</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {matches.map((match, index) => (
          <Card key={match.id} className={`hover:shadow-lg transition-all ${index === 0 ? 'ring-2 ring-green-200 bg-green-50' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-forest text-white">
                    <AvatarFallback>
                      {match.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {match.name}
                      {index === 0 && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="h-3 w-3 mr-1" />
                          Best Match
                        </Badge>
                      )}
                    </CardTitle>
                    {match.company_name && (
                      <p className="text-sm text-gray-600">{match.company_name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(match.match_score)}`}>
                    {match.match_score}%
                  </div>
                  <div className="text-sm text-gray-600">
                    {getScoreLabel(match.match_score)}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(match.expertise_score)}`}>
                    {match.expertise_score}%
                  </div>
                  <div className="text-gray-600">Expertise</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(match.availability_score)}`}>
                    {match.availability_score}%
                  </div>
                  <div className="text-gray-600">Availability</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(match.proximity_score)}`}>
                    {match.proximity_score}%
                  </div>
                  <div className="text-gray-600">Proximity</div>
                </div>
                <div className="text-center">
                  <div className={`font-semibold ${getScoreColor(match.cost_score)}`}>
                    {match.cost_score}%
                  </div>
                  <div className="text-gray-600">Value</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{match.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{match.experience_years} years</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{match.city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>₦{match.hourly_rate.toLocaleString()}/hr</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Why this vendor is a good match:</p>
                <div className="flex flex-wrap gap-2">
                  {match.reasons.map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {reason}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  onClick={() => assignVendor(match.id, match.name)}
                  className="flex-1 bg-terracotta hover:bg-terracotta/90"
                >
                  Assign Vendor
                </Button>
                <Button variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {matches.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
            <p className="text-gray-600">
              No qualified vendors available for this type of maintenance request.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIVendorMatching;

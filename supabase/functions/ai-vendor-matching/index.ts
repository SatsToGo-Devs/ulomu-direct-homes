
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  estimated_cost: number;
  properties?: { address: string; city: string };
}

interface Vendor {
  id: string;
  name: string;
  company_name: string;
  rating: number;
  experience_years: number;
  specialties: string[];
  hourly_rate: number;
  city: string;
  verified: boolean;
  service_areas: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { maintenanceRequest, userLocation } = await req.json();

    console.log('AI Vendor Matching Request:', { maintenanceRequest, userLocation });

    // Fetch available vendors
    const { data: vendors, error: vendorsError } = await supabaseClient
      .from('vendors')
      .select('*')
      .eq('verified', true);

    if (vendorsError) {
      throw vendorsError;
    }

    if (!vendors || vendors.length === 0) {
      return new Response(
        JSON.stringify({ matches: [] }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }

    // AI-powered matching algorithm
    const matches = vendors
      .map(vendor => {
        const matchScore = calculateAIMatchScore(vendor, maintenanceRequest, userLocation);
        return {
          ...vendor,
          match_score: matchScore.overall,
          availability_score: matchScore.availability,
          proximity_score: matchScore.proximity,
          expertise_score: matchScore.expertise,
          cost_score: matchScore.cost,
          reasons: generateMatchReasons(vendor, maintenanceRequest, matchScore)
        };
      })
      .filter(match => match.match_score >= 50) // Minimum threshold
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 5); // Top 5 matches

    console.log(`Found ${matches.length} qualified vendor matches`);

    return new Response(
      JSON.stringify({ matches }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in AI vendor matching:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function calculateAIMatchScore(vendor: Vendor, request: MaintenanceRequest, userLocation: string) {
  // Expertise Score (40% weight)
  let expertiseScore = 0;
  if (vendor.specialties.includes(request.category)) {
    expertiseScore = 90;
  } else if (vendor.specialties.some(s => s.toLowerCase().includes('general'))) {
    expertiseScore = 60;
  } else {
    expertiseScore = 20;
  }
  
  // Add experience bonus
  expertiseScore += Math.min(vendor.experience_years * 2, 10);
  expertiseScore = Math.min(expertiseScore, 100);

  // Availability Score (25% weight)
  // Simulate availability based on rating and workload
  const availabilityScore = Math.max(85 - (vendor.rating * 5), 60) + Math.random() * 15;

  // Proximity Score (20% weight)
  let proximityScore = 70; // Default score
  if (vendor.city === userLocation) {
    proximityScore = 95;
  } else if (vendor.service_areas?.includes(userLocation)) {
    proximityScore = 85;
  } else if (userLocation.includes('Lagos') && vendor.city?.includes('Lagos')) {
    proximityScore = 80;
  }

  // Cost Score (15% weight)
  const avgHourlyRate = 8000; // Average rate in Naira
  const vendorRate = vendor.hourly_rate || avgHourlyRate;
  const costRatio = avgHourlyRate / vendorRate;
  const costScore = Math.min(costRatio * 80, 100);

  // Calculate weighted overall score
  const overall = Math.round(
    (expertiseScore * 0.4) +
    (availabilityScore * 0.25) +
    (proximityScore * 0.2) +
    (costScore * 0.15)
  );

  return {
    overall,
    expertise: Math.round(expertiseScore),
    availability: Math.round(availabilityScore),
    proximity: Math.round(proximityScore),
    cost: Math.round(costScore)
  };
}

function generateMatchReasons(vendor: Vendor, request: MaintenanceRequest, scores: any): string[] {
  const reasons = [];

  if (vendor.specialties.includes(request.category)) {
    reasons.push(`Expert in ${request.category}`);
  }

  if (vendor.rating >= 4.5) {
    reasons.push('Highly rated (4.5+ stars)');
  }

  if (vendor.experience_years >= 10) {
    reasons.push('Highly experienced (10+ years)');
  } else if (vendor.experience_years >= 5) {
    reasons.push('Experienced professional (5+ years)');
  }

  if (scores.proximity >= 90) {
    reasons.push('Located in your area');
  }

  if (scores.cost >= 80) {
    reasons.push('Competitive pricing');
  }

  if (vendor.verified) {
    reasons.push('Verified and certified');
  }

  if (scores.availability >= 85) {
    reasons.push('Likely available soon');
  }

  return reasons.slice(0, 4); // Limit to 4 reasons
}

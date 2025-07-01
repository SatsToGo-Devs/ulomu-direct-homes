
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const googleCloudProjectId = Deno.env.get('GOOGLE_CLOUD_PROJECT_ID');
const googleCloudServiceKey = Deno.env.get('GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId, userId, imageData, maintenanceHistory } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get property details
    const { data: property } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    // Get recent maintenance history
    const { data: recentMaintenance } = await supabase
      .from('maintenance_requests')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(5);

    let predictions = [];

    // Generate predictions using OpenAI based on property data and history
    const contextPrompt = `
    Analyze this property for potential maintenance issues:
    - Property Type: ${property?.property_type || 'Unknown'}
    - Property Age: ${property?.created_at ? new Date().getFullYear() - new Date(property.created_at).getFullYear() : 'Unknown'} years
    - Recent Maintenance: ${JSON.stringify(recentMaintenance)}
    
    Generate 3-5 predictive maintenance insights with:
    1. Issue type and likelihood
    2. Estimated timeline
    3. Cost estimate
    4. Prevention actions
    `;

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: 'You are a property maintenance expert. Provide JSON formatted predictions with fields: title, description, prediction_type, confidence_score (0-1), estimated_cost, predicted_date, prevention_actions (array).'
          },
          { role: 'user', content: contextPrompt }
        ],
        response_format: { type: "json_object" }
      }),
    });

    const aiData = await openAIResponse.json();
    const aiPredictions = JSON.parse(aiData.choices[0].message.content);

    // Store predictions in database
    for (const prediction of aiPredictions.predictions || []) {
      const { data: savedPrediction } = await supabase
        .from('ai_predictions')
        .insert({
          user_id: userId,
          property_id: propertyId,
          title: prediction.title,
          description: prediction.description,
          prediction_type: prediction.prediction_type,
          confidence_score: prediction.confidence_score,
          estimated_cost: prediction.estimated_cost,
          predicted_date: prediction.predicted_date,
          prevention_actions: prediction.prevention_actions,
          data_sources: ['maintenance_history', 'property_data']
        })
        .select()
        .single();

      predictions.push(savedPrediction);
    }

    return new Response(JSON.stringify({ 
      predictions,
      summary: `Generated ${predictions.length} AI-powered maintenance predictions for your property.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating AI predictions:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

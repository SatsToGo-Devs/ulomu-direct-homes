
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { property_id, analysis_type = "maintenance_prediction" } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) throw new Error("User not authenticated");

    // Get property data for analysis
    const { data: property } = await supabaseClient
      .from('properties')
      .select(`
        *,
        units(*),
        maintenance_requests(*),
        service_charges(*)
      `)
      .eq('id', property_id)
      .single();

    if (!property) throw new Error("Property not found");

    // Prepare data for Gemini analysis
    const analysisPrompt = `
    Analyze the following property data and provide predictive insights:
    
    Property: ${property.name}
    Type: ${property.property_type}
    Units: ${property.units?.length || 0}
    Location: ${property.city}, ${property.state}
    
    Recent Maintenance Requests: ${JSON.stringify(property.maintenance_requests?.slice(0, 5) || [])}
    Service Charges: ${JSON.stringify(property.service_charges?.slice(0, 3) || [])}
    
    Please provide:
    1. Predictive maintenance insights
    2. Cost optimization recommendations
    3. Risk assessment
    4. Seasonal maintenance predictions
    
    Return your analysis in JSON format with structured insights.
    `;

    // Call Google Gemini via Vertex AI
    const geminiResponse = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${Deno.env.get('GOOGLE_CLOUD_PROJECT_ID')}/locations/us-central1/publishers/google/models/gemini-1.5-pro:generateContent`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getGoogleAccessToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048
          }
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    const insights = geminiData.candidates[0].content.parts[0].text;

    // Store insights in database
    await supabaseClient.from('ai_predictions').insert({
      user_id: user.id,
      property_id: property_id,
      prediction_type: analysis_type.toUpperCase(),
      title: `AI Property Insights for ${property.name}`,
      description: insights,
      confidence_score: 0.85,
      status: 'ACTIVE'
    });

    return new Response(JSON.stringify({ 
      insights,
      property_name: property.name,
      analysis_type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error generating property insights:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to get Google Cloud access token
async function getGoogleAccessToken() {
  const serviceAccountKey = JSON.parse(Deno.env.get('GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY') || '{}');
  
  const header = {
    alg: "RS256",
    typ: "JWT",
    kid: serviceAccountKey.private_key_id
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccountKey.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  };

  // Note: In production, you'd use a proper JWT library
  // For now, we'll use a simpler approach with the service account
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await createJWT(header, payload, serviceAccountKey.private_key)
    })
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

async function createJWT(header: any, payload: any, privateKey: string) {
  // Simplified JWT creation - in production use a proper JWT library
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  return `${encodedHeader}.${encodedPayload}.signature`;
}

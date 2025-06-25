
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { message, context = "general", user_type = "tenant" } = await req.json();

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

    // Define system prompts based on user type and context
    let systemPrompt = "";
    
    if (user_type === "tenant") {
      systemPrompt = `You are Ulomu AI, a helpful assistant for tenants in the Ulomu property management platform. 
      Help with rent payments, maintenance requests, service charges, lease questions, and general property management inquiries. 
      Be friendly, professional, and provide accurate information about property management processes. 
      Keep responses concise and helpful.`;
    } else if (user_type === "landlord") {
      systemPrompt = `You are Ulomu AI, a helpful assistant for landlords in the Ulomu property management platform. 
      Help with property management, tenant communications, maintenance coordination, financial reporting, and property insights. 
      Provide professional guidance on property management best practices. 
      Keep responses concise and actionable.`;
    }

    if (context === "escrow") {
      systemPrompt += " Focus on escrow payments, secure transactions, and financial management.";
    } else if (context === "maintenance") {
      systemPrompt += " Focus on maintenance requests, property upkeep, and preventive care.";
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const aiResponse = data.choices[0].message.content;

    // Store conversation in database
    await supabaseClient.from('ai_generated_content').insert({
      user_id: user.id,
      content_type: 'CHAT_RESPONSE',
      original_prompt: message,
      generated_content: aiResponse,
      context_data: { user_type, context }
    });

    return new Response(JSON.stringify({ 
      response: aiResponse,
      context: context
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat assistant:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm having trouble connecting to the AI service right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

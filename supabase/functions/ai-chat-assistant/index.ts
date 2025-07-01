
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    const { message, userId, propertyId, maintenanceRequestId } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Store user message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      property_id: propertyId,
      maintenance_request_id: maintenanceRequestId,
      message_type: 'user',
      content: message
    });

    // Get context from previous messages
    const { data: chatHistory } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build context for AI
    const context = chatHistory?.reverse().map(msg => 
      `${msg.message_type === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') || '';

    const systemPrompt = `You are Ulomu's AI assistant specializing in property management and tenant support. 
    You help tenants with maintenance issues, property questions, and guide them through the platform.
    
    Key capabilities:
    - Help tenants raise maintenance requests
    - Provide cost estimates for common repairs
    - Guide users through the escrow payment system
    - Suggest maintenance categories and priorities
    - Offer preventive maintenance tips
    
    Be helpful, professional, and concise. If you don't know something specific about their property, ask clarifying questions.
    
    Previous conversation:
    ${context}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const assistantReply = data.choices[0].message.content;

    // Store assistant message
    await supabase.from('chat_messages').insert({
      user_id: userId,
      property_id: propertyId,
      maintenance_request_id: maintenanceRequestId,
      message_type: 'assistant',
      content: assistantReply
    });

    return new Response(JSON.stringify({ 
      message: assistantReply,
      suggestions: [
        "Create maintenance request",
        "Check payment status", 
        "Contact landlord",
        "View property info"
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI chat assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

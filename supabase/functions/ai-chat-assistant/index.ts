
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
    const { message, userId, propertyId, maintenanceRequestId, roleContext } = await req.json();
    
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

    // Role-specific system prompts
    const getRolePrompt = (roleContext: any) => {
      if (roleContext?.isAdmin) {
        return `You are Ulomu's Admin AI Assistant. You specialize in:
        - System management and platform monitoring
        - User analytics and reporting
        - Administrative tasks and policy management
        - Security and compliance oversight
        - Platform optimization and troubleshooting
        Be professional, data-driven, and focus on administrative efficiency.`;
      } else if (roleContext?.isLandlord) {
        return `You are Ulomu's Property Manager AI. You specialize in:
        - Property management and optimization
        - Tenant relationship management
        - Maintenance scheduling and cost analysis
        - Rental income and financial insights
        - Legal compliance and lease management
        Be professional, strategic, and focus on property profitability and tenant satisfaction.`;
      } else if (roleContext?.isVendor) {
        return `You are Ulomu's Vendor Assistant AI. You specialize in:
        - Job matching and opportunity identification
        - Work proposal and quote generation
        - Business growth and performance optimization
        - Skill development and market trends
        - Client relationship management
        Be supportive, business-focused, and help maximize earning potential.`;
      } else if (roleContext?.isTenant) {
        return `You are Ulomu's Tenant Helper AI. You specialize in:
        - Maintenance request assistance
        - Payment and lease inquiries
        - Landlord communication support
        - Tenant rights and responsibilities
        - Property-related problem solving
        Be helpful, empathetic, and focus on tenant advocacy and support.`;
      } else {
        return `You are Ulomu's general AI assistant for property management and tenant support.`;
      }
    };

    const systemPrompt = `${getRolePrompt(roleContext)}
    
    Key capabilities:
    - Help users with their specific role-related tasks
    - Provide cost estimates for maintenance and services
    - Guide users through platform features
    - Offer role-appropriate advice and recommendations
    - Maintain context of ongoing conversations
    
    Be helpful, professional, and concise. Always consider the user's role when providing responses.
    
    Previous conversation:
    ${context}`;

    // Get role-specific suggestions
    const getRoleSuggestions = (roleContext: any) => {
      if (roleContext?.isAdmin) {
        return [
          "Generate system report",
          "Review user analytics",
          "Check platform health",
          "Manage user roles"
        ];
      } else if (roleContext?.isLandlord) {
        return [
          "Analyze property performance",
          "Schedule maintenance",
          "Review tenant payments",
          "Generate financial report"
        ];
      } else if (roleContext?.isVendor) {
        return [
          "Find new jobs",
          "Create work proposal",
          "Track earnings",
          "Update service profile"
        ];
      } else if (roleContext?.isTenant) {
        return [
          "Report maintenance issue",
          "Check payment status",
          "Contact landlord",
          "View lease details"
        ];
      } else {
        return [
          "General assistance",
          "Platform help",
          "Account support",
          "Contact support"
        ];
      }
    };

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
        max_tokens: 800,
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
      suggestions: getRoleSuggestions(roleContext)
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

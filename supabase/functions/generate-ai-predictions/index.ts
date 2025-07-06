
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
    const { propertyId, userId, userRole } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user role for context
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    const roles = userRoles?.map(r => r.role) || [];

    // Get property details if provided
    let property = null;
    if (propertyId) {
      const { data: propertyData } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      property = propertyData;
    }

    // Get recent maintenance history
    const { data: recentMaintenance } = await supabase
      .from('maintenance_requests')
      .select('*')
      .eq(propertyId ? 'property_id' : 'tenant_id', propertyId || userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get financial data context
    const { data: transactions } = await supabase
      .from('escrow_transactions')
      .select('*')
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10);

    let predictions = [];
    let roleInsights = [];

    // Role-specific prediction prompts
    const getRoleContextPrompt = (roles: string[]) => {
      if (roles.includes('admin')) {
        return `
        Generate platform-wide predictions for a system administrator:
        - System performance and scalability issues
        - User growth and engagement trends
        - Revenue optimization opportunities
        - Security and compliance risks
        - Platform maintenance requirements
        `;
      } else if (roles.includes('landlord')) {
        return `
        Generate property management predictions for a landlord:
        - Property maintenance and repair forecasts
        - Rental income optimization opportunities
        - Tenant retention and vacancy predictions
        - Market trends and property value changes
        - Operational cost management insights
        Property: ${property ? JSON.stringify(property) : 'Multiple properties'}
        `;
      } else if (roles.includes('vendor')) {
        return `
        Generate business insights for a service vendor:
        - Job opportunity predictions and market demand
        - Earnings potential and pricing optimization
        - Skill development recommendations
        - Competition analysis and positioning
        - Business growth opportunities
        `;
      } else if (roles.includes('tenant')) {
        return `
        Generate cost and maintenance predictions for a tenant:
        - Upcoming maintenance issues and costs
        - Rent and utility expense forecasts
        - Lease renewal considerations
        - Property condition assessments
        - Budget planning recommendations
        `;
      }
      return 'Generate general property-related predictions';
    };

    const contextPrompt = `
    ${getRoleContextPrompt(roles)}
    
    Recent Activity Data:
    - Maintenance History: ${JSON.stringify(recentMaintenance || [])}
    - Financial Transactions: ${JSON.stringify(transactions || [])}
    
    Generate 3-5 predictive insights with:
    1. Issue/opportunity type and likelihood (0-1 confidence score)
    2. Estimated timeline (predicted_date)
    3. Cost estimate or financial impact
    4. Prevention/optimization actions
    5. Priority level (HIGH/MEDIUM/LOW)
    
    Focus on actionable insights relevant to the user's role.
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
            content: 'You are an expert property management and business analyst. Provide JSON formatted predictions with fields: predictions (array of objects with title, description, prediction_type, confidence_score (0-1), estimated_cost, predicted_date, prevention_actions (array), priority), role_insights (array of objects with title, description, insight_category, confidence_score, impact_level, recommended_actions (array), estimated_savings, time_frame).'
          },
          { role: 'user', content: contextPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      }),
    });

    const aiData = await openAIResponse.json();
    const aiPredictions = JSON.parse(aiData.choices[0].message.content);

    // Store traditional predictions in ai_predictions table
    for (const prediction of aiPredictions.predictions || []) {
      const predictionType = prediction.prediction_type || (
        roles.includes('admin') ? 'SYSTEM' :
        roles.includes('landlord') ? 'MAINTENANCE' :
        roles.includes('vendor') ? 'BUSINESS' :
        'EXPENSE'
      );

      const { data: savedPrediction } = await supabase
        .from('ai_predictions')
        .insert({
          user_id: userId,
          property_id: propertyId,
          title: prediction.title,
          description: prediction.description,
          prediction_type: predictionType,
          confidence_score: prediction.confidence_score || 0.7,
          estimated_cost: prediction.estimated_cost,
          predicted_date: prediction.predicted_date,
          prevention_actions: prediction.prevention_actions || [],
          data_sources: ['user_activity', 'maintenance_history', 'financial_data'],
          status: 'ACTIVE'
        })
        .select()
        .single();

      predictions.push(savedPrediction);
    }

    // Store role-specific insights in ai_role_insights table
    for (const insight of aiPredictions.role_insights || []) {
      for (const role of roles) {
        const { data: savedInsight } = await supabase
          .from('ai_role_insights')
          .insert({
            user_id: userId,
            role: role,
            insight_category: insight.insight_category || 'operational',
            title: insight.title,
            description: insight.description,
            confidence_score: insight.confidence_score || 0.8,
            impact_level: insight.impact_level || 'MEDIUM',
            recommended_actions: insight.recommended_actions || [],
            estimated_savings: insight.estimated_savings || 0,
            time_frame: insight.time_frame || '30_DAYS',
            data_points: {
              source: 'ai_analysis',
              generated_at: new Date().toISOString(),
              maintenance_requests: recentMaintenance?.length || 0,
              transactions: transactions?.length || 0
            },
            status: 'ACTIVE'
          })
          .select()
          .single();

        roleInsights.push(savedInsight);

        // Create smart notifications for high-impact insights
        if (insight.impact_level === 'HIGH' || insight.impact_level === 'CRITICAL') {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: 'New AI Insight Available',
              message: `We've identified a ${insight.insight_category} opportunity: ${insight.title}. Potential savings: $${insight.estimated_savings || 0}.`,
              type: 'ai_insight',
              priority: insight.impact_level === 'CRITICAL' ? 'urgent' : 'high',
              metadata: {
                insight_id: savedInsight?.id,
                category: insight.insight_category,
                estimated_savings: insight.estimated_savings
              }
            });
        }
      }
    }

    return new Response(JSON.stringify({ 
      predictions,
      role_insights: roleInsights,
      summary: `Generated ${predictions.length} predictions and ${roleInsights.length} role-specific insights.`,
      userRole: roles[0] || 'user'
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

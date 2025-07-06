
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface AIRoleInsight {
  id: string;
  role: string;
  insight_category: string;
  title: string;
  description: string;
  confidence_score: number;
  impact_level: string;
  recommended_actions: string[];
  estimated_savings: number;
  time_frame: string;
  data_points: Record<string, any>;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useAIRoleInsights = () => {
  const [insights, setInsights] = useState<AIRoleInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userRoles } = useUserRole();

  const fetchInsights = useCallback(async () => {
    if (!userRoles.length) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_role_insights')
        .select('*')
        .in('role', userRoles.map(r => r.role))
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error: any) {
      console.error('Error fetching AI insights:', error);
      toast({
        title: "Error",
        description: "Failed to load AI insights",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [userRoles, toast]);

  const dismissInsight = async (insightId: string) => {
    try {
      const { error } = await supabase
        .from('ai_role_insights')
        .update({ status: 'DISMISSED' })
        .eq('id', insightId);

      if (error) throw error;

      setInsights(prev => prev.filter(insight => insight.id !== insightId));
      toast({
        title: "Success",
        description: "Insight dismissed successfully"
      });
    } catch (error: any) {
      console.error('Error dismissing insight:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss insight",
        variant: "destructive"
      });
    }
  };

  const generateInsights = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-predictions', {
        body: {
          userId: (await supabase.auth.getUser()).data.user?.id,
          userRole: userRoles[0]?.role || 'tenant'
        }
      });

      if (error) throw error;

      toast({
        title: "AI Insights Generated",
        description: `Generated ${data.predictions?.length || 0} new insights`
      });
      
      fetchInsights();
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        title: "Error",
        description: "Failed to generate AI insights",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    fetchInsights,
    dismissInsight,
    generateInsights
  };
};

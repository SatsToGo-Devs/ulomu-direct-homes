
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalProperties: number;
  activeTenants: number;
  monthlyRevenue: number;
  costSavings: number;
}

export interface MaintenanceRequest {
  id: string;
  property_name: string;
  title: string;
  priority: string;
  status: string;
  tenant_name: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  insight_type: string;
  title: string;
  description: string;
  priority: string;
  confidence_score: number;
  estimated_savings: number | null;
  created_at: string;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    activeTenants: 0,
    monthlyRevenue: 0,
    costSavings: 0,
  });
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch properties
      const { data: properties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, name, units_count')
        .eq('user_id', user?.id);

      if (propertiesError) throw propertiesError;

      // Fetch units and calculate active tenants
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('tenant_id, rent_amount, property_id, properties(user_id)')
        .not('tenant_id', 'is', null);

      if (unitsError) throw unitsError;

      // Filter units belonging to current user's properties
      const userUnits = units?.filter(unit => 
        unit.properties && (unit.properties as any).user_id === user?.id
      ) || [];

      // Calculate monthly revenue
      const monthlyRevenue = userUnits.reduce((sum, unit) => sum + Number(unit.rent_amount || 0), 0);

      // Fetch maintenance requests
      const { data: maintenance, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select(`
          id,
          title,
          priority,
          status,
          created_at,
          properties(name),
          tenant_id
        `)
        .in('property_id', properties?.map(p => p.id) || [])
        .order('created_at', { ascending: false })
        .limit(5);

      if (maintenanceError) throw maintenanceError;

      // Fetch AI insights
      const { data: insights, error: insightsError } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(10);

      if (insightsError) throw insightsError;

      // Calculate cost savings from AI insights
      const totalSavings = insights?.reduce((sum, insight) => 
        sum + Number(insight.estimated_savings || 0), 0
      ) || 0;

      setStats({
        totalProperties: properties?.length || 0,
        activeTenants: userUnits.length,
        monthlyRevenue,
        costSavings: Math.round((totalSavings / monthlyRevenue) * 100) || 0,
      });

      setMaintenanceRequests(maintenance?.map(req => ({
        id: req.id,
        property_name: (req.properties as any)?.name || 'Unknown Property',
        title: req.title,
        priority: req.priority,
        status: req.status,
        tenant_name: 'Tenant', // Would need to join with profiles to get actual name
        created_at: req.created_at,
      })) || []);

      setAiInsights(insights || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    if (user) {
      fetchDashboardData();
    }
  };

  return {
    stats,
    maintenanceRequests,
    aiInsights,
    loading,
    refreshData,
  };
};

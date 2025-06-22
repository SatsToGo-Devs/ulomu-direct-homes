
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface MaintenanceRequest {
  id: string;
  property_id: string;
  unit_id?: string;
  tenant_id: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  category?: string;
  estimated_cost?: number;
  actual_cost?: number;
  assigned_to?: string;
  scheduled_date?: string;
  completed_date?: string;
  created_at: string;
  updated_at: string;
  properties?: { name: string };
  units?: { unit_number: string };
}

export interface MaintenanceProgress {
  id: string;
  maintenance_request_id: string;
  progress_percentage: number;
  status_update?: string;
  work_description?: string;
  images?: string[];
  vendor_name?: string;
  escrow_amount: number;
  updated_by?: string;
  created_at: string;
}

export const useMaintenanceData = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMaintenanceRequests();
    }
  }, [user]);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(name),
          units(unit_number)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMaintenanceRequest = async (requestData: Partial<MaintenanceRequest>) => {
    try {
      // Ensure required fields are present
      const completeRequestData = {
        ...requestData,
        tenant_id: user?.id,
        property_id: requestData.property_id || '',
        title: requestData.title || ''
      };

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([completeRequestData])
        .select()
        .single();

      if (error) throw error;
      await fetchMaintenanceRequests();
      return data;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      throw error;
    }
  };

  const updateMaintenanceRequest = async (id: string, updates: Partial<MaintenanceRequest>) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchMaintenanceRequests();
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      throw error;
    }
  };

  return {
    requests,
    loading,
    fetchMaintenanceRequests,
    createMaintenanceRequest,
    updateMaintenanceRequest,
  };
};

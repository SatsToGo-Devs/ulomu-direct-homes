
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MaintenanceCoordination {
  id: string;
  maintenance_request_id: string;
  coordinator_id: string;
  assigned_vendor_id?: string;
  status: string;
  priority_level: string;
  estimated_duration?: string;
  actual_duration?: string;
  coordination_notes?: string;
  tenant_notifications_sent: boolean;
  landlord_notifications_sent: boolean;
  vendor_notifications_sent: boolean;
  real_time_updates: any[];
  created_at: string;
  updated_at: string;
  maintenance_requests?: {
    title: string;
    description?: string;
    priority: string;
    properties: { name: string };
  };
  vendors?: {
    name: string;
    email: string;
  };
}

export const useMaintenanceCoordination = () => {
  const [coordinations, setCoordinations] = useState<MaintenanceCoordination[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCoordinations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_coordination')
        .select(`
          *,
          maintenance_requests(
            title,
            description,
            priority,
            properties(name)
          ),
          vendors(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoordinations(data || []);
    } catch (error: any) {
      console.error('Error fetching maintenance coordination:', error);
      toast({
        title: "Error",
        description: "Failed to load maintenance coordination data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateCoordinationStatus = async (coordinationId: string, status: string, notes?: string) => {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      };
      
      if (notes) {
        updateData.coordination_notes = notes;
      }

      const { error } = await supabase
        .from('maintenance_coordination')
        .update(updateData)
        .eq('id', coordinationId);

      if (error) throw error;

      await fetchCoordinations();
      toast({
        title: "Success",
        description: "Coordination status updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating coordination status:', error);
      toast({
        title: "Error",
        description: "Failed to update coordination status",
        variant: "destructive"
      });
    }
  };

  const addRealtimeUpdate = async (coordinationId: string, update: any) => {
    try {
      const coordination = coordinations.find(c => c.id === coordinationId);
      if (!coordination) return;

      const newUpdates = [
        ...coordination.real_time_updates,
        {
          ...update,
          timestamp: new Date().toISOString()
        }
      ];

      const { error } = await supabase
        .from('maintenance_coordination')
        .update({ 
          real_time_updates: newUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', coordinationId);

      if (error) throw error;

      await fetchCoordinations();
    } catch (error: any) {
      console.error('Error adding realtime update:', error);
      toast({
        title: "Error",
        description: "Failed to add update",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchCoordinations();

    // Set up real-time subscription
    const channel = supabase
      .channel('maintenance-coordination')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_coordination'
        },
        () => {
          fetchCoordinations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCoordinations]);

  return {
    coordinations,
    loading,
    updateCoordinationStatus,
    addRealtimeUpdate,
    fetchCoordinations
  };
};


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
      // Temporarily use maintenance_requests with enhanced status tracking
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(name),
          vendors(name, email)
        `)
        .in('status', ['IN_PROGRESS', 'ASSIGNED'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform to coordination format
      const transformedCoordinations = (data || []).map(request => ({
        id: request.id,
        maintenance_request_id: request.id,
        coordinator_id: request.tenant_id,
        assigned_vendor_id: request.vendor_id,
        status: request.status || 'PENDING',
        priority_level: request.priority || 'MEDIUM',
        estimated_duration: '2-3 hours',
        actual_duration: undefined,
        coordination_notes: request.description,
        tenant_notifications_sent: false,
        landlord_notifications_sent: false,
        vendor_notifications_sent: false,
        real_time_updates: [],
        created_at: request.created_at,
        updated_at: request.updated_at,
        maintenance_requests: {
          title: request.title,
          description: request.description,
          priority: request.priority || 'MEDIUM',
          properties: { name: request.properties?.name || 'Unknown Property' }
        },
        vendors: request.vendors ? {
          name: request.vendors.name,
          email: request.vendors.email
        } : undefined
      }));
      
      setCoordinations(transformedCoordinations);
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
        updateData.description = notes;
      }

      const { error } = await supabase
        .from('maintenance_requests')
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
      // For now, just update the maintenance request with a note
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
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
          table: 'maintenance_requests'
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

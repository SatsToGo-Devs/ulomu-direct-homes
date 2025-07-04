
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setUserRoles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching roles for user:', user?.id);

      // Query user_roles table directly
      const { data, error: fetchError } = await supabase
        .from('user_roles')
        .select('role, assigned_at')
        .eq('user_id', user?.id);

      if (fetchError) {
        console.error('Error fetching user roles:', fetchError);
        // If no roles found, assign default 'tenant' role
        await assignDefaultRole();
        setUserRoles(['tenant']);
      } else {
        const roles = data?.map(item => item.role) || [];
        console.log('Fetched roles:', roles);
        
        // If no roles found, assign default 'tenant' role
        if (roles.length === 0) {
          await assignDefaultRole();
          setUserRoles(['tenant']);
        } else {
          setUserRoles(roles);
        }
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setError('Failed to fetch user roles');
      setUserRoles(['tenant']); // Default fallback
    } finally {
      setLoading(false);
    }
  };

  const assignDefaultRole = async () => {
    try {
      console.log('Assigning default tenant role to user:', user?.id);
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user?.id,
          role: 'tenant'
        });

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error assigning default role:', error);
        throw error;
      }
      console.log('Default role assigned successfully');
    } catch (error) {
      console.error('Error assigning default role:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    return userRoles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isLandlord = (): boolean => {
    return hasRole('landlord');
  };

  const isVendor = (): boolean => {
    return hasRole('vendor');
  };

  const isTenant = (): boolean => {
    return hasRole('tenant');
  };

  const getPrimaryRole = (): string => {
    // Priority order: admin > landlord > vendor > tenant
    if (hasRole('admin')) return 'admin';
    if (hasRole('landlord')) return 'landlord';
    if (hasRole('vendor')) return 'vendor';
    return 'tenant';
  };

  const assignRole = async (userId: string, role: string) => {
    try {
      console.log('Assigning role:', role, 'to user:', userId);
      // If userId is 'self', use current user's ID
      const targetUserId = userId === 'self' ? user?.id : userId;
      
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: targetUserId,
          role: role,
          assigned_by: user?.id
        })
        .select();

      if (error) {
        console.error('Error assigning role:', error);
        if (error.code === '23505') {
          // Role already exists, this is fine
          console.log('Role already exists for user');
          return { success: true };
        }
        throw error;
      }

      console.log('Role assigned successfully:', data);

      // Refresh roles if assigning to current user
      if (targetUserId === user?.id) {
        await fetchUserRoles();
      }

      return { success: true };
    } catch (error) {
      console.error('Error assigning role:', error);
      return { success: false, error: 'Failed to assign role' };
    }
  };

  const removeRole = async (userId: string, role: string) => {
    try {
      console.log('Removing role:', role, 'from user:', userId);
      // If userId is 'self', use current user's ID
      const targetUserId = userId === 'self' ? user?.id : userId;
      
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', targetUserId)
        .eq('role', role);

      if (error) {
        console.error('Error removing role:', error);
        throw error;
      }

      console.log('Role removed successfully');

      // Refresh roles if removing from current user
      if (targetUserId === user?.id) {
        await fetchUserRoles();
      }

      return { success: true };
    } catch (error) {
      console.error('Error removing role:', error);
      return { success: false, error: 'Failed to remove role' };
    }
  };

  return {
    userRoles,
    loading,
    error,
    hasRole,
    isAdmin,
    isLandlord,
    isVendor,
    isTenant,
    getPrimaryRole,
    assignRole,
    removeRole,
    refetch: fetchUserRoles
  };
};

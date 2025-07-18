
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { 
  Users, 
  Shield, 
  UserPlus, 
  UserMinus,
  Crown,
  Home,
  Wrench,
  User,
  RefreshCw
} from 'lucide-react';

interface UserProfile {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  created_at?: string;
  roles: string[];
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { assignRole, removeRole, isAdmin } = useUserRole();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const availableRoles = ['admin', 'landlord', 'vendor', 'tenant'];

  useEffect(() => {
    if (user && isAdmin()) {
      fetchUsers();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching users and roles...');
      
      // Get all user roles first
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        throw rolesError;
      }

      // Get profiles for users who have roles
      const userIds = [...new Set(userRoles?.map(ur => ur.user_id) || [])];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (profilesError) {
        console.warn('Could not fetch all profiles:', profilesError);
      }

      // Combine the data
      const usersWithRoles = userIds.map(userId => {
        const userRolesList = userRoles?.filter(ur => ur.user_id === userId) || [];
        const profile = profiles?.find(p => p.id === userId);
        
        return {
          id: userId,
          email: `user-${userId.slice(0, 8)}@example.com`, // Placeholder since we can't access auth.users
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          created_at: new Date().toISOString(), // Placeholder
          roles: userRolesList.map(ur => ur.role)
        };
      });

      // Add current user if not already included
      if (!userIds.includes(user?.id)) {
        const { data: currentUserRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user?.id);

        const { data: currentUserProfile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user?.id)
          .single();

        usersWithRoles.unshift({
          id: user?.id,
          email: user?.email || 'current-user@example.com',
          first_name: currentUserProfile?.first_name,
          last_name: currentUserProfile?.last_name,
          created_at: new Date().toISOString(),
          roles: currentUserRoles?.map(r => r.role) || []
        });
      }

      setUsers(usersWithRoles);
      console.log('Successfully fetched users:', usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users. You may need additional permissions.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, role: string) => {
    try {
      const result = await assignRole(userId, role);
      if (result.success) {
        toast({
          title: "Role Assigned",
          description: `Successfully assigned ${role} role to user.`
        });
        await fetchUsers(); // Refresh the list
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign role to user.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveRole = async (userId: string, role: string) => {
    try {
      const result = await removeRole(userId, role);
      if (result.success) {
        toast({
          title: "Role Removed",
          description: `Successfully removed ${role} role from user.`
        });
        await fetchUsers(); // Refresh the list
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove role from user.",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'landlord': return <Home className="h-4 w-4" />;
      case 'vendor': return <Wrench className="h-4 w-4" />;
      case 'tenant': return <User className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'landlord': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-green-100 text-green-800';
      case 'tenant': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You need admin privileges to access user management.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-terracotta mx-auto" />
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-terracotta" />
            User Management
          </h2>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Users
        </Button>
      </div>

      <div className="grid gap-4">
        {users.map((userProfile) => (
          <Card key={userProfile.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 bg-forest text-white">
                    <AvatarFallback>
                      {userProfile.first_name && userProfile.last_name 
                        ? `${userProfile.first_name[0]}${userProfile.last_name[0]}`
                        : userProfile.email ? userProfile.email[0].toUpperCase() : 'U'
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {userProfile.first_name && userProfile.last_name
                        ? `${userProfile.first_name} ${userProfile.last_name}`
                        : 'No Name Set'
                      }
                      {userProfile.id === user?.id && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </h3>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <p className="text-xs text-gray-500">
                      User ID: {userProfile.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex flex-wrap gap-2 justify-end mb-4">
                    {userProfile.roles.length > 0 ? (
                      userProfile.roles.map((role) => (
                        <Badge key={role} className={`${getRoleColor(role)} flex items-center gap-1`}>
                          {getRoleIcon(role)}
                          {role}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 ml-1 hover:bg-red-200"
                            onClick={() => handleRemoveRole(userProfile.id, role)}
                          >
                            <UserMinus className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">No roles assigned</Badge>
                    )}
                  </div>

                  <div className="flex gap-1 flex-wrap justify-end">
                    {availableRoles.map((role) => (
                      !userProfile.roles.includes(role) && (
                        <Button
                          key={role}
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => handleAssignRole(userProfile.id, role)}
                        >
                          <UserPlus className="h-3 w-3 mr-1" />
                          Add {role}
                        </Button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">No users with roles have been found in the system yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;

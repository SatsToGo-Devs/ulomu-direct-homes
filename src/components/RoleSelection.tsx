
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { 
  Crown, 
  Home, 
  Wrench, 
  User,
  Plus,
  X,
  Loader2
} from 'lucide-react';

const RoleSelection: React.FC = () => {
  const { userRoles, assignRole, removeRole, refetch, loading: rolesLoading } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const availableRoles = [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full system access and user management',
      icon: <Crown className="h-5 w-5" />,
      color: 'bg-red-100 text-red-800'
    },
    {
      id: 'landlord',
      name: 'Landlord',
      description: 'Manage properties and tenants',
      icon: <Home className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'vendor',
      name: 'Vendor',
      description: 'Provide maintenance and repair services',
      icon: <Wrench className="h-5 w-5" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'tenant',
      name: 'Tenant',
      description: 'Rent properties and request maintenance',
      icon: <User className="h-5 w-5" />,
      color: 'bg-gray-100 text-gray-800'
    }
  ];

  const handleAddRole = async (roleId: string) => {
    setLoading(roleId);
    try {
      console.log('Adding role:', roleId);
      const result = await assignRole('self', roleId);
      if (result.success) {
        toast({
          title: "Role Added",
          description: `Successfully added ${roleId} role.`
        });
        // Force refetch to update the UI
        setTimeout(() => refetch(), 500);
      } else {
        throw new Error(result.error || 'Failed to add role');
      }
    } catch (error: any) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    // Prevent removing the last role
    if (userRoles.length === 1) {
      toast({
        title: "Cannot Remove Role",
        description: "You must have at least one role assigned.",
        variant: "destructive"
      });
      return;
    }

    setLoading(roleId);
    try {
      console.log('Removing role:', roleId);
      const result = await removeRole('self', roleId);
      if (result.success) {
        toast({
          title: "Role Removed",
          description: `Successfully removed ${roleId} role.`
        });
        // Force refetch to update the UI
        setTimeout(() => refetch(), 500);
      } else {
        throw new Error(result.error || 'Failed to remove role');
      }
    } catch (error: any) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  if (rolesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading roles...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Select Your Roles
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose the roles that best describe how you want to use the platform
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {availableRoles.map((role) => {
            const hasRole = userRoles.includes(role.id);
            const isLoadingThis = loading === role.id;
            
            return (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${role.color}`}>
                    {role.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {hasRole && (
                    <Badge className={`${role.color} flex items-center gap-1`}>
                      {role.icon}
                      Active
                    </Badge>
                  )}
                  
                  {hasRole ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveRole(role.id)}
                      disabled={isLoadingThis || userRoles.length === 1}
                      className="text-red-600 hover:text-red-700"
                    >
                      {isLoadingThis ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAddRole(role.id)}
                      disabled={isLoadingThis}
                      className="bg-terracotta hover:bg-terracotta/90"
                    >
                      {isLoadingThis ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4 mr-1" />
                      )}
                      Add Role
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {userRoles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Loading your roles...</p>
          </div>
        )}

        {userRoles.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Current Roles:</h4>
            <div className="flex flex-wrap gap-2">
              {userRoles.map((role) => {
                const roleInfo = availableRoles.find(r => r.id === role);
                return (
                  <Badge key={role} className={roleInfo?.color || 'bg-gray-100 text-gray-800'}>
                    {roleInfo?.icon}
                    <span className="ml-1">{roleInfo?.name || role}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSelection;


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
  X
} from 'lucide-react';

const RoleSelection: React.FC = () => {
  const { userRoles, assignRole, removeRole, refetch } = useUserRole();
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
      const result = await assignRole('self', roleId);
      if (result.success) {
        toast({
          title: "Role Added",
          description: `Successfully added ${roleId} role.`
        });
        await refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error adding role:', error);
      toast({
        title: "Error",
        description: "Failed to add role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    setLoading(roleId);
    try {
      const result = await removeRole('self', roleId);
      if (result.success) {
        toast({
          title: "Role Removed",
          description: `Successfully removed ${roleId} role.`
        });
        await refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast({
        title: "Error",
        description: "Failed to remove role. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

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
                      disabled={loading === role.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleAddRole(role.id)}
                      disabled={loading === role.id}
                      className="bg-terracotta hover:bg-terracotta/90"
                    >
                      <Plus className="h-4 w-4 mr-1" />
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
            <p>No roles selected yet. Choose at least one role to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSelection;

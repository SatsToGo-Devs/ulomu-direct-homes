
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VendorOnboarding from './VendorOnboarding';
import VendorApplications from './VendorApplications';
import { 
  Users, 
  Star, 
  MapPin, 
  Verified, 
  Search,
  Phone,
  Mail,
  UserPlus,
  Plus
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Vendor = Tables<'vendors'>;

const VendorManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const specialties = [
    'Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 
    'Roofing', 'Landscaping', 'Cleaning', 'Appliance Repair', 'General Maintenance'
  ];

  useEffect(() => {
    if (user) {
      fetchUserRole();
      fetchVendors();
    }
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data && !error) {
        setUserRole(data.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Error",
        description: "Failed to load vendors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = !selectedSpecialty || 
                            vendor.specialties.includes(selectedSpecialty);
    
    return matchesSearch && matchesSpecialty;
  });

  const assignVendor = async (vendorId: string, maintenanceRequestId: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ vendor_id: vendorId, status: 'ASSIGNED' })
        .eq('id', maintenanceRequestId);

      if (error) throw error;

      toast({
        title: "Vendor Assigned",
        description: "Vendor has been successfully assigned to the maintenance request."
      });
    } catch (error) {
      console.error('Error assigning vendor:', error);
      toast({
        title: "Assignment Failed",
        description: "Failed to assign vendor to maintenance request.",
        variant: "destructive"
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  // Show onboarding if user wants to become a vendor
  if (showOnboarding) {
    return <VendorOnboarding />;
  }

  // Admin view with vendor applications
  if (userRole === 'admin') {
    return (
      <Tabs defaultValue="vendors" className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-6 w-6 text-terracotta" />
              Vendor Management
            </h2>
            <p className="text-gray-600">Manage vendors and review applications</p>
          </div>
        </div>

        <TabsList>
          <TabsTrigger value="vendors">Active Vendors</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search vendors by name, company, or specialty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="sm:w-64">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-terracotta focus:border-transparent"
                    >
                      <option value="">All Specialties</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>{specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 bg-forest text-white">
                          <AvatarFallback>
                            {vendor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {vendor.name}
                            {vendor.verified && (
                              <Verified className="h-4 w-4 text-blue-600" />
                            )}
                          </CardTitle>
                          {vendor.company_name && (
                            <p className="text-sm text-gray-600">{vendor.company_name}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(vendor.rating)}
                      </div>
                      <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                      {vendor.hourly_rate && vendor.hourly_rate > 0 && (
                        <span className="text-sm text-gray-600 ml-auto">
                          ₦{vendor.hourly_rate.toLocaleString()}/hr
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.specialties.slice(0, 3).map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {vendor.specialties.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vendor.specialties.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {(vendor.city || vendor.state) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{[vendor.city, vendor.state].filter(Boolean).join(', ')}</span>
                      </div>
                    )}

                    <div className="text-sm text-gray-600">
                      <strong>{vendor.experience_years}</strong> years of experience
                    </div>

                    <div className="space-y-2">
                      {vendor.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{vendor.email}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-terracotta hover:bg-terracotta/90"
                      >
                        Assign to Job
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredVendors.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedSpecialty 
                      ? "Try adjusting your search criteria" 
                      : "No verified vendors available at the moment"
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <VendorApplications />
        </TabsContent>
      </Tabs>
    );
  }

  // Regular user view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-terracotta" />
            Find Vendors
          </h2>
          <p className="text-gray-600">Browse and connect with verified service providers</p>
        </div>
        <Button 
          onClick={() => setShowOnboarding(true)}
          className="bg-terracotta hover:bg-terracotta/90"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Become a Vendor
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search vendors by name, company, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-terracotta focus:border-transparent"
              >
                <option value="">All Specialties</option>
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-forest text-white">
                    <AvatarFallback>
                      {vendor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {vendor.name}
                      {vendor.verified && (
                        <Verified className="h-4 w-4 text-blue-600" />
                      )}
                    </CardTitle>
                    {vendor.company_name && (
                      <p className="text-sm text-gray-600">{vendor.company_name}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(vendor.rating)}
                </div>
                <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                {vendor.hourly_rate && vendor.hourly_rate > 0 && (
                  <span className="text-sm text-gray-600 ml-auto">
                    ₦{vendor.hourly_rate.toLocaleString()}/hr
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {vendor.specialties.slice(0, 3).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {vendor.specialties.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{vendor.specialties.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {(vendor.city || vendor.state) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{[vendor.city, vendor.state].filter(Boolean).join(', ')}</span>
                </div>
              )}

              <div className="text-sm text-gray-600">
                <strong>{vendor.experience_years}</strong> years of experience
              </div>

              <div className="space-y-2">
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{vendor.email}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  size="sm" 
                  className="flex-1 bg-terracotta hover:bg-terracotta/90"
                >
                  Contact Vendor
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedSpecialty 
                ? "Try adjusting your search criteria" 
                : "No verified vendors available at the moment"
              }
            </p>
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Become a Vendor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorManagement;

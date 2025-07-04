
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Eye, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Building,
  Award
} from 'lucide-react';

interface VendorApplication {
  id: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  business_address?: string;
  years_experience: number;
  specialties: string[];
  portfolio_description?: string;
  application_status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

const VendorApplications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<VendorApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load vendor applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
    try {
      setProcessing(true);
      
      const { error: updateError } = await supabase
        .from('vendor_applications')
        .update({
          application_status: status,
          admin_notes: notes || adminNotes,
          reviewed_by: user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // If approved, create vendor profile
      if (status === 'APPROVED' && selectedApplication) {
        const { error: vendorError } = await supabase
          .from('vendors')
          .insert({
            user_id: selectedApplication.id, // This should be the user_id from the application
            name: selectedApplication.contact_person,
            company_name: selectedApplication.business_name,
            email: selectedApplication.email,
            phone: selectedApplication.phone,
            specialties: selectedApplication.specialties,
            address: selectedApplication.business_address,
            experience_years: selectedApplication.years_experience,
            verified: true,
            onboarding_completed: true,
            bio: selectedApplication.portfolio_description
          });

        if (vendorError) throw vendorError;

        // Update user role to vendor
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: selectedApplication.id,
            role: 'vendor',
            assigned_by: user?.id
          });

        if (roleError && roleError.code !== '23505') { // Ignore duplicate key error
          console.warn('Role assignment error:', roleError);
        }
      }

      await fetchApplications();
      setSelectedApplication(null);
      setAdminNotes('');

      toast({
        title: status === 'APPROVED' ? "Application Approved" : "Application Rejected",
        description: `Vendor application has been ${status.toLowerCase()}.`
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update application status.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
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
            Vendor Applications
          </h2>
          <p className="text-gray-600">Review and manage vendor applications</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications</h3>
            <p className="text-gray-600">No vendor applications to review at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-forest text-white">
                      <AvatarFallback>
                        {application.contact_person.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{application.contact_person}</CardTitle>
                      <p className="text-sm text-gray-600">{application.business_name}</p>
                    </div>
                  </div>
                  {getStatusBadge(application.application_status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>{application.years_experience} years</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building className="h-4 w-4" />
                    <span>{application.specialties.length} specialties</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{application.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{application.email}</span>
                  </div>
                  {application.business_address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="line-clamp-2">{application.business_address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {application.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {application.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{application.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Applied: {new Date(application.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedApplication(application)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-terracotta" />
                Review Application - {selectedApplication.business_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.contact_person}</p>
                    <p><strong>Business:</strong> {selectedApplication.business_name}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    {selectedApplication.business_address && (
                      <p><strong>Address:</strong> {selectedApplication.business_address}</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Experience & Specialties</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Experience:</strong> {selectedApplication.years_experience} years</p>
                    <div>
                      <strong>Specialties:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedApplication.specialties.map((specialty) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedApplication.portfolio_description && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Portfolio Description</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                    {selectedApplication.portfolio_description}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => setSelectedApplication(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'REJECTED')}
                  disabled={processing}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={() => updateApplicationStatus(selectedApplication.id, 'APPROVED')}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VendorApplications;

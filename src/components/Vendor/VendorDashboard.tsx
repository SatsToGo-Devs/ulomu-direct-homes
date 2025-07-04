
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Briefcase, 
  Star, 
  Clock, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type MaintenanceRequest = Tables<'maintenance_requests'>;
type Vendor = Tables<'vendors'>;

interface VendorStats {
  totalJobs: number;
  completedJobs: number;
  averageRating: number;
  completionRate: number;
  totalEarnings: number;
}

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [activeJobs, setActiveJobs] = useState<MaintenanceRequest[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalJobs: 0,
    completedJobs: 0,
    averageRating: 0,
    completionRate: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchVendorData();
      fetchActiveJobs();
      fetchStats();
    }
  }, [user]);

  const fetchVendorData = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
    }
  };

  const fetchActiveJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties (
            name,
            address
          )
        `)
        .eq('vendor_id', vendor?.id)
        .in('status', ['ASSIGNED', 'IN_PROGRESS'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActiveJobs(data || []);
    } catch (error) {
      console.error('Error fetching active jobs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      if (!vendor) return;

      const { data: completedJobs, error: jobsError } = await supabase
        .from('maintenance_requests')
        .select('*')
        .eq('vendor_id', vendor.id)
        .eq('status', 'COMPLETED');

      if (jobsError) throw jobsError;

      const { data: reviews, error: reviewsError } = await supabase
        .from('vendor_reviews')
        .select('rating')
        .eq('vendor_id', vendor.id);

      if (reviewsError) throw reviewsError;

      const totalJobs = vendor.total_jobs || 0;
      const completedCount = completedJobs?.length || 0;
      const averageRating = reviews?.length ? 
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
      const completionRate = vendor.completion_rate || 0;
      const totalEarnings = completedJobs?.reduce((sum, job) => sum + (job.actual_cost || 0), 0) || 0;

      setStats({
        totalJobs,
        completedJobs: completedCount,
        averageRating,
        completionRate,
        totalEarnings
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status,
          ...(status === 'COMPLETED' && { completed_date: new Date().toISOString() })
        })
        .eq('id', jobId);

      if (error) throw error;

      await fetchActiveJobs();
      await fetchStats();

      toast({
        title: "Job Updated",
        description: `Job status updated to ${status.toLowerCase()}.`
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update job status.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendor Profile</h3>
          <p className="text-gray-600">You need to complete your vendor profile to access the dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 bg-forest text-white">
            <AvatarFallback>
              {vendor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600">{vendor.company_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{stats.averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({stats.completionRate}% completion rate)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-terracotta" />
            Active Jobs ({activeJobs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeJobs.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Jobs</h3>
              <p className="text-gray-600">You don't have any active jobs at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <Badge className={getStatusColor(job.status || '')}>
                          {job.status?.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(job.priority || '')}>
                          {job.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.created_at || '').toLocaleDateString()}
                        </span>
                        {job.estimated_cost && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₦{job.estimated_cost.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {job.status === 'ASSIGNED' && (
                        <Button
                          size="sm"
                          onClick={() => updateJobStatus(job.id, 'IN_PROGRESS')}
                        >
                          Start Job
                        </Button>
                      )}
                      {job.status === 'IN_PROGRESS' && (
                        <Button
                          size="sm"
                          onClick={() => updateJobStatus(job.id, 'COMPLETED')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Job
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;

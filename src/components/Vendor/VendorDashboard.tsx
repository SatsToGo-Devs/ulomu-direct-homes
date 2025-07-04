
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  Star,
  MapPin,
  Calendar,
  Phone,
  MessageCircle
} from 'lucide-react';

interface VendorJob {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  estimated_cost: number;
  actual_cost?: number;
  scheduled_date?: string;
  created_at: string;
  properties: { name: string; address: string };
  units?: { unit_number: string };
  progress?: number;
}

interface VendorStats {
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  totalEarnings: number;
  avgRating: number;
  completionRate: number;
}

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<VendorJob[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalJobs: 0,
    completedJobs: 0,
    pendingJobs: 0,
    totalEarnings: 0,
    avgRating: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (user) {
      fetchVendorJobs();
      fetchVendorStats();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchVendorJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          properties(name, address),
          units(unit_number),
          maintenance_work_progress(progress_percentage)
        `)
        .eq('vendor_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const jobsWithProgress = data?.map(job => ({
        ...job,
        progress: job.maintenance_work_progress?.[0]?.progress_percentage || 0
      })) || [];
      
      setJobs(jobsWithProgress);
    } catch (error) {
      console.error('Error fetching vendor jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load your jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVendorStats = async () => {
    try {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('rating, total_jobs, completion_rate')
        .eq('user_id', user?.id)
        .single();

      if (vendorError) throw vendorError;

      const { data: jobsData, error: jobsError } = await supabase
        .from('maintenance_requests')
        .select('status, actual_cost, estimated_cost')
        .eq('vendor_id', user?.id);

      if (jobsError) throw jobsError;

      const totalJobs = jobsData?.length || 0;
      const completedJobs = jobsData?.filter(j => j.status === 'COMPLETED').length || 0;
      const pendingJobs = jobsData?.filter(j => ['PENDING', 'IN_PROGRESS', 'ASSIGNED'].includes(j.status)).length || 0;
      const totalEarnings = jobsData?.reduce((sum, job) => sum + (job.actual_cost || job.estimated_cost || 0), 0) || 0;

      setStats({
        totalJobs,
        completedJobs,
        pendingJobs,
        totalEarnings,
        avgRating: vendor?.rating || 0,
        completionRate: vendor?.completion_rate || 0
      });
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('vendor-jobs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'maintenance_requests',
          filter: `vendor_id=eq.${user?.id}`
        },
        () => {
          fetchVendorJobs();
          fetchVendorStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          ...(status === 'COMPLETED' && { completed_date: new Date().toISOString() })
        })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Job Updated",
        description: `Job status updated to ${status.toLowerCase().replace('_', ' ')}`
      });

      fetchVendorJobs();
      fetchVendorStats();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update job status",
        variant: "destructive"
      });
    }
  };

  const updateJobProgress = async (jobId: string, progress: number, statusUpdate: string) => {
    try {
      const { error } = await supabase
        .from('maintenance_work_progress')
        .upsert({
          maintenance_request_id: jobId,
          progress_percentage: progress,
          status_update: statusUpdate,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Progress Updated",
        description: "Job progress has been updated successfully"
      });

      fetchVendorJobs();
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update job progress",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => {
    switch (activeTab) {
      case 'pending':
        return ['PENDING', 'ASSIGNED'].includes(job.status);
      case 'active':
        return job.status === 'IN_PROGRESS';
      case 'completed':
        return job.status === 'COMPLETED';
      default:
        return true;
    }
  });

  const JobCard: React.FC<{ job: VendorJob }> = ({ job }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{job.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(job.status)}>
              {job.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(job.priority)}>
              {job.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{job.properties?.name} - {job.properties?.address}</span>
          </div>
          {job.units && (
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Unit:</span>
              <span>{job.units.unit_number}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">Category:</span>
            <span>{job.category}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-sm text-gray-700">{job.description}</p>
        )}

        {job.status === 'IN_PROGRESS' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{job.progress}%</span>
            </div>
            <Progress value={job.progress} className="h-2" />
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t text-sm">
          <span className="text-gray-500">
            {new Date(job.created_at).toLocaleDateString()}
          </span>
          <span className="font-medium text-green-600">
            ₦{(job.actual_cost || job.estimated_cost || 0).toLocaleString()}
          </span>
        </div>

        <div className="flex gap-2 pt-2">
          {job.status === 'ASSIGNED' && (
            <Button 
              size="sm" 
              onClick={() => updateJobStatus(job.id, 'IN_PROGRESS')}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              Start Job
            </Button>
          )}
          {job.status === 'IN_PROGRESS' && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => updateJobProgress(job.id, Math.min(job.progress + 25, 100), 'Progress update')}
              >
                Update Progress
              </Button>
              <Button 
                size="sm" 
                onClick={() => updateJobStatus(job.id, 'COMPLETED')}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete
              </Button>
            </>
          )}
          <Button size="sm" variant="outline">
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-terracotta">{stats.totalJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completedJobs}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.pendingJobs}</div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-forest">₦{stats.totalEarnings.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Earnings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 flex items-center justify-center gap-1">
              {stats.avgRating.toFixed(1)} <Star className="h-4 w-4" />
            </div>
            <div className="text-sm text-gray-600">Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.completionRate}%</div>
            <div className="text-sm text-gray-600">Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({jobs.filter(j => ['PENDING', 'ASSIGNED'].includes(j.status)).length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Active ({jobs.filter(j => j.status === 'IN_PROGRESS').length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({jobs.filter(j => j.status === 'COMPLETED').length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All ({jobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  {activeTab === 'pending' 
                    ? "You don't have any pending jobs at the moment" 
                    : `No ${activeTab} jobs to display`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDashboard;

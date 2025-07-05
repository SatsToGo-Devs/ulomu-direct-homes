
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { useEscrowData } from '@/hooks/useEscrowData';
import { 
  Wrench, 
  Star, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Award, 
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  MapPin,
  Briefcase,
  Target
} from 'lucide-react';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { transactions, vendorProfile, loading } = useEscrowData();

  // Calculate vendor metrics
  const workTransactions = transactions.filter(t => 
    t.purpose?.includes('MAINTENANCE') || 
    t.purpose?.includes('WORK') ||
    t.type === 'WORK_PAYMENT'
  );
  
  const completedWork = workTransactions.filter(t => t.status === 'COMPLETED');
  const pendingWork = workTransactions.filter(t => t.status === 'HELD');
  const totalEarnings = completedWork.reduce((sum, t) => sum + t.amount, 0);
  const pendingEarnings = pendingWork.reduce((sum, t) => sum + t.amount, 0);
  const trustScore = vendorProfile?.trust_score || 0.8;
  const completionRate = vendorProfile?.completion_rate || 100;

  const quickActions = [
    { icon: Briefcase, label: 'Browse Jobs', route: '/maintenance', color: 'bg-blue-500', description: 'Find new work opportunities' },
    { icon: FileText, label: 'Submit Work Evidence', route: '/maintenance', color: 'bg-green-500', description: 'Upload proof of completed work' },
    { icon: DollarSign, label: 'Request Payment', route: '/escrow', color: 'bg-purple-500', description: 'Request release of escrow funds' },
    { icon: Star, label: 'Update Profile', route: '/profile', color: 'bg-orange-500', description: 'Manage your vendor profile' },
    { icon: Target, label: 'Performance Metrics', route: '/dashboard', color: 'bg-indigo-500', description: 'View detailed analytics' },
    { icon: Users, label: 'Client Reviews', route: '/dashboard', color: 'bg-teal-500', description: 'Check customer feedback' }
  ];

  const jobOpportunities = [
    { title: 'Plumbing Repair', location: 'Lekki Phase 1', budget: '₦50,000', urgency: 'High', posted: '2 hours ago' },
    { title: 'Electrical Installation', location: 'Victoria Island', budget: '₦120,000', urgency: 'Medium', posted: '1 day ago' },
    { title: 'AC Maintenance', location: 'Ikoyi', budget: '₦35,000', urgency: 'Low', posted: '2 days ago' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Vendor Performance Hub</h1>
        <p className="text-orange-100">Track your jobs, earnings, and build your reputation as a trusted service provider</p>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Total Earnings</p>
                <p className="text-2xl font-bold text-green-800">₦{totalEarnings.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-green-600">{completedWork.length} jobs completed</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-700">Pending Earnings</p>
                <p className="text-2xl font-bold text-yellow-800">₦{pendingEarnings.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-yellow-600">{pendingWork.length} jobs in progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Trust Score</p>
                <p className="text-2xl font-bold text-blue-800">{(trustScore * 100).toFixed(0)}%</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">Excellent rating</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Completion Rate</p>
                <p className="text-2xl font-bold text-purple-800">{completionRate.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-xs text-purple-600">{vendorProfile?.total_jobs || 0} total jobs</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-sm text-gray-500">{(trustScore * 100).toFixed(0)}%</span>
              </div>
              <Progress value={trustScore * 100} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">Based on work quality and reliability</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Job Completion Rate</span>
                <span className="text-sm text-gray-500">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-3 mb-1" />
              <p className="text-xs text-gray-500">Successfully completed projects</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-orange-500" />
            Vendor Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-orange-500"
                onClick={() => navigate(action.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 ${action.color} rounded-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Job Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            Available Job Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobOpportunities.map((job, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {job.posted}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{job.budget}</p>
                    <Badge 
                      className={
                        job.urgency === 'High' ? 'bg-red-100 text-red-800' :
                        job.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {job.urgency} Priority
                    </Badge>
                  </div>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Apply for Job
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Progress & Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Current Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingWork.length > 0 ? (
              <div className="space-y-3">
                {pendingWork.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{transaction.description || 'Maintenance Work'}</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Started: {new Date(transaction.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-bold text-blue-600">
                        ₦{transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No active projects</p>
                <Button onClick={() => navigate('/maintenance')} className="bg-orange-500 hover:bg-orange-600">
                  Browse Available Jobs
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium">Excellent Work!</span>
              </div>
              <p className="text-sm text-gray-600">"Very professional and completed the job on time."</p>
              <p className="text-xs text-gray-500 mt-1">- Property Manager, Lekki</p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-yellow-500">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <Star className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Good Service</span>
              </div>
              <p className="text-sm text-gray-600">"Quality work, will hire again."</p>
              <p className="text-xs text-gray-500 mt-1">- Tenant, Victoria Island</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;

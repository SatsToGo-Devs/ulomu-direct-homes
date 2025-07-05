
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Database,
  Activity,
  UserCheck,
  DollarSign,
  FileText,
  Bell,
  Lock,
  Globe,
  Zap
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock admin data - replace with real data from your backend
  const systemMetrics = {
    totalUsers: 1247,
    activeUsers: 892,
    totalProperties: 456,
    totalTransactions: 2847,
    systemUptime: 99.9,
    pendingApprovals: 12,
    securityAlerts: 3,
    revenue: 4875000
  };

  const quickActions = [
    { icon: Users, label: 'User Management', route: '/admin-dashboard', color: 'bg-blue-500', description: 'Manage users, roles, and permissions' },
    { icon: Shield, label: 'Security Center', route: '/admin-dashboard', color: 'bg-red-500', description: 'Monitor security and access logs' },
    { icon: BarChart3, label: 'Analytics', route: '/admin-dashboard', color: 'bg-green-500', description: 'View system-wide analytics' },
    { icon: Settings, label: 'System Settings', route: '/admin-dashboard', color: 'bg-purple-500', description: 'Configure system parameters' },
    { icon: Database, label: 'Data Management', route: '/admin-dashboard', color: 'bg-indigo-500', description: 'Backup and data operations' },
    { icon: Bell, label: 'Notifications', route: '/admin-dashboard', color: 'bg-orange-500', description: 'System-wide notifications' }
  ];

  const recentActivities = [
    { type: 'user_registration', message: '15 new users registered today', time: '2 hours ago', severity: 'info' },
    { type: 'security_alert', message: 'Suspicious login attempt detected', time: '4 hours ago', severity: 'warning' },
    { type: 'system_update', message: 'Database backup completed successfully', time: '6 hours ago', severity: 'success' },
    { type: 'payment_issue', message: '3 payment transactions failed', time: '8 hours ago', severity: 'error' }
  ];

  const systemHealth = [
    { component: 'API Server', status: 'healthy', uptime: 99.9 },
    { component: 'Database', status: 'healthy', uptime: 99.8 },
    { component: 'Authentication', status: 'healthy', uptime: 100 },
    { component: 'Payment Gateway', status: 'warning', uptime: 98.5 },
    { component: 'File Storage', status: 'healthy', uptime: 99.7 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">System Administration Center</h1>
        <p className="text-red-100">Monitor, manage, and maintain the entire platform ecosystem</p>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Total Users</p>
                <p className="text-2xl font-bold text-blue-800">{systemMetrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-blue-600">{systemMetrics.activeUsers} active this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Revenue</p>
                <p className="text-2xl font-bold text-green-800">₦{systemMetrics.revenue.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-green-600">{systemMetrics.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">System Uptime</p>
                <p className="text-2xl font-bold text-purple-800">{systemMetrics.systemUptime}%</p>
              </div>
            </div>
            <p className="text-xs text-purple-600">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-700">Pending Actions</p>
                <p className="text-2xl font-bold text-orange-800">{systemMetrics.pendingApprovals}</p>
              </div>
            </div>
            <p className="text-xs text-orange-600">{systemMetrics.securityAlerts} security alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-500" />
            Administrative Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-red-500"
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

      {/* System Health Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    component.status === 'healthy' ? 'bg-green-500' :
                    component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    {component.status === 'healthy' ? 
                      <CheckCircle2 className="h-4 w-4 text-white" /> :
                      <AlertTriangle className="h-4 w-4 text-white" />
                    }
                  </div>
                  <div>
                    <h4 className="font-semibold">{component.component}</h4>
                    <p className="text-sm text-gray-500">Uptime: {component.uptime}%</p>
                  </div>
                </div>
                <Badge 
                  className={
                    component.status === 'healthy' ? 'bg-green-100 text-green-800' :
                    component.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {component.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  activity.severity === 'success' ? 'bg-green-50 border-green-500' :
                  activity.severity === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  activity.severity === 'error' ? 'bg-red-50 border-red-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{activity.message}</p>
                    <Badge 
                      className={`text-xs ${
                        activity.severity === 'success' ? 'bg-green-100 text-green-800' :
                        activity.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        activity.severity === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {activity.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">User Engagement</span>
                <span className="text-sm text-gray-500">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">System Performance</span>
                <span className="text-sm text-gray-500">94%</span>
              </div>
              <Progress value={94} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Security Score</span>
                <span className="text-sm text-gray-500">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Data Integrity</span>
                <span className="text-sm text-gray-500">100%</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Actions Panel */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Lock className="h-5 w-5" />
            Critical System Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Lockdown
            </Button>
            <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
              <Database className="h-4 w-4 mr-2" />
              Backup System
            </Button>
            <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
              <Globe className="h-4 w-4 mr-2" />
              Maintenance Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;

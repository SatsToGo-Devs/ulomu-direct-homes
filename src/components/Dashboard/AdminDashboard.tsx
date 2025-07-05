
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
    { icon: Users, label: 'User Management', route: '/admin-dashboard', color: 'bg-terracotta', description: 'Manage users, roles, and permissions' },
    { icon: Shield, label: 'Security Center', route: '/admin-dashboard', color: 'bg-forest', description: 'Monitor security and access logs' },
    { icon: BarChart3, label: 'Analytics', route: '/admin-dashboard', color: 'bg-ulomu-gold', description: 'View system-wide analytics' },
    { icon: Settings, label: 'System Settings', route: '/admin-dashboard', color: 'bg-terracotta', description: 'Configure system parameters' },
    { icon: Database, label: 'Data Management', route: '/admin-dashboard', color: 'bg-forest', description: 'Backup and data operations' },
    { icon: Bell, label: 'Notifications', route: '/admin-dashboard', color: 'bg-ulomu-gold', description: 'System-wide notifications' }
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
    <div className="container mx-auto px-4 py-8 space-y-8 bg-ulomu-beige min-h-screen">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-terracotta to-terracotta/90 text-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">System Administration Center</h1>
        <p className="text-white/90">Monitor, manage, and maintain the entire platform ecosystem</p>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-terracotta rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-terracotta">Total Users</p>
                <p className="text-2xl font-bold text-terracotta">{systemMetrics.totalUsers.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-terracotta/80">{systemMetrics.activeUsers} active this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-forest/10 to-forest/20 border-forest/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-forest rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-forest">Revenue</p>
                <p className="text-2xl font-bold text-forest">₦{systemMetrics.revenue.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-forest/80">{systemMetrics.totalTransactions} transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-ulomu-gold/10 to-ulomu-gold/20 border-ulomu-gold/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-ulomu-gold rounded-lg">
                <Activity className="h-5 w-5 text-black" />
              </div>
              <div>
                <p className="text-sm font-medium text-ulomu-gold">System Uptime</p>
                <p className="text-2xl font-bold text-ulomu-gold">{systemMetrics.systemUptime}%</p>
              </div>
            </div>
            <p className="text-xs text-ulomu-gold/80">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-terracotta/10 to-terracotta/20 border-terracotta/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-terracotta rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-terracotta">Pending Actions</p>
                <p className="text-2xl font-bold text-terracotta">{systemMetrics.pendingApprovals}</p>
              </div>
            </div>
            <p className="text-xs text-terracotta/80">{systemMetrics.securityAlerts} security alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Tools */}
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-terracotta" />
            Administrative Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-l-4 border-l-transparent hover:border-l-terracotta bg-ulomu-beige"
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
      <Card className="bg-white border-ulomu-beige-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-forest" />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.map((component, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-ulomu-beige rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    component.status === 'healthy' ? 'bg-forest' :
                    component.status === 'warning' ? 'bg-ulomu-gold' : 'bg-terracotta'
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
                    component.status === 'healthy' ? 'bg-forest text-white' :
                    component.status === 'warning' ? 'bg-ulomu-gold text-black' :
                    'bg-terracotta text-white'
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
        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-forest" />
              Recent System Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  activity.severity === 'success' ? 'bg-forest/10 border-forest' :
                  activity.severity === 'warning' ? 'bg-ulomu-gold/10 border-ulomu-gold' :
                  activity.severity === 'error' ? 'bg-terracotta/10 border-terracotta' :
                  'bg-terracotta/10 border-terracotta'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{activity.message}</p>
                    <Badge 
                      className={`text-xs ${
                        activity.severity === 'success' ? 'bg-forest text-white' :
                        activity.severity === 'warning' ? 'bg-ulomu-gold text-black' :
                        activity.severity === 'error' ? 'bg-terracotta text-white' :
                        'bg-terracotta text-white'
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

        <Card className="bg-white border-ulomu-beige-dark">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-ulomu-gold" />
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
      <Card className="border-terracotta/30 bg-terracotta/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-terracotta">
            <Lock className="h-5 w-5" />
            Critical System Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="w-full bg-terracotta hover:bg-terracotta/90">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Lockdown
            </Button>
            <Button variant="outline" className="w-full border-ulomu-gold text-ulomu-gold hover:bg-ulomu-gold hover:text-black">
              <Database className="h-4 w-4 mr-2" />
              Backup System
            </Button>
            <Button variant="outline" className="w-full border-forest text-forest hover:bg-forest hover:text-white">
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useEscrowData } from '@/hooks/useEscrowData';
import EnhancedEscrowPaymentModal from './EnhancedEscrowPaymentModal';
import { 
  Wrench, 
  Wallet, 
  Shield, 
  Star,
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Upload,
  FileCheck
} from 'lucide-react';

const VendorEscrowDashboard = () => {
  const { 
    account, 
    transactions, 
    vendorProfile,
    loading, 
    fetchEscrowData 
  } = useEscrowData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      {/* Vendor Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Total Earnings</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{totalEarnings.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {completedWork.length} jobs completed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Pending Release</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{pendingEarnings.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {pendingWork.length} jobs awaiting
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Trust Score</span>
            </div>
            <div className="text-3xl font-bold">
              {(trustScore * 100).toFixed(0)}%
            </div>
            <div className="text-xs opacity-75 mt-1">
              Excellent rating
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold">
              {completionRate.toFixed(1)}%
            </div>
            <div className="text-xs opacity-75 mt-1">
              {vendorProfile?.total_jobs || 0} total jobs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-sm text-gray-500">{(trustScore * 100).toFixed(0)}%</span>
              </div>
              <Progress value={trustScore * 100} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Based on work quality and reliability</p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm text-gray-500">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Jobs completed successfully</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-500" />
              Work Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Work Evidence
            </Button>
            <Button variant="outline" className="w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              Mark Work Complete
            </Button>
            <EnhancedEscrowPaymentModal 
              trigger={
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Request Payment Release
                </Button>
              }
              defaultPurpose="work_completion"
              onPaymentComplete={fetchEscrowData} 
            />
            <Button variant="outline" className="w-full">
              <Star className="h-4 w-4 mr-2" />
              View Job Opportunities
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              Pending Work
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingWork.length > 0 ? (
              <div className="space-y-3">
                {pendingWork.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{transaction.description || 'Maintenance Work'}</div>
                      <div className="text-xs text-gray-500">
                        Started: {new Date(transaction.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₦{transaction.amount.toLocaleString()}</div>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Awaiting Release
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                <p>No pending work!</p>
                <p className="text-sm">Check for new job opportunities</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Work History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" />
            Work History & Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {workTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No work history yet</h3>
              <p className="text-gray-500 mb-4">Your completed jobs will appear here.</p>
              <Button className="bg-orange-600 hover:bg-orange-700">
                Browse Job Opportunities
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Evidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workTransactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.description || 'Maintenance Work'}</TableCell>
                    <TableCell className="font-medium">₦{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'HELD' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {transaction.evidence_urls && transaction.evidence_urls.length > 0 ? (
                        <Badge variant="outline" className="text-green-600">
                          {transaction.evidence_urls.length} files
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {transaction.status === 'HELD' && (
                        <Button size="sm" variant="outline">
                          Update Status
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorEscrowDashboard;

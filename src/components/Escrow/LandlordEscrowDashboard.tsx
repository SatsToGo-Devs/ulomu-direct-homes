
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEscrowData } from '@/hooks/useEscrowData';
import EnhancedEscrowPaymentModal from './EnhancedEscrowPaymentModal';
import { 
  Home, 
  Users, 
  Shield, 
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  AlertTriangle
} from 'lucide-react';

const LandlordEscrowDashboard = () => {
  const { 
    account, 
    transactions, 
    serviceCharges, 
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

  const rentTransactions = transactions.filter(t => t.purpose?.includes('RENT') || t.type === 'RENT');
  const maintenanceTransactions = transactions.filter(t => t.purpose?.includes('MAINTENANCE'));
  const serviceChargeTransactions = transactions.filter(t => t.purpose?.includes('SERVICE_CHARGE'));
  const pendingReleases = transactions.filter(t => t.status === 'HELD');

  const totalRentCollected = rentTransactions
    .filter(t => t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalServiceCharges = serviceCharges.reduce((sum, sc) => sum + sc.amount, 0);

  return (
    <div className="space-y-8">
      {/* Landlord Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Home className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Rent Collected</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{totalRentCollected.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {rentTransactions.filter(t => t.status === 'COMPLETED').length} payments
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Service Charges</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{totalServiceCharges.toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              {serviceCharges.length} active charges
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Escrow Balance</span>
            </div>
            <div className="text-3xl font-bold">
              ₦{Number(account?.balance || 0).toLocaleString()}
            </div>
            <div className="text-xs opacity-75 mt-1">
              Available funds
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium opacity-90">Pending Releases</span>
            </div>
            <div className="text-3xl font-bold">
              {pendingReleases.length}
            </div>
            <div className="text-xs opacity-75 mt-1">
              ₦{pendingReleases.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Landlord Action Center */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Landlord Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Collect Rent
                  </Button>
                }
                defaultPurpose="rent_collection"
                onPaymentComplete={fetchEscrowData} 
              />
              <EnhancedEscrowPaymentModal 
                trigger={
                  <Button variant="outline" className="w-full">
                    Service Charge
                  </Button>
                }
                defaultPurpose="service_charge"
                onPaymentComplete={fetchEscrowData} 
              />
            </div>
            <Button variant="outline" className="w-full">
              <Shield className="h-4 w-4 mr-2" />
              Hold Maintenance Funds
            </Button>
            <Button variant="outline" className="w-full">
              <TrendingUp className="h-4 w-4 mr-2" />
              Property Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">
                      {transaction.purpose || transaction.type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{transaction.amount.toLocaleString()}</div>
                    <Badge variant={transaction.status === 'COMPLETED' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Fund Management */}
      {maintenanceTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Maintenance Escrow Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTransactions.slice(0, 10).map((transaction) => (
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
                      {transaction.status === 'HELD' && (
                        <Button size="sm" variant="outline">
                          Release Funds
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LandlordEscrowDashboard;

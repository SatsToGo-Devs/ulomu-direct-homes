
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEscrowData } from '@/hooks/useEscrowData';
import { DollarSign, Shield, Clock, TrendingUp, CreditCard } from 'lucide-react';
import ServiceChargeOverview from './ServiceChargeOverview';
import EscrowPaymentModal from './EscrowPaymentModal';
import ChatAssistant from '../AI/ChatAssistant';

const EscrowHub = () => {
  const { account, transactions, serviceCharges, loading } = useEscrowData();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return <TrendingUp className="h-4 w-4 text-forest" />;
      case 'HOLD': return <Shield className="h-4 w-4 text-gold" />;
      case 'RELEASE': return <DollarSign className="h-4 w-4 text-terracotta" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-forest text-white';
      case 'PENDING': return 'bg-gold text-white';
      case 'HELD': return 'bg-terracotta text-white';
      case 'FAILED': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Payment Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-forest">Escrow Hub</h2>
          <p className="text-gray-600">Secure financial transactions and service charge management</p>
        </div>
        <EscrowPaymentModal />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="service-charges">Service Charges</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Account Balance Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-forest" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-forest">
                  ₦{account?.balance?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-gray-600">Ready for transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Held in Escrow</CardTitle>
                <Shield className="h-4 w-4 text-gold" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gold">
                  ₦{account?.frozen_balance?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-gray-600">Pending release</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-terracotta" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-terracotta">
                  ₦{((account?.balance || 0) + (account?.frozen_balance || 0)).toLocaleString()}
                </div>
                <p className="text-xs text-gray-600">Combined holdings</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <EscrowPaymentModal 
                  trigger={
                    <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <CreditCard className="h-8 w-8 text-terracotta mb-2" />
                      <h3 className="font-medium">Make Payment</h3>
                      <p className="text-sm text-gray-600">Send money via escrow</p>
                    </div>
                  }
                />
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Shield className="h-8 w-8 text-gold mb-2" />
                  <h3 className="font-medium">Release Funds</h3>
                  <p className="text-sm text-gray-600">Complete transactions</p>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Clock className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-medium">View History</h3>
                  <p className="text-sm text-gray-600">Transaction records</p>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-medium">Reports</h3>
                  <p className="text-sm text-gray-600">Financial insights</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        {transaction.type}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.purpose || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        {transaction.type}
                      </TableCell>
                      <TableCell className="font-medium">
                        ₦{transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{transaction.purpose || '-'}</TableCell>
                      <TableCell>{transaction.description || '-'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="service-charges">
          <ServiceChargeOverview />
        </TabsContent>

        <TabsContent value="ai-assistant">
          <div className="grid lg:grid-cols-2 gap-6">
            <ChatAssistant userType="tenant" context="escrow" />
            <Card>
              <CardHeader>
                <CardTitle>Escrow AI Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Smart Transaction Analysis</h4>
                  <p className="text-sm text-blue-700">
                    AI monitors your escrow transactions for patterns, potential savings, and optimization opportunities.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Fraud Detection</h4>
                  <p className="text-sm text-green-700">
                    Advanced AI helps identify suspicious activities and protects your funds from fraudulent transactions.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Predictive Insights</h4>
                  <p className="text-sm text-purple-700">
                    Get predictions on cash flow, payment patterns, and optimal timing for fund releases.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Account Type</h3>
                    <p className="text-gray-600">{account?.account_type || 'General'}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Account ID</h3>
                    <p className="text-gray-600 font-mono text-sm">{account?.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EscrowHub;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEscrowData } from '@/hooks/useEscrowData';
import EscrowDashboard from './EscrowDashboard';
import ServiceChargeOverview from './ServiceChargeOverview';
import EscrowPaymentModal from './EscrowPaymentModal';
import PendingTransactionsManager from './PendingTransactionsManager';
import FundReleaseModal from './FundReleaseModal';
import { Wallet, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const EscrowHub = () => {
  const { account, transactions, serviceCharges, loading, fetchEscrowData } = useEscrowData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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

  const holdTransactions = transactions.filter(t => t.status === 'HELD');
  const completedTransactions = transactions.filter(t => t.status === 'COMPLETED');
  const failedTransactions = transactions.filter(t => t.status === 'FAILED');

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-5 w-5 text-forest" />
              <span className="text-sm font-medium">Available Balance</span>
            </div>
            <div className="text-2xl font-bold text-forest">
              ₦{Number(account?.balance || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium">Funds on Hold</span>
            </div>
            <div className="text-2xl font-bold text-gold">
              ₦{Number(account?.frozen_balance || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {completedTransactions.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {failedTransactions.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funds on Hold - Priority Section */}
      {holdTransactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              Funds on Hold ({holdTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge className="bg-gold text-white">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.purpose || '-'}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <FundReleaseModal 
                        transaction={transaction}
                        onReleaseComplete={fetchEscrowData}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Existing Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EscrowDashboard />
        <ServiceChargeOverview />
      </div>

      <PendingTransactionsManager 
        transactions={transactions}
        onTransactionsUpdated={fetchEscrowData}
      />

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <EscrowPaymentModal onPaymentComplete={fetchEscrowData} />
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Start by making a payment or deposit.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 10).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₦{transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'HELD' ? 'bg-gold text-white' :
                          transaction.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.purpose || '-'}</TableCell>
                    <TableCell>
                      {new Date(transaction.created_at).toLocaleDateString()}
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

export default EscrowHub;

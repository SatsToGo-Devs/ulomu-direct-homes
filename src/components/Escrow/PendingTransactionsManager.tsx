
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useEscrowActions } from '@/hooks/useEscrowActions';
import { EscrowTransaction } from '@/hooks/useEscrowData';
import { Trash2, AlertTriangle } from 'lucide-react';

interface PendingTransactionsManagerProps {
  transactions: EscrowTransaction[];
  onTransactionsUpdated: () => void;
}

const PendingTransactionsManager = ({ transactions, onTransactionsUpdated }: PendingTransactionsManagerProps) => {
  const { clearPendingTransactions, cancelPendingTransaction, loading } = useEscrowActions();
  
  const pendingTransactions = transactions.filter(t => t.status === 'PENDING');

  const handleClearAll = async () => {
    const success = await clearPendingTransactions();
    if (success) {
      onTransactionsUpdated();
    }
  };

  const handleCancelTransaction = async (transactionId: string) => {
    const success = await cancelPendingTransaction(transactionId);
    if (success) {
      onTransactionsUpdated();
    }
  };

  if (pendingTransactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Pending Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No pending transactions to manage.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-gold" />
            Pending Transactions ({pendingTransactions.length})
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                Clear All Pending
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Pending Transactions?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark all pending transactions as completed. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} disabled={loading}>
                  {loading ? 'Clearing...' : 'Clear All'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
            {pendingTransactions.map((transaction) => (
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will cancel this pending transaction. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleCancelTransaction(transaction.id)}
                          disabled={loading}
                        >
                          {loading ? 'Cancelling...' : 'Cancel Transaction'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PendingTransactionsManager;

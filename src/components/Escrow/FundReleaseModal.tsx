
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EscrowTransaction } from '@/hooks/useEscrowData';
import { Unlock } from 'lucide-react';

interface FundReleaseModalProps {
  transaction: EscrowTransaction;
  onReleaseComplete: () => void;
}

const FundReleaseModal = ({ transaction, onReleaseComplete }: FundReleaseModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');
  const { toast } = useToast();

  const handleReleaseFunds = async () => {
    try {
      setLoading(true);

      // Update transaction status to completed
      const { error: transactionError } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'COMPLETED',
          description: `${transaction.description || ''} - Released: ${releaseReason}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (transactionError) throw transactionError;

      // Update escrow account balance
      const { data: account, error: accountFetchError } = await supabase
        .from('escrow_accounts')
        .select('balance, frozen_balance')
        .eq('id', transaction.escrow_account_id)
        .single();

      if (accountFetchError) throw accountFetchError;

      const { error: balanceError } = await supabase
        .from('escrow_accounts')
        .update({
          balance: Number(account.balance) + Number(transaction.amount),
          frozen_balance: Number(account.frozen_balance) - Number(transaction.amount),
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.escrow_account_id);

      if (balanceError) throw balanceError;

      toast({
        title: "Success",
        description: "Funds released successfully!",
      });

      setOpen(false);
      setReleaseReason('');
      onReleaseComplete();
    } catch (error) {
      console.error('Error releasing funds:', error);
      toast({
        title: "Error",
        description: "Failed to release funds",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-forest hover:bg-forest/90">
          <Unlock className="h-4 w-4 mr-2" />
          Release Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Release Hold Funds</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Transaction Details</span>
              <Badge className="bg-gold text-white">
                {transaction.type}
              </Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">₦{transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Purpose:</span>
                <span>{transaction.purpose || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>{transaction.status}</span>
              </div>
              {transaction.description && (
                <div className="flex justify-between">
                  <span>Description:</span>
                  <span>{transaction.description}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="releaseReason">Release Reason</Label>
            <Textarea
              id="releaseReason"
              placeholder="Provide a reason for releasing these funds..."
              value={releaseReason}
              onChange={(e) => setReleaseReason(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReleaseFunds} 
              disabled={loading || !releaseReason.trim()}
              className="bg-forest hover:bg-forest/90"
            >
              {loading ? 'Releasing...' : 'Release Funds'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FundReleaseModal;

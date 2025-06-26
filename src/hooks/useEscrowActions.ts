
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useEscrowActions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const clearPendingTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // First get the user's escrow account ID
      const { data: escrowAccount, error: accountError } = await supabase
        .from('escrow_accounts')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (accountError) throw accountError;

      // Update all pending transactions to completed
      const { error } = await supabase
        .from('escrow_transactions')
        .update({ 
          status: 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('status', 'PENDING')
        .eq('escrow_account_id', escrowAccount.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All pending transactions have been cleared",
      });

      return true;
    } catch (error) {
      console.error('Error clearing pending transactions:', error);
      toast({
        title: "Error",
        description: "Failed to clear pending transactions",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelPendingTransaction = async (transactionId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('escrow_transactions')
        .update({ 
          status: 'FAILED',
          description: 'Cancelled by user',
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .eq('status', 'PENDING');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction cancelled successfully",
      });

      return true;
    } catch (error) {
      console.error('Error cancelling transaction:', error);
      toast({
        title: "Error",
        description: "Failed to cancel transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    clearPendingTransactions,
    cancelPendingTransaction,
    loading
  };
};

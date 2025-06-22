
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface EscrowAccount {
  id: string;
  user_id: string;
  balance: number;
  frozen_balance: number;
  account_type: string;
  created_at: string;
  updated_at: string;
}

export interface EscrowTransaction {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  escrow_account_id: string;
  amount: number;
  type: string;
  status: string;
  purpose?: string;
  description?: string;
  release_conditions?: string;
  scheduled_release?: string;
  created_at: string;
}

export interface ServiceCharge {
  id: string;
  unit_id: string;
  description: string;
  amount: number;
  frequency: string;
  next_due_date: string;
  status: string;
  escrow_held: number;
  created_at: string;
  units?: { unit_number: string; properties?: { name: string } };
}

export const useEscrowData = () => {
  const { user } = useAuth();
  const [account, setAccount] = useState<EscrowAccount | null>(null);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEscrowData();
    }
  }, [user]);

  const fetchEscrowData = async () => {
    try {
      setLoading(true);

      // Fetch or create escrow account
      let { data: accountData, error: accountError } = await supabase
        .from('escrow_accounts')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (accountError && accountError.code === 'PGRST116') {
        // Create account if it doesn't exist
        const { data: newAccount, error: createError } = await supabase
          .from('escrow_accounts')
          .insert([{ user_id: user?.id }])
          .select()
          .single();

        if (createError) throw createError;
        accountData = newAccount;
      } else if (accountError) {
        throw accountError;
      }

      setAccount(accountData);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('escrow_transactions')
        .select('*')
        .eq('escrow_account_id', accountData.id)
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

      // Fetch service charges
      const { data: serviceChargesData, error: serviceChargesError } = await supabase
        .from('service_charges')
        .select(`
          *,
          units(unit_number, properties(name))
        `)
        .order('next_due_date', { ascending: true });

      if (serviceChargesError) throw serviceChargesError;
      setServiceCharges(serviceChargesData || []);

    } catch (error) {
      console.error('Error fetching escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Partial<EscrowTransaction>) => {
    try {
      // Ensure required fields are present
      const completeTransactionData = {
        ...transactionData,
        escrow_account_id: account?.id || '',
        amount: transactionData.amount || 0,
        type: transactionData.type || 'DEPOSIT'
      };

      const { data, error } = await supabase
        .from('escrow_transactions')
        .insert([completeTransactionData])
        .select()
        .single();

      if (error) throw error;
      await fetchEscrowData();
      return data;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  };

  return {
    account,
    transactions,
    serviceCharges,
    loading,
    fetchEscrowData,
    createTransaction,
  };
};

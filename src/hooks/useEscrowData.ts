
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface EscrowAccount {
  id: string;
  user_id: string;
  balance: number;
  frozen_balance: number;
  account_type: string;
  role: string;
  wallet_id?: string;
  bank_details?: any;
  escrow_tier: string;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

export interface EscrowTransaction {
  id: string;
  from_user_id?: string;
  to_user_id?: string;
  payer_id?: string;
  payee_id?: string;
  escrow_account_id: string;
  property_id?: string;
  amount: number;
  type: string;
  status: string;
  purpose?: string;
  description?: string;
  release_condition?: string;
  release_conditions?: string;
  scheduled_release?: string;
  auto_release_date?: string;
  service_fee: number;
  evidence_urls?: string[];
  completion_confirmed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EscrowRule {
  id: string;
  transaction_type: string;
  release_condition: string;
  release_days: number;
  dispute_allowed: boolean;
  auto_release: boolean;
  created_at: string;
  updated_at: string;
}

export interface EscrowDispute {
  id: string;
  transaction_id: string;
  raised_by: string;
  reason: string;
  status: string;
  resolution_note?: string;
  resolved_by?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  trust_score: number;
  completion_rate: number;
  total_jobs: number;
  wallet_address?: string;
  specialties?: string[];
  verification_status: string;
  created_at: string;
  updated_at: string;
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
  const [escrowRules, setEscrowRules] = useState<EscrowRule[]>([]);
  const [disputes, setDisputes] = useState<EscrowDispute[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
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

      // Fetch transactions (both as payer and payee)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('escrow_transactions')
        .select('*')
        .or(`escrow_account_id.eq.${accountData.id},payer_id.eq.${user?.id},payee_id.eq.${user?.id}`)
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

      // Fetch escrow rules
      const { data: rulesData, error: rulesError } = await supabase
        .from('escrow_rules')
        .select('*');

      if (rulesError) throw rulesError;
      setEscrowRules(rulesData || []);

      // Fetch disputes
      const { data: disputesData, error: disputesError } = await supabase
        .from('escrow_disputes')
        .select('*')
        .order('created_at', { ascending: false });

      if (disputesError) throw disputesError;
      setDisputes(disputesData || []);

      // Fetch vendor profile if user is a vendor
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (vendorError && vendorError.code !== 'PGRST116') {
        console.error('Error fetching vendor profile:', vendorError);
      } else if (vendorData) {
        setVendorProfile(vendorData);
      }

    } catch (error) {
      console.error('Error fetching escrow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (transactionData: Partial<EscrowTransaction>) => {
    try {
      const completeTransactionData = {
        ...transactionData,
        escrow_account_id: account?.id || '',
        amount: transactionData.amount || 0,
        type: transactionData.type || 'DEPOSIT',
        service_fee: transactionData.service_fee || 0,
        completion_confirmed: false
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

  const createDispute = async (transactionId: string, reason: string) => {
    try {
      const { data, error } = await supabase
        .from('escrow_disputes')
        .insert([{
          transaction_id: transactionId,
          raised_by: user?.id,
          reason
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchEscrowData();
      return data;
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  };

  const updateVendorProfile = async (profileData: Partial<VendorProfile>) => {
    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .upsert([{
          user_id: user?.id,
          ...profileData
        }])
        .select()
        .single();

      if (error) throw error;
      setVendorProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating vendor profile:', error);
      throw error;
    }
  };

  return {
    account,
    transactions,
    serviceCharges,
    escrowRules,
    disputes,
    vendorProfile,
    loading,
    fetchEscrowData,
    createTransaction,
    createDispute,
    updateVendorProfile,
  };
};

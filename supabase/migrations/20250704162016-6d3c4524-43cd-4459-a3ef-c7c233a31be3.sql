
-- Add role-based escrow account types and enhanced fields
ALTER TABLE public.escrow_accounts 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'TENANT',
ADD COLUMN IF NOT EXISTS wallet_id text,
ADD COLUMN IF NOT EXISTS bank_details jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS escrow_tier text DEFAULT 'BASIC',
ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 0.8;

-- Update escrow_transactions with enhanced fields
ALTER TABLE public.escrow_transactions 
ADD COLUMN IF NOT EXISTS payer_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS payee_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS property_id uuid REFERENCES public.properties(id),
ADD COLUMN IF NOT EXISTS service_fee numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS release_condition text,
ADD COLUMN IF NOT EXISTS auto_release_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS evidence_urls text[],
ADD COLUMN IF NOT EXISTS completion_confirmed boolean DEFAULT false;

-- Create escrow_rules table for smart release conditions
CREATE TABLE IF NOT EXISTS public.escrow_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_type text NOT NULL,
  release_condition text NOT NULL,
  release_days integer DEFAULT 7,
  dispute_allowed boolean DEFAULT true,
  auto_release boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create escrow_disputes table for dispute handling
CREATE TABLE IF NOT EXISTS public.escrow_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.escrow_transactions(id) ON DELETE CASCADE NOT NULL,
  raised_by uuid REFERENCES auth.users(id) NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'OPEN',
  resolution_note text,
  resolved_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create vendor_profiles table for vendor trust scoring
CREATE TABLE IF NOT EXISTS public.vendor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trust_score numeric DEFAULT 0.8,
  completion_rate numeric DEFAULT 100.0,
  total_jobs integer DEFAULT 0,
  wallet_address text,
  specialties text[],
  verification_status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create escrow_receipts table for financial transparency
CREATE TABLE IF NOT EXISTS public.escrow_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.escrow_transactions(id) ON DELETE CASCADE NOT NULL,
  receipt_type text NOT NULL, -- PAYMENT, RELEASE, REFUND
  amount numeric NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) NOT NULL,
  receipt_data jsonb DEFAULT '{}',
  generated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.escrow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_receipts ENABLE ROW LEVEL SECURITY;

-- RLS policies for escrow_rules (admin managed)
CREATE POLICY "Everyone can view escrow rules" ON public.escrow_rules
  FOR SELECT USING (true);

-- RLS policies for escrow_disputes
CREATE POLICY "Users can view relevant disputes" ON public.escrow_disputes
  FOR SELECT USING (
    raised_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.escrow_transactions et
      WHERE et.id = escrow_disputes.transaction_id 
      AND (et.payer_id = auth.uid() OR et.payee_id = auth.uid())
    )
  );

CREATE POLICY "Users can create disputes" ON public.escrow_disputes
  FOR INSERT WITH CHECK (raised_by = auth.uid());

-- RLS policies for vendor_profiles
CREATE POLICY "Users can view verified vendor profiles" ON public.vendor_profiles
  FOR SELECT USING (verification_status = 'VERIFIED' OR user_id = auth.uid());

CREATE POLICY "Users can manage their vendor profile" ON public.vendor_profiles
  FOR ALL USING (user_id = auth.uid());

-- RLS policies for escrow_receipts
CREATE POLICY "Users can view their receipts" ON public.escrow_receipts
  FOR SELECT USING (
    recipient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.escrow_transactions et
      WHERE et.id = escrow_receipts.transaction_id 
      AND (et.payer_id = auth.uid() OR et.payee_id = auth.uid())
    )
  );

-- Insert default escrow rules
INSERT INTO public.escrow_rules (transaction_type, release_condition, release_days, auto_release) VALUES
('RENT', 'SCHEDULED_RELEASE', 30, true),
('DEPOSIT', 'MANUAL_RELEASE', 90, false),
('MAINTENANCE', 'COMPLETION_CONFIRMED', 7, true),
('SERVICE_CHARGE', 'AUTOMATIC', 3, true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_payer_payee ON public.escrow_transactions(payer_id, payee_id);
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_property ON public.escrow_transactions(property_id);
CREATE INDEX IF NOT EXISTS idx_escrow_disputes_transaction ON public.escrow_disputes(transaction_id);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_trust_score ON public.vendor_profiles(trust_score DESC);

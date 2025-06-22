
-- Create escrow accounts table
CREATE TABLE IF NOT EXISTS public.escrow_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  balance numeric DEFAULT 0,
  frozen_balance numeric DEFAULT 0,
  account_type text DEFAULT 'GENERAL',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create escrow transactions table
CREATE TABLE IF NOT EXISTS public.escrow_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  to_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  escrow_account_id uuid REFERENCES public.escrow_accounts(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL, -- DEPOSIT, WITHDRAWAL, TRANSFER, HOLD, RELEASE
  status text DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, HELD
  purpose text, -- SERVICE_CHARGE, MAINTENANCE, RENT
  description text,
  release_conditions text,
  scheduled_release timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create service charges table
CREATE TABLE IF NOT EXISTS public.service_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  frequency text DEFAULT 'MONTHLY', -- MONTHLY, QUARTERLY, ANNUAL
  next_due_date timestamp with time zone NOT NULL,
  status text DEFAULT 'ACTIVE', -- ACTIVE, PAID, OVERDUE
  escrow_held numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create service charge payments table
CREATE TABLE IF NOT EXISTS public.service_charge_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_charge_id uuid REFERENCES public.service_charges(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_date timestamp with time zone DEFAULT now(),
  status text DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED
  escrow_released boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create AI predictions table
CREATE TABLE IF NOT EXISTS public.ai_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  prediction_type text NOT NULL, -- MAINTENANCE, VACANCY, EXPENSE, REVENUE
  title text NOT NULL,
  description text NOT NULL,
  predicted_date timestamp with time zone,
  confidence_score numeric DEFAULT 0.8,
  estimated_cost numeric,
  prevention_actions text[],
  data_sources text[], -- What data was used for prediction
  status text DEFAULT 'ACTIVE', -- ACTIVE, RESOLVED, DISMISSED
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create AI generated content table
CREATE TABLE IF NOT EXISTS public.ai_generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL, -- REQUEST, REPLY, NOTIFICATION, DOCUMENT
  original_prompt text,
  generated_content text NOT NULL,
  context_data jsonb, -- Store related IDs and metadata
  used_at timestamp with time zone,
  feedback_rating integer, -- 1-5 rating
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create maintenance work progress table
CREATE TABLE IF NOT EXISTS public.maintenance_work_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  maintenance_request_id uuid REFERENCES public.maintenance_requests(id) ON DELETE CASCADE NOT NULL,
  progress_percentage integer DEFAULT 0,
  status_update text,
  work_description text,
  images text[],
  vendor_name text,
  escrow_amount numeric DEFAULT 0,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_charge_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_work_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for escrow accounts
CREATE POLICY "Users can view their own escrow accounts" ON public.escrow_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own escrow accounts" ON public.escrow_accounts
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for escrow transactions
CREATE POLICY "Users can view relevant escrow transactions" ON public.escrow_transactions
  FOR SELECT USING (
    from_user_id = auth.uid() OR 
    to_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.escrow_accounts 
      WHERE id = escrow_transactions.escrow_account_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create escrow transactions" ON public.escrow_transactions
  FOR INSERT WITH CHECK (
    from_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.escrow_accounts 
      WHERE id = escrow_transactions.escrow_account_id AND user_id = auth.uid()
    )
  );

-- RLS policies for service charges
CREATE POLICY "Users can view service charges for their units" ON public.service_charges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON u.property_id = p.id
      WHERE u.id = service_charges.unit_id 
      AND (p.user_id = auth.uid() OR u.tenant_id = auth.uid())
    )
  );

CREATE POLICY "Property owners can manage service charges" ON public.service_charges
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.units u
      JOIN public.properties p ON u.property_id = p.id
      WHERE u.id = service_charges.unit_id AND p.user_id = auth.uid()
    )
  );

-- RLS policies for AI predictions
CREATE POLICY "Users can view their AI predictions" ON public.ai_predictions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI predictions" ON public.ai_predictions
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for AI generated content
CREATE POLICY "Users can view their AI generated content" ON public.ai_generated_content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI generated content" ON public.ai_generated_content
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for maintenance work progress
CREATE POLICY "Users can view relevant maintenance work progress" ON public.maintenance_work_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.maintenance_requests mr
      JOIN public.properties p ON mr.property_id = p.id
      WHERE mr.id = maintenance_work_progress.maintenance_request_id
      AND (p.user_id = auth.uid() OR mr.tenant_id = auth.uid())
    )
  );

CREATE POLICY "Property owners can update maintenance work progress" ON public.maintenance_work_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.maintenance_requests mr
      JOIN public.properties p ON mr.property_id = p.id
      WHERE mr.id = maintenance_work_progress.maintenance_request_id
      AND p.user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_user_id ON public.escrow_transactions(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_service_charges_unit_id ON public.service_charges(unit_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_property_id ON public.ai_predictions(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_work_progress_request_id ON public.maintenance_work_progress(maintenance_request_id);

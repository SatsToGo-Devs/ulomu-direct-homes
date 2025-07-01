
-- Create a proper tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for tenants table
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Create policies for tenants
CREATE POLICY "Users can view their own tenants" 
  ON public.tenants 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tenants" 
  ON public.tenants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tenants" 
  ON public.tenants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tenants" 
  ON public.tenants 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Update units table to properly reference tenants
ALTER TABLE public.units 
ADD CONSTRAINT fk_units_tenant 
FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;

-- Add RLS policies for properties table
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own properties" 
  ON public.properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own properties" 
  ON public.properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" 
  ON public.properties 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" 
  ON public.properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view units of their properties" 
  ON public.units 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = units.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can create units for their properties" 
  ON public.units 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = units.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can update units of their properties" 
  ON public.units 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = units.property_id 
    AND properties.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete units of their properties" 
  ON public.units 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.properties 
    WHERE properties.id = units.property_id 
    AND properties.user_id = auth.uid()
  ));

-- Add RLS policies for escrow tables
ALTER TABLE public.escrow_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own escrow accounts" 
  ON public.escrow_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own escrow accounts" 
  ON public.escrow_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own escrow accounts" 
  ON public.escrow_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their escrow transactions" 
  ON public.escrow_transactions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.escrow_accounts 
    WHERE escrow_accounts.id = escrow_transactions.escrow_account_id 
    AND escrow_accounts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create escrow transactions for their accounts" 
  ON public.escrow_transactions 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.escrow_accounts 
    WHERE escrow_accounts.id = escrow_transactions.escrow_account_id 
    AND escrow_accounts.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their escrow transactions" 
  ON public.escrow_transactions 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.escrow_accounts 
    WHERE escrow_accounts.id = escrow_transactions.escrow_account_id 
    AND escrow_accounts.user_id = auth.uid()
  ));

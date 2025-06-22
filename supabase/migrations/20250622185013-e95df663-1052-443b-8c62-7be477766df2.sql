
-- Extend profiles table with additional user information
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  city text,
  state text,
  country text,
  property_type text DEFAULT 'RESIDENTIAL',
  size numeric,
  units_count integer DEFAULT 1,
  description text,
  amenities text[],
  images text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create units table
CREATE TABLE IF NOT EXISTS public.units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  unit_number text NOT NULL,
  rent_amount numeric NOT NULL,
  deposit_amount numeric,
  status text DEFAULT 'VACANT',
  tenant_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  lease_start_date date,
  lease_end_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create maintenance requests table
CREATE TABLE IF NOT EXISTS public.maintenance_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  priority text DEFAULT 'MEDIUM',
  status text DEFAULT 'PENDING',
  category text,
  estimated_cost numeric,
  actual_cost numeric,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  scheduled_date timestamp with time zone,
  completed_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  unit_id uuid REFERENCES public.units(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  landlord_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_type text DEFAULT 'RENT',
  payment_method text,
  status text DEFAULT 'PENDING',
  due_date date,
  paid_date timestamp with time zone,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create AI insights table
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES public.properties(id) ON DELETE CASCADE,
  insight_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  confidence_score numeric DEFAULT 0.8,
  status text DEFAULT 'ACTIVE',
  priority text DEFAULT 'MEDIUM',
  recommended_action text,
  estimated_savings numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for properties
CREATE POLICY "Users can view their own properties" ON public.properties
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for units
CREATE POLICY "Users can view units of their properties" ON public.units
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = units.property_id AND user_id = auth.uid()
    ) OR tenant_id = auth.uid()
  );

CREATE POLICY "Property owners can manage units" ON public.units
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = units.property_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for maintenance requests
CREATE POLICY "Users can view relevant maintenance requests" ON public.maintenance_requests
  FOR SELECT USING (
    tenant_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = maintenance_requests.property_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can create maintenance requests" ON public.maintenance_requests
  FOR INSERT WITH CHECK (tenant_id = auth.uid());

CREATE POLICY "Property owners can update maintenance requests" ON public.maintenance_requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = maintenance_requests.property_id AND user_id = auth.uid()
    )
  );

-- Create RLS policies for payments
CREATE POLICY "Users can view relevant payments" ON public.payments
  FOR SELECT USING (
    tenant_id = auth.uid() OR landlord_id = auth.uid()
  );

CREATE POLICY "Landlords can create payment records" ON public.payments
  FOR INSERT WITH CHECK (landlord_id = auth.uid());

CREATE POLICY "Landlords can update payment records" ON public.payments
  FOR UPDATE USING (landlord_id = auth.uid());

-- Create RLS policies for AI insights
CREATE POLICY "Users can view their AI insights" ON public.ai_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their AI insights" ON public.ai_insights
  FOR ALL USING (auth.uid() = user_id);

-- Update the handle_new_user function to include phone from user metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, company_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'company_name',
    NEW.phone
  );
  RETURN NEW;
END;
$$;

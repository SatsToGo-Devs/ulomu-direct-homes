
-- Create vendor onboarding workflow table
CREATE TABLE IF NOT EXISTS public.vendor_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step text NOT NULL DEFAULT 'PROFILE_INFO', -- PROFILE_INFO, SPECIALTIES, VERIFICATION, COMPLETED
  profile_data jsonb DEFAULT '{}',
  documents_uploaded text[],
  verification_notes text,
  admin_reviewer_id uuid REFERENCES auth.users(id),
  submitted_at timestamp with time zone,
  approved_at timestamp with time zone,
  rejected_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Update vendors table to add more onboarding fields
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS business_license text,
ADD COLUMN IF NOT EXISTS insurance_cert text,
ADD COLUMN IF NOT EXISTS portfolio_images text[],
ADD COLUMN IF NOT EXISTS service_areas text[],
ADD COLUMN IF NOT EXISTS hourly_rate numeric,
ADD COLUMN IF NOT EXISTS availability_schedule jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Create vendor applications table for tracking vendor requests
CREATE TABLE IF NOT EXISTS public.vendor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  business_name text NOT NULL,
  contact_person text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  business_address text,
  years_experience integer,
  specialties text[] NOT NULL,
  portfolio_description text,
  references jsonb DEFAULT '[]',
  application_status text DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, UNDER_REVIEW  
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.vendor_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for vendor_onboarding
CREATE POLICY "Users can manage their own onboarding" ON public.vendor_onboarding
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all onboarding records" ON public.vendor_onboarding
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for vendor_applications
CREATE POLICY "Users can manage their own applications" ON public.vendor_applications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all applications" ON public.vendor_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create user_roles table if it doesn't exist (for role-based access)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'tenant', -- tenant, landlord, vendor, admin
  assigned_at timestamp with time zone DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vendor_onboarding_user ON public.vendor_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_onboarding_step ON public.vendor_onboarding(step);
CREATE INDEX IF NOT EXISTS idx_vendor_applications_status ON public.vendor_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);

-- Insert default admin role (you'll need to update this with actual admin user ID)
-- INSERT INTO public.user_roles (user_id, role) VALUES ('your-admin-user-id', 'admin');


-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialties TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0.00,
  verified BOOLEAN DEFAULT false,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policies for vendors
CREATE POLICY "Users can view all verified vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (verified = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own vendor profiles" 
  ON public.vendors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendor profiles" 
  ON public.vendors 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create vendor reviews table
CREATE TABLE public.vendor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  maintenance_request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for vendor reviews
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view vendor reviews" 
  ON public.vendor_reviews 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create reviews for completed work" 
  ON public.vendor_reviews 
  FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

-- Update maintenance_requests table to include vendor assignment
ALTER TABLE public.maintenance_requests 
ADD COLUMN vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL;

-- Create chat messages table for tenant support
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  maintenance_request_id UUID REFERENCES public.maintenance_requests(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat messages" 
  ON public.chat_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create system diagnostics table
CREATE TABLE public.system_diagnostics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  test_type TEXT NOT NULL,
  test_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('passed', 'failed', 'warning')) NOT NULL,
  details JSONB DEFAULT '{}',
  execution_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for system diagnostics
ALTER TABLE public.system_diagnostics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagnostic results" 
  ON public.system_diagnostics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create diagnostic records" 
  ON public.system_diagnostics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add real-time subscriptions for tables
ALTER TABLE public.maintenance_requests REPLICA IDENTITY FULL;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.escrow_transactions REPLICA IDENTITY FULL;
ALTER TABLE public.vendors REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.escrow_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;

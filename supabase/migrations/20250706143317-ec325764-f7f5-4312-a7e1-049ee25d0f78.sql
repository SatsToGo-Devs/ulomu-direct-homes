
-- Enhanced AI insights table with role-specific predictions
CREATE TABLE IF NOT EXISTS public.ai_role_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'landlord', 'tenant', 'vendor')),
  insight_category TEXT NOT NULL CHECK (insight_category IN ('performance', 'financial', 'maintenance', 'tenant_satisfaction', 'market_trends', 'operational')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score NUMERIC DEFAULT 0.8 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  impact_level TEXT DEFAULT 'MEDIUM' CHECK (impact_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  recommended_actions TEXT[],
  estimated_savings NUMERIC DEFAULT 0,
  time_frame TEXT DEFAULT '30_DAYS' CHECK (time_frame IN ('7_DAYS', '30_DAYS', '90_DAYS', '1_YEAR')),
  data_points JSONB DEFAULT '{}',
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'DISMISSED')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time maintenance coordination table
CREATE TABLE IF NOT EXISTS public.maintenance_coordination (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maintenance_request_id UUID REFERENCES maintenance_requests(id) NOT NULL,
  coordinator_id UUID REFERENCES auth.users NOT NULL,
  assigned_vendor_id UUID REFERENCES vendors(id),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  priority_level TEXT DEFAULT 'MEDIUM' CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
  estimated_duration TEXT,
  actual_duration TEXT,
  coordination_notes TEXT,
  tenant_notifications_sent BOOLEAN DEFAULT false,
  landlord_notifications_sent BOOLEAN DEFAULT false,
  vendor_notifications_sent BOOLEAN DEFAULT false,
  real_time_updates JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Smart notification templates
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name TEXT NOT NULL UNIQUE,
  target_roles TEXT[] NOT NULL,
  trigger_conditions JSONB NOT NULL,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('maintenance', 'escrow', 'vendor', 'system', 'ai_insight')),
  auto_send BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI dashboard metrics for role-specific insights
CREATE TABLE IF NOT EXISTS public.ai_dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  comparison_period TEXT DEFAULT '30_DAYS',
  trend_direction TEXT CHECK (trend_direction IN ('UP', 'DOWN', 'STABLE')),
  trend_percentage NUMERIC,
  benchmark_value NUMERIC,
  data_source TEXT NOT NULL,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on new tables
ALTER TABLE public.ai_role_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maintenance_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_role_insights
CREATE POLICY "Users can view their role insights" ON public.ai_role_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create role insights" ON public.ai_role_insights
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their insights status" ON public.ai_role_insights
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for maintenance_coordination
CREATE POLICY "Users can view relevant coordination" ON public.maintenance_coordination
  FOR SELECT USING (
    auth.uid() = coordinator_id OR 
    EXISTS (
      SELECT 1 FROM maintenance_requests mr 
      WHERE mr.id = maintenance_request_id 
      AND (mr.tenant_id = auth.uid() OR EXISTS (
        SELECT 1 FROM properties p 
        WHERE p.id = mr.property_id AND p.user_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Coordinators can manage coordination" ON public.maintenance_coordination
  FOR ALL USING (auth.uid() = coordinator_id);

-- RLS Policies for notification_templates
CREATE POLICY "Everyone can view notification templates" ON public.notification_templates
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage templates" ON public.notification_templates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for ai_dashboard_metrics
CREATE POLICY "Users can view their metrics" ON public.ai_dashboard_metrics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create metrics" ON public.ai_dashboard_metrics
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_ai_role_insights_user_role ON public.ai_role_insights(user_id, role);
CREATE INDEX idx_ai_role_insights_status ON public.ai_role_insights(status, created_at DESC);
CREATE INDEX idx_maintenance_coordination_request ON public.maintenance_coordination(maintenance_request_id);
CREATE INDEX idx_maintenance_coordination_status ON public.maintenance_coordination(status, created_at DESC);
CREATE INDEX idx_ai_dashboard_metrics_user_type ON public.ai_dashboard_metrics(user_id, metric_type);
CREATE INDEX idx_notification_templates_roles ON public.notification_templates USING GIN(target_roles);

-- Enable realtime for coordination updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.maintenance_coordination;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_role_insights;

-- Insert default notification templates
INSERT INTO public.notification_templates (template_name, target_roles, trigger_conditions, title_template, message_template, notification_type, priority) VALUES
('maintenance_assigned', '["tenant", "landlord"]', '{"event": "maintenance_assigned"}', 'Maintenance Request Assigned', 'Your maintenance request "{{title}}" has been assigned to {{vendor_name}}. Expected completion: {{estimated_duration}}.', 'maintenance', 'medium'),
('ai_insight_generated', '["admin", "landlord", "vendor", "tenant"]', '{"event": "ai_insight_created", "impact_level": "HIGH"}', 'New AI Insight Available', 'We''ve identified a {{insight_category}} opportunity: {{title}}. Potential savings: ${{estimated_savings}}.', 'ai_insight', 'high'),
('maintenance_urgent', '["landlord", "admin"]', '{"priority": "EMERGENCY"}', 'Emergency Maintenance Required', 'Emergency maintenance request: {{title}} at {{property_name}}. Immediate attention required.', 'maintenance', 'urgent'),
('vendor_opportunity', '["vendor"]', '{"event": "job_match"}', 'New Job Opportunity', 'A maintenance job matching your skills is available: {{title}} in {{location}}. Estimated value: ${{estimated_cost}}.', 'vendor', 'medium');

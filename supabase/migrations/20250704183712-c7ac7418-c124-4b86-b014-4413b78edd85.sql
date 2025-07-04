
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create a security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.check_user_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
$$;

-- Create new policies that don't cause recursion
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roles" 
ON public.user_roles 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (public.check_user_role(auth.uid(), 'admin'));

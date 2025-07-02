
-- Add 'visualizador' to the existing user_role enum
ALTER TYPE public.user_role ADD VALUE 'visualizador';

-- Update the function to handle the new role
CREATE OR REPLACE FUNCTION public.is_admin_financeiro_or_visualizador(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'financeiro', 'visualizador') FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Create function to check if user can only view (visualizador role)
CREATE OR REPLACE FUNCTION public.is_visualizador_only(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role = 'visualizador' FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Update policies to allow visualizadores to view data but not modify it
-- Keep existing policies for despesas and receitas SELECT (they already allow all users to view)
-- The existing INSERT/UPDATE/DELETE policies already restrict to admin/financeiro only

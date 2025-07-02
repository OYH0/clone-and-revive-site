
-- First, let's check the current enum values
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');

-- Update the enum to add 'visualizador' if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'visualizador' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')) THEN
        ALTER TYPE public.user_role ADD VALUE 'visualizador';
    END IF;
END $$;

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

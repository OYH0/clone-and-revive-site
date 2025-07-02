
-- Criar enum para os papéis de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'financeiro');

-- Adicionar coluna de papel na tabela profiles
ALTER TABLE public.profiles ADD COLUMN role public.user_role DEFAULT 'financeiro';

-- Atualizar usuários admin existentes para ter o papel 'admin'
UPDATE public.profiles SET role = 'admin' WHERE is_admin = true;

-- Criar função para verificar se usuário tem papel específico
CREATE OR REPLACE FUNCTION public.has_user_role(user_id uuid, required_role user_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role = required_role FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Criar função para verificar se usuário é admin ou financeiro
CREATE OR REPLACE FUNCTION public.is_admin_or_financeiro(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'financeiro') FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- Atualizar políticas RLS para usar os novos papéis
-- Despesas: Admin e Financeiro podem criar
DROP POLICY IF EXISTS "Only admins can create despesas" ON public.despesas;
DROP POLICY IF EXISTS "Users can insert despesas" ON public.despesas;
CREATE POLICY "Admin and Financeiro can create despesas" 
  ON public.despesas 
  FOR INSERT 
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

-- Receitas: Admin e Financeiro podem criar
DROP POLICY IF EXISTS "Only admins can create receitas" ON public.receitas;
DROP POLICY IF EXISTS "Users can insert receitas" ON public.receitas;
CREATE POLICY "Admin and Financeiro can create receitas" 
  ON public.receitas 
  FOR INSERT 
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

-- Permissões de tab: Apenas admins podem gerenciar
DROP POLICY IF EXISTS "Admins can view all tab permissions" ON public.user_tab_permissions;
DROP POLICY IF EXISTS "Admins can create tab permissions" ON public.user_tab_permissions;
DROP POLICY IF EXISTS "Admins can update tab permissions" ON public.user_tab_permissions;

CREATE POLICY "Only admins can view all tab permissions" 
  ON public.user_tab_permissions 
  FOR SELECT 
  USING (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can create tab permissions" 
  ON public.user_tab_permissions 
  FOR INSERT 
  WITH CHECK (has_user_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update tab permissions" 
  ON public.user_tab_permissions 
  FOR UPDATE 
  USING (has_user_role(auth.uid(), 'admin'));

-- Profiles: Apenas admins podem atualizar papéis
DROP POLICY IF EXISTS "Admins can update user roles" ON public.profiles;
CREATE POLICY "Only admins can update user roles" 
  ON public.profiles 
  FOR UPDATE 
  USING (has_user_role(auth.uid(), 'admin'));

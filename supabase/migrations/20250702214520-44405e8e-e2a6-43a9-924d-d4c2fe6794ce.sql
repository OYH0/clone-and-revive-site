
-- Adicionar 'visualizador' ao enum de papéis de usuário
ALTER TYPE public.user_role ADD VALUE 'visualizador';

-- Atualizar a função para verificar se usuário é admin, financeiro ou visualizador
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

-- Criar função específica para verificar se usuário pode apenas visualizar
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

-- Atualizar políticas para permitir visualizadores verem dados, mas não modificarem

-- Despesas: Visualizadores podem ver, mas não criar
DROP POLICY IF EXISTS "Admin and Financeiro can create despesas" ON public.despesas;
CREATE POLICY "Admin and Financeiro can create despesas" 
  ON public.despesas 
  FOR INSERT 
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

-- Receitas: Visualizadores podem ver, mas não criar  
DROP POLICY IF EXISTS "Admin and Financeiro can create receitas" ON public.receitas;
CREATE POLICY "Admin and Financeiro can create receitas" 
  ON public.receitas 
  FOR INSERT 
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

-- Políticas de UPDATE e DELETE devem permitir apenas admin e financeiro
DROP POLICY IF EXISTS "Users can update own despesas, admins can update any" ON public.despesas;
CREATE POLICY "Admin and Financeiro can update despesas" 
  ON public.despesas 
  FOR UPDATE 
  USING (is_admin_or_financeiro(auth.uid()))
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

DROP POLICY IF EXISTS "Users can delete own despesas, admins can delete any" ON public.despesas;
CREATE POLICY "Admin and Financeiro can delete despesas" 
  ON public.despesas 
  FOR DELETE 
  USING (is_admin_or_financeiro(auth.uid()));

DROP POLICY IF EXISTS "Users can update own receitas, admins can update any" ON public.receitas;
CREATE POLICY "Admin and Financeiro can update receitas" 
  ON public.receitas 
  FOR UPDATE 
  USING (is_admin_or_financeiro(auth.uid()))
  WITH CHECK (is_admin_or_financeiro(auth.uid()));

DROP POLICY IF EXISTS "Users can delete own receitas, admins can delete any" ON public.receitas;
CREATE POLICY "Admin and Financeiro can delete receitas" 
  ON public.receitas 
  FOR DELETE 
  USING (is_admin_or_financeiro(auth.uid()));

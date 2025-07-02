
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'financeiro';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserRole = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar informações do usuário",
          variant: "destructive"
        });
      } else {
        setRole(data?.role || 'financeiro');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user?.id]);

  const isAdmin = role === 'admin';
  const isFinanceiro = role === 'financeiro';
  const canAccessAdmin = isAdmin;
  const canManageFinances = isAdmin || isFinanceiro;

  return {
    role,
    loading,
    isAdmin,
    isFinanceiro,
    canAccessAdmin,
    canManageFinances,
    refetch: fetchUserRole
  };
};

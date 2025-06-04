
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Despesa {
  id: number;
  data: string;
  valor: number;
  empresa: string;
  descricao: string;
  categoria: string;
  data_vencimento?: string;
  user_id: string;
}

export const useDespesas = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['despesas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching despesas from Supabase for user:', user.id);
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });
      
      if (error) {
        console.error('Error fetching despesas:', error);
        throw error;
      }
      
      console.log('Despesas fetched:', data);
      return data as Despesa[];
    },
    enabled: !!user,
  });
};

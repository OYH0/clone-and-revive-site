
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Despesa {
  id: number;
  data: string;
  valor: number;
  empresa: string;
  descricao: string;
  categoria: string;
}

export const useDespesas = () => {
  return useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      console.log('Fetching despesas from Supabase...');
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) {
        console.error('Error fetching despesas:', error);
        throw error;
      }
      
      console.log('Despesas fetched:', data);
      return data as Despesa[];
    },
  });
};

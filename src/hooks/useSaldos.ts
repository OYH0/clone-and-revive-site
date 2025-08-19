import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Saldo {
  id: number;
  tipo: 'conta' | 'cofre';
  valor: number;
}

export const useSaldos = () => {
  return useQuery({
    queryKey: ['saldos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('saldos')
        .select('*')
        .order('tipo');
      
      if (error) throw error;
      return data as Saldo[];
    }
  });
};

export const useUpdateSaldo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ tipo, valor }: { tipo: 'conta' | 'cofre'; valor: number }) => {
      // Get current saldo
      const { data: currentSaldo, error: fetchError } = await supabase
        .from('saldos')
        .select('*')
        .eq('tipo', tipo)
        .single();

      if (fetchError) throw fetchError;

      // Update with new value
      const newValor = (currentSaldo.valor || 0) + valor;
      
      const { data, error } = await supabase
        .from('saldos')
        .update({ valor: newValor })
        .eq('tipo', tipo)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saldos'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar saldo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar saldo',
        variant: 'destructive',
      });
    },
  });
};
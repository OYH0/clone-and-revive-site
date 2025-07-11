
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export interface Despesa {
  id: number;
  data: string | null;
  valor: number;
  empresa: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  data_vencimento?: string;
  comprovante?: string;
  status?: string;
  user_id: string;
  valor_juros?: number;
  valor_total?: number;
}

export const useDespesas = () => {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      console.log('Fetching despesas from Supabase - ordenando por data_vencimento');
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data_vencimento', { ascending: true, nullsFirst: false })
        .order('data', { ascending: false, nullsFirst: false });
      
      if (error) {
        console.error('Error fetching despesas:', error);
        throw error;
      }
      
      console.log('Despesas fetched successfully:', data?.length || 0, 'records');
      console.log('Primeiras 5 despesas com data_vencimento:', data?.slice(0, 5).map(d => ({
        id: d.id,
        empresa: d.empresa,
        data_vencimento: d.data_vencimento,
        data: d.data,
        valor: d.valor
      })));
      
      return data as Despesa[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized calculations for better performance
  const processedData = useMemo(() => {
    if (!query.data) return { despesas: [], stats: null };

    const despesas = query.data;
    const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
    const totalPagas = despesas
      .filter(d => d.status === 'PAGO')
      .reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
    const totalPendentes = despesas
      .filter(d => d.status !== 'PAGO')
      .reduce((sum, d) => sum + (d.valor || 0), 0);

    return {
      despesas,
      stats: {
        total: totalDespesas,
        pagas: totalPagas,
        pendentes: totalPendentes,
        count: despesas.length,
        pagasCount: despesas.filter(d => d.status === 'PAGO').length,
        pendentesCount: despesas.filter(d => d.status !== 'PAGO').length,
      }
    };
  }, [query.data]);

  return {
    ...query,
    data: processedData.despesas,
    stats: processedData.stats,
  };
};

export const useCreateDespesa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (despesa: Omit<Despesa, 'id' | 'user_id'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Creating despesa for user:', user.id);
      
      // Validate required fields
      if (!despesa.valor || despesa.valor <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      if (!despesa.descricao?.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!despesa.empresa?.trim()) {
        throw new Error('Empresa é obrigatória');
      }

      const { data, error } = await supabase
        .from('despesas')
        .insert([{ ...despesa, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating despesa:', error);
        throw error;
      }
      
      console.log('Despesa created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: "Sucesso",
        description: "Despesa criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar despesa:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDespesa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...despesa }: Partial<Despesa> & { id: number }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Updating despesa:', id);

      const { data, error } = await supabase
        .from('despesas')
        .update({ ...despesa, user_id: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating despesa:', error);
        throw error;
      }
      
      console.log('Despesa updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: "Sucesso",
        description: "Despesa atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar despesa:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDespesa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Deleting despesa:', id);
      const { error } = await supabase
        .from('despesas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting despesa:', error);
        throw error;
      }
      
      console.log('Despesa deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['despesas'] });
      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir despesa:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

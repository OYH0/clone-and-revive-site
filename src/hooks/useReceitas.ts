import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export interface Receita {
  id: number;
  data: string;
  valor: number;
  data_recebimento?: string;
  descricao: string;
  empresa: string;
  categoria: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useReceitas = () => {
  const { user } = useAuth();
  
  const query = useQuery({
    queryKey: ['receitas'],
    queryFn: async () => {
      console.log('Fetching receitas from Supabase');
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('data', { ascending: false });

      if (error) {
        console.error('Error fetching receitas:', error);
        throw error;
      }
      
      console.log('Receitas fetched successfully:', data?.length || 0, 'records');
      return data as Receita[];
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Memoized calculations for better performance
  const processedData = useMemo(() => {
    if (!query.data) return { receitas: [], stats: null };

    const receitas = query.data;
    
    // Filtrar receitas para excluir as de pagamento de despesas (receitas negativas criadas automaticamente)
    const receitasFiltradas = receitas.filter(r => 
      !r.categoria?.startsWith('PAGAMENTO_DESPESA_') && 
      r.categoria !== 'PAGAMENTO_DESPESA' &&
      !r.descricao?.startsWith('Pagamento de despesa:') &&
      !r.descricao?.startsWith('Pagamento:')
    );
    
    // Separar receitas por categoria (usando receitas filtradas para exibição)
    const receitasNormais = receitasFiltradas.filter(r => r.categoria !== 'EM_COFRE' && r.categoria !== 'EM_CONTA');
    
    // Para os cálculos de cofre e conta, incluir TODAS as receitas (incluindo pagamentos de despesas)
    const receitasCofre = receitas.filter(r => 
      r.categoria === 'EM_COFRE' || 
      r.categoria === 'PAGAMENTO_DESPESA_EM_COFRE' ||
      r.categoria?.includes('EM_COFRE')
    );
    const receitasConta = receitas.filter(r => 
      r.categoria === 'EM_CONTA' || 
      r.categoria === 'PAGAMENTO_DESPESA_EM_CONTA' ||
      r.categoria?.includes('EM_CONTA')
    );
    
    // Calcular totais das receitas normais (excluindo cofre e conta)
    const totalReceitas = receitasNormais.reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalRecebidas = receitasNormais
      .filter(r => r.data_recebimento)
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalPendentes = receitasNormais
      .filter(r => !r.data_recebimento)
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    
    // Calcular totais de cofre e conta (incluindo TODOS os pagamentos de despesas)
    const totalCofre = receitasCofre.reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalConta = receitasConta.reduce((sum, r) => sum + (r.valor || 0), 0);

    return {
      receitas: receitasFiltradas, // Retornar apenas receitas filtradas (sem pagamentos de despesas)
      stats: {
        total: totalReceitas,
        recebidas: totalRecebidas,
        pendentes: totalPendentes,
        totalCofre,
        totalConta,
        count: receitasNormais.length,
        recebidasCount: receitasNormais.filter(r => r.data_recebimento).length,
        pendentesCount: receitasNormais.filter(r => !r.data_recebimento).length,
      }
    };
  }, [query.data]);

  return {
    ...query,
    data: processedData.receitas,
    stats: processedData.stats,
  };
};

export const useCreateReceita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (receita: Omit<Receita, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      // Validate required fields
      if (!receita.valor || receita.valor <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      if (!receita.descricao?.trim()) {
        throw new Error('Descrição é obrigatória');
      }
      if (!receita.empresa?.trim()) {
        throw new Error('Empresa é obrigatória');
      }
      
      const { data, error } = await supabase
        .from('receitas')
        .insert([{ ...receita, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating receita:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: "Sucesso",
        description: "Receita criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar receita:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReceita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...receita }: Partial<Receita> & { id: number }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('receitas')
        .update({ ...receita, user_id: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: "Sucesso",
        description: "Receita atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar receita:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteReceita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: number) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('receitas')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receitas'] });
      toast({
        title: "Sucesso",
        description: "Receita excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir receita:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir receita. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

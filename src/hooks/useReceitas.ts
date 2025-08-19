import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { useTotaisCofreConta } from './useTotaisCofreConta';

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
  const { data: totaisCofreConta } = useTotaisCofreConta();
  
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
    
    // Separar receitas por categoria
    const receitasNormais = receitas.filter(r => r.categoria !== 'EM_COFRE' && r.categoria !== 'EM_CONTA');
    const receitasCofre = receitas.filter(r => r.categoria === 'EM_COFRE');
    const receitasConta = receitas.filter(r => r.categoria === 'EM_CONTA');
    
    // Calcular totais das receitas normais (excluindo cofre e conta)
    const totalReceitas = receitasNormais.reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalRecebidas = receitasNormais
      .filter(r => r.data_recebimento)
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalPendentes = receitasNormais
      .filter(r => !r.data_recebimento)
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    
    // Usar os totais calculados considerando despesas pagas
    const totalCofre = totaisCofreConta?.totalCofre || 0;
    const totalConta = totaisCofreConta?.totalConta || 0;
    
    console.log('=== DEBUG useReceitas ===');
    console.log('totaisCofreConta recebido:', totaisCofreConta);
    console.log('Total Cofre final:', totalCofre);
    console.log('Total Conta final:', totalConta);
    
    // Debug: Recarregar quando não tiver dados
    if (!totaisCofreConta) {
      console.log('Dados de totaisCofreConta não disponíveis ainda...');
    } else {
      console.log('Dados de totaisCofreConta recebidos com sucesso!');
    }

    return {
      receitas,
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
  }, [query.data, totaisCofreConta]);

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
      queryClient.invalidateQueries({ queryKey: ['totais-cofre-conta'] });
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
      queryClient.invalidateQueries({ queryKey: ['totais-cofre-conta'] });
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
      queryClient.invalidateQueries({ queryKey: ['totais-cofre-conta'] });
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

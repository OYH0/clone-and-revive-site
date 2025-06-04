
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  
  return useQuery({
    queryKey: ['receitas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .eq('user_id', user.id)
        .order('data', { ascending: false });

      if (error) throw error;
      return data as Receita[];
    },
    enabled: !!user,
  });
};

export const useCreateReceita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (receita: Omit<Receita, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data, error } = await supabase
        .from('receitas')
        .insert([{ ...receita, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
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
        description: "Erro ao criar receita. Tente novamente.",
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
        .eq('user_id', user.id)
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
        .eq('id', id)
        .eq('user_id', user.id);

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

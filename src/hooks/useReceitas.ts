
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Receita {
  id: number;
  data: string;
  valor: number;
  data_recebimento?: string;
  descricao: string;
  empresa: string;
  categoria: string;
  created_at?: string;
  updated_at?: string;
}

export const useReceitas = () => {
  return useQuery({
    queryKey: ['receitas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receitas')
        .select('*')
        .order('data', { ascending: false });

      if (error) throw error;
      return data as Receita[];
    },
  });
};

export const useCreateReceita = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (receita: Omit<Receita, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('receitas')
        .insert([receita])
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

  return useMutation({
    mutationFn: async ({ id, ...receita }: Partial<Receita> & { id: number }) => {
      const { data, error } = await supabase
        .from('receitas')
        .update(receita)
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

  return useMutation({
    mutationFn: async (id: number) => {
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

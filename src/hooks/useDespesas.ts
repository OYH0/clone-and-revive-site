import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Despesa {
  id: number;
  data: string;
  valor: number;
  empresa: string;
  descricao: string;
  categoria: string;
  data_vencimento?: string;
  comprovante?: string;
  status?: string;
  user_id: string;
}

export const useDespesas = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['despesas'],
    queryFn: async () => {
      console.log('Fetching all despesas from Supabase');
      const { data, error } = await supabase
        .from('despesas')
        .select('*')
        .order('data', { ascending: false });
      
      if (error) {
        console.error('Error fetching despesas:', error);
        throw error;
      }
      
      console.log('All despesas fetched:', data);
      return data as Despesa[];
    },
    enabled: true, // Always enabled, not dependent on user
  });
};

export const useCreateDespesa = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (despesa: Omit<Despesa, 'id' | 'user_id'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Creating despesa for user:', user.id, despesa);
      const { data, error } = await supabase
        .from('despesas')
        .insert([{ ...despesa, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating despesa:', error);
        throw error;
      }
      
      console.log('Despesa created:', data);
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
        description: "Erro ao criar despesa. Tente novamente.",
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
      
      console.log('Updating despesa:', id, despesa);
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
      
      console.log('Despesa updated:', data);
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
        description: "Erro ao atualizar despesa. Tente novamente.",
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
      
      console.log('Deleting despesa:', id, 'for user:', user.id);
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
        description: "Erro ao excluir despesa. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

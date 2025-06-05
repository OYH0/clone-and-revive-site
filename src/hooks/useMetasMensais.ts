
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface MetaMensal {
  id: string;
  user_id: string;
  empresa: string;
  nome_meta: string;
  valor_meta: number;
  valor_atual: number;
  mes: number;
  ano: number;
  cor: string;
  created_at?: string;
  updated_at?: string;
}

export const useMetasMensais = (empresa: string) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  return useQuery({
    queryKey: ['metas-mensais', empresa, currentMonth, currentYear],
    queryFn: async () => {
      console.log('Fetching metas mensais from Supabase for:', empresa);
      const { data, error } = await supabase
        .from('metas_mensais')
        .select('*')
        .eq('empresa', empresa)
        .eq('mes', currentMonth)
        .eq('ano', currentYear)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching metas mensais:', error);
        throw error;
      }
      
      console.log('Metas mensais fetched:', data);
      return data as MetaMensal[];
    },
    enabled: true,
  });
};

export const useCreateMetaMensal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (meta: Omit<MetaMensal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Creating meta mensal for user:', user.id, meta);
      const { data, error } = await supabase
        .from('metas_mensais')
        .insert([{ ...meta, user_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating meta mensal:', error);
        throw error;
      }
      
      console.log('Meta mensal created:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['metas-mensais'] });
      toast({
        title: "Sucesso",
        description: "Meta criada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar meta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMetaMensal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...meta }: Partial<MetaMensal> & { id: string }) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Updating meta mensal:', id, meta);
      const { data, error } = await supabase
        .from('metas_mensais')
        .update({ ...meta, user_id: user.id })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating meta mensal:', error);
        throw error;
      }
      
      console.log('Meta mensal updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-mensais'] });
      toast({
        title: "Sucesso",
        description: "Meta atualizada com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar meta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMetaMensal = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error('Usuário não autenticado');
      
      console.log('Deleting meta mensal:', id, 'for user:', user.id);
      const { error } = await supabase
        .from('metas_mensais')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting meta mensal:', error);
        throw error;
      }
      
      console.log('Meta mensal deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metas-mensais'] });
      toast({
        title: "Sucesso",
        description: "Meta excluída com sucesso!",
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir meta:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir meta. Tente novamente.",
        variant: "destructive",
      });
    },
  });
};

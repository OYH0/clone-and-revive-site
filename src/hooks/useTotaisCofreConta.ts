import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMemo } from 'react';

interface TotaisCofreConta {
  totalCofre: number;
  totalConta: number;
}

export const useTotaisCofreConta = (): { data: TotaisCofreConta | null; isLoading: boolean; error: any } => {
  
  const query = useQuery({
    queryKey: ['totais-cofre-conta'],
    queryFn: async () => {
      // Buscar receitas EM_COFRE e EM_CONTA
      const { data: receitas, error: receitasError } = await supabase
        .from('receitas')
        .select('categoria, valor')
        .in('categoria', ['EM_COFRE', 'EM_CONTA']);

      if (receitasError) throw receitasError;

      // Buscar despesas pagas em cofre e conta
      const { data: despesas, error: despesasError } = await supabase
        .from('despesas')
        .select('origem_pagamento, valor_total, valor')
        .eq('status', 'PAGO')
        .in('origem_pagamento', ['cofre', 'conta']);

      if (despesasError) throw despesasError;

      return { receitas: receitas || [], despesas: despesas || [] };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const processedData = useMemo(() => {
    if (!query.data) return null;

    const { receitas, despesas } = query.data;

    // Calcular totais das receitas
    const receitasCofre = receitas.filter(r => r.categoria === 'EM_COFRE');
    const receitasConta = receitas.filter(r => r.categoria === 'EM_CONTA');
    
    const totalReceitasCofre = receitasCofre.reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalReceitasConta = receitasConta.reduce((sum, r) => sum + (r.valor || 0), 0);

    // Calcular totais das despesas pagas
    const despesasCofre = despesas.filter(d => d.origem_pagamento === 'cofre');
    const despesasConta = despesas.filter(d => d.origem_pagamento === 'conta');
    
    const totalDespesasCofre = despesasCofre.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
    const totalDespesasConta = despesasConta.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);

    // Calcular saldos finais
    const totalCofre = totalReceitasCofre - totalDespesasCofre;
    const totalConta = totalReceitasConta - totalDespesasConta;

    return {
      totalCofre,
      totalConta,
    };
  }, [query.data]);

  return {
    data: processedData,
    isLoading: query.isLoading,
    error: query.error,
  };
};
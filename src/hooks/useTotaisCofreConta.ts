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
      console.log('=== DEBUG useTotaisCofreConta ===');
      
      // Buscar receitas EM_COFRE e EM_CONTA
      const { data: receitas, error: receitasError } = await supabase
        .from('receitas')
        .select('categoria, valor')
        .in('categoria', ['EM_COFRE', 'EM_CONTA']);

      if (receitasError) throw receitasError;
      
      console.log('Receitas cofre/conta encontradas:', receitas);

      // Buscar despesas pagas em cofre e conta
      const { data: despesas, error: despesasError } = await supabase
        .from('despesas')
        .select('origem_pagamento, valor_total, valor, status, empresa, descricao')
        .eq('status', 'PAGO')
        .in('origem_pagamento', ['cofre', 'conta']);

      if (despesasError) {
        console.error('Erro ao buscar despesas:', despesasError);
        throw despesasError;
      }
      
      console.log('Despesas pagas cofre/conta encontradas:', despesas);
      console.log('Total de despesas encontradas:', despesas?.length || 0);

      return { receitas: receitas || [], despesas: despesas || [] };
    },
    staleTime: 0, // Força refetch imediato para debug
    gcTime: 1 * 60 * 1000, // 1 minute for debug
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

    console.log('=== CÁLCULOS TOTAIS ===');
    console.log('Receitas Cofre:', totalReceitasCofre, 'Despesas Cofre:', totalDespesasCofre, 'Total Cofre:', totalCofre);
    console.log('Receitas Conta:', totalReceitasConta, 'Despesas Conta:', totalDespesasConta, 'Total Conta:', totalConta);

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
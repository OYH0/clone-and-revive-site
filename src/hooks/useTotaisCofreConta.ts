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
      console.log('=== CALCULANDO TOTAIS COFRE E CONTA ===');
      
      // 1. Buscar TODAS as receitas EM_COFRE e EM_CONTA (somam ao total)
      const { data: receitasCofre, error: receitasCofreError } = await supabase
        .from('receitas')
        .select('valor')
        .eq('categoria', 'EM_COFRE');

      if (receitasCofreError) {
        console.error('Erro ao buscar receitas cofre:', receitasCofreError);
        throw receitasCofreError;
      }

      const { data: receitasConta, error: receitasContaError } = await supabase
        .from('receitas')
        .select('valor')
        .eq('categoria', 'EM_CONTA');

      if (receitasContaError) {
        console.error('Erro ao buscar receitas conta:', receitasContaError);
        throw receitasContaError;
      }
      
      // 2. Buscar TODAS as despesas pagas em cofre (subtraem do total)
      const { data: despesasCofre, error: despesasCofreError } = await supabase
        .from('despesas')
        .select('valor_total, valor')
        .eq('status', 'PAGO')
        .eq('origem_pagamento', 'cofre');

      if (despesasCofreError) {
        console.error('Erro ao buscar despesas cofre:', despesasCofreError);
        throw despesasCofreError;
      }

      // 3. Buscar TODAS as despesas pagas em conta (subtraem do total)
      const { data: despesasConta, error: despesasContaError } = await supabase
        .from('despesas')
        .select('valor_total, valor')
        .eq('status', 'PAGO')
        .eq('origem_pagamento', 'conta');

      if (despesasContaError) {
        console.error('Erro ao buscar despesas conta:', despesasContaError);
        throw despesasContaError;
      }

      console.log('Receitas Cofre encontradas:', receitasCofre?.length || 0);
      console.log('Receitas Conta encontradas:', receitasConta?.length || 0);
      console.log('Despesas Cofre encontradas:', despesasCofre?.length || 0);
      console.log('Despesas Conta encontradas:', despesasConta?.length || 0);

      return { 
        receitasCofre: receitasCofre || [], 
        receitasConta: receitasConta || [],
        despesasCofre: despesasCofre || [],
        despesasConta: despesasConta || []
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const processedData = useMemo(() => {
    if (!query.data) return null;

    const { receitasCofre, receitasConta, despesasCofre, despesasConta } = query.data;

    // Calcular totais das receitas (SOMAM)
    const totalReceitasCofre = receitasCofre.reduce((sum, r) => sum + (r.valor || 0), 0);
    const totalReceitasConta = receitasConta.reduce((sum, r) => sum + (r.valor || 0), 0);

    // Calcular totais das despesas pagas (SUBTRAEM)
    const totalDespesasCofre = despesasCofre.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
    const totalDespesasConta = despesasConta.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);

    // Calcular saldos finais: Receitas MENOS Despesas
    const totalCofre = totalReceitasCofre - totalDespesasCofre;
    const totalConta = totalReceitasConta - totalDespesasConta;

    console.log('=== CÁLCULOS FINAIS ===');
    console.log('COFRE - Receitas:', totalReceitasCofre, 'Despesas:', totalDespesasCofre, 'TOTAL:', totalCofre);
    console.log('CONTA - Receitas:', totalReceitasConta, 'Despesas:', totalDespesasConta, 'TOTAL:', totalConta);

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
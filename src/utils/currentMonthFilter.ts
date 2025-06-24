
/**
 * Utility functions for filtering data by current month rules
 */

export const getCurrentMonthDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0);
  
  return {
    start: startOfMonth.toISOString().split('T')[0],
    end: endOfMonth.toISOString().split('T')[0]
  };
};

export const isCurrentMonth = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const now = new Date();
  
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export const filterDespesasCurrentMonth = (despesas: any[], dateFrom?: string, dateTo?: string) => {
  // Se há filtros de data manuais, usar eles
  if (dateFrom || dateTo) {
    return despesas.filter(despesa => {
      const dataVencimento = despesa.data_vencimento || despesa.data;
      let matchesDateFrom = true;
      let matchesDateTo = true;
      
      if (dateFrom && dataVencimento) {
        matchesDateFrom = dataVencimento >= dateFrom;
      }
      
      if (dateTo && dataVencimento) {
        matchesDateTo = dataVencimento <= dateTo;
      }
      
      return matchesDateFrom && matchesDateTo;
    });
  }

  // Aplicar regras do mês atual
  return despesas.filter(despesa => {
    // Regra 1: Despesas do mês atual (por vencimento)
    if (despesa.data_vencimento && isCurrentMonth(despesa.data_vencimento)) {
      return true;
    }
    
    // Regra 2: Despesas de meses anteriores que foram pagas no mês atual
    if (despesa.status === 'PAGO' && despesa.data && isCurrentMonth(despesa.data)) {
      return true;
    }
    
    return false;
  });
};

export const filterReceitasCurrentMonth = (receitas: any[], dateFrom?: string, dateTo?: string) => {
  // Se há filtros de data manuais, usar eles
  if (dateFrom || dateTo) {
    return receitas.filter(receita => {
      const dataReceita = receita.data_recebimento || receita.data;
      let matchesDateFrom = true;
      let matchesDateTo = true;
      
      if (dateFrom && dataReceita) {
        matchesDateFrom = dataReceita >= dateFrom;
      }
      
      if (dateTo && dataReceita) {
        matchesDateTo = dataReceita <= dateTo;
      }
      
      return matchesDateFrom && matchesDateTo;
    });
  }

  // Aplicar regras do mês atual
  return receitas.filter(receita => {
    // Regra 1: Receitas do mês atual (por data da receita)
    if (receita.data && isCurrentMonth(receita.data)) {
      return true;
    }
    
    // Regra 2: Receitas que foram recebidas no mês atual
    if (receita.data_recebimento && isCurrentMonth(receita.data_recebimento)) {
      return true;
    }
    
    return false;
  });
};

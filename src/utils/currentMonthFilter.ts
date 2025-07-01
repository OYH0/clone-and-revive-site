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

  // Criar a data de forma consistente para evitar problemas de timezone
  const dateParts = dateString.split('-');
  const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));

  const now = new Date();

  const result = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  console.log('isCurrentMonth check:', {
    dateString,
    parsedDate: date.toLocaleDateString('pt-BR'),
    currentMonth: now.getMonth(),
    currentYear: now.getFullYear(),
    dateMonth: date.getMonth(),
    dateYear: date.getFullYear(),
    isCurrentMonth: result
  });

  return result;
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

  // Aplicar regras do mês atual - CORRIGIDO
  return despesas.filter(despesa => {
    // Regra 1: Despesas com vencimento no mês atual (independente do status)
    if (despesa.data_vencimento && isCurrentMonth(despesa.data_vencimento)) {
      console.log('Despesa incluída por vencimento no mês atual:', despesa.id, despesa.data_vencimento);
      return true;
    }

    // Regra 2: Despesas de meses anteriores que foram pagas no mês atual
    if (despesa.status === 'PAGO' && despesa.data && isCurrentMonth(despesa.data)) {
      // Só incluir se a data de vencimento é de mês anterior ou não existe
      if (!despesa.data_vencimento || !isCurrentMonth(despesa.data_vencimento)) {
        console.log('Despesa incluída por pagamento no mês atual:', despesa.id, despesa.data);
        return true;
      }
    }

    // Regra 3: Despesas sem data de vencimento mas criadas/pagas no mês atual
    if (!despesa.data_vencimento && despesa.data && isCurrentMonth(despesa.data)) {
      console.log('Despesa incluída por criação no mês atual (sem vencimento):', despesa.id, despesa.data);
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

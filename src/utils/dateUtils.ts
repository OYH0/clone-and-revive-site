
/**
 * Utility functions for date formatting and manipulation
 */

export const formatDate = (dateString: string | null): string => {
  if (!dateString) {
    return 'Não definido';
  }
  
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) {
      return 'Data inválida';
    }
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

export const formatDateForInput = (dateString: string | null): string => {
  if (!dateString) return '';
  return dateString;
};

export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isDateInPast = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

export const isDateToday = (dateString: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

// Nova função para calcular lucro baseado no período
export const calculateProfitByPeriod = (
  allDespesas: any[], 
  allReceitas: any[], 
  selectedPeriod: 'today' | 'week' | 'month' | 'year' | 'custom',
  customMonth?: number,
  customYear?: number
): number => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  console.log('=== CALCULATE PROFIT BY PERIOD ===');
  console.log('Período selecionado:', selectedPeriod);
  console.log('Mês personalizado:', customMonth);
  console.log('Ano personalizado:', customYear);

  switch (selectedPeriod) {
    case 'today':
      // Apenas hoje
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = today;
      endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000);
      break;
    
    case 'week':
      // Apenas esta semana
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      startDate = startOfWeek;
      endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);
      break;
    
    case 'month':
      // Acumulado desde janeiro até o mês atual (sem meses futuros)
      startDate = new Date(now.getFullYear(), 0, 1); // 1º de janeiro
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Último dia do mês atual
      break;
    
    case 'year':
      // Todo o ano (incluindo meses futuros)
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    
    case 'custom':
      // Período personalizado - ACUMULADO desde janeiro até o mês selecionado
      if (customMonth && customYear) {
        startDate = new Date(customYear, 0, 1); // 1º de janeiro do ano selecionado
        endDate = new Date(customYear, customMonth, 0, 23, 59, 59, 999); // Último dia do mês selecionado
        console.log('Período personalizado - De:', startDate.toLocaleDateString('pt-BR'), 'até:', endDate.toLocaleDateString('pt-BR'));
      } else {
        console.log('Período personalizado sem dados válidos');
        return 0;
      }
      break;
    
    default:
      return 0;
  }

  console.log('Data início:', startDate.toLocaleDateString('pt-BR'));
  console.log('Data fim:', endDate.toLocaleDateString('pt-BR'));

  // Filtrar despesas
  const filteredDespesas = allDespesas.filter(item => {
    let itemDate: Date;
    
    if (item.data_vencimento) {
      itemDate = new Date(item.data_vencimento + 'T00:00:00');
    } else if (item.data) {
      itemDate = new Date(item.data + 'T00:00:00');
    } else {
      return false;
    }
    
    const isInRange = itemDate >= startDate && itemDate <= endDate;
    if (isInRange && selectedPeriod === 'custom') {
      console.log('Despesa incluída:', {
        data: item.data_vencimento || item.data,
        empresa: item.empresa,
        valor: item.valor_total || item.valor,
        descricao: item.descricao
      });
    }
    
    return isInRange;
  });

  // Filtrar receitas
  const filteredReceitas = allReceitas.filter(item => {
    let itemDate: Date;
    
    if (item.data) {
      itemDate = new Date(item.data + 'T00:00:00');
    } else if (item.data_recebimento) {
      itemDate = new Date(item.data_recebimento + 'T00:00:00');
    } else {
      return false;
    }
    
    const isInRange = itemDate >= startDate && itemDate <= endDate;
    if (isInRange && selectedPeriod === 'custom') {
      console.log('Receita incluída:', {
        data: item.data || item.data_recebimento,
        empresa: item.empresa,
        valor: item.valor,
        descricao: item.descricao
      });
    }
    
    return isInRange;
  });

  const totalDespesas = filteredDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitas = filteredReceitas.reduce((sum, r) => sum + r.valor, 0);
  
  const lucro = totalReceitas - totalDespesas;
  
  console.log('Despesas filtradas:', filteredDespesas.length, 'Total:', totalDespesas);
  console.log('Receitas filtradas:', filteredReceitas.length, 'Total:', totalReceitas);
  console.log('Lucro calculado:', lucro);
  
  return lucro;
};

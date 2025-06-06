
export const filterDataByPeriod = (data: any[], period: string) => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case 'today':
      // Para "hoje", usar apenas a data (ignorar horário)
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      startDate = today;
      endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Fim do dia
      break;
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      startDate = startOfWeek;
      endDate = new Date();
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date();
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date();
      break;
    default:
      return data; // Return all data if period is not recognized
  }

  return data.filter(item => {
    // Parse da data no formato YYYY-MM-DD
    const itemDate = new Date(item.data + 'T00:00:00');
    
    if (period === 'today') {
      // Para hoje, comparar apenas a data (ano, mês, dia)
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return itemDateOnly.getTime() === todayOnly.getTime();
    }
    
    return itemDate >= startDate && itemDate <= endDate;
  });
};

export const getPeriodString = (selectedPeriod: string) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  switch (selectedPeriod) {
    case 'today':
      return `Hoje - ${currentDate.toLocaleDateString('pt-BR')}`;
    case 'week':
      return `Esta Semana`;
    case 'month':
      const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(currentDate);
      const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
      return `${capitalizedMonth} ${currentYear}`;
    case 'year':
      return `Ano ${currentYear}`;
    default:
      return `${currentMonth} ${currentYear}`;
  }
};


export const filterDataByPeriod = (data: any[], period: string) => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      startDate = startOfWeek;
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return data; // Return all data if period is not recognized
  }

  return data.filter(item => {
    const itemDate = new Date(item.data);
    return itemDate >= startDate;
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


export const filterDataByPeriod = (data: any[], period: string) => {
  if (!data || data.length === 0) return [];
  
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  return data.filter(item => {
    const itemDate = new Date(item.data);
    switch (period) {
      case 'today':
        return itemDate >= startOfDay;
      case 'week':
        return itemDate >= startOfWeek;
      case 'month':
        return itemDate >= startOfMonth;
      case 'year':
        return itemDate >= startOfYear;
      default:
        return true;
    }
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

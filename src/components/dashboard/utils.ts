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

  console.log('\n=== FILTER DEBUG ===');
  console.log('Período selecionado:', period);
  console.log('Data início:', startDate);
  console.log('Data fim:', endDate);
  console.log('Total de itens antes do filtro:', data.length);

  const filteredData = data.filter(item => {
    // Usar data_vencimento se disponível, caso contrário usar data
    const dateToUse = item.data_vencimento || item.data;
    
    if (!dateToUse) {
      console.log('Item sem data válida:', item);
      return false;
    }
    
    // Parse da data no formato YYYY-MM-DD
    const itemDate = new Date(dateToUse + 'T00:00:00');
    
    console.log('Verificando item:', {
      id: item.id,
      empresa: item.empresa,
      data_vencimento: item.data_vencimento,
      data: item.data,
      dateToUse,
      itemDate,
      inRange: itemDate >= startDate && itemDate <= endDate
    });
    
    if (period === 'today') {
      // Para hoje, comparar apenas a data (ano, mês, dia)
      const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
      const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const isToday = itemDateOnly.getTime() === todayOnly.getTime();
      
      console.log('Verificação "hoje":', {
        itemDateOnly,
        todayOnly,
        isToday
      });
      
      return isToday;
    }
    
    const inRange = itemDate >= startDate && itemDate <= endDate;
    return inRange;
  });

  console.log('Total de itens após o filtro:', filteredData.length);
  console.log('Itens filtrados:', filteredData.map(item => ({
    id: item.id,
    empresa: item.empresa,
    valor: item.valor,
    valor_total: item.valor_total,
    data_vencimento: item.data_vencimento,
    data: item.data
  })));

  return filteredData;
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

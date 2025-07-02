
import { Despesa } from '@/hooks/useDespesas';

export const calculateDistributionData = (despesas: Despesa[]) => {
  console.log('=== CALCULATING DISTRIBUTION DATA WITH SUBCATEGORIES ===');
  console.log('Despesas para calcular:', despesas?.length || 0);

  if (!despesas || despesas.length === 0) {
    return [];
  }

  // Agrupar por categoria e subcategoria
  const categoryGroups: { [key: string]: { total: number; subcategorias: { [key: string]: number } } } = {};

  despesas.forEach(despesa => {
    const valor = despesa.valor_total || despesa.valor || 0;
    const categoria = despesa.categoria || 'Sem categoria';
    const subcategoria = despesa.subcategoria || 'Outros';

    if (!categoryGroups[categoria]) {
      categoryGroups[categoria] = { total: 0, subcategorias: {} };
    }

    categoryGroups[categoria].total += valor;
    
    if (!categoryGroups[categoria].subcategorias[subcategoria]) {
      categoryGroups[categoria].subcategorias[subcategoria] = 0;
    }
    categoryGroups[categoria].subcategorias[subcategoria] += valor;
  });

  // Cores para as categorias
  const colors: { [key: string]: string } = {
    'INSUMOS': '#10B981',
    'FIXAS': '#EF4444', 
    'VARIÁVEIS': '#F59E0B',
    'ATRASADOS': '#DC2626',
    'RETIRADAS': '#8B5CF6',
    'Sem categoria': '#6B7280'
  };

  const data = Object.entries(categoryGroups)
    .filter(([_, group]) => group.total > 0)
    .map(([categoria, group]) => ({
      name: categoria,
      value: group.total,
      color: colors[categoria] || '#6B7280',
      subcategorias: group.subcategorias
    }))
    .sort((a, b) => b.value - a.value);

  console.log('Dados de distribuição calculados:', data);
  return data;
};

export const calculateMonthlyData = (despesas: Despesa[], receitas: any[]) => {
  console.log('=== CALCULATING MONTHLY DATA ===');
  
  const monthlyData: { [key: string]: { despesas: number; receitas: number } } = {};
  
  // Processar despesas
  despesas.forEach(despesa => {
    if (despesa.data_vencimento) {
      const date = new Date(despesa.data_vencimento + 'T00:00:00');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { despesas: 0, receitas: 0 };
      }
      
      monthlyData[monthKey].despesas += despesa.valor_total || despesa.valor || 0;
    }
  });
  
  // Processar receitas
  receitas.forEach(receita => {
    if (receita.data) {
      const date = new Date(receita.data + 'T00:00:00');
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { despesas: 0, receitas: 0 };
      }
      
      monthlyData[monthKey].receitas += receita.valor || 0;
    }
  });
  
  // Converter para array e ordenar
  const data = Object.entries(monthlyData)
    .map(([month, values]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      return {
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        despesas: values.despesas,
        receitas: values.receitas,
        lucro: values.receitas - values.despesas
      };
    })
    .sort((a, b) => {
      const monthOrder = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });

  console.log('Dados mensais calculados:', data);
  return data;
};

export const calculateTotalsByCompany = (despesas: Despesa[], empresa: string) => {
  console.log(`=== CALCULATING TOTALS FOR ${empresa} ===`);
  
  const filteredDespesas = despesas.filter(d => d.empresa === empresa);
  
  const totalDespesas = filteredDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
  const totalPagas = filteredDespesas
    .filter(d => d.status === 'PAGO')
    .reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
  const totalPendentes = filteredDespesas
    .filter(d => d.status !== 'PAGO')
    .reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);

  console.log(`Totais para ${empresa}:`, { totalDespesas, totalPagas, totalPendentes });
  
  return {
    totalDespesas,
    totalPagas,
    totalPendentes,
    count: filteredDespesas.length
  };
};


import { getExpenseValue } from '@/utils/expenseFilters';

export const normalizeCompanyName = (companyName: string) => {
  if (!companyName) return '';
  
  const company = companyName.toLowerCase().trim();
  
  if (company.includes('churrasco') || company === 'churrasco') {
    return 'churrasco';
  }
  if (company.includes('johnny') || company === 'johnny') {
    return 'johnny';
  }
  if (company.includes('camerino') || company === 'camerino') {
    return 'camerino';
  }
  
  return company;
};

export const calculateDistributionData = (despesas: any[]) => {
  console.log('Calculando dados de distribuição para', despesas.length, 'despesas');
  
  // Agrupar por categoria e subcategoria
  const categoryTotals: { [key: string]: { total: number, subcategories: { [key: string]: number } } } = {};
  
  despesas.forEach(despesa => {
    const valor = getExpenseValue(despesa);
    const categoria = despesa.categoria || 'Sem Categoria';
    const subcategoria = despesa.subcategoria || 'Sem Subcategoria';
    
    if (!categoryTotals[categoria]) {
      categoryTotals[categoria] = { total: 0, subcategories: {} };
    }
    
    categoryTotals[categoria].total += valor;
    
    if (!categoryTotals[categoria].subcategories[subcategoria]) {
      categoryTotals[categoria].subcategories[subcategoria] = 0;
    }
    categoryTotals[categoria].subcategories[subcategoria] += valor;
  });

  console.log('Totais por categoria e subcategoria:', categoryTotals);

  // Cores para as categorias
  const categoryColors: { [key: string]: string } = {
    'INSUMOS': '#ef4444',
    'FIXAS': '#3b82f6', 
    'VARIÁVEIS': '#10b981',
    'ATRASADOS': '#f59e0b',
    'RETIRADAS': '#8b5cf6',
    'Sem Categoria': '#6b7280'
  };

  const data = Object.entries(categoryTotals).map(([categoria, info]) => ({
    name: categoria,
    value: info.total,
    color: categoryColors[categoria] || '#6b7280',
    subcategories: info.subcategories
  }));

  console.log('Dados finais de distribuição:', data);
  
  return data;
};

export const getExpensesForCompany = (despesas: any[], companyName: string) => {
  const normalized = normalizeCompanyName(companyName);
  return despesas.filter(despesa => normalizeCompanyName(despesa.empresa) === normalized);
};

export const getTotalExpensesForCompany = (despesas: any[], companyName: string) => {
  const companyExpenses = getExpensesForCompany(despesas, companyName);
  return companyExpenses.reduce((total, despesa) => total + getExpenseValue(despesa), 0);
};

export const getTotalRevenues = (receitas: any[]) => {
  return receitas.reduce((total, receita) => total + (receita.valor || 0), 0);
};

export const getRevenuesForCompany = (receitas: any[], companyName: string) => {
  const normalized = normalizeCompanyName(companyName);
  return receitas.filter(receita => normalizeCompanyName(receita.empresa) === normalized);
};

export const getTotalRevenuesForCompany = (receitas: any[], companyName: string) => {
  const companyRevenues = getRevenuesForCompany(receitas, companyName);
  return getTotalRevenues(companyRevenues);
};


import { Despesa } from '@/hooks/useDespesas';

// Função centralizada para normalizar nomes das empresas
export const normalizeCompanyName = (empresa: string | undefined): string => {
  if (!empresa) return '';
  const normalized = empresa.toLowerCase().trim();
  
  // Mapear todas as variações possíveis dos nomes das empresas
  if (normalized.includes('churrasco') || normalized === 'companhia do churrasco' || normalized === 'cia do churrasco') {
    return 'churrasco';
  }
  if (normalized.includes('johnny') || normalized === 'johnny rockets' || normalized === 'johnny rocket') {
    return 'johnny';
  }
  if (normalized === 'camerino' || normalized.includes('camerino')) {
    return 'camerino';
  }
  
  return normalized;
};

// Função para obter o valor correto (prioriza valor_total, depois valor)
export const getTransactionValue = (despesa: Despesa): number => {
  return despesa.valor_total || despesa.valor || 0;
};

// Função para filtrar despesas por empresa
export const filterExpensesByCompany = (despesas: Despesa[], companyKey: string): Despesa[] => {
  return despesas.filter(d => normalizeCompanyName(d.empresa) === companyKey);
};

// Função para calcular total por categoria
export const calculateCategoryTotal = (despesas: Despesa[], categoria: string): number => {
  return despesas
    .filter(d => d.categoria === categoria)
    .reduce((sum, d) => sum + getTransactionValue(d), 0);
};

// Função para calcular totais por empresa
export const calculateCompanyTotals = (despesas: Despesa[]) => {
  const companies = ['churrasco', 'johnny', 'camerino'];
  
  return companies.reduce((acc, company) => {
    const companyExpenses = filterExpensesByCompany(despesas, company);
    const total = companyExpenses.reduce((sum, d) => sum + getTransactionValue(d), 0);
    
    // Calcular por categoria
    const categories = {
      insumos: calculateCategoryTotal(companyExpenses, 'INSUMOS'),
      variaveis: calculateCategoryTotal(companyExpenses, 'VARIAVEIS'),
      fixas: calculateCategoryTotal(companyExpenses, 'FIXAS'),
      atrasados: calculateCategoryTotal(companyExpenses, 'ATRASADOS'),
      retiradas: calculateCategoryTotal(companyExpenses, 'RETIRADAS')
    };
    
    acc[company] = {
      expenses: companyExpenses,
      total,
      categories
    };
    
    return acc;
  }, {} as Record<string, { expenses: Despesa[], total: number, categories: Record<string, number> }>);
};

// Função para calcular dados do gráfico de distribuição
export const calculateDistributionData = (despesas: Despesa[]) => {
  const categories = [
    { name: 'INSUMOS', label: 'Insumos', color: '#0ea5e9' },
    { name: 'FIXAS', label: 'Fixas', color: '#1e293b' },
    { name: 'VARIAVEIS', label: 'Variáveis', color: '#f59e0b' },
    { name: 'ATRASADOS', label: 'Atrasados', color: '#ef4444' },
    { name: 'RETIRADAS', label: 'Retiradas', color: '#8b5cf6' }
  ];

  return categories.map(category => {
    const value = calculateCategoryTotal(despesas, category.name);
    
    return {
      name: category.label,
      value,
      color: category.color
    };
  }).filter(item => item.value > 0);
};

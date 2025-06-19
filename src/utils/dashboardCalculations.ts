
import { Despesa } from '@/hooks/useDespesas';

// Função centralizada para normalizar nomes das empresas
export const normalizeCompanyName = (empresa: string | undefined): string => {
  if (!empresa) return '';
  const normalized = empresa.toLowerCase().trim();
  
  console.log('Normalizando empresa:', empresa, '-> normalized:', normalized);
  
  // Mapear todas as variações possíveis dos nomes das empresas
  if (normalized.includes('churrasco') || 
      normalized === 'companhia do churrasco' || 
      normalized === 'cia do churrasco' ||
      normalized === 'churrasco' ||
      normalized === 'cia. do churrasco') {
    return 'churrasco';
  }
  if (normalized.includes('johnny') || 
      normalized === 'johnny rockets' || 
      normalized === 'johnny rocket' ||
      normalized === 'johnny') {
    return 'johnny';
  }
  if (normalized === 'camerino' || 
      normalized.includes('camerino')) {
    return 'camerino';
  }
  
  // Se não encontrou uma correspondência, retorna o valor original normalizado
  console.log('Empresa não mapeada:', normalized);
  return normalized;
};

// Função para obter o valor correto (prioriza valor_total, depois valor)
export const getTransactionValue = (despesa: Despesa): number => {
  const valor = despesa.valor_total || despesa.valor || 0;
  console.log('Valor da transação:', { 
    id: despesa.id, 
    empresa: despesa.empresa, 
    valor_total: despesa.valor_total, 
    valor: despesa.valor, 
    valor_usado: valor 
  });
  return valor;
};

// Função para filtrar despesas por empresa
export const filterExpensesByCompany = (despesas: Despesa[], companyKey: string): Despesa[] => {
  const filtered = despesas.filter(d => normalizeCompanyName(d.empresa) === companyKey);
  console.log(`Despesas filtradas para ${companyKey}:`, filtered.length, 'de', despesas.length);
  return filtered;
};

// Função para calcular total por categoria
export const calculateCategoryTotal = (despesas: Despesa[], categoria: string): number => {
  const categoryExpenses = despesas.filter(d => d.categoria === categoria);
  const total = categoryExpenses.reduce((sum, d) => sum + getTransactionValue(d), 0);
  
  console.log(`Total categoria ${categoria}:`, {
    count: categoryExpenses.length,
    total,
    despesas: categoryExpenses.map(d => ({
      id: d.id,
      empresa: d.empresa,
      categoria: d.categoria,
      valor: getTransactionValue(d)
    }))
  });
  
  return total;
};

// Função para calcular totais por empresa
export const calculateCompanyTotals = (despesas: Despesa[]) => {
  console.log('Calculando totais por empresa. Total de despesas:', despesas.length);
  
  const companies = ['churrasco', 'johnny', 'camerino'];
  
  return companies.reduce((acc, company) => {
    const companyExpenses = filterExpensesByCompany(despesas, company);
    const total = companyExpenses.reduce((sum, d) => sum + getTransactionValue(d), 0);
    
    console.log(`Empresa ${company} - Total de despesas:`, companyExpenses.length, 'Total valor:', total);
    
    // Calcular por categoria
    const categories = {
      insumos: calculateCategoryTotal(companyExpenses, 'INSUMOS'),
      variaveis: calculateCategoryTotal(companyExpenses, 'VARIAVEIS'),
      fixas: calculateCategoryTotal(companyExpenses, 'FIXAS'),
      atrasados: calculateCategoryTotal(companyExpenses, 'ATRASADOS'),
      retiradas: calculateCategoryTotal(companyExpenses, 'RETIRADAS')
    };
    
    console.log(`Categorias para ${company}:`, categories);
    
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
  console.log('Calculando dados de distribuição para', despesas.length, 'despesas');
  
  const categories = [
    { name: 'INSUMOS', label: 'Insumos', color: '#0ea5e9' },
    { name: 'FIXAS', label: 'Fixas', color: '#1e293b' },
    { name: 'VARIAVEIS', label: 'Variáveis', color: '#f59e0b' },
    { name: 'ATRASADOS', label: 'Atrasados', color: '#ef4444' },
    { name: 'RETIRADAS', label: 'Retiradas', color: '#8b5cf6' }
  ];

  const data = categories.map(category => {
    const value = calculateCategoryTotal(despesas, category.name);
    
    console.log(`Distribuição - ${category.label}:`, value);
    
    return {
      name: category.label,
      value,
      color: category.color
    };
  }).filter(item => item.value > 0);
  
  console.log('Dados finais de distribuição:', data);
  return data;
};

// Função para debug - listar todas as empresas únicas
export const debugCompanies = (despesas: Despesa[]) => {
  const uniqueCompanies = Array.from(new Set(despesas.map(d => d.empresa)));
  console.log('Empresas únicas encontradas:', uniqueCompanies);
  
  uniqueCompanies.forEach(empresa => {
    const normalized = normalizeCompanyName(empresa);
    const count = despesas.filter(d => d.empresa === empresa).length;
    const total = despesas
      .filter(d => d.empresa === empresa)
      .reduce((sum, d) => sum + getTransactionValue(d), 0);
    
    console.log(`${empresa} -> ${normalized} (${count} despesas, total: ${total})`);
  });
};

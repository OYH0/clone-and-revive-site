import { Despesa } from '@/hooks/useDespesas';

// Função para normalizar nomes das categorias
export const normalizeCategoryName = (categoria: string | undefined): string => {
  if (!categoria) return 'SEM_CATEGORIA';
  const normalized = categoria.toUpperCase().trim();
  
  console.log('Normalizando categoria:', categoria, '-> normalized:', normalized);
  
  // Mapear variações das categorias
  if (normalized === 'VARIÁVEIS' || normalized === 'VARIAVEIS') {
    return 'VARIÁVEIS';
  }
  if (normalized === 'FIXAS') {
    return 'FIXAS';
  }
  if (normalized === 'INSUMOS') {
    return 'INSUMOS';
  }
  if (normalized === 'ATRASADOS') {
    return 'ATRASADOS';
  }
  if (normalized === 'RETIRADAS') {
    return 'RETIRADAS';
  }
  if (normalized === 'SEM CATEGORIA' || normalized === 'SEM_CATEGORIA' || normalized === '') {
    return 'SEM_CATEGORIA';
  }
  
  console.log('Categoria não mapeada:', normalized);
  return 'SEM_CATEGORIA';
};

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
  console.log('\n=== FILTERING EXPENSES BY COMPANY ===');
  console.log('Total despesas:', despesas.length);
  console.log('Filtrando por empresa:', companyKey);
  
  // Debug: listar todas as empresas únicas
  const uniqueCompanies = Array.from(new Set(despesas.map(d => d.empresa)));
  console.log('Empresas únicas encontradas:', uniqueCompanies);
  
  const filtered = despesas.filter(d => {
    const normalized = normalizeCompanyName(d.empresa);
    const match = normalized === companyKey;
    if (match) {
      console.log('Match encontrado:', d.empresa, '->', normalized, 'valor:', getTransactionValue(d));
    }
    return match;
  });
  
  console.log(`Despesas filtradas para ${companyKey}:`, filtered.length, 'de', despesas.length);
  console.log('Despesas encontradas:', filtered.map(d => ({
    id: d.id,
    empresa: d.empresa,
    categoria: d.categoria,
    valor: getTransactionValue(d)
  })));
  
  return filtered;
};

// Função para calcular total por categoria
export const calculateCategoryTotal = (despesas: Despesa[], categoria: string): number => {
  console.log('\n=== CALCULATING CATEGORY TOTAL ===');
  console.log('Categoria solicitada:', categoria);
  console.log('Total despesas para análise:', despesas.length);
  
  const categoryExpenses = despesas.filter(d => {
    const normalizedDespesaCategoria = normalizeCategoryName(d.categoria);
    const normalizedTargetCategoria = categoria;
    const match = normalizedDespesaCategoria === normalizedTargetCategoria;
    
    if (match) {
      console.log('Despesa da categoria encontrada:', {
        id: d.id,
        empresa: d.empresa,
        categoria_original: d.categoria,
        categoria_normalizada: normalizedDespesaCategoria,
        valor: getTransactionValue(d)
      });
    }
    return match;
  });
  
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
  console.log('\n=== CALCULATING COMPANY TOTALS ===');
  console.log('Total de despesas recebidas:', despesas.length);
  
  // Debug: listar todas as despesas
  console.log('Todas as despesas:', despesas.map(d => ({
    id: d.id,
    empresa: d.empresa,
    categoria: d.categoria,
    valor: d.valor,
    valor_total: d.valor_total,
    valor_usado: getTransactionValue(d)
  })));
  
  const companies = ['churrasco', 'johnny', 'camerino'];
  
  return companies.reduce((acc, company) => {
    console.log(`\n--- Processando empresa: ${company} ---`);
    
    const companyExpenses = filterExpensesByCompany(despesas, company);
    const total = companyExpenses.reduce((sum, d) => sum + getTransactionValue(d), 0);
    
    console.log(`Empresa ${company} - Total de despesas:`, companyExpenses.length, 'Total valor:', total);
    
    // Calcular por categoria usando os nomes corretos
    const categories = {
      insumos: calculateCategoryTotal(companyExpenses, 'INSUMOS'),
      variaveis: calculateCategoryTotal(companyExpenses, 'VARIÁVEIS'),
      fixas: calculateCategoryTotal(companyExpenses, 'FIXAS'),
      atrasados: calculateCategoryTotal(companyExpenses, 'ATRASADOS'),
      retiradas: calculateCategoryTotal(companyExpenses, 'RETIRADAS'),
      sem_categoria: calculateCategoryTotal(companyExpenses, 'SEM_CATEGORIA')
    };
    
    console.log(`Categorias para ${company}:`, categories);
    console.log(`Soma das categorias: ${Object.values(categories).reduce((sum, val) => sum + val, 0)}`);
    
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
  console.log('\n=== CALCULATING DISTRIBUTION DATA ===');
  console.log('Calculando dados de distribuição para', despesas.length, 'despesas');
  
  const categories = [
    { name: 'INSUMOS', label: 'Insumos', color: '#0ea5e9' },
    { name: 'FIXAS', label: 'Fixas', color: '#1e293b' },
    { name: 'VARIÁVEIS', label: 'Variáveis', color: '#f59e0b' },
    { name: 'ATRASADOS', label: 'Atrasados', color: '#ef4444' },
    { name: 'RETIRADAS', label: 'Retiradas', color: '#8b5cf6' },
    { name: 'SEM_CATEGORIA', label: 'Sem Categoria', color: '#6b7280' }
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
  console.log('\n=== DEBUG COMPANIES ===');
  const uniqueCompanies = Array.from(new Set(despesas.map(d => d.empresa)));
  console.log('Empresas únicas encontradas:', uniqueCompanies);
  
  uniqueCompanies.forEach(empresa => {
    const normalized = normalizeCompanyName(empresa);
    const empresaDespesas = despesas.filter(d => d.empresa === empresa);
    const count = empresaDespesas.length;
    const total = empresaDespesas.reduce((sum, d) => sum + getTransactionValue(d), 0);
    
    console.log(`${empresa} -> ${normalized} (${count} despesas, total: ${total})`);
    console.log('Despesas desta empresa:', empresaDespesas.map(d => ({
      id: d.id,
      categoria: d.categoria,
      valor: getTransactionValue(d)
    })));
  });
};

// Nova função para verificar integridade dos dados
export const verifyDataIntegrity = (despesas: Despesa[]) => {
  console.log('\n=== VERIFICAÇÃO DE INTEGRIDADE DOS DADOS ===');
  
  // Verificar se há despesas sem empresa
  const semEmpresa = despesas.filter(d => !d.empresa || d.empresa.trim() === '');
  if (semEmpresa.length > 0) {
    console.log('ALERTA: Despesas sem empresa:', semEmpresa);
  }
  
  // Verificar se há despesas sem categoria
  const semCategoria = despesas.filter(d => !d.categoria || d.categoria.trim() === '');
  if (semCategoria.length > 0) {
    console.log('ALERTA: Despesas sem categoria:', semCategoria);
  }
  
  // Verificar se há despesas com valores zerados ou negativos
  const valoresInvalidos = despesas.filter(d => getTransactionValue(d) <= 0);
  if (valoresInvalidos.length > 0) {
    console.log('ALERTA: Despesas com valores inválidos:', valoresInvalidos);
  }
  
  // Verificar total geral
  const totalGeral = despesas.reduce((sum, d) => sum + getTransactionValue(d), 0);
  console.log('Total geral de todas as despesas:', totalGeral);
  
  return {
    totalDespesas: despesas.length,
    semEmpresa: semEmpresa.length,
    semCategoria: semCategoria.length,
    valoresInvalidos: valoresInvalidos.length,
    totalGeral
  };
};

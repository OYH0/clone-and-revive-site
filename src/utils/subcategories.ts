
export interface Subcategory {
  value: string;
  label: string;
  category: string;
}

export const subcategories: Subcategory[] = [
  // Insumos
  { value: 'DESCARTAVEIS', label: 'Descartáveis', category: 'INSUMOS' },
  { value: 'LIMPEZA', label: 'Limpeza', category: 'INSUMOS' },
  { value: 'HORTIFRUTE', label: 'Hortifrute', category: 'INSUMOS' },
  { value: 'CARNES', label: 'Carnes', category: 'INSUMOS' },
  { value: 'BEBIDAS', label: 'Bebidas', category: 'INSUMOS' },
  { value: 'PEIXES', label: 'Peixes', category: 'INSUMOS' },
  { value: 'SUPERMERCADO', label: 'SuperMercado', category: 'INSUMOS' },
  
  // Fixas
  { value: 'IMPOSTOS', label: 'Impostos', category: 'FIXAS' },
  { value: 'EMPRESTIMOS', label: 'Empréstimos', category: 'FIXAS' },
];

export const getSubcategoriesByCategory = (category: string): Subcategory[] => {
  return subcategories.filter(sub => sub.category === category);
};

export const getSubcategoryLabel = (subcategoryValue: string): string => {
  const subcategory = subcategories.find(sub => sub.value === subcategoryValue);
  return subcategory?.label || subcategoryValue;
};

export const companies = [
  { value: 'Johnny Rockets', label: 'Johnny Rockets' },
  { value: 'Companhia do Churrasco', label: 'Companhia do Churrasco' },
  { value: 'Camerino', label: 'Camerino' },
];

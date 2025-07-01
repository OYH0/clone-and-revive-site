
import { Despesa } from '@/hooks/useDespesas';

// Função para obter o valor correto de uma despesa (prioriza valor_total que inclui juros)
export const getExpenseValue = (despesa: Despesa): number => {
  // Priorizar valor_total se existir e for maior que 0, senão usar valor
  return despesa.valor_total && despesa.valor_total > 0 ? despesa.valor_total : (despesa.valor || 0);
};

// Função para filtrar despesas excluindo maio de 2025
export const filterExpensesExcludingMay2025 = (despesas: Despesa[]): Despesa[] => {
  return despesas.filter(despesa => {
    if (!despesa.data_vencimento && !despesa.data) return true;
    
    // Usar data_vencimento se disponível, senão usar data
    const dateToCheck = despesa.data_vencimento || despesa.data;
    if (!dateToCheck) return true;
    
    // Parse da data
    const dateParts = dateToCheck.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    
    // Excluir maio de 2025 (mês 5)
    return !(year === 2025 && month === 5);
  });
};

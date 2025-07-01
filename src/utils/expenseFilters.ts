
export const getExpenseValue = (despesa: any) => {
  // Priorizar valor_total, depois valor
  if (despesa.valor_total && despesa.valor_total > 0) {
    return despesa.valor_total;
  }
  return despesa.valor || 0;
};

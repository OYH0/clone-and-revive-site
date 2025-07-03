
import { Despesa } from '@/hooks/useDespesas';
import { Transaction } from '@/types/transaction';

export const despesaToTransaction = (despesa: Despesa): Transaction => {
  return {
    id: despesa.id,
    date: despesa.data || despesa.data_vencimento || '',
    valor: despesa.valor || 0,
    company: despesa.empresa || '',
    description: despesa.descricao || '',
    category: despesa.categoria || '',
    subcategoria: despesa.subcategoria,
    data_vencimento: despesa.data_vencimento,
    comprovante: despesa.comprovante,
    status: despesa.status,
    user_id: despesa.user_id,
    valor_juros: despesa.valor_juros,
    valor_total: despesa.valor_total,
  };
};

export const despesasToTransactions = (despesas: Despesa[]): Transaction[] => {
  return despesas.map(despesaToTransaction);
};

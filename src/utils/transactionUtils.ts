
import { Despesa } from '@/hooks/useDespesas';
import { Transaction, TransactionStatus } from '@/types/transaction';

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

export const getTransactionStatus = (transaction: Transaction): TransactionStatus => {
  // Se tem status definido e é PAGO, retorna PAGO
  if (transaction.status === 'PAGO') {
    return 'PAGO';
  }
  
  // Se não tem data de vencimento, considera PENDENTE
  if (!transaction.data_vencimento) {
    return 'PENDENTE';
  }
  
  const today = new Date();
  const dueDate = new Date(transaction.data_vencimento + 'T00:00:00');
  
  // Se passou da data de vencimento, é ATRASADO
  if (dueDate < today) {
    return 'ATRASADO';
  }
  
  return 'PENDENTE';
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'FIXAS': 'bg-blue-100 text-blue-800',
    'VARIÁVEIS': 'bg-green-100 text-green-800',
    'VARIAVEIS': 'bg-green-100 text-green-800',
    'INSUMOS': 'bg-purple-100 text-purple-800',
    'ATRASADOS': 'bg-red-100 text-red-800',
    'IMPLEMENTAÇÃO': 'bg-orange-100 text-orange-800',
    'IMPLEMENTACAO': 'bg-orange-100 text-orange-800'
  };
  
  return colors[category?.toUpperCase()] || 'bg-gray-100 text-gray-800';
};

export const getStatusColor = (status: TransactionStatus): string => {
  const colors: Record<TransactionStatus, string> = {
    'PAGO': 'bg-green-100 text-green-800',
    'PENDENTE': 'bg-yellow-100 text-yellow-800',
    'ATRASADO': 'bg-red-100 text-red-800'
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const truncateDescription = (description: string, maxLength: number = 100): { text: string; isTruncated: boolean } => {
  if (!description || description.length <= maxLength) {
    return { text: description || '', isTruncated: false };
  }
  
  return {
    text: description.substring(0, maxLength) + '...',
    isTruncated: true
  };
};


export const getTransactionStatus = (transaction: any) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const transactionDate = new Date(transaction.date);
  transactionDate.setHours(0, 0, 0, 0);
  
  // Se tem um campo específico de status pago, usar ele
  if (transaction.status === 'PAGO') {
    return 'PAGO';
  }
  
  // Se é categoria ATRASADOS (independente da data)
  if (transaction.category === 'ATRASADOS') {
    return 'ATRASADO';
  }
  
  // Se tem data de vencimento, usar ela para determinar se está atrasado
  if (transaction.data_vencimento) {
    const dueDate = new Date(transaction.data_vencimento);
    dueDate.setHours(0, 0, 0, 0);
    
    // Se a data de vencimento já passou, está atrasado
    if (dueDate < today) {
      return 'ATRASADO';
    }
  }
  
  // Se a data da transação é futura, está pendente
  if (transactionDate > today) {
    return 'PENDENTE';
  }
  
  // Se a data da transação é hoje ou anterior, está pago
  return 'PAGO';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PAGO':
      return 'bg-green-500 text-white';
    case 'PENDENTE':
      return 'bg-yellow-500 text-white';
    case 'ATRASADO':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'INSUMOS':
      return 'bg-blue-500 text-white';
    case 'FIXAS':
      return 'bg-purple-500 text-white';
    case 'VARIÁVEIS':
      return 'bg-orange-500 text-white';
    case 'ATRASADOS':
      return 'bg-red-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const truncateDescription = (description: string, maxLength: number = 30) => {
  if (description.length <= maxLength) {
    return { text: description, isTruncated: false };
  }
  return { 
    text: description.substring(0, maxLength) + '...', 
    isTruncated: true 
  };
};

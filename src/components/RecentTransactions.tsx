
import React from 'react';
import { getTransactionStatus, getCategoryColor, getStatusColor } from '@/utils/transactionUtils';

interface RecentTransactionsProps {
  despesas?: any[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ despesas }) => {
  
  // Use filtered data from props
  const transactions = despesas?.slice(0, 5).map(despesa => ({
    id: despesa.id,
    date: new Date(despesa.data).toLocaleDateString('pt-BR'),
    company: despesa.empresa,
    description: despesa.descricao,
    category: despesa.categoria,
    value: despesa.valor,
    status: getTransactionStatus({
      date: despesa.data,
      category: despesa.categoria,
      data_vencimento: despesa.data_vencimento
    })
  })) || [];

  const getCompanyColor = (company: string) => {
    return company === 'Churrasco' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Não há transações para exibir.</p>
        <p className="text-sm mt-2">Adicione transações para visualizá-las aqui.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 text-sm">
            <th className="pb-4 font-medium">Data</th>
            <th className="pb-4 font-medium">Empresa</th>
            <th className="pb-4 font-medium">Descrição</th>
            <th className="pb-4 font-medium">Categoria</th>
            <th className="pb-4 font-medium">Valor</th>
            <th className="pb-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-200">
              <td className="py-3 text-gray-800 text-sm">{transaction.date}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-2xl text-xs ${getCompanyColor(transaction.company)}`}>
                  {transaction.company}
                </span>
              </td>
              <td className="py-3 text-gray-800 text-sm">{transaction.description}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-2xl text-xs ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </td>
              <td className="py-3 text-gray-800 font-medium">
                R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded-2xl text-xs ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;

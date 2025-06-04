
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useDespesas } from '@/hooks/useDespesas';

const RecentTransactions: React.FC = () => {
  const { data: despesas } = useDespesas();
  
  const getTransactionStatus = (despesa: any) => {
    const today = new Date();
    const transactionDate = new Date(despesa.data);
    const dueDate = despesa.data_vencimento ? new Date(despesa.data_vencimento) : transactionDate;
    
    if (despesa.data_vencimento && dueDate < today) {
      return 'ATRASADO';
    }
    
    if (despesa.categoria === 'ATRASADOS') {
      return 'ATRASADO';
    }
    
    if (transactionDate > today) {
      return 'PENDENTE';
    }
    
    return 'PAGO';
  };
  
  // Use actual data from database if available, otherwise show empty or sample data
  const transactions = despesas?.slice(0, 5).map(despesa => ({
    id: despesa.id,
    date: new Date(despesa.data).toLocaleDateString('pt-BR'),
    company: despesa.empresa,
    description: despesa.descricao,
    category: despesa.categoria,
    value: despesa.valor,
    status: getTransactionStatus(despesa)
  })) || [];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INSUMOS':
        return 'bg-blue-500 text-white';
      case 'FIXAS':
        return 'bg-teal-500 text-white';
      case 'VARIAVEIS':
        return 'bg-orange-500 text-white';
      case 'ATRASADOS':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
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
            <th className="pb-4 font-medium">Ações</th>
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
              <td className="py-3">
                <div className="flex gap-2">
                  <button className="text-blue-500 hover:text-blue-700 p-1">
                    <Edit size={14} />
                  </button>
                  <button className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactions;

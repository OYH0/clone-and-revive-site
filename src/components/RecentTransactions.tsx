
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  const transactions = [
    {
      id: 1,
      date: '27/05/2025',
      company: 'Churrasco',
      description: 'COMPRAS',
      category: 'INSUMOS',
      value: 2250.00,
      status: 'PAGO'
    },
    {
      id: 2,
      date: '27/05/2025',
      company: 'Johnny',
      description: 'MANUTENÇÃO VEÍCULOS',
      category: 'FIXAS',
      value: 5200.00,
      status: 'PAGO'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INSUMOS':
        return 'bg-blue-500 text-white';
      case 'FIXAS':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getCompanyColor = (company: string) => {
    return company === 'Churrasco' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-300 text-sm">
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
            <tr key={transaction.id} className="border-t border-slate-600">
              <td className="py-3 text-white text-sm">{transaction.date}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs ${getCompanyColor(transaction.company)}`}>
                  {transaction.company}
                </span>
              </td>
              <td className="py-3 text-white text-sm">{transaction.description}</td>
              <td className="py-3">
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </td>
              <td className="py-3 text-white font-medium">
                R$ {transaction.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3">
                <span className="px-2 py-1 rounded text-xs bg-green-500 text-white">
                  {transaction.status}
                </span>
              </td>
              <td className="py-3">
                <div className="flex gap-2">
                  <button className="text-blue-400 hover:text-blue-300 p-1">
                    <Edit size={14} />
                  </button>
                  <button className="text-red-400 hover:text-red-300 p-1">
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

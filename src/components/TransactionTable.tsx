
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const handleEdit = (transaction: Transaction) => {
    console.log('Editando transação:', transaction);
    // TODO: Implementar modal de edição
  };

  const handleDelete = (transaction: Transaction) => {
    console.log('Deletando transação:', transaction);
    // TODO: Implementar confirmação e exclusão
  };

  const getStatusColor = (status: string) => {
    return status === 'PAGO' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'INSUMOS':
        return 'bg-blue-500 text-white';
      case 'FIXAS':
        return 'bg-purple-500 text-white';
      case 'ATRASADOS':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Data</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Empresa</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Descrição</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Categoria</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Valor</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Status</th>
            <th className="text-left text-gray-700 py-3 px-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-900">
                {new Date(transaction.date).toLocaleDateString('pt-BR')}
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded text-xs bg-blue-500 text-white">
                  {transaction.company}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(transaction.category)}`}>
                  {transaction.category}
                </span>
              </td>
              <td className="py-3 px-4 text-gray-900 font-medium">
                R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor('PAGO')}`}>
                  PAGO
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(transaction)}
                    className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(transaction)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
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

export default TransactionTable;

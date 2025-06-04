import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface TransactionTableProps {
  transactions: Transaction[];
  onTransactionUpdated: () => void;
  type?: 'despesa' | 'receita';
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onTransactionUpdated,
  type = 'despesa'
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const getTransactionStatus = (transaction: Transaction) => {
    const today = new Date();
    const transactionDate = new Date(transaction.date);
    const dueDate = transaction.data_vencimento ? new Date(transaction.data_vencimento) : transactionDate;
    
    // Se tem data de vencimento e está atrasada
    if (transaction.data_vencimento && dueDate < today) {
      return 'ATRASADO';
    }
    
    // Se é categoria ATRASADOS
    if (transaction.category === 'ATRASADOS') {
      return 'ATRASADO';
    }
    
    // Se a data da transação é futura, está pendente
    if (transactionDate > today) {
      return 'PENDENTE';
    }
    
    // Se não tem data de vencimento ou está dentro do prazo
    return 'PAGO';
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

  const getCategoryColor = (category: string) => {
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

  return (
    <>
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
            {transactions.map((transaction) => {
              const status = getTransactionStatus(transaction);
              return (
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
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(status)}`}>
                      {status}
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
              );
            })}
          </tbody>
        </table>
      </div>

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onTransactionUpdated={onTransactionUpdated}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        transaction={deletingTransaction}
        onTransactionDeleted={onTransactionUpdated}
        type={type}
      />
    </>
  );
};

export default TransactionTable;


import React from 'react';
import { Edit, Trash2, CheckCircle, Paperclip, Eye } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { getTransactionStatus } from '@/utils/transactionUtils';

interface ActionsCellProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onMarkAsPaid: (transaction: Transaction) => void;
  onAttachReceipt: (transaction: Transaction) => void;
  onViewReceipt?: (transaction: Transaction) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  transaction,
  onEdit,
  onDelete,
  onMarkAsPaid,
  onAttachReceipt,
  onViewReceipt
}) => {
  const status = getTransactionStatus(transaction);
  const isPaid = status === 'PAGO';

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(transaction)}
        className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
        title="Editar"
      >
        <Edit size={16} />
      </button>
      
      {!isPaid && (
        <button
          onClick={() => onMarkAsPaid(transaction)}
          className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
          title="Marcar como Pago"
        >
          <CheckCircle size={16} />
        </button>
      )}
      
      {transaction.comprovante && onViewReceipt && (
        <button
          onClick={() => onViewReceipt(transaction)}
          className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50"
          title="Visualizar Comprovante"
        >
          <Eye size={16} />
        </button>
      )}
      
      <button
        onClick={() => onAttachReceipt(transaction)}
        className={`p-1 rounded ${transaction.comprovante ? 'text-green-500 hover:text-green-700 hover:bg-green-50' : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
        title={transaction.comprovante ? "Comprovante anexado" : "Anexar Comprovante"}
      >
        <Paperclip size={16} />
      </button>
      
      <button
        onClick={() => onDelete(transaction)}
        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
        title="Excluir"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ActionsCell;

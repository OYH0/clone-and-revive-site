
import React from 'react';
import { Edit, Trash2, CheckCircle, Paperclip, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction';
import { getTransactionStatus } from '@/utils/transactionUtils';

interface ActionsCellProps {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onMarkAsPaid: (transaction: Transaction) => void;
  onAttachReceipt: (transaction: Transaction) => void;
  onViewReceipt: (transaction: Transaction) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  transaction,
  onEdit,
  onDelete,
  onMarkAsPaid,
  onAttachReceipt,
  onViewReceipt,
  canEdit = true,
  canDelete = true
}) => {
  const status = getTransactionStatus(transaction);

  return (
    <div className="flex gap-1">
      {canEdit ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(transaction)}
          className="h-8 w-8 p-0 hover:bg-blue-100"
          title="Editar"
        >
          <Edit size={14} className="text-blue-600" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 opacity-50"
          title="Sem permissão para editar"
        >
          <Lock size={14} className="text-gray-400" />
        </Button>
      )}

      {canDelete ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(transaction)}
          className="h-8 w-8 p-0 hover:bg-red-100"
          title="Excluir"
        >
          <Trash2 size={14} className="text-red-600" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 opacity-50"
          title="Sem permissão para excluir"
        >
          <Lock size={14} className="text-gray-400" />
        </Button>
      )}

      {status !== 'PAGO' && canEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMarkAsPaid(transaction)}
          className="h-8 w-8 p-0 hover:bg-green-100"
          title="Marcar como pago"
        >
          <CheckCircle size={14} className="text-green-600" />
        </Button>
      )}

      {transaction.comprovante ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewReceipt(transaction)}
          className="h-8 w-8 p-0 hover:bg-purple-100"
          title="Ver comprovante"
        >
          <Eye size={14} className="text-purple-600" />
        </Button>
      ) : canEdit ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAttachReceipt(transaction)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
          title="Anexar comprovante"
        >
          <Paperclip size={14} className="text-gray-600" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 opacity-50"
          title="Sem permissão para anexar"
        >
          <Lock size={14} className="text-gray-400" />
        </Button>
      )}
    </div>
  );
};

export default ActionsCell;

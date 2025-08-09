import React, { useState } from 'react';
import { MoreHorizontal, Eye, Edit, Trash2, Clock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import EditTransactionModal from '@/components/EditTransactionModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import ViewReceiptModal from '@/components/ViewReceiptModal';
import { Transaction } from '@/types/transaction';
import { useAdminAccess } from '@/hooks/useAdminAccess';

interface ActionsCellProps {
  transaction: Transaction;
  onTransactionUpdated: () => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ transaction, onTransactionUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  
  const { isAdmin } = useAdminAccess();

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsReceiptModalOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Comprovante
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isAdmin && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          transaction={transaction}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}

      {isAdmin && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          transaction={transaction}
          onTransactionDeleted={onTransactionUpdated}
          type="despesa"
        />
      )}

      <ViewReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptPath={transaction.comprovante || ''}
        transactionDescription={transaction.description}
      />

    </div>
  );
};

export default ActionsCell;

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteDespesa } from '@/hooks/useDespesas';
import { useDeleteReceita } from '@/hooks/useReceitas';
import { Transaction } from '@/types/transaction';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onTransactionDeleted: () => void;
  type: 'despesa' | 'receita';
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onTransactionDeleted,
  type
}) => {
  const deleteDespesa = useDeleteDespesa();
  const deleteReceita = useDeleteReceita();

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      if (type === 'despesa') {
        await deleteDespesa.mutateAsync(transaction.id);
      } else {
        await deleteReceita.mutateAsync(transaction.id);
      }
      
      onTransactionDeleted();
      onClose();
    } catch (error) {
      console.error(`Erro ao excluir ${type}:`, error);
    }
  };

  const isLoading = deleteDespesa.isPending || deleteReceita.isPending;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            Tem certeza que deseja excluir esta {type}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-4">
          <div>
            <span className="font-medium text-gray-700">Empresa:</span>
            <div className="text-gray-900">{transaction?.company}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Descrição:</span>
            <div className="text-gray-900 break-words max-w-full overflow-hidden text-sm">
              {transaction?.description}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Valor:</span>
            <div className="text-gray-900">
              R$ {transaction?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          <AlertDialogCancel onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;

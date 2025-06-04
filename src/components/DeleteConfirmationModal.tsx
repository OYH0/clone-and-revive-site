
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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2">
            <div className="mb-4">
              Tem certeza que deseja excluir esta {type}? Esta ação não pode ser desfeita.
            </div>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Empresa:</span> {transaction?.company}
              </div>
              <div>
                <span className="font-medium">Descrição:</span> 
                <div className="break-words max-w-full overflow-hidden">
                  {transaction?.description}
                </div>
              </div>
              <div>
                <span className="font-medium">Valor:</span> R$ {transaction?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;


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
import { useUpdateSaldo } from '@/hooks/useSaldos';
import { Transaction } from '@/types/transaction';
import { truncateDescription } from '@/utils/transactionUtils';

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
  const updateSaldo = useUpdateSaldo();

  const handleDelete = async () => {
    if (!transaction) return;

    try {
      console.log('=== EXCLUINDO TRANSAÇÃO ===');
      console.log('Tipo:', type);
      console.log('Status:', transaction.status);
      console.log('Origem pagamento:', transaction.origem_pagamento);
      console.log('Valor total:', transaction.valor_total || transaction.valor);

      // Se for uma despesa PAGA com origem de pagamento, reverter o saldo
      if (type === 'despesa' && transaction.status === 'PAGO' && transaction.origem_pagamento) {
        const valorReverter = transaction.valor_total || transaction.valor;
        console.log('Revertendo saldo - Adicionando', valorReverter, 'ao', transaction.origem_pagamento);
        
        // Adicionar de volta o valor ao saldo (valor positivo para adicionar)
        updateSaldo.mutate({
          tipo: transaction.origem_pagamento as 'conta' | 'cofre',
          valor: valorReverter
        });
      }

      // Para receitas, a lógica será implementada quando necessário
      // O tipo Transaction atualmente é focado em despesas

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

  // Truncar a descrição para exibição no modal
  const { text: truncatedDescription } = truncateDescription(transaction?.description || '', 50);

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-lg font-semibold">
            Confirmar Exclusão
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Tem certeza que deseja excluir esta {type}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Empresa:</label>
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
              {transaction?.company}
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Descrição:</label>
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border break-words">
              {truncatedDescription}
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Valor:</label>
            <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded border font-medium">
              R$ {transaction?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <AlertDialogCancel 
            onClick={onClose} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
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

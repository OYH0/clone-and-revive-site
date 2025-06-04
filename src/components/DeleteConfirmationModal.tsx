
import React, { useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transaction';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onTransactionDeleted: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onTransactionDeleted
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!transaction || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('despesas')
        .delete()
        .eq('id', transaction.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Despesa excluída com sucesso!",
      });

      onTransactionDeleted();
      onClose();
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir despesa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.
            <br />
            <br />
            <strong>Empresa:</strong> {transaction?.company}
            <br />
            <strong>Descrição:</strong> {transaction?.description}
            <br />
            <strong>Valor:</strong> R$ {transaction?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationModal;

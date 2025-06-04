
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import DescriptionCell from './table/DescriptionCell';
import StatusCell from './table/StatusCell';
import CategoryCell from './table/CategoryCell';
import ActionsCell from './table/ActionsCell';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  const { toast } = useToast();
  const { user } = useAuth();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleMarkAsPaid = async (transaction: Transaction) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('Marking transaction as paid:', transaction.id, 'Setting date to:', today);
      
      const updateData: any = {
        data: today,
        categoria: transaction.category === 'ATRASADOS' ? 'FIXAS' : transaction.category,
        status: 'PAGO'
      };

      const { error, data } = await supabase
        .from('despesas')
        .update(updateData)
        .eq('id', transaction.id)
        .eq('user_id', user.id)
        .select();

      if (error) {
        console.error('Error updating despesa:', error);
        throw error;
      }

      console.log('Transaction updated successfully:', data);

      toast({
        title: "Sucesso",
        description: "Despesa marcada como paga!",
      });

      onTransactionUpdated();
    } catch (error) {
      console.error('Erro ao marcar como paga:', error);
      toast({
        title: "Erro",
        description: "Erro ao marcar despesa como paga.",
        variant: "destructive",
      });
    }
  };

  const handleAttachReceipt = async (transaction: Transaction) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !user) return;

      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${transaction.id}_${Date.now()}.${fileExt}`;
        
        console.log('Uploading file:', fileName);
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded successfully, updating database...');

        const { error: updateError } = await supabase
          .from('despesas')
          .update({ comprovante: fileName })
          .eq('id', transaction.id)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Database update error:', updateError);
          throw updateError;
        }

        toast({
          title: "Sucesso",
          description: "Comprovante anexado com sucesso!",
        });

        onTransactionUpdated();
      } catch (error) {
        console.error('Erro ao anexar comprovante:', error);
        toast({
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao anexar comprovante.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Data</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-32">Empresa</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-40">Descrição</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-28">Categoria</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-32">Valor</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Status</th>
              <th className="text-left text-gray-700 py-3 px-4 font-medium w-36">Ações</th>
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
                <td className="py-3 px-4">
                  <div className="max-w-full overflow-hidden">
                    <DescriptionCell description={transaction.description} />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <CategoryCell category={transaction.category} />
                </td>
                <td className="py-3 px-4 text-gray-900 font-medium">
                  R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4">
                  <StatusCell transaction={transaction} />
                </td>
                <td className="py-3 px-4">
                  <ActionsCell
                    transaction={transaction}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onMarkAsPaid={handleMarkAsPaid}
                    onAttachReceipt={handleAttachReceipt}
                  />
                </td>
              </tr>
            ))}
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

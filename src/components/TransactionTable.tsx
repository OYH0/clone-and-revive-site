
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckCircle, Paperclip } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button } from '@/components/ui/button';
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

  // Create receipts bucket if it doesn't exist
  useEffect(() => {
    const createReceiptsBucket = async () => {
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const receiptsBucketExists = buckets?.some(bucket => bucket.name === 'receipts');
        
        if (!receiptsBucketExists) {
          await supabase.storage.createBucket('receipts', {
            public: false,
            allowedMimeTypes: ['image/*', 'application/pdf'],
            fileSizeLimit: 10485760 // 10MB
          });
          console.log('Receipts bucket created successfully');
        }
      } catch (error) {
        console.error('Error creating receipts bucket:', error);
      }
    };

    createReceiptsBucket();
  }, []);

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
      const { error } = await supabase
        .from('despesas')
        .update({
          data: today,
          categoria: transaction.category === 'ATRASADOS' ? 'FIXAS' : transaction.category
        })
        .eq('id', transaction.id)
        .eq('user_id', user.id);

      if (error) throw error;

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
        const fileName = `${transaction.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('receipts')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: updateError } = await supabase
          .from('despesas')
          .update({ comprovante: fileName })
          .eq('id', transaction.id)
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        toast({
          title: "Sucesso",
          description: "Comprovante anexado com sucesso!",
        });

        onTransactionUpdated();
      } catch (error) {
        console.error('Erro ao anexar comprovante:', error);
        toast({
          title: "Erro",
          description: "Erro ao anexar comprovante.",
          variant: "destructive",
        });
      }
    };
    input.click();
  };

  const getTransactionStatus = (transaction: Transaction) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const transactionDate = new Date(transaction.date);
    transactionDate.setHours(0, 0, 0, 0);
    
    const dueDate = transaction.data_vencimento ? new Date(transaction.data_vencimento) : transactionDate;
    dueDate.setHours(0, 0, 0, 0);
    
    // Se tem data de vencimento e está atrasada
    if (transaction.data_vencimento && dueDate < today) {
      return 'ATRASADO';
    }
    
    // Se é categoria ATRASADOS
    if (transaction.category === 'ATRASADOS') {
      return 'ATRASADO';
    }
    
    // Se a data da transação é hoje ou anterior, está pago
    if (transactionDate <= today) {
      return 'PAGO';
    }
    
    // Se a data da transação é futura, está pendente
    return 'PENDENTE';
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
              const isPaid = status === 'PAGO';
              
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
                      
                      {!isPaid && (
                        <button
                          onClick={() => handleMarkAsPaid(transaction)}
                          className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-50"
                          title="Marcar como Pago"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleAttachReceipt(transaction)}
                        className={`p-1 rounded ${transaction.comprovante ? 'text-green-500 hover:text-green-700 hover:bg-green-50' : 'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
                        title={transaction.comprovante ? "Comprovante anexado" : "Anexar Comprovante"}
                      >
                        <Paperclip size={16} />
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

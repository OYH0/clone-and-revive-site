
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import EditTransactionModal from './EditTransactionModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ViewReceiptModal from './ViewReceiptModal';
import MarkAsPaidModal from './MarkAsPaidModal';
import DescriptionCell from './table/DescriptionCell';
import StatusCell from './table/StatusCell';
import CategoryCell from './table/CategoryCell';
import ActionsCell from './table/ActionsCell';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAccess } from '@/hooks/useAdminAccess';

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
  const [viewingReceipt, setViewingReceipt] = useState<Transaction | null>(null);
  const [markingAsPaidTransaction, setMarkingAsPaidTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdminAccess();

  // Função para formatar data corretamente
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  // Função para obter a data atual no formato correto (YYYY-MM-DD)
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEdit = (transaction: Transaction) => {
    // Only allow editing if user is admin or owns the transaction
    if (isAdmin || transaction.user_id === user?.id) {
      setEditingTransaction(transaction);
    }
  };

  const handleDelete = (transaction: Transaction) => {
    // Only allow deletion if user is admin or owns the transaction
    if (isAdmin || transaction.user_id === user?.id) {
      setDeletingTransaction(transaction);
    }
  };

  const handleViewReceipt = (transaction: Transaction) => {
    setViewingReceipt(transaction);
  };

  const handleMarkAsPaidRequest = (transaction: Transaction) => {
    if (!user) return;
    
    // Only allow marking as paid if user is admin or owns the transaction
    if (!isAdmin && transaction.user_id !== user?.id) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para alterar esta despesa.",
        variant: "destructive",
      });
      return;
    }

    setMarkingAsPaidTransaction(transaction);
  };

  const handleMarkAsPaidConfirm = async (transaction: Transaction, paymentSource: 'cofre' | 'conta') => {
    if (!user) return;

    try {
      const today = getCurrentDate();
      
      console.log('Marking transaction as paid:', transaction.id, 'Setting payment date to:', today);
      
      const updateData: any = {
        data: today, // Now this represents the payment date
        categoria: transaction.category === 'ATRASADOS' ? 'FIXAS' : transaction.category,
        status: 'PAGO'
      };

      // Atualizar a despesa como paga
      const { error, data } = await supabase
        .from('despesas')
        .update(updateData)
        .eq('id', transaction.id)
        .select();

      if (error) {
        console.error('Error updating despesa:', error);
        throw error;
      }

      // Subtrair o valor do cofre ou conta correspondente
      const valorPago = transaction.valor_total || transaction.valor;
      const categoria = paymentSource === 'cofre' ? 'EM_COFRE' : 'EM_CONTA';
      
      // Criar uma entrada negativa nas receitas para subtrair o valor
      const { error: receitaError } = await supabase
        .from('receitas')
        .insert({
          data: today,
          valor: -valorPago,
          descricao: `Pagamento: ${transaction.description}`,
          empresa: transaction.company,
          categoria: categoria,
          data_recebimento: today,
          user_id: user.id
        });

      if (receitaError) {
        console.error('Error creating negative receipt:', receitaError);
        // Continue even if the receipt creation fails
      }

      console.log('Transaction updated successfully:', data);

      const formattedDate = new Date(today).toLocaleDateString('pt-BR');
      const sourceText = paymentSource === 'cofre' ? 'cofre' : 'conta';

      toast({
        title: "Sucesso",
        description: `Despesa marcada como paga em ${formattedDate} e valor deduzido do ${sourceText}!`,
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
    if (!user) return;
    
    // Only allow attaching receipt if user is admin or owns the transaction
    if (!isAdmin && transaction.user_id !== user?.id) {
      toast({
        title: "Erro",
        description: "Você não tem permissão para alterar esta despesa.",
        variant: "destructive",
      });
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

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
          .eq('id', transaction.id);

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

  // Group transactions by payment date for bank statement format
  const groupedTransactions = () => {
    const groups: { [date: string]: Transaction[] } = {};
    
    transactions.forEach(transaction => {
      // Use payment date for paid transactions, otherwise group as "Pendentes"
      const groupKey = transaction.status === 'PAGO' && transaction.date 
        ? transaction.date 
        : 'pending';
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(transaction);
    });
    
    return groups;
  };

  const groups = groupedTransactions();
  const sortedDates = Object.keys(groups).sort((a, b) => {
    if (a === 'pending') return 1;
    if (b === 'pending') return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const calculateDailyTotal = (transactions: Transaction[]) => {
    return transactions.reduce((total, transaction) => 
      total + (transaction.valor_total || transaction.valor), 0
    );
  };

  return (
    <>
      <div className="overflow-x-auto">
        {/* Versão desktop da tabela */}
        <div className="hidden lg:block">
          {sortedDates.map((date) => {
            const dateTransactions = groups[date];
            const dailyTotal = calculateDailyTotal(dateTransactions);
            const isToday = date !== 'pending';
            
            return (
              <div key={date} className="mb-6">
                {/* Data Header */}
                <div className="bg-gray-50 border-b-2 border-gray-200 px-4 py-3 mb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {date === 'pending' ? 'Pendentes' : formatDate(date)}
                    </h3>
                    <span className="font-bold text-red-600">
                      -{dailyTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
                
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Data de Pagamento</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Vencimento</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-28">Empresa</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-32">Descrição</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Categoria</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Valor</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Juros</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-24">Total</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-20">Status</th>
                      <th className="text-left text-gray-700 py-3 px-4 font-medium w-36">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900 text-sm">
                          {transaction.status === 'PAGO' ? formatDate(transaction.date) : '-'}
                        </td>
                        <td className="py-3 px-4 text-gray-900 text-sm">
                          {transaction.data_vencimento ? formatDate(transaction.data_vencimento) : '-'}
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
                        <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                          R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-gray-900 text-sm">
                          {transaction.valor_juros && transaction.valor_juros > 0 ? 
                            `R$ ${transaction.valor_juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 
                            '-'
                          }
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-medium text-sm">
                          R$ {(transaction.valor_total || transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <StatusCell transaction={transaction} />
                        </td>
                        <td className="py-3 px-4">
                          <ActionsCell
                            transaction={transaction}
                            onTransactionUpdated={onTransactionUpdated}
                            onMarkAsPaidRequest={handleMarkAsPaidRequest}
                            onAttachReceipt={handleAttachReceipt}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        {/* Versão mobile - Cards */}
        <div className="lg:hidden space-y-6">
          {sortedDates.map((date) => {
            const dateTransactions = groups[date];
            const dailyTotal = calculateDailyTotal(dateTransactions);
            
            return (
              <div key={date}>
                {/* Data Header Mobile */}
                <div className="bg-gray-50 border-b-2 border-gray-200 px-4 py-3 mb-4 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {date === 'pending' ? 'Pendentes' : formatDate(date)}
                    </h3>
                    <span className="font-bold text-red-600">
                      -{dailyTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {dateTransactions.map((transaction) => (
                    <div key={transaction.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            <DescriptionCell description={transaction.description} />
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded text-xs bg-blue-500 text-white">
                              {transaction.company}
                            </span>
                            <CategoryCell category={transaction.category} />
                          </div>
                        </div>
                        <StatusCell transaction={transaction} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Vencimento:</span>
                          <div>{transaction.data_vencimento ? formatDate(transaction.data_vencimento) : '-'}</div>
                        </div>
                        <div>
                          <span className="font-medium">Pagamento:</span>
                          <div>{transaction.status === 'PAGO' ? formatDate(transaction.date) : '-'}</div>
                        </div>
                        <div>
                          <span className="font-medium">Valor:</span>
                          <div className="text-gray-900 font-medium">
                            R$ {transaction.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Total:</span>
                          <div className="text-gray-900 font-medium">
                            R$ {(transaction.valor_total || transaction.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>

                      {transaction.valor_juros && transaction.valor_juros > 0 && (
                        <div className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Juros:</span> R$ {transaction.valor_juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <ActionsCell
                          transaction={transaction}
                          onTransactionUpdated={onTransactionUpdated}
                          onMarkAsPaidRequest={handleMarkAsPaidRequest}
                          onAttachReceipt={handleAttachReceipt}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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

      <ViewReceiptModal
        isOpen={!!viewingReceipt}
        onClose={() => setViewingReceipt(null)}
        receiptPath={viewingReceipt?.comprovante || ''}
        transactionDescription={viewingReceipt?.description || ''}
      />

      <MarkAsPaidModal
        isOpen={!!markingAsPaidTransaction}
        onClose={() => setMarkingAsPaidTransaction(null)}
        transaction={markingAsPaidTransaction}
        onConfirm={handleMarkAsPaidConfirm}
      />
    </>
  );
};

export default TransactionTable;

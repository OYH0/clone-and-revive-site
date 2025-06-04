
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { useDespesas } from '@/hooks/useDespesas';
import { Transaction } from '@/types/transaction';

const DespesasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: despesas = [], isLoading, refetch } = useDespesas();

  // Converter Despesa para Transaction
  const transactions: Transaction[] = despesas.map(despesa => ({
    id: despesa.id,
    date: despesa.data,
    valor: despesa.valor,
    company: despesa.empresa || 'Não informado',
    description: despesa.descricao || 'Sem descrição',
    category: despesa.categoria || 'Sem categoria',
    data_vencimento: despesa.data_vencimento
  }));

  const totalDespesas = despesas.reduce((sum, despesa) => sum + (despesa.valor || 0), 0);

  const handleTransactionAdded = () => {
    refetch();
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Despesas</h1>
            <p className="text-gray-600">Gerencie todas as despesas do negócio</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total de Despesas</h3>
                <p className="text-3xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nova Despesa
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <TransactionTable transactions={transactions} />
          </div>

          <AddTransactionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTransactionAdded={handleTransactionAdded}
          />
        </div>
      </div>
    </div>
  );
};

export default DespesasPage;

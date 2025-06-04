
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, TrendingDown, DollarSign, Calendar, FileText } from 'lucide-react';
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

  const handleTransactionUpdated = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                <TrendingDown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Despesas
                </h1>
                <p className="text-gray-600 text-lg">Gerencie todas as despesas do negócio</p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
                  <DollarSign className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Total de Despesas</h3>
                  <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{despesas.length} registros encontrados</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-200">
                  <Filter className="h-4 w-4" />
                  Filtrar
                </Button>
                <Button variant="outline" className="flex items-center gap-2 bg-white/50 hover:bg-white/80 border-gray-200">
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Nova Despesa
                </Button>
              </div>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Lista de Despesas</h2>
              </div>
            </div>
            <TransactionTable 
              transactions={transactions} 
              onTransactionUpdated={handleTransactionUpdated}
            />
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

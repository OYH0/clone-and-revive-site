
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import DespesasHeader from '@/components/DespesasHeader';
import DespesasStats from '@/components/DespesasStats';
import DespesasActions from '@/components/DespesasActions';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useDespesas } from '@/hooks/useDespesas';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transaction';
import { getTransactionStatus } from '@/utils/transactionUtils';

interface FilterOptions {
  empresa?: string;
  categoria?: string;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
  status?: string;
}

const DespesasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { data: despesas = [], isLoading, refetch } = useDespesas();
  const { user } = useAuth();

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
              <p className="text-gray-600 mb-8">Você precisa estar logado para acessar as despesas.</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Converter Despesa para Transaction
  const allTransactions: Transaction[] = despesas.map(despesa => ({
    id: despesa.id,
    date: despesa.data,
    valor: despesa.valor,
    company: despesa.empresa || 'Não informado',
    description: despesa.descricao || 'Sem descrição',
    category: despesa.categoria || 'Sem categoria',
    data_vencimento: despesa.data_vencimento,
    comprovante: despesa.comprovante
  }));

  // Aplicar filtros
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const status = getTransactionStatus(transaction);
      
      // Filtro por empresa
      if (filters.empresa && transaction.company !== filters.empresa) {
        return false;
      }
      
      // Filtro por categoria
      if (filters.categoria && transaction.category !== filters.categoria) {
        return false;
      }
      
      // Filtro por status
      if (filters.status && status !== filters.status) {
        return false;
      }
      
      // Filtro por data
      if (filters.dataInicio) {
        const transactionDate = new Date(transaction.date);
        if (transactionDate < filters.dataInicio) {
          return false;
        }
      }
      
      if (filters.dataFim) {
        const transactionDate = new Date(transaction.date);
        if (transactionDate > filters.dataFim) {
          return false;
        }
      }
      
      // Filtro por valor
      if (filters.valorMin && transaction.valor < filters.valorMin) {
        return false;
      }
      
      if (filters.valorMax && transaction.valor > filters.valorMax) {
        return false;
      }
      
      return true;
    });
  }, [allTransactions, filters]);

  const totalDespesas = filteredTransactions.reduce((sum, transaction) => sum + transaction.valor, 0);
  const despesasPagas = filteredTransactions.filter(t => getTransactionStatus(t) === 'PAGO');
  const despesasPendentes = filteredTransactions.filter(t => getTransactionStatus(t) === 'PENDENTE');
  const despesasAtrasadas = filteredTransactions.filter(t => getTransactionStatus(t) === 'ATRASADO');

  const valorPago = despesasPagas.reduce((sum, t) => sum + t.valor, 0);
  const valorPendente = despesasPendentes.reduce((sum, t) => sum + t.valor, 0);
  const valorAtrasado = despesasAtrasadas.reduce((sum, t) => sum + t.valor, 0);

  const handleTransactionAdded = () => {
    refetch();
    setIsModalOpen(false);
  };

  const handleTransactionUpdated = () => {
    refetch();
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
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

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <DespesasHeader
            filteredCount={filteredTransactions.length}
            totalCount={allTransactions.length}
            hasActiveFilters={hasActiveFilters}
          />

          <DespesasStats
            totalDespesas={totalDespesas}
            valorPago={valorPago}
            valorPendente={valorPendente}
            valorAtrasado={valorAtrasado}
            despesasPagasCount={despesasPagas.length}
            despesasPendentesCount={despesasPendentes.length}
            despesasAtrasadasCount={despesasAtrasadas.length}
            filteredTransactionsCount={filteredTransactions.length}
          />

          <DespesasActions
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onAddTransaction={() => setIsModalOpen(true)}
            filteredTransactions={filteredTransactions}
          />

          {/* Transaction Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-800">Lista de Despesas</h2>
                {hasActiveFilters && (
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-sm">
                    Filtrado
                  </span>
                )}
              </div>
            </div>
            <TransactionTable 
              transactions={filteredTransactions} 
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

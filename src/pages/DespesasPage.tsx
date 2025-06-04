
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import DespesasFilter from '@/components/DespesasFilter';
import DespesasExport from '@/components/DespesasExport';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, DollarSign, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
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
                {hasActiveFilters && (
                  <p className="text-sm text-purple-600">
                    Mostrando {filteredTransactions.length} de {allTransactions.length} registros
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Total de Despesas</h3>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{filteredTransactions.length} registros</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Pagas</h3>
                  <p className="text-2xl font-bold text-green-600">
                    R$ {valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{despesasPagas.length} despesas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Pendentes</h3>
                  <p className="text-2xl font-bold text-yellow-600">
                    R$ {valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{despesasPendentes.length} despesas</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Atrasadas</h3>
                  <p className="text-2xl font-bold text-red-600">
                    R$ {valorAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{despesasAtrasadas.length} despesas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <DespesasFilter 
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                <DespesasExport transactions={filteredTransactions} />
              </div>
              
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                Nova Despesa
              </Button>
            </div>
          </div>

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

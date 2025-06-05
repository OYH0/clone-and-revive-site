
import React, { useState, useMemo } from 'react';
import { Plus, TrendingDown, DollarSign, CheckCircle, Clock, AlertTriangle, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import DespesasFilterSimple from '@/components/DespesasFilterSimple';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDespesas } from '@/hooks/useDespesas';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Transaction } from '@/types/transaction';
import { getTransactionStatus } from '@/utils/transactionUtils';

const DespesasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('all');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { data: despesas = [], isLoading, refetch } = useDespesas();
  const { user } = useAuth();
  const { isAdmin } = useAdminAccess();

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100">
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
    comprovante: despesa.comprovante,
    status: despesa.status || null,
    user_id: despesa.user_id
  }));

  // Filtrar despesas
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      const status = getTransactionStatus(transaction);
      
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEmpresa = filterEmpresa === 'all' || transaction.company === filterEmpresa;
      const matchesCategoria = filterCategoria === 'all' || transaction.category === filterCategoria;
      const matchesStatus = filterStatus === 'all' || status === filterStatus;
      
      return matchesSearch && matchesEmpresa && matchesCategoria && matchesStatus;
    });
  }, [allTransactions, searchTerm, filterEmpresa, filterCategoria, filterStatus]);

  // Calcular estatísticas
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-lg text-gray-600">Carregando despesas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100">
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
            
            {isAdmin ? (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 rounded-2xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Despesa
              </Button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium">Modo Visualização</p>
                    <p className="text-blue-600 text-sm">Apenas administradores podem adicionar novas despesas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Despesas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{filteredTransactions.length} despesas cadastradas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Valor Pago</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  R$ {valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{despesasPagas.length} despesas pagas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas Pendentes</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{despesasPendentes.length}</div>
                <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas Atrasadas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {despesasAtrasadas.length}
                </div>
                <p className="text-xs text-gray-500 mt-1">Vencidas</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <DespesasFilterSimple
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterEmpresa={filterEmpresa}
            setFilterEmpresa={setFilterEmpresa}
            filterCategoria={filterCategoria}
            setFilterCategoria={setFilterCategoria}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Main Content Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">Lista de Despesas</CardTitle>
                  <CardDescription className="text-gray-600">
                    {filteredTransactions.length} despesa(s) encontrada(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <TransactionTable 
                transactions={filteredTransactions} 
                onTransactionUpdated={handleTransactionUpdated}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {isAdmin && (
        <AddTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTransactionAdded={handleTransactionAdded}
        />
      )}
    </div>
  );
};

export default DespesasPage;

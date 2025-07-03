
import React, { useState, useMemo } from 'react';
import { Building2, Plus, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DespesasFilterSimple from '@/components/DespesasFilterSimple';
import TransactionTable from '@/components/TransactionTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import ImplementacaoCharts from '@/components/implementacao/ImplementacaoCharts';
import ImplementacaoStats from '@/components/implementacao/ImplementacaoStats';
import { despesasToTransactions } from '@/utils/transactionUtils';

const ImplementacaoPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: allDespesas, isLoading: despesasLoading, refetch: refetchDespesas } = useDespesas();
  const { data: allReceitas, isLoading: receitasLoading } = useReceitas();
  const { isAdmin } = useAdminAccess();

  const implementacaoDespesas = useMemo(() => {
    return allDespesas?.filter(despesa => {
      const empresa = despesa.empresa?.toLowerCase().trim() || '';
      return empresa === 'implementação' || empresa === 'implementacao';
    }) || [];
  }, [allDespesas]);

  const implementacaoReceitas = useMemo(() => {
    return allReceitas?.filter(receita => {
      const empresa = receita.empresa?.toLowerCase().trim() || '';
      return empresa === 'implementação' || empresa === 'implementacao';
    }) || [];
  }, [allReceitas]);

  const filteredDespesas = useMemo(() => {
    return implementacaoDespesas.filter(despesa => {
      const matchesSearch = despesa.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           despesa.empresa?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategoria = filterCategoria === 'all' || despesa.categoria === filterCategoria;
      const matchesStatus = filterStatus === 'all' || despesa.status === filterStatus;
      
      return matchesSearch && matchesCategoria && matchesStatus;
    });
  }, [implementacaoDespesas, searchTerm, filterCategoria, filterStatus]);

  const handleTransactionAdded = () => {
    refetchDespesas();
    setIsModalOpen(false);
  };

  const handleTransactionUpdated = () => {
    refetchDespesas();
  };

  const isLoading = despesasLoading || receitasLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-lg text-gray-600">Carregando dados da Implementação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Implementação
                </h1>
                <p className="text-gray-600 text-lg">Gestão financeira de projetos de implementação</p>
              </div>
            </div>
            
            {isAdmin ? (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 rounded-2xl"
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
          <ImplementacaoStats despesas={implementacaoDespesas} receitas={implementacaoReceitas} />

          {/* Charts */}
          <ImplementacaoCharts despesas={implementacaoDespesas} receitas={implementacaoReceitas} />

          {/* Filters */}
          <DespesasFilterSimple
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
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
                  <CardTitle className="text-xl text-gray-800">Despesas da Implementação</CardTitle>
                  <CardDescription className="text-gray-600">
                    {filteredDespesas.length} despesa(s) encontrada(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <TransactionTable 
                transactions={despesasToTransactions(filteredDespesas)} 
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
          defaultEmpresa="Implementação"
        />
      )}
    </div>
  );
};

export default ImplementacaoPage;

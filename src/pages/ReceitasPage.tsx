
import React, { useState } from 'react';
import { Plus, TrendingUp, DollarSign, Calendar, Shield } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddReceitaModal from '@/components/AddReceitaModal';
import ReceitaTable from '@/components/ReceitaTable';
import ReceitasFilter from '@/components/ReceitasFilter';
import { useReceitas } from '@/hooks/useReceitas';
import { useAdminAccess } from '@/hooks/useAdminAccess';

const ReceitasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('all');
  const [filterCategoria, setFilterCategoria] = useState('all');
  
  const { data: receitas, isLoading } = useReceitas();
  const { isAdmin } = useAdminAccess();

  // Calcular estatísticas
  const totalReceitas = receitas?.reduce((sum, receita) => sum + receita.valor, 0) || 0;
  const receitasRecebidas = receitas?.filter(r => r.data_recebimento).length || 0;
  const receitasPendentes = receitas?.filter(r => !r.data_recebimento).length || 0;
  const valorRecebido = receitas?.filter(r => r.data_recebimento).reduce((sum, receita) => sum + receita.valor, 0) || 0;

  // Filtrar receitas
  const filteredReceitas = receitas?.filter(receita => {
    const matchesSearch = receita.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         receita.empresa.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEmpresa = filterEmpresa === 'all' || receita.empresa === filterEmpresa;
    const matchesCategoria = filterCategoria === 'all' || receita.categoria === filterCategoria;
    
    return matchesSearch && matchesEmpresa && matchesCategoria;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
        <Sidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-lg text-gray-600">Carregando receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Receitas
                </h1>
                <p className="text-gray-600 text-lg">Gerencie todas as receitas do negócio</p>
              </div>
            </div>
            
            {isAdmin ? (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 rounded-2xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Receita
              </Button>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-blue-800 font-medium">Modo Visualização</p>
                    <p className="text-blue-600 text-sm">Apenas administradores podem adicionar novas receitas.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Receitas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{receitas?.length || 0} receitas cadastradas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Valor Recebido</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  R$ {valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{receitasRecebidas} receitas recebidas</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Receitas Pendentes</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{receitasPendentes}</div>
                <p className="text-xs text-gray-500 mt-1">Aguardando recebimento</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Taxa de Recebimento</CardTitle>
                <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">
                  {receitas?.length ? Math.round((receitasRecebidas / receitas.length) * 100) : 0}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Receitas já recebidas</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <ReceitasFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterEmpresa={filterEmpresa}
            setFilterEmpresa={setFilterEmpresa}
            filterCategoria={filterCategoria}
            setFilterCategoria={setFilterCategoria}
          />

          {/* Main Content Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-800">Lista de Receitas</CardTitle>
                  <CardDescription className="text-gray-600">
                    {filteredReceitas.length} receita(s) encontrada(s)
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ReceitaTable receitas={filteredReceitas} />
            </CardContent>
          </Card>
        </div>
      </div>

      {isAdmin && (
        <AddReceitaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default ReceitasPage;

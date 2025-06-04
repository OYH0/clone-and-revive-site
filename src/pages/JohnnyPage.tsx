
import React from 'react';
import { Building2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDespesas } from '@/hooks/useDespesas';

const JohnnyPage = () => {
  const { data: despesas } = useDespesas();
  
  const johnnyDespesas = despesas?.filter(d => d.empresa === 'Johnny') || [];
  const totalDespesas = johnnyDespesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const despesasInsumos = johnnyDespesas.filter(d => d.categoria === 'INSUMOS').length;
  const despesasFixas = johnnyDespesas.filter(d => d.categoria === 'FIXAS').length;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Johnny Rockets
                </h1>
                <p className="text-gray-600 text-lg">Gestão financeira do Johnny Rockets</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Despesas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">Total acumulado</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas de Insumos</CardTitle>
                <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{despesasInsumos}</div>
                <p className="text-xs text-gray-500 mt-1">Registros de insumos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas Fixas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{despesasFixas}</div>
                <p className="text-xs text-gray-500 mt-1">Registros fixos</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Registros</CardTitle>
                <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg">
                  <Building2 className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{johnnyDespesas.length}</div>
                <p className="text-xs text-gray-500 mt-1">Todas as movimentações</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Principais Categorias</CardTitle>
                <CardDescription className="text-gray-600">
                  Distribuição de gastos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Insumos</span>
                    <span className="text-sm font-semibold text-orange-600">{despesasInsumos} registros</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Despesas Fixas</span>
                    <span className="text-sm font-semibold text-green-600">{despesasFixas} registros</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Despesas Variáveis</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {johnnyDespesas.filter(d => d.categoria === 'VARIÁVEIS').length} registros
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Últimas Movimentações</CardTitle>
                <CardDescription className="text-gray-600">
                  Registros mais recentes da empresa
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {johnnyDespesas.slice(0, 5).map((despesa) => (
                    <div key={despesa.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{despesa.descricao}</p>
                        <p className="text-xs text-gray-500">{despesa.categoria}</p>
                      </div>
                      <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        -R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  {johnnyDespesas.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>Nenhuma movimentação encontrada</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JohnnyPage;

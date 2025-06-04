
import React from 'react';
import { Plus, TrendingUp, DollarSign, FileText, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ReceitasPage = () => {
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
            
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Receitas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  R$ 0,00
                </div>
                <p className="text-xs text-gray-500 mt-1">+0% em relação ao mês anterior</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Receitas Pendentes</CardTitle>
                <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">0</div>
                <p className="text-xs text-gray-500 mt-1">Aguardando recebimento</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Receitas Recebidas</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">0</div>
                <p className="text-xs text-gray-500 mt-1">Já recebidas este mês</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <CardTitle className="text-xl text-gray-800">Lista de Receitas</CardTitle>
                  <CardDescription className="text-gray-600">
                    Todas as receitas registradas no sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12">
              <div className="text-center text-gray-500">
                <div className="mb-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma receita cadastrada ainda</h3>
                <p className="text-gray-500 mb-6">Comece adicionando sua primeira receita para começar a acompanhar suas entradas financeiras.</p>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar primeira receita
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReceitasPage;

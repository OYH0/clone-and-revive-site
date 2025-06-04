
import React from 'react';
import { BarChart3, FileText, Download, TrendingUp, PieChart } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExpenseDistributionChart from '@/components/ExpenseDistributionChart';
import MonthlyEvolutionChart from '@/components/MonthlyEvolutionChart';

const RelatoriosPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                    Relatórios
                  </h1>
                  <p className="text-gray-600 text-lg">Análises e estatísticas financeiras</p>
                </div>
              </div>
              
              <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-gray-200">
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <PieChart className="h-5 w-5 text-blue-600" />
                  </div>
                  Distribuição de Despesas
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Despesas por categoria
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ExpenseDistributionChart />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  Evolução Mensal
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Tendência de gastos ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <MonthlyEvolutionChart />
              </CardContent>
            </Card>
          </div>

          {/* Report Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl w-fit">
                  <FileText className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-gray-800">Relatório de Despesas</CardTitle>
                <CardDescription className="text-gray-600">
                  Análise detalhada das despesas por período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl w-fit">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-gray-800">Relatório de Receitas</CardTitle>
                <CardDescription className="text-gray-600">
                  Análise detalhada das receitas por período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl w-fit">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-gray-800">Fluxo de Caixa</CardTitle>
                <CardDescription className="text-gray-600">
                  Relatório consolidado de entradas e saídas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Gerar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatoriosPage;

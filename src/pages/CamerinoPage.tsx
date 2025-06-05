
import React, { useState } from 'react';
import { Building2, TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import AnalyseCostsModal from '@/components/AnalyseCostsModal';
import ProjectionsModal from '@/components/ProjectionsModal';
import ComparativeModal from '@/components/ComparativeModal';
import ExpenseDistribution from '@/components/ExpenseDistribution';
import MonthlyGoals from '@/components/MonthlyGoals';
import NextActions from '@/components/NextActions';

const CamerinoPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Filtrar dados do Camerino
  const camerinoDespesas = despesas?.filter(d => d.empresa === 'Camerino') || [];
  const camerinoReceitas = receitas?.filter(r => r.empresa === 'Camerino') || [];

  // Calcular estatísticas - removendo divisão por 100
  const totalDespesas = camerinoDespesas.reduce((sum, d) => sum + d.valor, 0);
  const totalReceitas = camerinoReceitas.reduce((sum, r) => sum + r.valor, 0);
  const lucro = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;

  const evolucaoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      const monthDespesas = camerinoDespesas.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);
      
      const monthReceitas = camerinoReceitas.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);
      
      return {
        month,
        despesas: monthDespesas,
        receitas: monthReceitas,
        lucro: monthReceitas - monthDespesas
      };
    });
  }, [camerinoDespesas, camerinoReceitas]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                  Camerino
                </h1>
                <p className="text-gray-600 text-lg">Análise financeira detalhada da empresa</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl h-12">
                Relatório Mensal
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-12"
                onClick={() => setActiveModal('costs')}
              >
                Análise de Custos
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-12"
                onClick={() => setActiveModal('projections')}
              >
                Projeções
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-12"
                onClick={() => setActiveModal('comparative')}
              >
                Comparativo
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{camerinoReceitas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Despesas Totais</CardTitle>
                <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
                  <DollarSign className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{camerinoDespesas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {lucro >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
                <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  R$ {camerinoReceitas.length > 0 ? (totalReceitas / camerinoReceitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por transação</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Evolução Mensal */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Evolução Mensal</CardTitle>
                <CardDescription>Performance financeira mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evolucaoMensal}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                      <Legend />
                      <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#8b5cf6" name="Despesas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Despesas */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Distribuição de Despesas</CardTitle>
                <CardDescription>Categorias de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseDistribution despesas={camerinoDespesas} empresa="Camerino" />
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Indicadores de Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Indicadores</CardTitle>
                <CardDescription>KPIs principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-purple-700 font-medium">ROI</span>
                  <span className="text-purple-800 font-bold">
                    {totalDespesas > 0 ? ((lucro / totalDespesas) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                  <span className="text-indigo-700 font-medium">Break Even</span>
                  <span className="text-indigo-800 font-bold">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-700 font-medium">Crescimento</span>
                  <span className="text-blue-800 font-bold">+15.2%</span>
                </div>
              </CardContent>
            </Card>

            {/* Metas e Objetivos */}
            <MonthlyGoals 
              totalReceitas={totalReceitas} 
              totalDespesas={totalDespesas} 
              empresa="Camerino" 
            />

            {/* Próximas Ações */}
            <NextActions empresa="Camerino" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnalyseCostsModal
        isOpen={activeModal === 'costs'}
        onClose={() => setActiveModal(null)}
        despesas={camerinoDespesas}
        empresa="Camerino"
      />

      <ProjectionsModal
        isOpen={activeModal === 'projections'}
        onClose={() => setActiveModal(null)}
        despesas={camerinoDespesas}
        receitas={camerinoReceitas}
        empresa="Camerino"
      />

      <ComparativeModal
        isOpen={activeModal === 'comparative'}
        onClose={() => setActiveModal(null)}
        empresa="Camerino"
      />
    </div>
  );
};

export default CamerinoPage;


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

const CompanhiaPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Filtrar dados da Companhia do Churrasco
  const companhiaDespesas = despesas?.filter(d => d.empresa === 'Churrasco') || [];
  const companhiaReceitas = receitas?.filter(r => r.empresa === 'Churrasco') || [];

  // Calcular estatísticas - removendo divisão por 100
  const totalDespesas = companhiaDespesas.reduce((sum, d) => sum + d.valor, 0);
  const totalReceitas = companhiaReceitas.reduce((sum, r) => sum + r.valor, 0);
  const lucro = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;

  const evolucaoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      const monthDespesas = companhiaDespesas.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);
      
      const monthReceitas = companhiaReceitas.filter(r => {
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
  }, [companhiaDespesas, companhiaReceitas]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Sidebar />
      
      <div className="flex-1 p-4 md:p-8 main-content">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                <Building2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                  Companhia do Churrasco
                </h1>
                <p className="text-gray-600 text-sm md:text-lg">Análise financeira detalhada da empresa</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl h-10 md:h-12 text-xs md:text-sm mobile-button">
                Relatório
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-10 md:h-12 text-xs md:text-sm mobile-button"
                onClick={() => setActiveModal('costs')}
              >
                Custos
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-10 md:h-12 text-xs md:text-sm mobile-button"
                onClick={() => setActiveModal('projections')}
              >
                Projeções
              </Button>
              <Button 
                variant="outline" 
                className="rounded-2xl h-10 md:h-12 text-xs md:text-sm mobile-button"
                onClick={() => setActiveModal('comparative')}
              >
                Comparativo
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mobile-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Receita Total</CardTitle>
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="mobile-padding">
                <div className="text-xl md:text-2xl font-bold text-green-600">
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{companhiaReceitas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mobile-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Despesas Totais</CardTitle>
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent className="mobile-padding">
                <div className="text-xl md:text-2xl font-bold text-red-600">
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{companhiaDespesas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mobile-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <BarChart3 className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="mobile-padding">
                <div className={`text-xl md:text-2xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {lucro >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mobile-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
                <CardTitle className="text-xs md:text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
                  <Users className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="mobile-padding">
                <div className="text-xl md:text-2xl font-bold text-purple-600">
                  R$ {companhiaReceitas.length > 0 ? (totalReceitas / companhiaReceitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por transação</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Evolução Mensal */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-800">Evolução Mensal</CardTitle>
                <CardDescription className="text-sm">Performance financeira mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evolucaoMensal}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                      <Legend />
                      <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Despesas */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-800">Distribuição de Despesas</CardTitle>
                <CardDescription className="text-sm">Categorias de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseDistribution despesas={companhiaDespesas} empresa="Companhia do Churrasco" />
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 responsive-grid">
            {/* Indicadores de Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg md:text-xl text-gray-800">Indicadores</CardTitle>
                <CardDescription className="text-sm">KPIs principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center p-2 md:p-3 bg-red-50 rounded-xl">
                  <span className="text-red-700 font-medium text-sm md:text-base">ROI</span>
                  <span className="text-red-800 font-bold text-sm md:text-base">
                    {totalDespesas > 0 ? ((lucro / totalDespesas) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 md:p-3 bg-orange-50 rounded-xl">
                  <span className="text-orange-700 font-medium text-sm md:text-base">Break Even</span>
                  <span className="text-orange-800 font-bold text-xs md:text-sm">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-2 md:p-3 bg-yellow-50 rounded-xl">
                  <span className="text-yellow-700 font-medium text-sm md:text-base">Crescimento</span>
                  <span className="text-yellow-800 font-bold text-sm md:text-base">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* Metas e Objetivos */}
            <MonthlyGoals 
              totalReceitas={totalReceitas} 
              totalDespesas={totalDespesas} 
              empresa="Companhia do Churrasco" 
            />

            {/* Próximas Ações */}
            <NextActions empresa="Companhia do Churrasco" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnalyseCostsModal
        isOpen={activeModal === 'costs'}
        onClose={() => setActiveModal(null)}
        despesas={companhiaDespesas}
        empresa="Companhia do Churrasco"
      />

      <ProjectionsModal
        isOpen={activeModal === 'projections'}
        onClose={() => setActiveModal(null)}
        despesas={companhiaDespesas}
        receitas={companhiaReceitas}
        empresa="Companhia do Churrasco"
      />

      <ComparativeModal
        isOpen={activeModal === 'comparative'}
        onClose={() => setActiveModal(null)}
        empresa="Companhia do Churrasco"
      />
    </div>
  );
};

export default CompanhiaPage;

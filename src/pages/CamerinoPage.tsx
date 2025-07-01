
import React, { useState, useMemo } from 'react';
import { Building2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
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
import NextActions from '@/components/NextActions';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { filterDataByPeriod } from '@/components/dashboard/utils';
import { calculateProfitByPeriod } from '@/utils/dateUtils';
import { getExpenseValue } from '@/utils/expenseFilters';

const CamerinoPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Filtrar dados do Camerino - usando várias variações possíveis do nome
  const camerinoDespesas = despesas?.filter(d => {
    const empresa = d.empresa?.toLowerCase().trim() || '';
    return empresa === 'camerino' || empresa.includes('camerino');
  }) || [];
  
  const camerinoReceitas = receitas?.filter(r => {
    const empresa = r.empresa?.toLowerCase().trim() || '';
    return empresa === 'camerino' || empresa.includes('camerino');
  }) || [];

  // Aplicar filtro de período APENAS para exibição dos gráficos e distribuição
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    return {
      filteredDespesas: filterDataByPeriod(camerinoDespesas, selectedPeriod),
      filteredReceitas: filterDataByPeriod(camerinoReceitas, selectedPeriod)
    };
  }, [camerinoDespesas, camerinoReceitas, selectedPeriod]);

  console.log('Camerino - Despesas filtradas:', filteredDespesas.length);
  console.log('Camerino - Despesas por categoria:', filteredDespesas.reduce((acc, d) => {
    const cat = d.categoria || 'SEM_CATEGORIA';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Calcular estatísticas - usar nova lógica de lucro por período
  const totalDespesasPeriodo = filteredDespesas.reduce((sum, d) => sum + getExpenseValue(d), 0);
  const totalReceitasPeriodo = filteredReceitas.reduce((sum, r) => sum + r.valor, 0);
  
  // NOVO: Calcular lucro baseado no período selecionado
  const lucroCalculado = calculateProfitByPeriod(camerinoDespesas, camerinoReceitas, selectedPeriod);
  const margemLucro = totalReceitasPeriodo > 0 ? (lucroCalculado / totalReceitasPeriodo) * 100 : 0;

  // Para os indicadores (ROI e Break Even), usar dados acumulados totais
  const totalDespesasAcumulado = camerinoDespesas.reduce((sum, d) => sum + getExpenseValue(d), 0);
  const totalReceitasAcumulado = camerinoReceitas.reduce((sum, r) => sum + r.valor, 0);

  const evolucaoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    console.log('=== DEBUG CAMERINO EVOLUÇÃO MENSAL ===');
    console.log('Ano atual:', currentYear);
    console.log('Total de receitas Camerino:', filteredReceitas?.length || 0);
    console.log('Total de despesas Camerino:', filteredDespesas?.length || 0);
    
    return months.map((month, index) => {
      const monthDespesas = filteredDespesas?.filter(d => {
        if (!d.data) return false;
        
        // Parsing corrigido - criar date de forma consistente
        const dateParts = d.data.split('-');
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        
        const isCurrentMonth = date.getMonth() === index && date.getFullYear() === currentYear;
        
        if (index === 4 || index === 5) { // Debug para Mai e Jun
          console.log(`Camerino Despesa - ${month}: data=${d.data}, parsedMonth=${date.getMonth()}, isCurrentMonth=${isCurrentMonth}`);
        }
        
        return isCurrentMonth;
      }).reduce((sum, d) => sum + getExpenseValue(d), 0) || 0;
      
      const monthReceitas = filteredReceitas?.filter(r => {
        if (!r.data) return false;
        
        // Parsing corrigido - criar date de forma consistente
        const dateParts = r.data.split('-');
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        
        const isCurrentMonth = date.getMonth() === index && date.getFullYear() === currentYear;
        
        if (index === 4 || index === 5) { // Debug para Mai e Jun
          console.log(`Camerino Receita - ${month}: data=${r.data}, parsedMonth=${date.getMonth()}, isCurrentMonth=${isCurrentMonth}, valor=${r.valor}`);
        }
        
        return isCurrentMonth;
      }).reduce((sum, r) => sum + r.valor, 0) || 0;
      
      if (index === 4 || index === 5) {
        console.log(`Camerino Total ${month}: Receitas=${monthReceitas}, Despesas=${monthDespesas}`);
      }
      
      return {
        month,
        despesas: monthDespesas,
        receitas: monthReceitas,
        lucro: monthReceitas - monthDespesas
      };
    });
  }, [filteredDespesas, filteredReceitas]);

  // Determinar o label do lucro baseado no período
  const getLucroLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Lucro Líquido Hoje';
      case 'week': return 'Lucro Líquido Semanal';
      case 'month': return 'Lucro Líquido Acumulado';
      case 'year': return 'Lucro Líquido Anual';
      default: return 'Lucro Líquido';
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
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

              {/* Filtros de Período */}
              <div className="flex gap-2">
                <button 
                  className={`px-4 py-2 text-sm rounded-2xl ${
                    selectedPeriod === 'today' 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPeriod('today')}
                >
                  Hoje
                </button>
                <button 
                  className={`px-4 py-2 text-sm rounded-2xl ${
                    selectedPeriod === 'week' 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPeriod('week')}
                >
                  Semana
                </button>
                <button 
                  className={`px-4 py-2 text-sm rounded-2xl ${
                    selectedPeriod === 'month' 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPeriod('month')}
                >
                  Mês
                </button>
                <button 
                  className={`px-4 py-2 text-sm rounded-2xl ${
                    selectedPeriod === 'year' 
                      ? 'bg-black text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPeriod('year')}
                >
                  Ano
                </button>
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

          {/* Stats Cards - Removido o card de Ticket Médio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
                <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitasPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{filteredReceitas.length} transações</p>
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
                  R$ {totalDespesasPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{filteredDespesas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">{getLucroLabel()}</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${lucroCalculado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucroCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {lucroCalculado >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem
                </p>
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
                <ExpenseDistribution despesas={filteredDespesas} empresa="Camerino" />
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
                    {totalDespesasAcumulado > 0 ? (((totalReceitasAcumulado - totalDespesasAcumulado) / totalDespesasAcumulado) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                  <span className="text-indigo-700 font-medium">Break Even</span>
                  <span className="text-indigo-800 font-bold">
                    R$ {totalDespesasAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-700 font-medium">Crescimento</span>
                  <span className="text-blue-800 font-bold">+8.3%</span>
                </div>
              </CardContent>
            </Card>

            {/* Próximas Ações */}
            <NextActions empresa="Camerino" />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnalyseCostsModal
        isOpen={activeModal === 'costs'}
        onClose={() => setActiveModal(null)}
        despesas={filteredDespesas}
        empresa="Camerino"
      />

      <ProjectionsModal
        isOpen={activeModal === 'projections'}
        onClose={() => setActiveModal(null)}
        despesas={filteredDespesas}
        receitas={filteredReceitas}
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

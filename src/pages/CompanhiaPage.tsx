
import React, { useState, useMemo } from 'react';
import { Building2, TrendingUp, DollarSign, Users, BarChart3, Package } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PeriodSelector from '@/components/PeriodSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import AnalyseCostsModal from '@/components/AnalyseCostsModal';
import ProjectionsModal from '@/components/ProjectionsModal';
import ComparativeModal from '@/components/ComparativeModal';
import MonthlyGoals from '@/components/MonthlyGoals';
import NextActions from '@/components/NextActions';
import { filterDataByPeriod } from '@/components/dashboard/utils';
import { calculateProfitByPeriod } from '@/utils/dateUtils';
import CompanhiaCharts from '@/components/companhia/CompanhiaCharts';

const CompanhiaPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());

  // Filtrar dados da Companhia do Churrasco - usando várias variações possíveis do nome
  const companhiaDespesas = despesas?.filter(d => {
    const empresa = d.empresa?.toLowerCase().trim() || '';
    return empresa === 'churrasco' || 
           empresa === 'companhia do churrasco' || 
           empresa === 'cia do churrasco' ||
           empresa.includes('churrasco');
  }) || [];
  
  const companhiaReceitas = receitas?.filter(r => {
    const empresa = r.empresa?.toLowerCase().trim() || '';
    return empresa === 'churrasco' || 
           empresa === 'companhia do churrasco' || 
           empresa === 'cia do churrasco' ||
           empresa.includes('churrasco');
  }) || [];

  // Aplicar filtro de período APENAS para exibição dos cards de estatísticas
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    return {
      filteredDespesas: filterDataByPeriod(companhiaDespesas, selectedPeriod, customMonth, customYear),
      filteredReceitas: filterDataByPeriod(companhiaReceitas, selectedPeriod, customMonth, customYear)
    };
  }, [companhiaDespesas, companhiaReceitas, selectedPeriod, customMonth, customYear]);

  console.log('Churrasco - Despesas filtradas:', filteredDespesas.length);
  console.log('Churrasco - Despesas por categoria:', filteredDespesas.reduce((acc, d) => {
    const cat = d.categoria || 'SEM_CATEGORIA';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Calcular estatísticas - usar nova lógica de lucro por período
  const totalDespesasPeriodo = filteredDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasPeriodo = filteredReceitas.reduce((sum, r) => sum + r.valor, 0);
  
  // NOVO: Calcular lucro baseado no período selecionado - passa os parâmetros customMonth e customYear
  const lucroCalculado = calculateProfitByPeriod(
    companhiaDespesas, 
    companhiaReceitas, 
    selectedPeriod, 
    customMonth, 
    customYear
  );
  const margemLucro = totalReceitasPeriodo > 0 ? (lucroCalculado / totalReceitasPeriodo) * 100 : 0;

  // Calcular CMV (Custo da Mercadoria Vendida) - apenas despesas de INSUMOS
  const cmvTotal = filteredDespesas
    .filter(d => d.categoria?.toUpperCase().includes('INSUMOS'))
    .reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  
  const percentualCMV = totalReceitasPeriodo > 0 ? (cmvTotal / totalReceitasPeriodo) * 100 : 0;

  // Para os indicadores (ROI e Break Even), usar dados acumulados totais
  const totalDespesasAcumulado = companhiaDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasAcumulado = companhiaReceitas.reduce((sum, r) => sum + r.valor, 0);

  // Determinar o label do lucro baseado no período
  const getLucroLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Lucro Líquido Hoje';
      case 'week': return 'Lucro Líquido Semanal';
      case 'month': return 'Lucro Líquido Acumulado';
      case 'year': return 'Lucro Líquido Anual';
      case 'custom': return 'Lucro Líquido Acumulado';
      default: return 'Lucro Líquido';
    }
  };

  const handleCustomDateChange = (month: number, year: number) => {
    setCustomMonth(month);
    setCustomYear(year);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                    Companhia do Churrasco
                  </h1>
                  <p className="text-gray-600 text-lg">Análise financeira detalhada da empresa</p>
                </div>
              </div>

              {/* Filtros de Período */}
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                customMonth={customMonth}
                customYear={customYear}
                onCustomDateChange={handleCustomDateChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl h-12">
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

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">CMV (Insumos)</CardTitle>
                <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  R$ {cmvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {percentualCMV.toFixed(1)}% das vendas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Component */}
          <CompanhiaCharts despesas={filteredDespesas} receitas={filteredReceitas} />

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Indicadores de Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Indicadores</CardTitle>
                <CardDescription>KPIs principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                  <span className="text-red-700 font-medium">ROI</span>
                  <span className="text-red-800 font-bold">
                    {totalDespesasAcumulado > 0 ? (((totalReceitasAcumulado - totalDespesasAcumulado) / totalDespesasAcumulado) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                  <span className="text-orange-700 font-medium">Break Even</span>
                  <span className="text-orange-800 font-bold">
                    R$ {totalDespesasAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl">
                  <span className="text-yellow-700 font-medium">Crescimento</span>
                  <span className="text-yellow-800 font-bold">+12.5%</span>
                </div>
              </CardContent>
            </Card>

            {/* Metas e Objetivos - Now properly connected to period selection */}
            <MonthlyGoals 
              empresa="Churrasco" 
              selectedPeriod={selectedPeriod}
              customMonth={customMonth}
              customYear={customYear}
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
        despesas={filteredDespesas}
        empresa="Companhia do Churrasco"
      />

      <ProjectionsModal
        isOpen={activeModal === 'projections'}
        onClose={() => setActiveModal(null)}
        despesas={filteredDespesas}
        receitas={filteredReceitas}
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


import React, { useState, useMemo } from 'react';
import { Building2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import AnalyseCostsModal from '@/components/AnalyseCostsModal';
import ProjectionsModal from '@/components/ProjectionsModal';
import ComparativeModal from '@/components/ComparativeModal';
import NextActions from '@/components/NextActions';
import { filterDataByPeriod } from '@/components/dashboard/utils';
import { calculateProfitByPeriod } from '@/utils/dateUtils';
import PeriodSelector from '@/components/PeriodSelector';
import CamerinoCharts from '@/components/camerino/CamerinoCharts';

const CamerinoPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());

  // Filtrar dados do Camerino - usando várias variações possíveis do nome
  const camerinoDespesas = despesas?.filter(d => {
    const empresa = d.empresa?.toLowerCase().trim() || '';
    return empresa === 'camerino' || empresa.includes('camerino');
  }) || [];
  
  const camerinoReceitas = receitas?.filter(r => {
    const empresa = r.empresa?.toLowerCase().trim() || '';
    return empresa === 'camerino' || empresa.includes('camerino');
  }) || [];

  // Aplicar filtro de período APENAS para exibição dos cards de estatísticas
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    return {
      filteredDespesas: filterDataByPeriod(camerinoDespesas, selectedPeriod, customMonth, customYear),
      filteredReceitas: filterDataByPeriod(camerinoReceitas, selectedPeriod, customMonth, customYear)
    };
  }, [camerinoDespesas, camerinoReceitas, selectedPeriod, customMonth, customYear]);

  console.log('Camerino - Despesas filtradas:', filteredDespesas.length);
  console.log('Camerino - Despesas por categoria:', filteredDespesas.reduce((acc, d) => {
    const cat = d.categoria || 'SEM_CATEGORIA';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  // Calcular estatísticas - usar nova lógica de lucro por período
  const totalDespesasPeriodo = filteredDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasPeriodo = filteredReceitas.reduce((sum, r) => sum + r.valor, 0);
  
  // NOVO: Calcular lucro baseado no período selecionado
  const lucroCalculado = calculateProfitByPeriod(camerinoDespesas, camerinoReceitas, selectedPeriod);
  const margemLucro = totalReceitasPeriodo > 0 ? (lucroCalculado / totalReceitasPeriodo) * 100 : 0;

  // Para os indicadores (ROI e Break Even), usar dados acumulados totais
  const totalDespesasAcumulado = camerinoDespesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasAcumulado = camerinoReceitas.reduce((sum, r) => sum + r.valor, 0);

  // Determinar o label do lucro baseado no período
  const getLucroLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Lucro Líquido Hoje';
      case 'week': return 'Lucro Líquido Semanal';
      case 'month': return 'Lucro Líquido Acumulado';
      case 'year': return 'Lucro Líquido Anual';
      case 'custom': return 'Lucro Líquido Personalizado';
      default: return 'Lucro Líquido';
    }
  };

  const handleCustomDateChange = (month: number, year: number) => {
    setCustomMonth(month);
    setCustomYear(year);
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
              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                customMonth={customMonth}
                customYear={customYear}
                onCustomDateChange={handleCustomDateChange}
              />
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

          {/* Charts Component */}
          <CamerinoCharts despesas={filteredDespesas} receitas={filteredReceitas} />

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

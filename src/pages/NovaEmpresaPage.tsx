
import React, { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PeriodSelector from '@/components/PeriodSelector';
import DespesasFilter from '@/components/DespesasFilter';
import TransactionTable from '@/components/TransactionTable';
import ReceitaTable from '@/components/ReceitaTable';
import NextActions from '@/components/NextActions';
import NovaEmpresaStats from '@/components/novaempresa/NovaEmpresaStats';
import NovaEmpresaCharts from '@/components/novaempresa/NovaEmpresaCharts';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { filterDataByPeriod, getPeriodString } from '@/components/dashboard/utils';

const NovaEmpresaPage = () => {
  const { data: allDespesas, isLoading: isLoadingDespesas, refetch: refetchDespesas } = useDespesas();
  const { data: allReceitas, isLoading: isLoadingReceitas } = useReceitas();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());
  const [filters, setFilters] = useState({
    status: 'todos' as 'todos' | 'pendente' | 'pago' | 'vencido',
    categoria: 'todas' as string,
    empresa: 'todas' as string,
    valorMin: '',
    valorMax: '',
  });

  // Filtrar dados para Nova Empresa
  const despesasNovaEmpresa = useMemo(() => {
    return allDespesas?.filter(d => {
      const empresa = d.empresa?.toLowerCase().trim() || '';
      return empresa.includes('nova empresa') || empresa === 'nova';
    }) || [];
  }, [allDespesas]);

  const receitasNovaEmpresa = useMemo(() => {
    return allReceitas?.filter(r => {
      const empresa = r.empresa?.toLowerCase().trim() || '';
      return empresa.includes('nova empresa') || empresa === 'nova';
    }) || [];
  }, [allReceitas]);

  // Aplicar filtros de período
  const filteredDespesas = useMemo(() => {
    return filterDataByPeriod(despesasNovaEmpresa, selectedPeriod, customMonth, customYear);
  }, [despesasNovaEmpresa, selectedPeriod, customMonth, customYear]);

  const filteredReceitas = useMemo(() => {
    return filterDataByPeriod(receitasNovaEmpresa, selectedPeriod, customMonth, customYear);
  }, [receitasNovaEmpresa, selectedPeriod, customMonth, customYear]);

  // Aplicar filtros adicionais nas despesas
  const finalFilteredDespesas = useMemo(() => {
    return filteredDespesas.filter(despesa => {
      if (filters.status !== 'todos' && despesa.status !== filters.status) return false;
      if (filters.categoria !== 'todas' && despesa.categoria !== filters.categoria) return false;
      if (filters.valorMin && (despesa.valor_total || despesa.valor || 0) < parseFloat(filters.valorMin)) return false;
      if (filters.valorMax && (despesa.valor_total || despesa.valor || 0) > parseFloat(filters.valorMax)) return false;
      return true;
    });
  }, [filteredDespesas, filters]);

  const period = getPeriodString(selectedPeriod, customMonth, customYear);
  const isLoading = isLoadingDespesas || isLoadingReceitas;

  const handleCustomDateChange = (month: number, year: number) => {
    setCustomMonth(month);
    setCustomYear(year);
  };

  const handleTransactionUpdated = () => {
    refetchDespesas();
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
                    Nova Empresa
                  </h1>
                  <p className="text-gray-600 text-lg">Gestão financeira - {period}</p>
                </div>
              </div>

              <PeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                customMonth={customMonth}
                customYear={customYear}
                onCustomDateChange={handleCustomDateChange}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <NovaEmpresaStats 
                despesas={finalFilteredDespesas} 
                receitas={filteredReceitas}
                period={period} 
              />

              {/* Charts */}
              <NovaEmpresaCharts 
                despesas={finalFilteredDespesas} 
                receitas={filteredReceitas}
              />

              {/* Next Actions */}
              <NextActions empresa="Nova Empresa" />

              {/* Data Tables */}
              <Tabs defaultValue="despesas" className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="despesas">Despesas</TabsTrigger>
                  <TabsTrigger value="receitas">Receitas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="despesas" className="space-y-6">
                  <DespesasFilter 
                    filters={filters}
                    onFiltersChange={setFilters}
                    despesas={filteredDespesas}
                  />
                  <TransactionTable 
                    transactions={finalFilteredDespesas}
                    onTransactionUpdated={handleTransactionUpdated}
                  />
                </TabsContent>
                
                <TabsContent value="receitas">
                  <ReceitaTable receitas={filteredReceitas} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovaEmpresaPage;

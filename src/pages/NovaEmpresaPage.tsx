
import React, { useState, useMemo } from 'react';
import { Building2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import PeriodSelector from '@/components/PeriodSelector';
import NextActions from '@/components/NextActions';
import NovaEmpresaStats from '@/components/novaempresa/NovaEmpresaStats';
import NovaEmpresaCharts from '@/components/novaempresa/NovaEmpresaCharts';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { filterDataByPeriod, getPeriodString } from '@/components/dashboard/utils';

interface FilterOptions {
  empresa?: string;
  categoria?: string;
  status?: string;
  valorMin?: number;
  valorMax?: number;
  dataInicio?: Date;
  dataFim?: Date;
}

const NovaEmpresaPage = () => {
  const { data: allDespesas, isLoading: isLoadingDespesas } = useDespesas();
  const { data: allReceitas, isLoading: isLoadingReceitas } = useReceitas();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());

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

  const period = getPeriodString(selectedPeriod, customMonth, customYear);
  const isLoading = isLoadingDespesas || isLoadingReceitas;

  const handleCustomDateChange = (month: number, year: number) => {
    setCustomMonth(month);
    setCustomYear(year);
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
                    Implementação
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
                despesas={filteredDespesas} 
                receitas={filteredReceitas}
                period={period} 
              />

              {/* Charts */}
              <NovaEmpresaCharts 
                despesas={filteredDespesas} 
                receitas={filteredReceitas}
              />

              {/* Next Actions */}
              <NextActions empresa="Implementação" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovaEmpresaPage;

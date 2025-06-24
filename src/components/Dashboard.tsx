
import React, { useState, useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import Sidebar from './Sidebar';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardCards from './dashboard/DashboardCards';
import DashboardTransactions from './dashboard/DashboardTransactions';
import DashboardCharts from './dashboard/DashboardCharts';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { filterDataByPeriod, getPeriodString } from './dashboard/utils';

const Dashboard = () => {
  const { data: despesas, isLoading: isLoadingDespesas, stats: despesasStats } = useDespesas();
  const { data: receitas, isLoading: isLoadingReceitas, stats: receitasStats } = useReceitas();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  console.log('Dashboard - despesas count:', despesas?.length || 0);
  console.log('Dashboard - receitas count:', receitas?.length || 0);
  console.log('Dashboard - despesas stats:', despesasStats);
  console.log('Dashboard - receitas stats:', receitasStats);

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Acesso Restrito</h2>
              <p className="text-gray-600 mb-8">Você precisa estar logado para acessar o dashboard.</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Fazer Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isLoading = isLoadingDespesas || isLoadingReceitas;

  // Memoize filtered data for better performance
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    return {
      filteredDespesas: filterDataByPeriod(despesas || [], selectedPeriod),
      filteredReceitas: filterDataByPeriod(receitas || [], selectedPeriod)
    };
  }, [despesas, receitas, selectedPeriod]);

  const period = getPeriodString(selectedPeriod);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                    Dashboard Financeiro
                  </h1>
                  <p className="text-gray-600 text-lg">Visão geral de todas as empresas</p>
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
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Carregando dados...</p>
              </div>
            </div>
          ) : (
            <>
              <DashboardCards 
                despesas={filteredDespesas} 
                period={period} 
                stats={despesasStats}
              />
              <DashboardTransactions despesas={filteredDespesas} />
              <DashboardCharts 
                despesas={filteredDespesas} 
                selectedPeriod={selectedPeriod} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);

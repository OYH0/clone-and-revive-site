
import React, { useState, useMemo } from 'react';
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
          <DashboardHeader 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod} 
          />

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
              <DashboardTransactions despesas={despesas || []} />
              <DashboardCharts 
                despesas={despesas || []} 
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

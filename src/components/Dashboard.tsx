
import React, { useState } from 'react';
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
  const { data: despesas, isLoading: isLoadingDespesas } = useDespesas();
  const { data: receitas, isLoading: isLoadingReceitas } = useReceitas();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  console.log('Dashboard - despesas data:', despesas);
  console.log('Dashboard - receitas data:', receitas);

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

  const filteredDespesas = filterDataByPeriod(despesas || [], selectedPeriod);
  const filteredReceitas = filterDataByPeriod(receitas || [], selectedPeriod);

  console.log('Dashboard - filtered despesas:', filteredDespesas);
  console.log('Dashboard - filtered receitas:', filteredReceitas);

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
              <p className="text-lg text-gray-600">Carregando dados...</p>
            </div>
          ) : (
            <>
              <DashboardCards despesas={filteredDespesas} period={period} />
              <DashboardTransactions despesas={despesas || []} />
              <DashboardCharts despesas={despesas || []} selectedPeriod={selectedPeriod} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

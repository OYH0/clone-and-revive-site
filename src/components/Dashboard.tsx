
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
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { data: despesas, isLoading: isLoadingDespesas } = useDespesas();
  const { data: receitas, isLoading: isLoadingReceitas } = useReceitas();
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const isMobile = useIsMobile();

  console.log('Dashboard - despesas data:', despesas);
  console.log('Dashboard - receitas data:', receitas);

  // Verificar se o usuário está autenticado
  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className={`flex-1 ${isMobile ? 'p-4' : 'p-6'} ${!isMobile ? 'main-content' : ''}`}>
          <div className="max-w-7xl mx-auto">
            <div className={`text-center ${isMobile ? 'py-12 mt-16' : 'py-16'}`}>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900 mb-4`}>Acesso Restrito</h2>
              <p className={`text-gray-600 ${isMobile ? 'mb-6 text-sm' : 'mb-8'}`}>Você precisa estar logado para acessar o dashboard.</p>
              <Button onClick={() => window.location.href = '/auth'} className={isMobile ? 'text-sm' : ''}>
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
      
      <div className={`flex-1 ${isMobile ? 'p-4' : 'p-6'} ${!isMobile ? 'main-content' : ''}`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'mt-16' : ''}`}>
          <DashboardHeader 
            selectedPeriod={selectedPeriod} 
            onPeriodChange={setSelectedPeriod} 
          />

          {isLoading ? (
            <div className={`grid place-items-center ${isMobile ? 'h-48' : 'h-64'}`}>
              <p className={`${isMobile ? 'text-base' : 'text-lg'} text-gray-600`}>Carregando dados...</p>
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

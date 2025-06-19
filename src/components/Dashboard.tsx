
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

const Dashboard = () => {
  const { data: despesas, isLoading: isLoadingDespesas, stats: despesasStats } = useDespesas();
  const { data: receitas, isLoading: isLoadingReceitas, stats: receitasStats } = useReceitas();
  const { user } = useAuth();
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

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

  // Filtrar dados por data
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    let filteredDespesas = despesas || [];
    let filteredReceitas = receitas || [];

    // Filtro por data para despesas (usando data_vencimento)
    if (dataInicio || dataFim) {
      filteredDespesas = filteredDespesas.filter(despesa => {
        const dateToUse = despesa.data_vencimento || despesa.data;
        if (!dateToUse) return false;
        
        const despesaDate = new Date(dateToUse + 'T00:00:00');
        
        let matchesDate = true;
        if (dataInicio) {
          const startDate = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
          matchesDate = matchesDate && despesaDate >= startDate;
        }
        if (dataFim) {
          const endDate = new Date(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate(), 23, 59, 59);
          matchesDate = matchesDate && despesaDate <= endDate;
        }
        
        return matchesDate;
      });

      // Filtro por data para receitas (usando data)
      filteredReceitas = filteredReceitas.filter(receita => {
        if (!receita.data) return false;
        
        const receitaDate = new Date(receita.data + 'T00:00:00');
        
        let matchesDate = true;
        if (dataInicio) {
          const startDate = new Date(dataInicio.getFullYear(), dataInicio.getMonth(), dataInicio.getDate());
          matchesDate = matchesDate && receitaDate >= startDate;
        }
        if (dataFim) {
          const endDate = new Date(dataFim.getFullYear(), dataFim.getMonth(), dataFim.getDate(), 23, 59, 59);
          matchesDate = matchesDate && receitaDate <= endDate;
        }
        
        return matchesDate;
      });
    }

    return { filteredDespesas, filteredReceitas };
  }, [despesas, receitas, dataInicio, dataFim]);

  const period = dataInicio && dataFim 
    ? `${dataInicio.toLocaleDateString('pt-BR')} - ${dataFim.toLocaleDateString('pt-BR')}`
    : dataInicio 
    ? `A partir de ${dataInicio.toLocaleDateString('pt-BR')}`
    : dataFim 
    ? `Até ${dataFim.toLocaleDateString('pt-BR')}`
    : 'Todos os períodos';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            dataInicio={dataInicio}
            setDataInicio={setDataInicio}
            dataFim={dataFim}
            setDataFim={setDataFim}
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
              <DashboardTransactions despesas={filteredDespesas} />
              <DashboardCharts 
                despesas={filteredDespesas} 
                selectedPeriod="custom"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);

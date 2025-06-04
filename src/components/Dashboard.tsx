
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CompanyCard from './CompanyCard';
import ExpenseDistributionChart from './ExpenseDistributionChart';
import MonthlyEvolutionChart from './MonthlyEvolutionChart';
import RecentTransactions from './RecentTransactions';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const { data: despesas, isLoading: isLoadingDespesas } = useDespesas();
  const { data: receitas, isLoading: isLoadingReceitas } = useReceitas();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  const isLoading = isLoadingDespesas || isLoadingReceitas;

  // Filter data based on selected period
  const filterDataByPeriod = (data: any[], period: string) => {
    if (!data) return [];
    
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return data.filter(item => {
      const itemDate = new Date(item.data);
      switch (period) {
        case 'today':
          return itemDate >= startOfDay;
        case 'week':
          return itemDate >= startOfWeek;
        case 'month':
          return itemDate >= startOfMonth;
        case 'year':
          return itemDate >= startOfYear;
        default:
          return true;
      }
    });
  };

  const filteredDespesas = filterDataByPeriod(despesas || [], selectedPeriod);
  const filteredReceitas = filterDataByPeriod(receitas || [], selectedPeriod);

  // Calculate values only when data exists
  const totalDespesas = filteredDespesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const totalReceitas = filteredReceitas.reduce((sum, receita) => sum + receita.valor, 0);
  
  const churrascoDespesas = filteredDespesas.filter(d => d.empresa === 'Churrasco').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyDespesas = filteredDespesas.filter(d => d.empresa === 'Johnny').reduce((sum, despesa) => sum + despesa.valor, 0);

  // Extract categories for each company
  const churrascoInsumos = filteredDespesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'INSUMOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const churrascoVariaveis = filteredDespesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'VARIAVEIS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyFixas = filteredDespesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'FIXAS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyInsumos = filteredDespesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'INSUMOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyAtrasados = filteredDespesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'ATRASADOS').reduce((sum, despesa) => sum + despesa.valor, 0);

  // Generate period string
  const getPeriodString = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    switch (selectedPeriod) {
      case 'today':
        return `Hoje - ${currentDate.toLocaleDateString('pt-BR')}`;
      case 'week':
        return `Esta Semana`;
      case 'month':
        const month = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(currentDate);
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        return `${capitalizedMonth} ${currentYear}`;
      case 'year':
        return `Ano ${currentYear}`;
      default:
        return `${currentMonth} ${currentYear}`;
    }
  };

  const period = getPeriodString();

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === 'today' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-2xl"
                onClick={() => setSelectedPeriod('today')}
              >
                Hoje
              </Button>
              <Button 
                variant={selectedPeriod === 'week' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-2xl"
                onClick={() => setSelectedPeriod('week')}
              >
                Semana
              </Button>
              <Button 
                variant={selectedPeriod === 'month' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-2xl"
                onClick={() => setSelectedPeriod('month')}
              >
                Mês
              </Button>
              <Button 
                variant={selectedPeriod === 'year' ? 'default' : 'outline'} 
                size="sm" 
                className="rounded-2xl"
                onClick={() => setSelectedPeriod('year')}
              >
                Ano
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid place-items-center h-64">
              <p className="text-lg text-gray-600">Carregando dados...</p>
            </div>
          ) : (
            <>
              {/* Cards das empresas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <CompanyCard
                  name="Companhia do Churrasco"
                  totalDespesas={churrascoDespesas}
                  status={filteredDespesas && filteredDespesas.length > 0 ? "Atualizado" : "Sem dados"}
                  statusColor={filteredDespesas && filteredDespesas.length > 0 ? "green" : "yellow"}
                  periodo={period}
                  insumos={churrascoInsumos}
                  variaveis={churrascoVariaveis}
                  chartData={[
                    { value: churrascoDespesas > 0 ? churrascoDespesas * 0.8 : 0 }, 
                    { value: churrascoDespesas > 0 ? churrascoDespesas * 0.9 : 0 }, 
                    { value: churrascoDespesas > 0 ? churrascoDespesas * 0.95 : 0 }, 
                    { value: churrascoDespesas > 0 ? churrascoDespesas * 0.98 : 0 },
                    { value: churrascoDespesas }
                  ]}
                  chartColor="#ef4444"
                />
                <CompanyCard
                  name="Johnny Rockets"
                  totalDespesas={johnnyDespesas}
                  status={filteredDespesas && filteredDespesas.length > 0 ? "Atualizado" : "Sem dados"}
                  statusColor={filteredDespesas && filteredDespesas.length > 0 ? "green" : "yellow"}
                  periodo={period}
                  fixas={johnnyFixas}
                  insumos={johnnyInsumos}
                  atrasados={johnnyAtrasados}
                  chartData={[
                    { value: johnnyDespesas > 0 ? johnnyDespesas * 0.8 : 0 }, 
                    { value: johnnyDespesas > 0 ? johnnyDespesas * 0.85 : 0 }, 
                    { value: johnnyDespesas > 0 ? johnnyDespesas * 0.9 : 0 }, 
                    { value: johnnyDespesas > 0 ? johnnyDespesas * 0.95 : 0 },
                    { value: johnnyDespesas }
                  ]}
                  chartColor="#3b82f6"
                />
              </div>

              {/* Últimas Transações */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Últimas Transações</h3>
                  <select className="border border-gray-300 bg-white text-gray-700 rounded-2xl px-3 py-1 text-sm">
                    <option>Todas Empresas</option>
                    <option>Companhia do Churrasco</option>
                    <option>Johnny Rockets</option>
                  </select>
                </div>
                {filteredDespesas && filteredDespesas.length > 0 ? (
                  <RecentTransactions despesas={filteredDespesas} />
                ) : (
                  <Card className="p-6 text-center text-gray-600">
                    <p>Não há transações recentes para mostrar.</p>
                    <p className="text-sm mt-2">Adicione transações para ver os dados aqui.</p>
                  </Card>
                )}
              </div>

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribuição de Despesas</h3>
                  {filteredDespesas && filteredDespesas.length > 0 ? (
                    <ExpenseDistributionChart despesas={filteredDespesas} />
                  ) : (
                    <Card className="p-6 text-center text-gray-600">
                      <p>Não há dados suficientes para gerar o gráfico de distribuição.</p>
                    </Card>
                  )}
                </div>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Evolução Mensal</h3>
                  {filteredDespesas && filteredDespesas.length > 0 ? (
                    <MonthlyEvolutionChart despesas={filteredDespesas} selectedPeriod={selectedPeriod} />
                  ) : (
                    <Card className="p-6 text-center text-gray-600">
                      <p>Não há dados suficientes para gerar o gráfico de evolução.</p>
                    </Card>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

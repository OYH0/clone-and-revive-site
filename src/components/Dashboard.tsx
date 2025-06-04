
import React from 'react';
import Sidebar from './Sidebar';
import CompanyCard from './CompanyCard';
import ExpenseDistributionChart from './ExpenseDistributionChart';
import MonthlyEvolutionChart from './MonthlyEvolutionChart';
import { useDespesas } from '@/hooks/useDespesas';

const Dashboard = () => {
  const { data: despesas } = useDespesas();

  const totalDespesas = despesas?.reduce((sum, despesa) => sum + despesa.valor, 0) || 0;
  const churrascoDespesas = despesas?.filter(d => d.empresa === 'Churrasco').reduce((sum, despesa) => sum + despesa.valor, 0) || 0;
  const johnnyDespesas = despesas?.filter(d => d.empresa === 'Johnny').reduce((sum, despesa) => sum + despesa.valor, 0) || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Visão geral das finanças do negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CompanyCard
              name="Companhia do Churrasco"
              totalDespesas={churrascoDespesas}
              totalReceitas={0}
              color="bg-red-500"
            />
            <CompanyCard
              name="Johnny Rockets"
              totalDespesas={johnnyDespesas}
              totalReceitas={0}
              color="bg-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Distribuição de Despesas</h3>
              <ExpenseDistributionChart />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Evolução Mensal</h3>
              <MonthlyEvolutionChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

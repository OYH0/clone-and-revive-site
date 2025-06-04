
import React from 'react';
import Sidebar from './Sidebar';
import CompanyCard from './CompanyCard';
import ExpenseDistributionChart from './ExpenseDistributionChart';
import MonthlyEvolutionChart from './MonthlyEvolutionChart';
import RecentTransactions from './RecentTransactions';
import { useDespesas } from '@/hooks/useDespesas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { data: despesas } = useDespesas();

  const totalDespesas = despesas?.reduce((sum, despesa) => sum + despesa.valor, 0) || 0;
  const churrascoDespesas = despesas?.filter(d => d.empresa === 'Churrasco').reduce((sum, despesa) => sum + despesa.valor, 0) || 0;
  const johnnyDespesas = despesas?.filter(d => d.empresa === 'Johnny').reduce((sum, despesa) => sum + despesa.valor, 0) || 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Financeiro</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Hoje</Button>
              <Button variant="outline" size="sm">Semana</Button>
              <Button variant="outline" size="sm" className="bg-gray-700 text-white">Mês</Button>
              <Button variant="outline" size="sm">Ano</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Transação
              </Button>
            </div>
          </div>

          {/* Cards das empresas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CompanyCard
              name="Companhia do Churrasco"
              totalDespesas={3598.00}
              status="Atualizado"
              statusColor="green"
              periodo="Maio 2025"
              insumos={3138.00}
              variaveis={460.00}
              chartData={[
                { value: 3000 }, { value: 2800 }, { value: 3200 }, 
                { value: 3600 }, { value: 3598 }
              ]}
              chartColor="#ef4444"
            />
            <CompanyCard
              name="Johnny Rockets"
              totalDespesas={122900.59}
              status="Pendências"
              statusColor="yellow"
              periodo="Maio 2025"
              fixas={48633.32}
              insumos={36713.79}
              atrasados={36808.58}
              chartData={[
                { value: 120000 }, { value: 121500 }, { value: 122000 }, 
                { value: 122500 }, { value: 122900 }
              ]}
              chartColor="#3b82f6"
            />
          </div>

          {/* Últimas Transações */}
          <div className="bg-slate-700 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Últimas Transações</h3>
              <select className="bg-slate-600 text-white border border-slate-500 rounded px-3 py-1 text-sm">
                <option>Todas Empresas</option>
                <option>Companhia do Churrasco</option>
                <option>Johnny Rockets</option>
              </select>
            </div>
            <RecentTransactions />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Despesas</h3>
              <ExpenseDistributionChart />
            </div>
            
            <div className="bg-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Evolução Mensal</h3>
              <MonthlyEvolutionChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

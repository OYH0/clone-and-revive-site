
import React from 'react';
import ExpenseDistributionChart from '../ExpenseDistributionChart';
import MonthlyEvolutionChart from '../MonthlyEvolutionChart';
import { Card } from '@/components/ui/card';
import { Despesa } from '@/hooks/useDespesas';

interface DashboardChartsProps {
  despesas: Despesa[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ despesas, selectedPeriod }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribuição de Despesas</h3>
        {despesas && despesas.length > 0 ? (
          <ExpenseDistributionChart despesas={despesas} />
        ) : (
          <Card className="p-6 text-center text-gray-600">
            <p>Não há dados suficientes para gerar o gráfico de distribuição.</p>
          </Card>
        )}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Evolução Mensal</h3>
        {despesas && despesas.length > 0 ? (
          <MonthlyEvolutionChart despesas={despesas} selectedPeriod={selectedPeriod} />
        ) : (
          <Card className="p-6 text-center text-gray-600">
            <p>Não há dados suficientes para gerar o gráfico de evolução.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardCharts;

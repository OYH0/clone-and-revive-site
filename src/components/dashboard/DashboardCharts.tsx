
import React from 'react';
import ExpenseDistributionChart from '../ExpenseDistributionChart';
import MonthlyEvolutionChart from '../MonthlyEvolutionChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Despesa } from '@/hooks/useDespesas';

interface DashboardChartsProps {
  despesas: Despesa[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ despesas, selectedPeriod }) => {
  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
  const totalTransactions = despesas.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Distribuição de Despesas
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Total: R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em {totalTransactions} transações
          </CardDescription>
        </CardHeader>
        <CardContent>
          {despesas && despesas.length > 0 ? (
            <ExpenseDistributionChart despesas={despesas} />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <p>Não há dados suficientes para gerar o gráfico de distribuição.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Evolução das Despesas
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Comparativo entre empresas por {
              selectedPeriod === 'today' ? 'horas' :
              selectedPeriod === 'week' ? 'dias da semana' :
              selectedPeriod === 'year' ? 'meses' : 'período'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {despesas && despesas.length > 0 ? (
            <MonthlyEvolutionChart despesas={despesas} selectedPeriod={selectedPeriod} />
          ) : (
            <div className="flex items-center justify-center h-80 text-gray-500">
              <p>Não há dados suficientes para gerar o gráfico de evolução.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;

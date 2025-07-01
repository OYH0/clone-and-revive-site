
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Despesa } from '@/hooks/useDespesas';
import { calculateDistributionData } from '@/utils/dashboardCalculations';

interface ExpenseDistributionProps {
  despesas: Despesa[];
  empresa: string;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({ despesas, empresa }) => {
  console.log('=== EXPENSE DISTRIBUTION ===');
  console.log('Empresa:', empresa);
  console.log('Despesas recebidas:', despesas?.length || 0);

  // Usar função centralizada para calcular dados
  const data = calculateDistributionData(despesas || []);

  console.log('Dados do gráfico de distribuição:', data);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">
            {((data.value / data.payload.total) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <p>Não há dados de despesas para exibir</p>
      </div>
    );
  }

  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseDistribution;

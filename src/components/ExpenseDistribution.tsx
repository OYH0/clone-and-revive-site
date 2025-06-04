
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Despesa } from '@/hooks/useDespesas';

interface ExpenseDistributionProps {
  despesas: Despesa[];
  empresa: string;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({ despesas, empresa }) => {
  const categorias = [
    { name: 'INSUMOS', color: '#3b82f6' },
    { name: 'FIXAS', color: '#8b5cf6' },
    { name: 'VARIAVEIS', color: '#f59e0b' },
    { name: 'ATRASADOS', color: '#ef4444' }
  ];

  const data = categorias.map(categoria => {
    const valor = despesas
      .filter(d => d.categoria === categoria.name)
      .reduce((sum, d) => sum + d.valor, 0);
    
    return {
      name: categoria.name,
      value: valor,
      color: categoria.color,
      percentage: 0 // Will be calculated below
    };
  }).filter(item => item.value > 0);

  // Calculate percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  data.forEach(item => {
    item.percentage = total > 0 ? (item.value / total) * 100 : 0;
  });

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
            {data.payload.percentage.toFixed(1)}%
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

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
          >
            {data.map((entry, index) => (
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


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ExpenseDistributionChartProps {
  despesas?: any[];
}

const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ despesas }) => {
  // Define categories and colors
  const categories = [
    { name: 'INSUMOS', label: 'Insumos', color: '#0ea5e9' },
    { name: 'FIXAS', label: 'Fixas', color: '#1e293b' },
    { name: 'VARIAVEIS', label: 'Variáveis', color: '#f59e0b' },
    { name: 'ATRASADOS', label: 'Atrasados', color: '#ef4444' }
  ];

  // Calculate values based on filtered data
  const data = categories.map(category => {
    const value = despesas
      ?.filter(d => d.categoria === category.name)
      .reduce((sum, d) => sum + d.valor, 0) || 0;
    
    return {
      name: category.label,
      value,
      color: category.color
    };
  }).filter(item => item.value > 0);

  // If there's no data with values, show placeholder
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>Não há dados para mostrar</p>
      </div>
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-gray-700 text-sm">{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-1 text-xs text-gray-500">
        {data.map((item, index) => (
          <div key={index} className="text-right">
            R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ExpenseDistributionChart: React.FC = () => {
  const data = [
    { name: 'Insumos', value: 35, color: '#0ea5e9' },
    { name: 'Fixas', value: 25, color: '#1e293b' },
    { name: 'Variáveis', value: 25, color: '#f59e0b' },
    { name: 'Atrasados', value: 15, color: '#ef4444' }
  ];

  const valueLabels = ['R$ 140k', 'R$ 120k', 'R$ 100k', 'R$ 80k', 'R$ 60k', 'R$ 40k', 'R$ 20k', 'R$ 0k'];

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
            <span className="text-white text-sm">{item.name}</span>
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-1 text-xs text-gray-400">
        {valueLabels.map((label, index) => (
          <div key={index} className="text-right">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;

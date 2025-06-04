
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const ExpenseDistributionChart: React.FC = () => {
  const data = [
    { name: 'Insumos', value: 35, color: '#3498db' },
    { name: 'Fixas', value: 25, color: '#2c3e50' },
    { name: 'Variáveis', value: 25, color: '#f39c12' },
    { name: 'Atrasados', value: 15, color: '#e74c3c' }
  ];

  const valueData = [
    { label: 'R$ 140k', percentage: 'R$ 140k' },
    { label: 'R$ 120k', percentage: 'R$ 120k' },
    { label: 'R$ 100k', percentage: 'R$ 100k' },
    { label: 'R$ 80k', percentage: 'R$ 80k' },
    { label: 'R$ 60k', percentage: 'R$ 60k' },
    { label: 'R$ 40k', percentage: 'R$ 40k' },
    { label: 'R$ 20k', percentage: 'R$ 20k' },
    { label: 'R$ 0k', percentage: 'R$ 0k' }
  ];

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Despesas</h3>
      
      <div className="flex items-center justify-between">
        <div className="w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white text-sm">{item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-1 text-xs text-gray-400">
          {valueData.map((item, index) => (
            <div key={index} className="text-right">
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;


import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseDistributionProps {
  data?: Array<{ name: string; value: number; color: string }>;
}

const ExpenseDistributionChart: React.FC<ExpenseDistributionProps> = ({ data }) => {
  // Dados padrão caso não haja dados reais
  const defaultData = [
    { name: 'Insumos', value: 35, color: '#3498db' },
    { name: 'Fixas', value: 25, color: '#2c3e50' },
    { name: 'Variáveis', value: 25, color: '#f39c12' },
    { name: 'Atrasados', value: 15, color: '#e74c3c' }
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const valueData = [
    { label: 'R$ 140k' },
    { label: 'R$ 120k' },
    { label: 'R$ 100k' },
    { label: 'R$ 80k' },
    { label: 'R$ 60k' },
    { label: 'R$ 40k' },
    { label: 'R$ 20k' },
    { label: 'R$ 0k' }
  ];

  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Distribuição de Despesas</h3>
      
      <div className="flex items-center justify-between">
        <div className="w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-col gap-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-white text-sm">{item.name} ({item.value}%)</span>
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

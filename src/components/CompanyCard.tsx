
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CompanyCardProps {
  name: string;
  period: string;
  totalExpenses: string;
  status: 'Atualizado' | 'Pendentes';
  categories: Array<{ name: string; value: string }>;
  chartData: Array<{ value: number }>;
  chartColor: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  period,
  totalExpenses,
  status,
  categories,
  chartData,
  chartColor
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">{period}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          status === 'Atualizado' 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-white'
        }`}>
          {status}
        </span>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Total Despesas</p>
        <p className="text-2xl font-bold text-gray-800">{totalExpenses}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-2">Por Categoria</p>
          {categories.map((category, index) => (
            <div key={index} className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">{category.name}:</span>
              <span className="text-gray-800">{category.value}</span>
            </div>
          ))}
        </div>
        
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={2}
                dot={{ fill: chartColor, strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

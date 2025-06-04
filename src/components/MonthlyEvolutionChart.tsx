
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const MonthlyEvolutionChart: React.FC = () => {
  const data = [
    { month: 'Jan', churrasco: 120, johnny: 100 },
    { month: 'Fev', churrasco: 140, johnny: 120 },
    { month: 'Mar', churrasco: 130, johnny: 140 },
    { month: 'Abr', churrasco: 160, johnny: 150 },
    { month: 'Mai', churrasco: 180, johnny: 170 }
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="h-48 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4B5563', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4B5563', fontSize: 12 }} 
            />
            <Bar 
              dataKey="churrasco" 
              name="Companhia do Churrasco"
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="johnny" 
              name="Johnny Rockets"
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="ml-6 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-700 text-sm">Companhia do Churrasco</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700 text-sm">Johnny Rockets</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyEvolutionChart;

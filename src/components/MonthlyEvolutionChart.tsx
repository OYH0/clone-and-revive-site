
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
    <div className="bg-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Evolução Mensal</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'white', fontSize: 12 }} />
            <Legend 
              wrapperStyle={{ color: 'white' }}
              iconType="circle"
            />
            <Bar 
              dataKey="churrasco" 
              name="Companhia do Churrasco"
              fill="#e74c3c" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="johnny" 
              name="Johnny Rockets"
              fill="#3498db" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyEvolutionChart;


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useDespesas } from '@/hooks/useDespesas';

const MonthlyEvolutionChart: React.FC = () => {
  const { data: despesas } = useDespesas();
  
  // Generate monthly data based on actual expenses
  const monthlyData = React.useMemo(() => {
    if (!despesas) return [];

    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    // Initialize data structure
    const data = months.map((month, index) => ({
      month,
      index,
      churrasco: 0,
      johnny: 0
    }));
    
    // Fill with actual data
    despesas.forEach(despesa => {
      const date = new Date(despesa.data);
      const monthIndex = date.getMonth();
      
      if (despesa.empresa === 'Churrasco') {
        data[monthIndex].churrasco += despesa.valor;
      } else if (despesa.empresa === 'Johnny') {
        data[monthIndex].johnny += despesa.valor;
      }
    });
    
    // Get current month to show only relevant months
    const currentMonth = new Date().getMonth();
    
    // Return data for the last 6 months including current month
    return data
      .filter((_, i) => i <= currentMonth && i >= currentMonth - 5)
      .sort((a, b) => a.index - b.index);
  }, [despesas]);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: R$ {(entry.value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!monthlyData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>Não há dados para mostrar</p>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={(value) => `${(value / 100).toLocaleString('pt-BR', { notation: 'compact' })}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span className="text-sm">{value === 'churrasco' ? 'Companhia do Churrasco' : 'Johnny Rockets'}</span>}
          />
          <Bar 
            name="churrasco"
            dataKey="churrasco" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            name="johnny"
            dataKey="johnny" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyEvolutionChart;

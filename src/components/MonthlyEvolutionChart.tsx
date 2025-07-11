
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, ReferenceLine } from 'recharts';
import { normalizeCompanyName, getTransactionValue } from '@/utils/dashboardCalculations';

interface MonthlyEvolutionChartProps {
  despesas?: any[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year' | 'custom';
}

const MonthlyEvolutionChart: React.FC<MonthlyEvolutionChartProps> = ({ despesas, selectedPeriod }) => {
  console.log('=== MONTHLY EVOLUTION CHART ===');
  console.log('Despesas recebidas:', despesas?.length || 0);
  console.log('Período selecionado:', selectedPeriod);
  
  // Generate data based on selected period
  const chartData = React.useMemo(() => {
    if (!despesas) return [];

    console.log('Gerando dados do gráfico para período:', selectedPeriod);

    // Filtrar despesas para excluir Camerino
    const despesasSemCamerino = despesas.filter(d => {
      const empresa = normalizeCompanyName(d.empresa);
      return empresa !== 'camerino';
    });

    if (selectedPeriod === 'today') {
      // Show hourly data for today
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map(hour => {
        const hourData = despesasSemCamerino.filter(d => {
          const date = new Date(d.data);
          return date.getHours() === hour;
        });
        
        const churrasco = hourData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = hourData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: `${hour}h`,
          churrasco,
          johnny
        };
      }).filter(item => item.churrasco > 0 || item.johnny > 0);
    }

    if (selectedPeriod === 'week') {
      // Show daily data for the week
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days.map((day, index) => {
        const dayData = despesasSemCamerino.filter(d => {
          const date = new Date(d.data);
          return date.getDay() === index;
        });
        
        const churrasco = dayData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = dayData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: day,
          churrasco,
          johnny
        };
      });
    }

    if (selectedPeriod === 'year') {
      // Show monthly data for the year
      const months = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
      ];
      
      return months.map((month, index) => {
        const monthData = despesasSemCamerino.filter(d => {
          const date = new Date(d.data);
          return date.getMonth() === index;
        });
        
        const churrasco = monthData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = monthData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: month,
          churrasco,
          johnny
        };
      });
    }

    // Default: show last 6 months including current month (for 'month' and 'custom' periods)
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const data = months.map((month, index) => ({
      period: month,
      index,
      churrasco: 0,
      johnny: 0
    }));
    
    despesasSemCamerino.forEach(despesa => {
      const date = new Date(despesa.data);
      const monthIndex = date.getMonth();
      const valor = getTransactionValue(despesa);
      const empresa = normalizeCompanyName(despesa.empresa);
      
      if (empresa === 'churrasco') {
        data[monthIndex].churrasco += valor;
      } else if (empresa === 'johnny') {
        data[monthIndex].johnny += valor;
      }
    });
    
    const currentMonth = new Date().getMonth();
    const result = data
      .filter((_, i) => i <= currentMonth && i >= currentMonth - 5)
      .sort((a, b) => a.index - b.index);
      
    console.log('Dados finais do gráfico mensal (sem Camerino):', result);
    return result;
  }, [despesas, selectedPeriod]);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'churrasco' ? 'Companhia do Churrasco' : 
               entry.name === 'johnny' ? 'Johnny Rockets' : entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        <p>Não há dados para mostrar</p>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis 
            dataKey="period" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4B5563', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#4B5563', fontSize: 12 }} 
            tickFormatter={(value) => `${value.toLocaleString('pt-BR', { notation: 'compact' })}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => 
              value === 'churrasco' ? 'Companhia do Churrasco' : 
              value === 'johnny' ? 'Johnny Rockets' : value
            }
          />
          <ReferenceLine 
            y={0} 
            stroke="#D1D5DB" 
            strokeWidth={1}
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

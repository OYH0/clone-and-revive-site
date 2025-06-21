
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, CartesianGrid } from 'recharts';
import { normalizeCompanyName, getTransactionValue } from '@/utils/dashboardCalculations';

interface MonthlyEvolutionChartProps {
  despesas?: any[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
}

const MonthlyEvolutionChart: React.FC<MonthlyEvolutionChartProps> = ({ despesas, selectedPeriod }) => {
  console.log('=== MONTHLY EVOLUTION CHART ===');
  console.log('Despesas recebidas:', despesas?.length || 0);
  console.log('Período selecionado:', selectedPeriod);
  
  // Generate data based on selected period
  const chartData = React.useMemo(() => {
    if (!despesas) return [];

    console.log('Gerando dados do gráfico para período:', selectedPeriod);

    if (selectedPeriod === 'today') {
      // Show hourly data for today
      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map(hour => {
        const hourData = despesas.filter(d => {
          const date = new Date(d.data);
          return date.getHours() === hour;
        });
        
        const churrasco = hourData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = hourData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const camerino = hourData
          .filter(d => normalizeCompanyName(d.empresa) === 'camerino')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: `${hour}h`,
          churrasco,
          johnny,
          camerino,
          total: churrasco + johnny + camerino
        };
      }).filter(item => item.total > 0);
    }

    if (selectedPeriod === 'week') {
      // Show daily data for the week
      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      return days.map((day, index) => {
        const dayData = despesas.filter(d => {
          const date = new Date(d.data);
          return date.getDay() === index;
        });
        
        const churrasco = dayData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = dayData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const camerino = dayData
          .filter(d => normalizeCompanyName(d.empresa) === 'camerino')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: day,
          churrasco,
          johnny,
          camerino,
          total: churrasco + johnny + camerino
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
        const monthData = despesas.filter(d => {
          const date = new Date(d.data);
          return date.getMonth() === index;
        });
        
        const churrasco = monthData
          .filter(d => normalizeCompanyName(d.empresa) === 'churrasco')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const johnny = monthData
          .filter(d => normalizeCompanyName(d.empresa) === 'johnny')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        const camerino = monthData
          .filter(d => normalizeCompanyName(d.empresa) === 'camerino')
          .reduce((sum, d) => sum + getTransactionValue(d), 0);
        
        return {
          period: month,
          churrasco,
          johnny,
          camerino,
          total: churrasco + johnny + camerino
        };
      });
    }

    // Default: show last 6 months including current month
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    
    const data = months.map((month, index) => ({
      period: month,
      index,
      churrasco: 0,
      johnny: 0,
      camerino: 0,
      total: 0
    }));
    
    despesas.forEach(despesa => {
      const date = new Date(despesa.data);
      const monthIndex = date.getMonth();
      const valor = getTransactionValue(despesa);
      const empresa = normalizeCompanyName(despesa.empresa);
      
      if (empresa === 'churrasco') {
        data[monthIndex].churrasco += valor;
      } else if (empresa === 'johnny') {
        data[monthIndex].johnny += valor;
      } else if (empresa === 'camerino') {
        data[monthIndex].camerino += valor;
      }
      data[monthIndex].total += valor;
    });
    
    const currentMonth = new Date().getMonth();
    const result = data
      .filter((_, i) => i <= currentMonth && i >= currentMonth - 5)
      .sort((a, b) => a.index - b.index);
      
    console.log('Dados finais do gráfico mensal:', result);
    return result;
  }, [despesas, selectedPeriod]);
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex justify-between items-center mb-1" style={{ color: entry.color }}>
              <span className="mr-4">
                {entry.name === 'churrasco' ? 'Companhia do Churrasco' : 
                 entry.name === 'johnny' ? 'Johnny Rockets' : 
                 entry.name === 'camerino' ? 'Camerino' : entry.name}:
              </span>
              <span className="font-medium">
                R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </p>
          ))}
          <div className="border-t pt-2 mt-2">
            <p className="text-sm font-bold text-gray-800 flex justify-between">
              <span>Total:</span>
              <span>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <p>Não há dados para mostrar</p>
      </div>
    );
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
            tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { notation: 'compact' })}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => (
              <span className="text-sm font-medium">
                {value === 'churrasco' ? 'Companhia do Churrasco' : 
                 value === 'johnny' ? 'Johnny Rockets' : 
                 value === 'camerino' ? 'Camerino' : value}
              </span>
            )}
          />
          <Bar 
            name="camerino"
            dataKey="camerino" 
            fill="#10b981" 
            radius={[2, 2, 0, 0]}
            stackId="stack"
          />
          <Bar 
            name="churrasco"
            dataKey="churrasco" 
            fill="#ef4444" 
            radius={[2, 2, 0, 0]}
            stackId="stack"
          />
          <Bar 
            name="johnny"
            dataKey="johnny" 
            fill="#3b82f6" 
            radius={[2, 2, 0, 0]}
            stackId="stack"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyEvolutionChart;

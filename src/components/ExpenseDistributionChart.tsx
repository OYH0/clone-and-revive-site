
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateDistributionData } from '@/utils/dashboardCalculations';
import { getSubcategoryLabel } from '@/utils/subcategories';

interface ExpenseDistributionChartProps {
  despesas?: any[];
}

const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ despesas }) => {
  console.log('=== EXPENSE DISTRIBUTION CHART ===');
  console.log('Despesas recebidas:', despesas?.length || 0);

  // Usar função centralizada para calcular dados
  const data = calculateDistributionData(despesas || []);

  console.log('Dados do gráfico de distribuição:', data);

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
      const category = payload[0].name;
      
      // Buscar subcategorias da categoria
      const categoryExpenses = despesas?.filter(d => {
        const normalizedCategory = d.categoria?.trim().toUpperCase();
        return normalizedCategory === category.toUpperCase() || 
               (category === 'Insumos' && normalizedCategory === 'INSUMOS') ||
               (category === 'Fixas' && normalizedCategory === 'FIXAS') ||
               (category === 'Variáveis' && normalizedCategory === 'VARIÁVEIS') ||
               (category === 'Atrasados' && normalizedCategory === 'ATRASADOS') ||
               (category === 'Retiradas' && normalizedCategory === 'RETIRADAS');
      }) || [];

      // Agrupar por subcategoria
      const subcategoryTotals = categoryExpenses.reduce((acc, expense) => {
        const subcategory = expense.subcategoria || 'Sem subcategoria';
        const label = expense.subcategoria ? getSubcategoryLabel(expense.subcategoria) : 'Sem subcategoria';
        const value = expense.valor_total || expense.valor || 0;
        
        if (!acc[subcategory]) {
          acc[subcategory] = { label, value: 0 };
        }
        acc[subcategory].value += value;
        
        return acc;
      }, {} as Record<string, { label: string; value: number }>);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-800 mb-1">{category}</p>
          <p className="text-sm text-gray-600 mb-2">
            R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          
          {Object.keys(subcategoryTotals).length > 0 && (
            <div className="border-t pt-2 mt-1">
              <p className="text-xs font-medium text-gray-700 mb-1">Subcategorias:</p>
              {Object.entries(subcategoryTotals).map(([key, { label, value }]) => (
                <p key={key} className="text-xs text-gray-600">
                  • {label}: R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center gap-8">
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
      
      <div className="flex flex-col gap-4 min-w-[200px]">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-gray-700 text-sm font-medium">{item.name}</span>
            </div>
            <span className="text-gray-900 text-sm font-semibold text-right">
              R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseDistributionChart;

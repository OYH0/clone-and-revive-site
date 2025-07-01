
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Despesa } from '@/hooks/useDespesas';
import { calculateDistributionData } from '@/utils/dashboardCalculations';
import { getSubcategoryLabel } from '@/utils/subcategories';

interface ExpenseDistributionProps {
  despesas: Despesa[];
  empresa: string;
}

const ExpenseDistribution: React.FC<ExpenseDistributionProps> = ({ despesas, empresa }) => {
  console.log('=== EXPENSE DISTRIBUTION ===');
  console.log('Empresa:', empresa);
  console.log('Despesas recebidas:', despesas?.length || 0);

  // Usar função centralizada para calcular dados
  const data = calculateDistributionData(despesas || []);

  console.log('Dados do gráfico de distribuição:', data);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const category = data.payload.name;
      
      // Buscar subcategorias da categoria
      const categoryExpenses = despesas.filter(d => {
        const normalizedCategory = d.categoria?.trim().toUpperCase();
        return normalizedCategory === category.toUpperCase() || 
               (category === 'Insumos' && normalizedCategory === 'INSUMOS') ||
               (category === 'Fixas' && normalizedCategory === 'FIXAS') ||
               (category === 'Variáveis' && normalizedCategory === 'VARIÁVEIS') ||
               (category === 'Atrasados' && normalizedCategory === 'ATRASADOS') ||
               (category === 'Retiradas' && normalizedCategory === 'RETIRADAS');
      });

      // Agrupar por subcategoria com tipagem correta
      const subcategoryTotals = categoryExpenses.reduce((acc: Record<string, { label: string; value: number }>, expense) => {
        const subcategory = expense.subcategoria || 'Sem subcategoria';
        const label = expense.subcategoria ? getSubcategoryLabel(expense.subcategoria) : 'Sem subcategoria';
        const value = expense.valor_total || expense.valor || 0;
        
        if (!acc[subcategory]) {
          acc[subcategory] = { label, value: 0 };
        }
        acc[subcategory].value += value;
        
        return acc;
      }, {});

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-800 mb-2">{category}</p>
          <p className="text-sm text-gray-600 mb-2">
            Total: R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600 mb-2">
            {((data.value / data.payload.total) * 100).toFixed(1)}% do total
          </p>
          
          {Object.keys(subcategoryTotals).length > 0 && (
            <div className="border-t pt-2 mt-2">
              <p className="text-xs font-medium text-gray-700 mb-1">Subcategorias:</p>
              {Object.entries(subcategoryTotals).map(([key, subcategoryData]) => {
                const typedData = subcategoryData as { label: string; value: number };
                return (
                  <p key={key} className="text-xs text-gray-600">
                    • {typedData.label}: R$ {typedData.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500">
        <p>Não há dados de despesas para exibir</p>
      </div>
    );
  }

  // Calcular total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map(item => ({ ...item, total }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span className="text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseDistribution;

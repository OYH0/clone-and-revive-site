
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MonthlyGoals from '@/components/MonthlyGoals';
import NextActions from '@/components/NextActions';
import { Despesa } from '@/hooks/useDespesas';
import { Receita } from '@/hooks/useReceitas';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';

interface JohnnyInsightsProps {
  despesas: Despesa[];
  receitas: Receita[];
}

const JohnnyInsights: React.FC<JohnnyInsightsProps> = ({ despesas, receitas }) => {
  const { data: todasDespesas } = useDespesas();
  const { data: todasReceitas } = useReceitas();

  // Filtrar TODOS os dados do Johnny para cálculos acumulados (para indicadores)
  const johnnyDespesasCompleto = todasDespesas?.filter(d => {
    const empresa = d.empresa?.toLowerCase().trim() || '';
    return empresa === 'johnny' || 
           empresa === 'johnny rockets' || 
           empresa === 'johnny rocket' ||
           empresa.includes('johnny');
  }) || [];
  
  const johnnyReceitasCompleto = todasReceitas?.filter(r => {
    const empresa = r.empresa?.toLowerCase().trim() || '';
    return empresa === 'johnny' || 
           empresa === 'johnny rockets' || 
           empresa === 'johnny rocket' ||
           empresa.includes('johnny');
  }) || [];

  // Para os indicadores (ROI e Break Even), usar dados acumulados totais
  const totalDespesasAcumulado = johnnyDespesasCompleto.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasAcumulado = johnnyReceitasCompleto.reduce((sum, r) => sum + r.valor, 0);
  const lucroAcumulado = totalReceitasAcumulado - totalDespesasAcumulado;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Indicadores de Performance */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Indicadores</CardTitle>
          <CardDescription>KPIs principais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
            <span className="text-blue-700 font-medium">ROI</span>
            <span className="text-blue-800 font-bold">
              {totalDespesasAcumulado > 0 ? ((lucroAcumulado / totalDespesasAcumulado) * 100).toFixed(1) : '0'}%
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
            <span className="text-indigo-700 font-medium">Break Even</span>
            <span className="text-indigo-800 font-bold">
              R$ {totalDespesasAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
            <span className="text-purple-700 font-medium">Crescimento</span>
            <span className="text-purple-800 font-bold">+8.3%</span>
          </div>
        </CardContent>
      </Card>

      {/* Metas e Objetivos */}
      <MonthlyGoals empresa="Johnny" />

      {/* Próximas Ações */}
      <NextActions empresa="Johnny Rockets" />
    </div>
  );
};

export default JohnnyInsights;

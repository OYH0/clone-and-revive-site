
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MonthlyGoals from '@/components/MonthlyGoals';
import NextActions from '@/components/NextActions';
import { Despesa } from '@/hooks/useDespesas';
import { Receita } from '@/hooks/useReceitas';

interface JohnnyInsightsProps {
  despesas: Despesa[];
  receitas: Receita[];
}

const JohnnyInsights: React.FC<JohnnyInsightsProps> = ({ despesas, receitas }) => {
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
  const lucro = totalReceitas - totalDespesas;

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
              {totalDespesas > 0 ? ((lucro / totalDespesas) * 100).toFixed(1) : '0'}%
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
            <span className="text-indigo-700 font-medium">Break Even</span>
            <span className="text-indigo-800 font-bold">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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

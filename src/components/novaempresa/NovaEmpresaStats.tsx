
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface NovaEmpresaStatsProps {
  despesas: any[];
  receitas: any[];
  period: string;
}

const NovaEmpresaStats: React.FC<NovaEmpresaStatsProps> = ({ despesas, receitas, period }) => {
  // Calcular totais
  const totalReceitas = receitas.reduce((sum, r) => sum + (r.valor || 0), 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
  const valorRestante = totalReceitas - totalDespesas;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Total de Receitas */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Receitas</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalReceitas)}
          </div>
          <CardDescription className="text-xs text-gray-500 mt-1">
            {period}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Total de Despesas */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Despesas</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalDespesas)}
          </div>
          <CardDescription className="text-xs text-gray-500 mt-1">
            {period}
          </CardDescription>
        </CardContent>
      </Card>

      {/* Valor Restante */}
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Valor Restante</CardTitle>
          <DollarSign className={`h-4 w-4 ${valorRestante >= 0 ? 'text-purple-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${valorRestante >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
            {formatCurrency(valorRestante)}
          </div>
          <CardDescription className="text-xs text-gray-500 mt-1">
            {period}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default NovaEmpresaStats;


import React from 'react';
import { TrendingUp, DollarSign, BarChart3, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JohnnyStatsProps {
  despesas: any[];
  receitas: any[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year' | 'custom';
}

const JohnnyStats: React.FC<JohnnyStatsProps> = ({ despesas, receitas, selectedPeriod }) => {
  const totalDespesas = despesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0;

  // Calcular CMV (Custo da Mercadoria Vendida) - apenas despesas de INSUMOS
  const cmvTotal = despesas
    .filter(d => d.categoria?.toUpperCase().includes('INSUMOS'))
    .reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  
  const percentualCMV = totalReceitas > 0 ? (cmvTotal / totalReceitas) * 100 : 0;

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Hoje';
      case 'week': return 'Esta Semana';
      case 'month': return 'Este Mês';
      case 'year': return 'Este Ano';
      case 'custom': return 'Período Personalizado';
      default: return 'Período';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Receita Total</CardTitle>
          <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()} • {receitas.length} transações</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Despesas Totais</CardTitle>
          <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
            <DollarSign className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{getPeriodLabel()} • {despesas.length} transações</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
          <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${lucroLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lucroLiquido >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem • {getPeriodLabel()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">CMV (Insumos)</CardTitle>
          <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl">
            <Package className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            R$ {cmvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {percentualCMV.toFixed(1)}% das vendas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JohnnyStats;

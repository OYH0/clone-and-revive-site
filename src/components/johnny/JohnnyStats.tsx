
import React from 'react';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Despesa } from '@/hooks/useDespesas';
import { Receita } from '@/hooks/useReceitas';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { calculateProfitByPeriod } from '@/utils/dateUtils';
import { getExpenseValue } from '@/utils/expenseFilters';

interface JohnnyStatsProps {
  despesas: Despesa[];
  receitas: Receita[];
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
}

const JohnnyStats: React.FC<JohnnyStatsProps> = ({ despesas, receitas, selectedPeriod }) => {
  const { data: todasDespesas } = useDespesas();
  const { data: todasReceitas } = useReceitas();

  // Filtrar TODOS os dados do Johnny para cálculos
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

  // Usar valor_total que inclui juros, ou valor como fallback - PERÍODO SELECIONADO
  const totalDespesasPeriodo = despesas.reduce((sum, d) => sum + getExpenseValue(d), 0);
  const totalReceitasPeriodo = receitas.reduce((sum, r) => sum + r.valor, 0);
  
  // NOVO: Calcular lucro baseado no período selecionado
  const lucroCalculado = calculateProfitByPeriod(johnnyDespesasCompleto, johnnyReceitasCompleto, selectedPeriod);
  const margemLucro = totalReceitasPeriodo > 0 ? (lucroCalculado / totalReceitasPeriodo) * 100 : 0;

  // Determinar o label do lucro baseado no período
  const getLucroLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'Lucro Líquido Hoje';
      case 'week': return 'Lucro Líquido Semanal';
      case 'month': return 'Lucro Líquido Acumulado';
      case 'year': return 'Lucro Líquido Anual';
      default: return 'Lucro Líquido';
    }
  };

  console.log('Johnny Stats - Total despesas período:', totalDespesasPeriodo);
  console.log('Johnny Stats - Despesas detalhadas:', despesas.map(d => ({
    id: d.id,
    descricao: d.descricao,
    valor: d.valor,
    valor_total: d.valor_total,
    valor_usado: getExpenseValue(d)
  })));

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
            R$ {totalReceitasPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{receitas.length} transações</p>
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
            R$ {totalDespesasPeriodo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{despesas.length} transações</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">{getLucroLabel()}</CardTitle>
          <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${lucroCalculado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {lucroCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lucroCalculado >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Média de Vendas</CardTitle>
          <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            R$ {receitas.length > 0 ? (totalReceitasPeriodo / receitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Por venda</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JohnnyStats;

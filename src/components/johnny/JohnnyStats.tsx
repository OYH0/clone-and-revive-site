
import React from 'react';
import { TrendingUp, DollarSign, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Despesa } from '@/hooks/useDespesas';
import { Receita } from '@/hooks/useReceitas';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';

interface JohnnyStatsProps {
  despesas: Despesa[];
  receitas: Receita[];
}

const JohnnyStats: React.FC<JohnnyStatsProps> = ({ despesas, receitas }) => {
  const { data: todasDespesas } = useDespesas();
  const { data: todasReceitas } = useReceitas();

  // Filtrar TODOS os dados do Johnny para lucro acumulado
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
  const totalDespesasPeriodo = despesas.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasPeriodo = receitas.reduce((sum, r) => sum + r.valor, 0);
  
  // LUCRO ACUMULADO - usar TODOS os dados da empresa, não apenas o período selecionado
  const totalDespesasAcumulado = johnnyDespesasCompleto.reduce((sum, d) => sum + (d.valor_total || d.valor), 0);
  const totalReceitasAcumulado = johnnyReceitasCompleto.reduce((sum, r) => sum + r.valor, 0);
  const lucroAcumulado = totalReceitasAcumulado - totalDespesasAcumulado;
  const margemLucro = totalReceitasAcumulado > 0 ? (lucroAcumulado / totalReceitasAcumulado) * 100 : 0;

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
          <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido Acumulado</CardTitle>
          <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${lucroAcumulado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {lucroAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {lucroAcumulado >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem acumulada
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Ticket Médio</CardTitle>
          <div className="p-2 bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl">
            <Users className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            R$ {receitas.length > 0 ? (totalReceitasPeriodo / receitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Por transação</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default JohnnyStats;

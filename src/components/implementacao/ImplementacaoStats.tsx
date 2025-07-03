
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, AlertCircle, TrendingDown } from 'lucide-react';

interface ImplementacaoStatsProps {
  despesas: any[];
  receitas: any[];
}

const ImplementacaoStats: React.FC<ImplementacaoStatsProps> = ({ despesas, receitas }) => {
  const totalDespesas = despesas.reduce((sum, despesa) => sum + (despesa.valor_total || despesa.valor || 0), 0);
  const totalReceitas = receitas.reduce((sum, receita) => sum + (receita.valor || 0), 0);
  const valorRestante = totalReceitas - totalDespesas;
  const despesasPendentes = despesas.filter(d => d.status === 'Pendente').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Receitas</CardTitle>
          <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-xl">
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{receitas.length} receitas registradas</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Total de Despesas</CardTitle>
          <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-xl">
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-gray-500 mt-1">{despesas.length} despesas registradas</p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Valor Restante</CardTitle>
          <div className={`p-2 bg-gradient-to-r rounded-xl ${
            valorRestante >= 0 
              ? 'from-purple-100 to-purple-200' 
              : 'from-red-100 to-red-200'
          }`}>
            <DollarSign className={`h-4 w-4 ${
              valorRestante >= 0 ? 'text-purple-600' : 'text-red-600'
            }`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${
            valorRestante >= 0 
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent'
          }`}>
            R$ {Math.abs(valorRestante).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className={`text-xs mt-1 ${
            valorRestante >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {valorRestante >= 0 ? 'Lucro' : 'Prejuízo'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-gray-600">Despesas Pendentes</CardTitle>
          <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-800">{despesasPendentes}</div>
          <p className="text-xs text-gray-500 mt-1">Aguardando pagamento</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImplementacaoStats;

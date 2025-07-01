
import React from 'react';
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getExpenseValue } from '@/utils/expenseFilters';

interface DespesasStatsProps {
  despesas: any[];
  filteredTransactionsCount: number;
}

const DespesasStats: React.FC<DespesasStatsProps> = ({
  despesas,
  filteredTransactionsCount
}) => {

  // Calcular totais usando a função padronizada
  const totalDespesas = despesas.reduce((sum, d) => sum + getExpenseValue(d), 0);
  
  const despesasPagas = despesas.filter(d => d.status === 'PAGO');
  const valorPago = despesasPagas.reduce((sum, d) => sum + getExpenseValue(d), 0);
  
  const despesasPendentes = despesas.filter(d => d.status !== 'PAGO');
  const valorPendente = despesasPendentes.reduce((sum, d) => sum + getExpenseValue(d), 0);
  
  // Calcular despesas atrasadas (vencidas e não pagas)
  const hoje = new Date();
  const despesasAtrasadas = despesas.filter(d => {
    if (d.status === 'PAGO') return false;
    
    const dataVencimento = d.data_vencimento || d.data;
    if (!dataVencimento) return false;
    
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  });
  const valorAtrasado = despesasAtrasadas.reduce((sum, d) => sum + getExpenseValue(d), 0);

  console.log('DespesasStats - Debug valores:', {
    totalDespesas,
    valorPago,
    valorPendente,
    valorAtrasado,
    countPagas: despesasPagas.length,
    countPendentes: despesasPendentes.length,
    countAtrasadas: despesasAtrasadas.length
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
            <DollarSign className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Total de Despesas</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">{filteredTransactionsCount} registros</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Pagas</h3>
            <p className="text-2xl font-bold text-green-600">
              R$ {valorPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">{despesasPagas.length} despesas</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-2xl">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-600">
              R$ {valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">{despesasPendentes.length} despesas</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Atrasadas</h3>
            <p className="text-2xl font-bold text-red-600">
              R$ {valorAtrasado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-gray-500">{despesasAtrasadas.length} despesas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DespesasStats;

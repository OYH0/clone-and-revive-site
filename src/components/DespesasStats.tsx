import React from 'react';
import { DollarSign, CheckCircle, Clock, AlertTriangle, Wallet, Vault, Percent } from 'lucide-react';
import { useSaldos } from '@/hooks/useSaldos';

interface DespesasStatsProps {
  totalDespesas: number;
  totalJuros: number;
  valorPago: number;
  valorPendente: number;
  valorAtrasado: number;
  despesasPagasCount: number;
  despesasPendentesCount: number;
  despesasAtrasadasCount: number;
  filteredTransactionsCount: number;
}

const DespesasStats: React.FC<DespesasStatsProps> = ({
  totalDespesas,
  totalJuros,
  valorPago,
  valorPendente,
  valorAtrasado,
  despesasPagasCount,
  despesasPendentesCount,
  despesasAtrasadasCount,
  filteredTransactionsCount
}) => {
  const { data: saldos, isLoading: saldosLoading } = useSaldos();
  
  const saldoConta = saldos?.find(s => s.tipo === 'conta')?.valor || 0;
  const saldoCofre = saldos?.find(s => s.tipo === 'cofre')?.valor || 0;

  return (
    <div className="mb-8 space-y-6">
      {/* Primeira linha: Stats principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
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
            <div className="p-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl">
              <Percent className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Total em Juros</h3>
              <p className="text-2xl font-bold text-orange-600">
                R$ {totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">Juros aplicados</p>
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
              <p className="text-xs text-gray-500">{despesasPagasCount} despesas</p>
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
              <p className="text-xs text-gray-500">{despesasPendentesCount} despesas</p>
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
              <p className="text-xs text-gray-500">{despesasAtrasadasCount} despesas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha: Saldos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
              <Wallet className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Total em Conta</h3>
              <p className="text-2xl font-bold text-blue-600">
                {saldosLoading ? 'Carregando...' : `R$ ${saldoConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs text-gray-500">Saldo atual</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl">
              <Vault className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Total em Cofre</h3>
              <p className="text-2xl font-bold text-purple-600">
                {saldosLoading ? 'Carregando...' : `R$ ${saldoCofre.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </p>
              <p className="text-xs text-gray-500">Saldo atual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DespesasStats;
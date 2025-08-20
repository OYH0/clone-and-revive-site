import React, { useMemo } from 'react';
import { DollarSign, CheckCircle, Clock, AlertTriangle, Wallet, Vault, Percent } from 'lucide-react';
import { useSaldos } from '@/hooks/useSaldos';
import { useReceitas } from '@/hooks/useReceitas';
import { Transaction } from '@/types/transaction';

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
  filterEmpresa: string;
  dateFrom?: string;
  dateTo?: string;
  allTransactions: Transaction[];
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
  filteredTransactionsCount,
  filterEmpresa,
  dateFrom,
  dateTo,
  allTransactions // Adicionar as transações para calcular débitos
}) => {
  const { data: saldos, isLoading: saldosLoading } = useSaldos();
  const { data: receitas, isLoading: receitasLoading } = useReceitas();
  
  // Memoizar o cálculo dos saldos para evitar recálculos desnecessários e erros de renderização
  const { saldoConta, saldoCofre } = useMemo(() => {
    // Verificações de segurança para evitar erros de renderização
    if (!receitas || !allTransactions) return { saldoConta: 0, saldoCofre: 0 };
    
    // Se não há filtro de empresa específico, usar saldos globais
    if (filterEmpresa === 'all') {
      const saldoConta = saldos?.find(s => s.tipo === 'conta')?.valor || 0;
      const saldoCofre = saldos?.find(s => s.tipo === 'cofre')?.valor || 0;
      return { saldoConta, saldoCofre };
    }
    
    console.log('=== CALCULANDO SALDOS FILTRADOS ===');
    console.log('Empresa:', filterEmpresa);
    console.log('Período:', dateFrom, 'até', dateTo);
    
    // Função para verificar se a data está no período
    const isInPeriod = (date: string) => {
      try {
        if (dateFrom || dateTo) {
          const itemDate = new Date(date);
          const fromDate = dateFrom ? new Date(dateFrom) : null;
          const toDate = dateTo ? new Date(dateTo) : null;
          
          if (fromDate && itemDate < fromDate) return false;
          if (toDate && itemDate > toDate) return false;
          return true;
        } else {
          // Se não há filtro manual, usar mês atual
          const now = new Date();
          const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          const itemDate = new Date(date);
          
          return itemDate >= firstDay && itemDate <= lastDay;
        }
      } catch (error) {
        console.warn('Erro ao verificar período:', error);
        return false;
      }
    };
    
    // Filtrar receitas por empresa e período com verificação de segurança
    const filteredReceitas = receitas?.filter(receita => {
      try {
        return receita && receita.empresa === filterEmpresa && receita.data && isInPeriod(receita.data);
      } catch (error) {
        console.warn('Erro ao filtrar receita:', error, receita);
        return false;
      }
    }) || [];
    
    // Filtrar despesas PAGAS por empresa e período com verificação de segurança
    const filteredDespesasPagas = allTransactions?.filter(despesa => {
      try {
        return despesa && 
               despesa.company === filterEmpresa && 
               despesa.status === 'PAGO' && 
               despesa.date && 
               isInPeriod(despesa.date) &&
               despesa.origem_pagamento;
      } catch (error) {
        console.warn('Erro ao filtrar despesa:', error, despesa);
        return false;
      }
    }) || [];
    
    console.log('Receitas filtradas:', filteredReceitas.length);
    console.log('Despesas pagas filtradas:', filteredDespesasPagas.length);
    
    // Calcular entradas por destino (receitas)
    const receitasConta = filteredReceitas
      .filter(r => r && r.destino === 'conta')
      .reduce((sum, r) => sum + (r.valor || 0), 0);
      
    const receitasCofre = filteredReceitas
      .filter(r => r && r.destino === 'cofre')
      .reduce((sum, r) => sum + (r.valor || 0), 0);
    
    // Calcular saídas por origem (despesas pagas)
    const despesasConta = filteredDespesasPagas
      .filter(d => d && d.origem_pagamento === 'conta')
      .reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
      
    const despesasCofre = filteredDespesasPagas
      .filter(d => d && d.origem_pagamento === 'cofre')
      .reduce((sum, d) => sum + (d.valor_total || d.valor || 0), 0);
    
    console.log('Receitas conta:', receitasConta, 'Despesas conta:', despesasConta);
    console.log('Receitas cofre:', receitasCofre, 'Despesas cofre:', despesasCofre);
    
    // Saldo = Receitas - Despesas
    const saldoConta = receitasConta - despesasConta;
    const saldoCofre = receitasCofre - despesasCofre;
    
    console.log('Saldo final conta:', saldoConta, 'Saldo final cofre:', saldoCofre);
    
    return { saldoConta, saldoCofre };
  }, [receitas, saldos, allTransactions, filterEmpresa, dateFrom, dateTo]);
  
  const isLoading = saldosLoading || receitasLoading;

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
                {isLoading ? 'Carregando...' : `R$ ${saldoConta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
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
                {isLoading ? 'Carregando...' : `R$ ${saldoCofre.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
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
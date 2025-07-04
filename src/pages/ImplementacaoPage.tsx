
import React, { useMemo } from 'react';
import { Building2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NextActions from '@/components/NextActions';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import ImplementacaoCharts from '@/components/implementacao/ImplementacaoCharts';
import ImplementacaoStats from '@/components/implementacao/ImplementacaoStats';

const ImplementacaoPage = () => {
  const { data: allDespesas, isLoading: despesasLoading } = useDespesas();
  const { data: allReceitas, isLoading: receitasLoading } = useReceitas();
  const { isAdmin } = useAdminAccess();

  const implementacaoDespesas = useMemo(() => {
    return allDespesas?.filter(despesa => {
      const empresa = despesa.empresa?.toLowerCase().trim() || '';
      return empresa === 'implementação' || empresa === 'implementacao';
    }) || [];
  }, [allDespesas]);

  const implementacaoReceitas = useMemo(() => {
    return allReceitas?.filter(receita => {
      const empresa = receita.empresa?.toLowerCase().trim() || '';
      return empresa === 'implementação' || empresa === 'implementacao';
    }) || [];
  }, [allReceitas]);

  const isLoading = despesasLoading || receitasLoading;

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100">
        <p className="text-lg text-gray-600">Carregando dados da Implementação...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-orange-50 to-amber-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Implementação
              </h1>
              <p className="text-gray-600 text-lg">Gestão financeira de projetos de implementação</p>
            </div>
          </div>
          
          {!isAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-medium">Modo Visualização</p>
                  <p className="text-blue-600 text-sm">Apenas administradores podem adicionar novas despesas.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <ImplementacaoStats despesas={implementacaoDespesas} receitas={implementacaoReceitas} />

        {/* Charts */}
        <ImplementacaoCharts despesas={implementacaoDespesas} receitas={implementacaoReceitas} />

        {/* Next Actions */}
        <div className="mb-6">
          <NextActions empresa="Implementação" />
        </div>
      </div>
    </div>
  );
};

export default ImplementacaoPage;

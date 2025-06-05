
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, FileText, DollarSign, TrendingUp } from 'lucide-react';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import TransactionTable from '@/components/TransactionTable';
import ReceitaTable from '@/components/ReceitaTable';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddReceitaModal from '@/components/AddReceitaModal';

const CamerinoPage = () => {
  const [isAddDespesaModalOpen, setIsAddDespesaModalOpen] = useState(false);
  const [isAddReceitaModalOpen, setIsAddReceitaModalOpen] = useState(false);
  
  const { data: despesas = [], isLoading: isLoadingDespesas } = useDespesas();
  const { data: receitas = [], isLoading: isLoadingReceitas } = useReceitas();

  // Filtrar dados específicos para Camerino
  const camerinoDespesas = despesas.filter(despesa => despesa.empresa === 'Camerino');
  const camerinoReceitas = receitas.filter(receita => receita.empresa === 'Camerino');

  // Calcular estatísticas
  const totalDespesas = camerinoDespesas.reduce((sum, despesa) => sum + (despesa.valor || 0), 0);
  const totalReceitas = camerinoReceitas.reduce((sum, receita) => sum + (receita.valor || 0), 0);
  const saldoAtual = totalReceitas - totalDespesas;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Camerino</h1>
            <p className="text-gray-600">Gestão financeira da empresa Camerino</p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Despesas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Receitas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${saldoAtual >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                  <FileText className={`h-6 w-6 ${saldoAtual >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                  <p className={`text-2xl font-bold ${saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs para Despesas e Receitas */}
          <Tabs defaultValue="despesas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="despesas">Despesas</TabsTrigger>
              <TabsTrigger value="receitas">Receitas</TabsTrigger>
            </TabsList>

            <TabsContent value="despesas" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Despesas da Camerino</h2>
                <Button 
                  onClick={() => setIsAddDespesaModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Nova Despesa
                </Button>
              </div>
              
              <Card className="p-6">
                {isLoadingDespesas ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Carregando despesas...</p>
                  </div>
                ) : camerinoDespesas.length > 0 ? (
                  <TransactionTable despesas={camerinoDespesas} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhuma despesa encontrada para a Camerino.</p>
                    <p className="text-sm text-gray-500 mt-2">Clique em "Nova Despesa" para começar.</p>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="receitas" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Receitas da Camerino</h2>
                <Button 
                  onClick={() => setIsAddReceitaModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  Nova Receita
                </Button>
              </div>
              
              <Card className="p-6">
                {isLoadingReceitas ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Carregando receitas...</p>
                  </div>
                ) : camerinoReceitas.length > 0 ? (
                  <ReceitaTable receitas={camerinoReceitas} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Nenhuma receita encontrada para a Camerino.</p>
                    <p className="text-sm text-gray-500 mt-2">Clique em "Nova Receita" para começar.</p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modais */}
      <AddTransactionModal
        isOpen={isAddDespesaModalOpen}
        onClose={() => setIsAddDespesaModalOpen(false)}
        defaultEmpresa="Camerino"
      />
      <AddReceitaModal
        isOpen={isAddReceitaModalOpen}
        onClose={() => setIsAddReceitaModalOpen(false)}
        defaultEmpresa="Camerino"
      />
    </div>
  );
};

export default CamerinoPage;

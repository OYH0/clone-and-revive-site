
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddTransactionModal from '@/components/AddTransactionModal';
import TransactionTable from '@/components/TransactionTable';
import { useDespesas } from '@/hooks/useDespesas';
import { useQueryClient } from '@tanstack/react-query';

const DespesasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: despesas, isLoading } = useDespesas();
  const queryClient = useQueryClient();

  const handleTransactionAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['despesas'] });
  };

  const totalDespesas = despesas?.reduce((sum, despesa) => sum + despesa.valor, 0) || 0;
  const despesasAtrasadas = despesas?.filter(d => d.categoria === 'ATRASADOS').length || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
              <p className="text-gray-600">Gerencie todas as despesas do negócio</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Nova Despesa
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Registros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{despesas?.length || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas Atrasadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{despesasAtrasadas}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Despesas</CardTitle>
              <CardDescription>
                Todas as despesas registradas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <TransactionTable transactions={despesas || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
};

export default DespesasPage;

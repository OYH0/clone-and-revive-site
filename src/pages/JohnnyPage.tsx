
import React from 'react';
import { Building2, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDespesas } from '@/hooks/useDespesas';

const JohnnyPage = () => {
  const { data: despesas } = useDespesas();
  
  const johnnyDespesas = despesas?.filter(d => d.empresa === 'Johnny') || [];
  const totalDespesas = johnnyDespesas.reduce((sum, despesa) => sum + despesa.valor, 0);
  const despesasInsumos = johnnyDespesas.filter(d => d.categoria === 'INSUMOS').length;
  const despesasFixas = johnnyDespesas.filter(d => d.categoria === 'FIXAS').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">Johnny Rockets</h1>
            </div>
            <p className="text-gray-600">Gestão financeira do Johnny Rockets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                <p className="text-xs text-muted-foreground">Total acumulado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas de Insumos</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{despesasInsumos}</div>
                <p className="text-xs text-muted-foreground">Registros de insumos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
                <Calendar className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{despesasFixas}</div>
                <p className="text-xs text-muted-foreground">Registros fixos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Registros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{johnnyDespesas.length}</div>
                <p className="text-xs text-muted-foreground">Todas as movimentações</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Principais Categorias</CardTitle>
                <CardDescription>
                  Distribuição de gastos por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Insumos</span>
                    <span className="text-sm text-orange-600">{despesasInsumos} registros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Despesas Fixas</span>
                    <span className="text-sm text-green-600">{despesasFixas} registros</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Despesas Variáveis</span>
                    <span className="text-sm text-blue-600">
                      {johnnyDespesas.filter(d => d.categoria === 'VARIÁVEIS').length} registros
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas Movimentações</CardTitle>
                <CardDescription>
                  Registros mais recentes da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {johnnyDespesas.slice(0, 5).map((despesa) => (
                    <div key={despesa.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{despesa.descricao}</p>
                        <p className="text-xs text-gray-500">{despesa.categoria}</p>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        -R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JohnnyPage;

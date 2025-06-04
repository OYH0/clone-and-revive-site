
import React from 'react';
import { Building2, TrendingUp, DollarSign, Users, Calendar, PieChart, BarChart3 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';

const JohnnyPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();

  // Filtrar dados do Johnny Rockets
  const johnnyDespesas = despesas?.filter(d => d.empresa === 'Johnny') || [];
  const johnnyReceitas = receitas?.filter(r => r.empresa === 'Johnny') || [];

  // Calcular estatísticas
  const totalDespesas = johnnyDespesas.reduce((sum, d) => sum + d.valor, 0) / 100;
  const totalReceitas = johnnyReceitas.reduce((sum, r) => sum + r.valor, 0);
  const lucro = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;

  // Dados para gráficos
  const despesasPorCategoria = [
    { name: 'Insumos', value: johnnyDespesas.filter(d => d.categoria === 'INSUMOS').reduce((sum, d) => sum + d.valor, 0) / 100, color: '#3b82f6' },
    { name: 'Fixas', value: johnnyDespesas.filter(d => d.categoria === 'FIXAS').reduce((sum, d) => sum + d.valor, 0) / 100, color: '#8b5cf6' },
    { name: 'Atrasados', value: johnnyDespesas.filter(d => d.categoria === 'ATRASADOS').reduce((sum, d) => sum + d.valor, 0) / 100, color: '#ef4444' },
    { name: 'Variáveis', value: johnnyDespesas.filter(d => d.categoria === 'VARIAVEIS').reduce((sum, d) => sum + d.valor, 0) / 100, color: '#f59e0b' }
  ].filter(item => item.value > 0);

  const evolucaoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      const monthDespesas = johnnyDespesas.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0) / 100;
      
      const monthReceitas = johnnyReceitas.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);
      
      return {
        month,
        despesas: monthDespesas,
        receitas: monthReceitas,
        lucro: monthReceitas - monthDespesas
      };
    });
  }, [johnnyDespesas, johnnyReceitas]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
                  Johnny Rockets
                </h1>
                <p className="text-gray-600 text-lg">Análise financeira detalhada da empresa</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl h-12">
                Relatório Mensal
              </Button>
              <Button variant="outline" className="rounded-2xl h-12">
                Análise de Custos
              </Button>
              <Button variant="outline" className="rounded-2xl h-12">
                Projeções
              </Button>
              <Button variant="outline" className="rounded-2xl h-12">
                Comparativo
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
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
                  R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{johnnyReceitas.length} transações</p>
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
                  R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">{johnnyDespesas.length} transações</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Lucro Líquido</CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {lucro >= 0 ? '+' : ''}{margemLucro.toFixed(1)}% margem
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
                  R$ {johnnyReceitas.length > 0 ? (totalReceitas / johnnyReceitas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
                </div>
                <p className="text-xs text-gray-500 mt-1">Por transação</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Evolução Mensal */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Evolução Mensal</CardTitle>
                <CardDescription>Performance financeira mês a mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={evolucaoMensal}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                      <Legend />
                      <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#3b82f6" name="Despesas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribuição de Despesas */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Distribuição de Despesas</CardTitle>
                <CardDescription>Categorias de gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={despesasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {despesasPorCategoria.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Indicadores de Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Indicadores</CardTitle>
                <CardDescription>KPIs principais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                  <span className="text-blue-700 font-medium">ROI</span>
                  <span className="text-blue-800 font-bold">
                    {totalDespesas > 0 ? ((lucro / totalDespesas) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-xl">
                  <span className="text-indigo-700 font-medium">Break Even</span>
                  <span className="text-indigo-800 font-bold">
                    R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                  <span className="text-purple-700 font-medium">Crescimento</span>
                  <span className="text-purple-800 font-bold">+8.3%</span>
                </div>
              </CardContent>
            </Card>

            {/* Metas e Objetivos */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Metas do Mês</CardTitle>
                <CardDescription>Objetivos e progresso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Receita Meta</span>
                    <span className="text-sm text-gray-600">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Controle Custos</span>
                    <span className="text-sm text-gray-600">88%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Margem Lucro</span>
                    <span className="text-sm text-gray-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximas Ações */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Próximas Ações</CardTitle>
                <CardDescription>Tarefas pendentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reunião de resultados</p>
                    <p className="text-xs text-gray-500">Até 18/12</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <PieChart className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Renegociar contratos</p>
                    <p className="text-xs text-gray-500">Até 22/12</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Planejamento 2025</p>
                    <p className="text-xs text-gray-500">Até 30/12</p>
                  </div>
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

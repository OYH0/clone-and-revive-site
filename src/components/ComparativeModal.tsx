
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';

interface ComparativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  empresa: string;
}

const ComparativeModal: React.FC<ComparativeModalProps> = ({ isOpen, onClose, empresa }) => {
  const { data: todasDespesas } = useDespesas();
  const { data: todasReceitas } = useReceitas();

  // Filtrar dados por empresa
  const empresaAtual = empresa === 'Johnny Rockets' ? 'Johnny' : 'Churrasco';
  const outraEmpresa = empresa === 'Johnny Rockets' ? 'Churrasco' : 'Johnny';
  const nomeOutraEmpresa = empresa === 'Johnny Rockets' ? 'Companhia do Churrasco' : 'Johnny Rockets';

  const despesasAtual = todasDespesas?.filter(d => d.empresa === empresaAtual) || [];
  const receitasAtual = todasReceitas?.filter(r => r.empresa === empresaAtual) || [];
  const despesasOutra = todasDespesas?.filter(d => d.empresa === outraEmpresa) || [];
  const receitasOutra = todasReceitas?.filter(r => r.empresa === outraEmpresa) || [];

  // Calcular totais
  const calcularTotais = (despesas: any[], receitas: any[]) => {
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
    const lucro = totalReceitas - totalDespesas;
    const margem = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;
    
    return { totalDespesas, totalReceitas, lucro, margem };
  };

  const totaisAtual = calcularTotais(despesasAtual, receitasAtual);
  const totaisOutra = calcularTotais(despesasOutra, receitasOutra);

  // Comparativo mensal
  const comparativoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      const receitasAtualMes = receitasAtual.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);

      const receitasOutraMes = receitasOutra.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);

      const despesasAtualMes = despesasAtual.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);

      const despesasOutraMes = despesasOutra.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);

      return {
        month,
        [`${empresa} - Receitas`]: receitasAtualMes,
        [`${nomeOutraEmpresa} - Receitas`]: receitasOutraMes,
        [`${empresa} - Despesas`]: despesasAtualMes,
        [`${nomeOutraEmpresa} - Despesas`]: despesasOutraMes,
        [`${empresa} - Lucro`]: receitasAtualMes - despesasAtualMes,
        [`${nomeOutraEmpresa} - Lucro`]: receitasOutraMes - despesasOutraMes
      };
    });
  }, [despesasAtual, receitasAtual, despesasOutra, receitasOutra, empresa, nomeOutraEmpresa]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Análise Comparativa</DialogTitle>
          <DialogDescription>
            Comparação entre {empresa} e {nomeOutraEmpresa}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comparativo de Indicadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Empresa Atual */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{empresa}</CardTitle>
                <CardDescription>Indicadores financeiros atuais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {totaisAtual.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {totaisAtual.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro:</span>
                  <span className={`font-bold ${totaisAtual.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {totaisAtual.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem:</span>
                  <span className={`font-bold ${totaisAtual.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totaisAtual.margem.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Outra Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{nomeOutraEmpresa}</CardTitle>
                <CardDescription>Indicadores financeiros atuais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {totaisOutra.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {totaisOutra.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro:</span>
                  <span className={`font-bold ${totaisOutra.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {totaisOutra.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem:</span>
                  <span className={`font-bold ${totaisOutra.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totaisOutra.margem.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise de Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Análise de Performance
              </CardTitle>
              <CardDescription>Comparativo detalhado entre as empresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {totaisAtual.totalReceitas > totaisOutra.totalReceitas ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Receitas</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {empresa} tem {totaisAtual.totalReceitas > totaisOutra.totalReceitas ? 'maior' : 'menor'} receita que {nomeOutraEmpresa}
                  </p>
                  <p className="text-xs mt-1">
                    Diferença: R$ {Math.abs(totaisAtual.totalReceitas - totaisOutra.totalReceitas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {totaisAtual.totalDespesas < totaisOutra.totalDespesas ? (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Despesas</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {empresa} tem {totaisAtual.totalDespesas > totaisOutra.totalDespesas ? 'maiores' : 'menores'} despesas que {nomeOutraEmpresa}
                  </p>
                  <p className="text-xs mt-1">
                    Diferença: R$ {Math.abs(totaisAtual.totalDespesas - totaisOutra.totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {totaisAtual.margem > totaisOutra.margem ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Margem</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {empresa} tem {totaisAtual.margem > totaisOutra.margem ? 'melhor' : 'pior'} margem que {nomeOutraEmpresa}
                  </p>
                  <p className="text-xs mt-1">
                    Diferença: {Math.abs(totaisAtual.margem - totaisOutra.margem).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Comparativo */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Comparativa (Receitas)</CardTitle>
              <CardDescription>Comparação mensal das receitas entre as empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativoMensal}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey={`${empresa} - Receitas`} fill="#3b82f6" name={`${empresa} - Receitas`} />
                    <Bar dataKey={`${nomeOutraEmpresa} - Receitas`} fill="#ef4444" name={`${nomeOutraEmpresa} - Receitas`} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Lucro Comparativo */}
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Lucro</CardTitle>
              <CardDescription>Evolução do lucro mensal entre as empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparativoMensal}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey={`${empresa} - Lucro`} stroke="#3b82f6" strokeWidth={3} name={`${empresa} - Lucro`} />
                    <Line type="monotone" dataKey={`${nomeOutraEmpresa} - Lucro`} stroke="#ef4444" strokeWidth={3} name={`${nomeOutraEmpresa} - Lucro`} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComparativeModal;


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

  // Mapear nomes das empresas para consistência
  const empresaMapping: { [key: string]: string } = {
    'Johnny Rockets': 'Johnny',
    'Companhia do Churrasco': 'Churrasco',
    'Camerino': 'Camerino'
  };

  const empresaAtualKey = empresaMapping[empresa] || empresa;

  // Filtrar dados por empresa
  const despesasCamerino = todasDespesas?.filter(d => d.empresa === 'Camerino') || [];
  const receitasCamerino = todasReceitas?.filter(r => r.empresa === 'Camerino') || [];
  const despesasJohnny = todasDespesas?.filter(d => d.empresa === 'Johnny') || [];
  const receitasJohnny = todasReceitas?.filter(r => r.empresa === 'Johnny') || [];
  const despesasChurrasco = todasDespesas?.filter(d => d.empresa === 'Churrasco') || [];
  const receitasChurrasco = todasReceitas?.filter(r => r.empresa === 'Churrasco') || [];

  // Calcular totais para cada empresa
  const calcularTotais = (despesas: any[], receitas: any[]) => {
    const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
    const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
    const lucro = totalReceitas - totalDespesas;
    const margem = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0;
    
    return { totalDespesas, totalReceitas, lucro, margem };
  };

  const totaisCamerino = calcularTotais(despesasCamerino, receitasCamerino);
  const totaisJohnny = calcularTotais(despesasJohnny, receitasJohnny);
  const totaisChurrasco = calcularTotais(despesasChurrasco, receitasChurrasco);

  // Comparativo mensal entre todas as empresas
  const comparativoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      // Camerino
      const receitasCamerinoMes = receitasCamerino.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);

      const despesasCamerinoMes = despesasCamerino.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);

      // Johnny
      const receitasJohnnyMes = receitasJohnny.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);

      const despesasJohnnyMes = despesasJohnny.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);

      // Churrasco
      const receitasChurrascoMes = receitasChurrasco.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === index;
      }).reduce((sum, r) => sum + r.valor, 0);

      const despesasChurrascoMes = despesasChurrasco.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);

      return {
        month,
        'Camerino - Receitas': receitasCamerinoMes,
        'Johnny Rockets - Receitas': receitasJohnnyMes,
        'Companhia do Churrasco - Receitas': receitasChurrascoMes,
        'Camerino - Despesas': despesasCamerinoMes,
        'Johnny Rockets - Despesas': despesasJohnnyMes,
        'Companhia do Churrasco - Despesas': despesasChurrascoMes,
        'Camerino - Lucro': receitasCamerinoMes - despesasCamerinoMes,
        'Johnny Rockets - Lucro': receitasJohnnyMes - despesasJohnnyMes,
        'Companhia do Churrasco - Lucro': receitasChurrascoMes - despesasChurrascoMes
      };
    });
  }, [despesasCamerino, receitasCamerino, despesasJohnny, receitasJohnny, despesasChurrasco, receitasChurrasco]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Análise Comparativa</DialogTitle>
          <DialogDescription>
            Comparação entre todas as empresas: Camerino, Johnny Rockets e Companhia do Churrasco
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Comparativo de Indicadores - Todas as Empresas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Camerino */}
            <Card className={empresa === 'Camerino' ? 'ring-2 ring-purple-500' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Camerino
                  {empresa === 'Camerino' && <span className="text-sm text-purple-600">(Atual)</span>}
                </CardTitle>
                <CardDescription>Indicadores financeiros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {totaisCamerino.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {totaisCamerino.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro:</span>
                  <span className={`font-bold ${totaisCamerino.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {totaisCamerino.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem:</span>
                  <span className={`font-bold ${totaisCamerino.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totaisCamerino.margem.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Johnny Rockets */}
            <Card className={empresa === 'Johnny Rockets' ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Johnny Rockets
                  {empresa === 'Johnny Rockets' && <span className="text-sm text-blue-600">(Atual)</span>}
                </CardTitle>
                <CardDescription>Indicadores financeiros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {totaisJohnny.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {totaisJohnny.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro:</span>
                  <span className={`font-bold ${totaisJohnny.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {totaisJohnny.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem:</span>
                  <span className={`font-bold ${totaisJohnny.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totaisJohnny.margem.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Companhia do Churrasco */}
            <Card className={empresa === 'Companhia do Churrasco' ? 'ring-2 ring-red-500' : ''}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Companhia do Churrasco
                  {empresa === 'Companhia do Churrasco' && <span className="text-sm text-red-600">(Atual)</span>}
                </CardTitle>
                <CardDescription>Indicadores financeiros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Receitas:</span>
                  <span className="font-bold text-green-600">
                    R$ {totaisChurrasco.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Despesas:</span>
                  <span className="font-bold text-red-600">
                    R$ {totaisChurrasco.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lucro:</span>
                  <span className={`font-bold ${totaisChurrasco.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {totaisChurrasco.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margem:</span>
                  <span className={`font-bold ${totaisChurrasco.margem >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totaisChurrasco.margem.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ranking de Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Ranking de Performance
              </CardTitle>
              <CardDescription>Comparativo entre todas as empresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium">Maior Receita</span>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    {totaisCamerino.totalReceitas >= totaisJohnny.totalReceitas && totaisCamerino.totalReceitas >= totaisChurrasco.totalReceitas ? 'Camerino' :
                     totaisJohnny.totalReceitas >= totaisChurrasco.totalReceitas ? 'Johnny Rockets' : 'Companhia do Churrasco'}
                  </p>
                  <p className="text-xs mt-1">
                    R$ {Math.max(totaisCamerino.totalReceitas, totaisJohnny.totalReceitas, totaisChurrasco.totalReceitas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Menor Despesa</span>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    {totaisCamerino.totalDespesas <= totaisJohnny.totalDespesas && totaisCamerino.totalDespesas <= totaisChurrasco.totalDespesas ? 'Camerino' :
                     totaisJohnny.totalDespesas <= totaisChurrasco.totalDespesas ? 'Johnny Rockets' : 'Companhia do Churrasco'}
                  </p>
                  <p className="text-xs mt-1">
                    R$ {Math.min(totaisCamerino.totalDespesas, totaisJohnny.totalDespesas, totaisChurrasco.totalDespesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Melhor Margem</span>
                  </div>
                  <p className="text-sm text-gray-600 font-semibold">
                    {totaisCamerino.margem >= totaisJohnny.margem && totaisCamerino.margem >= totaisChurrasco.margem ? 'Camerino' :
                     totaisJohnny.margem >= totaisChurrasco.margem ? 'Johnny Rockets' : 'Companhia do Churrasco'}
                  </p>
                  <p className="text-xs mt-1">
                    {Math.max(totaisCamerino.margem, totaisJohnny.margem, totaisChurrasco.margem).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Comparativo - Receitas */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Comparativa (Receitas)</CardTitle>
              <CardDescription>Comparação mensal das receitas entre todas as empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparativoMensal}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Bar dataKey="Camerino - Receitas" fill="#8b5cf6" name="Camerino" />
                    <Bar dataKey="Johnny Rockets - Receitas" fill="#3b82f6" name="Johnny Rockets" />
                    <Bar dataKey="Companhia do Churrasco - Receitas" fill="#ef4444" name="Companhia do Churrasco" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Lucro Comparativo */}
          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Lucro</CardTitle>
              <CardDescription>Evolução do lucro mensal entre todas as empresas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparativoMensal}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="Camerino - Lucro" stroke="#8b5cf6" strokeWidth={3} name="Camerino" />
                    <Line type="monotone" dataKey="Johnny Rockets - Lucro" stroke="#3b82f6" strokeWidth={3} name="Johnny Rockets" />
                    <Line type="monotone" dataKey="Companhia do Churrasco - Lucro" stroke="#ef4444" strokeWidth={3} name="Companhia do Churrasco" />
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

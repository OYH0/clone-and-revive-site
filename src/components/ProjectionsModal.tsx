
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Calculator } from 'lucide-react';

interface ProjectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  despesas: any[];
  receitas: any[];
  empresa: string;
}

const ProjectionsModal: React.FC<ProjectionsModalProps> = ({ isOpen, onClose, despesas, receitas, empresa }) => {
  // Calcular médias dos últimos 6 meses
  const calcularMedias = () => {
    const months = Array.from({ length: 6 }, (_, i) => i);
    const receitasMensais = months.map(month => {
      return receitas.filter(r => {
        const date = new Date(r.data);
        return date.getMonth() === month;
      }).reduce((sum, r) => sum + r.valor, 0);
    });
    
    const despesasMensais = months.map(month => {
      return despesas.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === month;
      }).reduce((sum, d) => sum + d.valor, 0);
    });

    return {
      mediaReceitas: receitasMensais.reduce((sum, val) => sum + val, 0) / receitasMensais.filter(val => val > 0).length || 0,
      mediaDespesas: despesasMensais.reduce((sum, val) => sum + val, 0) / despesasMensais.filter(val => val > 0).length || 0
    };
  };

  const { mediaReceitas, mediaDespesas } = calcularMedias();

  // Projeções para os próximos 6 meses
  const projecoes = React.useMemo(() => {
    const mesesFuturos = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const crescimentoReceitas = 1.05; // 5% de crescimento
    const crescimentoDespesas = 1.03; // 3% de crescimento

    return mesesFuturos.map((mes, index) => {
      const receitaProjetada = mediaReceitas * Math.pow(crescimentoReceitas, index + 1);
      const despesaProjetada = mediaDespesas * Math.pow(crescimentoDespesas, index + 1);
      
      return {
        mes,
        receitas: receitaProjetada,
        despesas: despesaProjetada,
        lucro: receitaProjetada - despesaProjetada
      };
    });
  }, [mediaReceitas, mediaDespesas]);

  const totalReceitaProjetada = projecoes.reduce((sum, p) => sum + p.receitas, 0);
  const totalDespesaProjetada = projecoes.reduce((sum, p) => sum + p.despesas, 0);
  const lucroProjetado = totalReceitaProjetada - totalDespesaProjetada;

  // Cenários
  const cenarios = [
    {
      nome: 'Otimista',
      receitas: totalReceitaProjetada * 1.15,
      despesas: totalDespesaProjetada * 0.95,
      cor: '#10b981'
    },
    {
      nome: 'Realista',
      receitas: totalReceitaProjetada,
      despesas: totalDespesaProjetada,
      cor: '#3b82f6'
    },
    {
      nome: 'Pessimista',
      receitas: totalReceitaProjetada * 0.85,
      despesas: totalDespesaProjetada * 1.10,
      cor: '#ef4444'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Projeções Financeiras - {empresa}</DialogTitle>
          <DialogDescription>
            Projeções baseadas no histórico dos últimos 6 meses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo das Projeções */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Receita Projetada (6m)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  R$ {totalReceitaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">+5% crescimento mensal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-red-500" />
                  Despesa Projetada (6m)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  R$ {totalDespesaProjetada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">+3% crescimento mensal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Lucro Projetado (6m)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${lucroProjetado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucroProjetado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((lucroProjetado / totalReceitaProjetada) * 100).toFixed(1)}% margem
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Projeções */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Projetada (Próximos 6 Meses)</CardTitle>
              <CardDescription>Projeção baseada na tendência histórica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={projecoes}>
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    <Legend />
                    <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={3} name="Receitas" />
                    <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} name="Despesas" />
                    <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={3} name="Lucro" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Análise de Cenários */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Cenários</CardTitle>
              <CardDescription>Diferentes possibilidades para os próximos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cenarios.map((cenario, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold" style={{ color: cenario.cor }}>
                        Cenário {cenario.nome}
                      </h4>
                      <div className="text-sm text-gray-500">
                        Lucro: R$ {(cenario.receitas - cenario.despesas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Receitas:</span> 
                        <span className="ml-2 font-medium">R$ {cenario.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Despesas:</span> 
                        <span className="ml-2 font-medium">R$ {cenario.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Metas Recomendadas */}
          <Card>
            <CardHeader>
              <CardTitle>Metas Recomendadas</CardTitle>
              <CardDescription>Objetivos sugeridos com base nas projeções</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm">
                  <strong>Meta de Receita:</strong> R$ {(totalReceitaProjetada * 1.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (+10% sobre projeção)
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm">
                  <strong>Meta de Redução de Custos:</strong> R$ {(totalDespesaProjetada * 0.95).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (-5% sobre projeção)
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                <p className="text-sm">
                  <strong>Meta de Margem:</strong> {(((totalReceitaProjetada * 1.1) - (totalDespesaProjetada * 0.95)) / (totalReceitaProjetada * 1.1) * 100).toFixed(1)}% de margem de lucro
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectionsModal;

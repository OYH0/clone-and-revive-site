
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import ExpenseDistribution from '@/components/ExpenseDistribution';
import { Despesa } from '@/hooks/useDespesas';
import { Receita } from '@/hooks/useReceitas';

interface JohnnyChartsProps {
  despesas: Despesa[];
  receitas: Receita[];
}

const JohnnyCharts: React.FC<JohnnyChartsProps> = ({ despesas, receitas }) => {
  const evolucaoMensal = React.useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    return months.map((month, index) => {
      const monthDespesas = despesas.filter(d => {
        const date = new Date(d.data);
        return date.getMonth() === index;
      }).reduce((sum, d) => sum + d.valor, 0);
      
      const monthReceitas = receitas.filter(r => {
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
  }, [despesas, receitas]);

  return (
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
          <ExpenseDistribution despesas={despesas} empresa="Johnny Rockets" />
        </CardContent>
      </Card>
    </div>
  );
};

export default JohnnyCharts;


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
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentYear = new Date().getFullYear();
    
    console.log('=== DEBUG JOHNNY EVOLUÇÃO MENSAL ===');
    console.log('Ano atual:', currentYear);
    console.log('Total de receitas Johnny:', receitas?.length || 0);
    console.log('Total de despesas Johnny:', despesas?.length || 0);
    
    return months.map((month, index) => {
      const monthDespesas = despesas?.filter(d => {
        if (!d.data) return false;
        
        // Parsing corrigido - criar date de forma consistente
        const dateParts = d.data.split('-');
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        
        const isCurrentMonth = date.getMonth() === index && date.getFullYear() === currentYear;
        
        if (index === 4 || index === 5) { // Debug para Mai e Jun
          console.log(`Johnny Despesa - ${month}: data=${d.data}, parsedMonth=${date.getMonth()}, isCurrentMonth=${isCurrentMonth}`);
        }
        
        return isCurrentMonth;
      }).reduce((sum, d) => sum + (d.valor || 0), 0) || 0;
      
      const monthReceitas = receitas?.filter(r => {
        if (!r.data) return false;
        
        // Parsing corrigido - criar date de forma consistente
        const dateParts = r.data.split('-');
        const date = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        
        const isCurrentMonth = date.getMonth() === index && date.getFullYear() === currentYear;
        
        if (index === 4 || index === 5) { // Debug para Mai e Jun
          console.log(`Johnny Receita - ${month}: data=${r.data}, parsedMonth=${date.getMonth()}, isCurrentMonth=${isCurrentMonth}, valor=${r.valor}`);
        }
        
        return isCurrentMonth;
      }).reduce((sum, r) => sum + (r.valor || 0), 0) || 0;
      
      if (index === 4 || index === 5) {
        console.log(`Johnny Total ${month}: Receitas=${monthReceitas}, Despesas=${monthDespesas}`);
      }
      
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


import React from 'react';
import CompanyCard from '../CompanyCard';
import { Despesa } from '@/hooks/useDespesas';
import { calculateCompanyTotals, debugCompanies, verifyDataIntegrity } from '@/utils/dashboardCalculations';

interface DashboardCardsProps {
  despesas: Despesa[];
  period: string;
  stats?: {
    total: number;
    pagas: number;
    pendentes: number;
    count: number;
    pagasCount: number;
    pendentesCount: number;
  };
}

// Função para gerar dados de gráfico baseados nas categorias
const generateChartData = (categories: Record<string, number>) => {
  const values = Object.values(categories).filter(v => v > 0);
  if (values.length === 0) return [{ value: 0 }];
  
  const maxValue = Math.max(...values);
  
  // Gerar 6 pontos de dados simulando evolução mensal
  return Array.from({ length: 6 }, (_, i) => ({
    value: Math.max(0, maxValue * (0.6 + (i * 0.08) + Math.random() * 0.1))
  }));
};

const DashboardCards: React.FC<DashboardCardsProps> = ({ despesas, period, stats }) => {
  console.log('\n🎯 =========================');
  console.log('🎯 DASHBOARD CARDS DEBUG');
  console.log('🎯 =========================');
  console.log('Total de despesas recebidas:', despesas.length);
  console.log('Período:', period);
  console.log('Stats:', stats);

  // Verificar integridade dos dados
  const integrity = verifyDataIntegrity(despesas);
  console.log('Integridade dos dados:', integrity);

  // Debug das empresas
  debugCompanies(despesas);

  // Usar função centralizada para calcular dados
  const companyTotals = calculateCompanyTotals(despesas);

  console.log('\n🎯 === TOTAIS FINAIS CALCULADOS ===');
  console.log('Camerino:', {
    total: companyTotals.camerino?.total || 0,
    despesas: companyTotals.camerino?.expenses?.length || 0,
    categorias: companyTotals.camerino?.categories
  });
  console.log('Churrasco:', {
    total: companyTotals.churrasco?.total || 0,
    despesas: companyTotals.churrasco?.expenses?.length || 0,
    categorias: companyTotals.churrasco?.categories
  });
  console.log('Johnny:', {
    total: companyTotals.johnny?.total || 0,
    despesas: companyTotals.johnny?.expenses?.length || 0,
    categorias: companyTotals.johnny?.categories
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <CompanyCard
        name="Camerino"
        totalDespesas={companyTotals.camerino?.total || 0}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={companyTotals.camerino?.categories.fixas > 0 ? companyTotals.camerino.categories.fixas : undefined}
        insumos={companyTotals.camerino?.categories.insumos > 0 ? companyTotals.camerino.categories.insumos : undefined}
        variaveis={companyTotals.camerino?.categories.variaveis > 0 ? companyTotals.camerino.categories.variaveis : undefined}
        atrasados={companyTotals.camerino?.categories.atrasados > 0 ? companyTotals.camerino.categories.atrasados : undefined}
        retiradas={companyTotals.camerino?.categories.retiradas > 0 ? companyTotals.camerino.categories.retiradas : undefined}
        sem_categoria={companyTotals.camerino?.categories.sem_categoria > 0 ? companyTotals.camerino.categories.sem_categoria : undefined}
        chartData={generateChartData(companyTotals.camerino?.categories || {})}
        chartColor="#10b981"
      />
      
      <CompanyCard
        name="Companhia do Churrasco"
        totalDespesas={companyTotals.churrasco?.total || 0}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        insumos={companyTotals.churrasco?.categories.insumos > 0 ? companyTotals.churrasco.categories.insumos : undefined}
        variaveis={companyTotals.churrasco?.categories.variaveis > 0 ? companyTotals.churrasco.categories.variaveis : undefined}
        fixas={companyTotals.churrasco?.categories.fixas > 0 ? companyTotals.churrasco.categories.fixas : undefined}
        atrasados={companyTotals.churrasco?.categories.atrasados > 0 ? companyTotals.churrasco.categories.atrasados : undefined}
        retiradas={companyTotals.churrasco?.categories.retiradas > 0 ? companyTotals.churrasco.categories.retiradas : undefined}
        sem_categoria={companyTotals.churrasco?.categories.sem_categoria > 0 ? companyTotals.churrasco.categories.sem_categoria : undefined}
        chartData={generateChartData(companyTotals.churrasco?.categories || {})}
        chartColor="#ef4444"
      />
      
      <CompanyCard
        name="Johnny Rockets"
        totalDespesas={companyTotals.johnny?.total || 0}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={companyTotals.johnny?.categories.fixas > 0 ? companyTotals.johnny.categories.fixas : undefined}
        insumos={companyTotals.johnny?.categories.insumos > 0 ? companyTotals.johnny.categories.insumos : undefined}
        variaveis={companyTotals.johnny?.categories.variaveis > 0 ? companyTotals.johnny.categories.variaveis : undefined}
        atrasados={companyTotals.johnny?.categories.atrasados > 0 ? companyTotals.johnny.categories.atrasados : undefined}
        retiradas={companyTotals.johnny?.categories.retiradas > 0 ? companyTotals.johnny.categories.retiradas : undefined}
        sem_categoria={companyTotals.johnny?.categories.sem_categoria > 0 ? companyTotals.johnny.categories.sem_categoria : undefined}
        chartData={generateChartData(companyTotals.johnny?.categories || {})}
        chartColor="#3b82f6"
      />
    </div>
  );
};

export default DashboardCards;

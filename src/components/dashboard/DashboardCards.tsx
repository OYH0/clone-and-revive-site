
import React from 'react';
import CompanyCard from '../CompanyCard';
import { Despesa } from '@/hooks/useDespesas';
import { calculateCompanyTotals, debugCompanies } from '@/utils/dashboardCalculations';

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

const DashboardCards: React.FC<DashboardCardsProps> = ({ despesas, period, stats }) => {
  console.log('=== DASHBOARD CARDS DEBUG ===');
  console.log('Total de despesas recebidas:', despesas.length);
  console.log('Período:', period);
  console.log('Stats:', stats);

  // Debug das empresas
  debugCompanies(despesas);

  // Usar função centralizada para calcular dados
  const companyTotals = calculateCompanyTotals(despesas);

  console.log('=== TOTAIS CALCULADOS ===');
  console.log('Camerino:', companyTotals.camerino);
  console.log('Churrasco:', companyTotals.churrasco);
  console.log('Johnny:', companyTotals.johnny);

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
        chartData={[
          { value: (companyTotals.camerino?.total || 0) > 0 ? (companyTotals.camerino?.total || 0) * 0.8 : 0 }, 
          { value: (companyTotals.camerino?.total || 0) > 0 ? (companyTotals.camerino?.total || 0) * 0.85 : 0 }, 
          { value: (companyTotals.camerino?.total || 0) > 0 ? (companyTotals.camerino?.total || 0) * 0.9 : 0 }, 
          { value: (companyTotals.camerino?.total || 0) > 0 ? (companyTotals.camerino?.total || 0) * 0.95 : 0 },
          { value: companyTotals.camerino?.total || 0 }
        ]}
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
        chartData={[
          { value: (companyTotals.churrasco?.total || 0) > 0 ? (companyTotals.churrasco?.total || 0) * 0.8 : 0 }, 
          { value: (companyTotals.churrasco?.total || 0) > 0 ? (companyTotals.churrasco?.total || 0) * 0.9 : 0 }, 
          { value: (companyTotals.churrasco?.total || 0) > 0 ? (companyTotals.churrasco?.total || 0) * 0.95 : 0 }, 
          { value: (companyTotals.churrasco?.total || 0) > 0 ? (companyTotals.churrasco?.total || 0) * 0.98 : 0 },
          { value: companyTotals.churrasco?.total || 0 }
        ]}
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
        chartData={[
          { value: (companyTotals.johnny?.total || 0) > 0 ? (companyTotals.johnny?.total || 0) * 0.8 : 0 }, 
          { value: (companyTotals.johnny?.total || 0) > 0 ? (companyTotals.johnny?.total || 0) * 0.85 : 0 }, 
          { value: (companyTotals.johnny?.total || 0) > 0 ? (companyTotals.johnny?.total || 0) * 0.9 : 0 }, 
          { value: (companyTotals.johnny?.total || 0) > 0 ? (companyTotals.johnny?.total || 0) * 0.95 : 0 },
          { value: companyTotals.johnny?.total || 0 }
        ]}
        chartColor="#3b82f6"
      />
    </div>
  );
};

export default DashboardCards;

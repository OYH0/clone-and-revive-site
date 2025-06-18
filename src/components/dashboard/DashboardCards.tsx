
import React from 'react';
import CompanyCard from '../CompanyCard';
import { Despesa } from '@/hooks/useDespesas';

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
  console.log('DashboardCards - todas as despesas:', despesas);
  console.log('DashboardCards - período:', period);
  console.log('DashboardCards - stats:', stats);

  // Normalizar nomes das empresas para garantir consistência
  const normalizeCompanyName = (empresa: string | undefined): string => {
    if (!empresa) return '';
    const normalized = empresa.toLowerCase().trim();
    
    // Mapear variações dos nomes das empresas
    if (normalized.includes('churrasco') || normalized === 'companhia do churrasco') {
      return 'churrasco';
    }
    if (normalized.includes('johnny') || normalized === 'johnny rockets') {
      return 'johnny';
    }
    if (normalized === 'camerino') {
      return 'camerino';
    }
    
    return normalized;
  };

  // Filtrar despesas por empresa usando normalização
  const churrascoDespesas = despesas.filter(d => 
    normalizeCompanyName(d.empresa) === 'churrasco'
  );
  
  const johnnyDespesas = despesas.filter(d => 
    normalizeCompanyName(d.empresa) === 'johnny'
  );
  
  const camerinoDespesas = despesas.filter(d => 
    normalizeCompanyName(d.empresa) === 'camerino'
  );

  // Calcular totais usando valor_total quando disponível, senão valor
  const churrascoDespesasTotal = churrascoDespesas.reduce((sum, despesa) => 
    sum + (despesa.valor_total || despesa.valor || 0), 0
  );
  
  const johnnyDespesasTotal = johnnyDespesas.reduce((sum, despesa) => 
    sum + (despesa.valor_total || despesa.valor || 0), 0
  );
  
  const camerinoDespesasTotal = camerinoDespesas.reduce((sum, despesa) => 
    sum + (despesa.valor_total || despesa.valor || 0), 0
  );

  console.log('DashboardCards - Despesas por empresa (corrigido):', {
    churrasco: { count: churrascoDespesas.length, total: churrascoDespesasTotal },
    johnny: { count: johnnyDespesas.length, total: johnnyDespesasTotal },
    camerino: { count: camerinoDespesas.length, total: camerinoDespesasTotal }
  });

  // Função para calcular despesas por categoria
  const calculateCategoryTotal = (empresaDespesas: Despesa[], categoria: string): number => {
    return empresaDespesas
      .filter(d => d.categoria === categoria)
      .reduce((sum, despesa) => sum + (despesa.valor_total || despesa.valor || 0), 0);
  };

  // Categorias para cada empresa
  const churrascoCategories = {
    insumos: calculateCategoryTotal(churrascoDespesas, 'INSUMOS'),
    variaveis: calculateCategoryTotal(churrascoDespesas, 'VARIAVEIS'),
    fixas: calculateCategoryTotal(churrascoDespesas, 'FIXAS'),
    atrasados: calculateCategoryTotal(churrascoDespesas, 'ATRASADOS'),
    retiradas: calculateCategoryTotal(churrascoDespesas, 'RETIRADAS')
  };

  const johnnyCategories = {
    fixas: calculateCategoryTotal(johnnyDespesas, 'FIXAS'),
    insumos: calculateCategoryTotal(johnnyDespesas, 'INSUMOS'),
    variaveis: calculateCategoryTotal(johnnyDespesas, 'VARIAVEIS'),
    atrasados: calculateCategoryTotal(johnnyDespesas, 'ATRASADOS'),
    retiradas: calculateCategoryTotal(johnnyDespesas, 'RETIRADAS')
  };

  const camerinoCategories = {
    fixas: calculateCategoryTotal(camerinoDespesas, 'FIXAS'),
    insumos: calculateCategoryTotal(camerinoDespesas, 'INSUMOS'),
    variaveis: calculateCategoryTotal(camerinoDespesas, 'VARIAVEIS'),
    atrasados: calculateCategoryTotal(camerinoDespesas, 'ATRASADOS'),
    retiradas: calculateCategoryTotal(camerinoDespesas, 'RETIRADAS')
  };

  console.log('DashboardCards - Categorias detalhadas:', {
    churrasco: churrascoCategories,
    johnny: johnnyCategories,
    camerino: camerinoCategories
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <CompanyCard
        name="Camerino"
        totalDespesas={camerinoDespesasTotal}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={camerinoCategories.fixas > 0 ? camerinoCategories.fixas : undefined}
        insumos={camerinoCategories.insumos > 0 ? camerinoCategories.insumos : undefined}
        variaveis={camerinoCategories.variaveis > 0 ? camerinoCategories.variaveis : undefined}
        atrasados={camerinoCategories.atrasados > 0 ? camerinoCategories.atrasados : undefined}
        retiradas={camerinoCategories.retiradas > 0 ? camerinoCategories.retiradas : undefined}
        chartData={[
          { value: camerinoDespesasTotal > 0 ? camerinoDespesasTotal * 0.8 : 0 }, 
          { value: camerinoDespesasTotal > 0 ? camerinoDespesasTotal * 0.85 : 0 }, 
          { value: camerinoDespesasTotal > 0 ? camerinoDespesasTotal * 0.9 : 0 }, 
          { value: camerinoDespesasTotal > 0 ? camerinoDespesasTotal * 0.95 : 0 },
          { value: camerinoDespesasTotal }
        ]}
        chartColor="#10b981"
      />
      
      <CompanyCard
        name="Companhia do Churrasco"
        totalDespesas={churrascoDespesasTotal}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        insumos={churrascoCategories.insumos > 0 ? churrascoCategories.insumos : undefined}
        variaveis={churrascoCategories.variaveis > 0 ? churrascoCategories.variaveis : undefined}
        fixas={churrascoCategories.fixas > 0 ? churrascoCategories.fixas : undefined}
        atrasados={churrascoCategories.atrasados > 0 ? churrascoCategories.atrasados : undefined}
        retiradas={churrascoCategories.retiradas > 0 ? churrascoCategories.retiradas : undefined}
        chartData={[
          { value: churrascoDespesasTotal > 0 ? churrascoDespesasTotal * 0.8 : 0 }, 
          { value: churrascoDespesasTotal > 0 ? churrascoDespesasTotal * 0.9 : 0 }, 
          { value: churrascoDespesasTotal > 0 ? churrascoDespesasTotal * 0.95 : 0 }, 
          { value: churrascoDespesasTotal > 0 ? churrascoDespesasTotal * 0.98 : 0 },
          { value: churrascoDespesasTotal }
        ]}
        chartColor="#ef4444"
      />
      
      <CompanyCard
        name="Johnny Rockets"
        totalDespesas={johnnyDespesasTotal}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={johnnyCategories.fixas > 0 ? johnnyCategories.fixas : undefined}
        insumos={johnnyCategories.insumos > 0 ? johnnyCategories.insumos : undefined}
        variaveis={johnnyCategories.variaveis > 0 ? johnnyCategories.variaveis : undefined}
        atrasados={johnnyCategories.atrasados > 0 ? johnnyCategories.atrasados : undefined}
        retiradas={johnnyCategories.retiradas > 0 ? johnnyCategories.retiradas : undefined}
        chartData={[
          { value: johnnyDespesasTotal > 0 ? johnnyDespesasTotal * 0.8 : 0 }, 
          { value: johnnyDespesasTotal > 0 ? johnnyDespesasTotal * 0.85 : 0 }, 
          { value: johnnyDespesasTotal > 0 ? johnnyDespesasTotal * 0.9 : 0 }, 
          { value: johnnyDespesasTotal > 0 ? johnnyDespesasTotal * 0.95 : 0 },
          { value: johnnyDespesasTotal }
        ]}
        chartColor="#3b82f6"
      />
    </div>
  );
};

export default DashboardCards;

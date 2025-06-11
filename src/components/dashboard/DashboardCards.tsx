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

  // Calculate values for all companies - normalizar nomes das empresas
  const churrascoDespesas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'churrasco' || empresa === 'companhia do churrasco';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const johnnyDespesas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'johnny' || empresa === 'johnny rockets';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const camerinoDespesas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);

  console.log('DashboardCards - Despesas por empresa:', {
    churrasco: churrascoDespesas,
    johnny: johnnyDespesas,
    camerino: camerinoDespesas
  });

  // Extract categories for Churrasco
  const churrascoInsumos = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'churrasco' || empresa === 'companhia do churrasco') && d.categoria === 'INSUMOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const churrascoVariaveis = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'churrasco' || empresa === 'companhia do churrasco') && d.categoria === 'VARIAVEIS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const churrascoFixas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'churrasco' || empresa === 'companhia do churrasco') && d.categoria === 'FIXAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const churrascoAtrasados = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'churrasco' || empresa === 'companhia do churrasco') && d.categoria === 'ATRASADOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const churrascoRetiradas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'churrasco' || empresa === 'companhia do churrasco') && d.categoria === 'RETIRADAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  // Extract categories for Johnny
  const johnnyFixas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'johnny' || empresa === 'johnny rockets') && d.categoria === 'FIXAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const johnnyInsumos = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'johnny' || empresa === 'johnny rockets') && d.categoria === 'INSUMOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const johnnyVariaveis = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'johnny' || empresa === 'johnny rockets') && d.categoria === 'VARIAVEIS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const johnnyAtrasados = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'johnny' || empresa === 'johnny rockets') && d.categoria === 'ATRASADOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);

  const johnnyRetiradas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return (empresa === 'johnny' || empresa === 'johnny rockets') && d.categoria === 'RETIRADAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);

  // Extract categories for Camerino
  const camerinoFixas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino' && d.categoria === 'FIXAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const camerinoInsumos = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino' && d.categoria === 'INSUMOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const camerinoVariaveis = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino' && d.categoria === 'VARIAVEIS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);
  
  const camerinoAtrasados = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino' && d.categoria === 'ATRASADOS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);

  const camerinoRetiradas = despesas.filter(d => {
    const empresa = d.empresa?.toLowerCase();
    return empresa === 'camerino' && d.categoria === 'RETIRADAS';
  }).reduce((sum, despesa) => sum + despesa.valor, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <CompanyCard
        name="Camerino"
        totalDespesas={camerinoDespesas}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={camerinoFixas > 0 ? camerinoFixas : undefined}
        insumos={camerinoInsumos > 0 ? camerinoInsumos : undefined}
        variaveis={camerinoVariaveis > 0 ? camerinoVariaveis : undefined}
        atrasados={camerinoAtrasados > 0 ? camerinoAtrasados : undefined}
        retiradas={camerinoRetiradas > 0 ? camerinoRetiradas : undefined}
        chartData={[
          { value: camerinoDespesas > 0 ? camerinoDespesas * 0.8 : 0 }, 
          { value: camerinoDespesas > 0 ? camerinoDespesas * 0.85 : 0 }, 
          { value: camerinoDespesas > 0 ? camerinoDespesas * 0.9 : 0 }, 
          { value: camerinoDespesas > 0 ? camerinoDespesas * 0.95 : 0 },
          { value: camerinoDespesas }
        ]}
        chartColor="#10b981"
      />
      
      <CompanyCard
        name="Companhia do Churrasco"
        totalDespesas={churrascoDespesas}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        insumos={churrascoInsumos > 0 ? churrascoInsumos : undefined}
        variaveis={churrascoVariaveis > 0 ? churrascoVariaveis : undefined}
        fixas={churrascoFixas > 0 ? churrascoFixas : undefined}
        atrasados={churrascoAtrasados > 0 ? churrascoAtrasados : undefined}
        retiradas={churrascoRetiradas > 0 ? churrascoRetiradas : undefined}
        chartData={[
          { value: churrascoDespesas > 0 ? churrascoDespesas * 0.8 : 0 }, 
          { value: churrascoDespesas > 0 ? churrascoDespesas * 0.9 : 0 }, 
          { value: churrascoDespesas > 0 ? churrascoDespesas * 0.95 : 0 }, 
          { value: churrascoDespesas > 0 ? churrascoDespesas * 0.98 : 0 },
          { value: churrascoDespesas }
        ]}
        chartColor="#ef4444"
      />
      
      <CompanyCard
        name="Johnny Rockets"
        totalDespesas={johnnyDespesas}
        status={despesas && despesas.length > 0 ? "Atualizado" : "Sem dados"}
        statusColor={despesas && despesas.length > 0 ? "green" : "yellow"}
        periodo={period}
        fixas={johnnyFixas > 0 ? johnnyFixas : undefined}
        insumos={johnnyInsumos > 0 ? johnnyInsumos : undefined}
        variaveis={johnnyVariaveis > 0 ? johnnyVariaveis : undefined}
        atrasados={johnnyAtrasados > 0 ? johnnyAtrasados : undefined}
        retiradas={johnnyRetiradas > 0 ? johnnyRetiradas : undefined}
        chartData={[
          { value: johnnyDespesas > 0 ? johnnyDespesas * 0.8 : 0 }, 
          { value: johnnyDespesas > 0 ? johnnyDespesas * 0.85 : 0 }, 
          { value: johnnyDespesas > 0 ? johnnyDespesas * 0.9 : 0 }, 
          { value: johnnyDespesas > 0 ? johnnyDespesas * 0.95 : 0 },
          { value: johnnyDespesas }
        ]}
        chartColor="#3b82f6"
      />
    </div>
  );
};

export default DashboardCards;

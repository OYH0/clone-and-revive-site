
import React from 'react';
import CompanyCard from '../CompanyCard';
import { Despesa } from '@/hooks/useDespesas';

interface DashboardCardsProps {
  despesas: Despesa[];
  period: string;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ despesas, period }) => {
  // Calculate values for all companies
  const churrascoDespesas = despesas.filter(d => d.empresa === 'Churrasco').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyDespesas = despesas.filter(d => d.empresa === 'Johnny').reduce((sum, despesa) => sum + despesa.valor, 0);
  const camerinoDespesas = despesas.filter(d => d.empresa === 'Camerino').reduce((sum, despesa) => sum + despesa.valor, 0);

  // Extract categories for Churrasco
  const churrascoInsumos = despesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'INSUMOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const churrascoVariaveis = despesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'VARIAVEIS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const churrascoFixas = despesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'FIXAS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const churrascoAtrasados = despesas.filter(d => d.empresa === 'Churrasco' && d.categoria === 'ATRASADOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  
  // Extract categories for Johnny
  const johnnyFixas = despesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'FIXAS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyInsumos = despesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'INSUMOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyVariaveis = despesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'VARIAVEIS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const johnnyAtrasados = despesas.filter(d => d.empresa === 'Johnny' && d.categoria === 'ATRASADOS').reduce((sum, despesa) => sum + despesa.valor, 0);

  // Extract categories for Camerino
  const camerinoFixas = despesas.filter(d => d.empresa === 'Camerino' && d.categoria === 'FIXAS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const camerinoInsumos = despesas.filter(d => d.empresa === 'Camerino' && d.categoria === 'INSUMOS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const camerinoVariaveis = despesas.filter(d => d.empresa === 'Camerino' && d.categoria === 'VARIAVEIS').reduce((sum, despesa) => sum + despesa.valor, 0);
  const camerinoAtrasados = despesas.filter(d => d.empresa === 'Camerino' && d.categoria === 'ATRASADOS').reduce((sum, despesa) => sum + despesa.valor, 0);

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

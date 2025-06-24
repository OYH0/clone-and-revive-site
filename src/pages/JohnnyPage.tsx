import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import { useDespesas } from '@/hooks/useDespesas';
import { useReceitas } from '@/hooks/useReceitas';
import AnalyseCostsModal from '@/components/AnalyseCostsModal';
import ProjectionsModal from '@/components/ProjectionsModal';
import ComparativeModal from '@/components/ComparativeModal';
import JohnnyHeader from '@/components/johnny/JohnnyHeader';
import JohnnyStats from '@/components/johnny/JohnnyStats';
import JohnnyCharts from '@/components/johnny/JohnnyCharts';
import JohnnyInsights from '@/components/johnny/JohnnyInsights';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { filterDataByPeriod } from '@/components/dashboard/utils';

const JohnnyPage = () => {
  const { data: despesas } = useDespesas();
  const { data: receitas } = useReceitas();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Filtrar dados do Johnny Rockets - usando várias variações possíveis do nome
  const johnnyDespesas = despesas?.filter(d => {
    const empresa = d.empresa?.toLowerCase().trim() || '';
    return empresa === 'johnny' || 
           empresa === 'johnny rockets' || 
           empresa === 'johnny rocket' ||
           empresa.includes('johnny');
  }) || [];
  
  const johnnyReceitas = receitas?.filter(r => {
    const empresa = r.empresa?.toLowerCase().trim() || '';
    return empresa === 'johnny' || 
           empresa === 'johnny rockets' || 
           empresa === 'johnny rocket' ||
           empresa.includes('johnny');
  }) || [];

  // Aplicar filtro de período
  const { filteredDespesas, filteredReceitas } = useMemo(() => {
    return {
      filteredDespesas: filterDataByPeriod(johnnyDespesas, selectedPeriod),
      filteredReceitas: filterDataByPeriod(johnnyReceitas, selectedPeriod)
    };
  }, [johnnyDespesas, johnnyReceitas, selectedPeriod]);

  console.log('Johnny - Despesas filtradas:', filteredDespesas.length);
  console.log('Johnny - Despesas por categoria:', filteredDespesas.reduce((acc, d) => {
    const cat = d.categoria || 'SEM_CATEGORIA';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <JohnnyHeader onModalOpen={setActiveModal} selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
          
          <JohnnyStats despesas={filteredDespesas} receitas={filteredReceitas} />
          <JohnnyCharts despesas={filteredDespesas} receitas={filteredReceitas} />
          <JohnnyInsights despesas={filteredDespesas} receitas={filteredReceitas} />
        </div>
      </div>

      <AnalyseCostsModal
        isOpen={activeModal === 'costs'}
        onClose={() => setActiveModal(null)}
        despesas={filteredDespesas}
        empresa="Johnny Rockets"
      />

      <ProjectionsModal
        isOpen={activeModal === 'projections'}
        onClose={() => setActiveModal(null)}
        despesas={filteredDespesas}
        receitas={filteredReceitas}
        empresa="Johnny Rockets"
      />

      <ComparativeModal
        isOpen={activeModal === 'comparative'}
        onClose={() => setActiveModal(null)}
        empresa="Johnny Rockets"
      />
    </div>
  );
};

export default JohnnyPage;

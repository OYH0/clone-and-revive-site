
import React from 'react';

interface DashboardHeaderProps {
  selectedPeriod: 'today' | 'week' | 'month' | 'year';
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'year') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="flex justify-end items-center mb-6">
      <div className="flex gap-2">
        <button 
          className={`px-4 py-2 text-sm rounded-2xl ${
            selectedPeriod === 'today' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('today')}
        >
          Hoje
        </button>
        <button 
          className={`px-4 py-2 text-sm rounded-2xl ${
            selectedPeriod === 'week' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('week')}
        >
          Semana
        </button>
        <button 
          className={`px-4 py-2 text-sm rounded-2xl ${
            selectedPeriod === 'month' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('month')}
        >
          Mês
        </button>
        <button 
          className={`px-4 py-2 text-sm rounded-2xl ${
            selectedPeriod === 'year' 
              ? 'bg-black text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onPeriodChange('year')}
        >
          Ano
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

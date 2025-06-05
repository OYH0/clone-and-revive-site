
import React from 'react';
import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface JohnnyHeaderProps {
  onModalOpen: (modalType: string) => void;
}

const JohnnyHeader: React.FC<JohnnyHeaderProps> = ({ onModalOpen }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
            Johnny Rockets
          </h1>
          <p className="text-gray-600 text-lg">Análise financeira detalhada da empresa</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl h-12">
          Relatório Mensal
        </Button>
        <Button 
          variant="outline" 
          className="rounded-2xl h-12"
          onClick={() => onModalOpen('costs')}
        >
          Análise de Custos
        </Button>
        <Button 
          variant="outline" 
          className="rounded-2xl h-12"
          onClick={() => onModalOpen('projections')}
        >
          Projeções
        </Button>
        <Button 
          variant="outline" 
          className="rounded-2xl h-12"
          onClick={() => onModalOpen('comparative')}
        >
          Comparativo
        </Button>
      </div>
    </div>
  );
};

export default JohnnyHeader;

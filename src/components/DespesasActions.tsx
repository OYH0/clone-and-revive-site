
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DespesasFilter from '@/components/DespesasFilter';
import DespesasExport from '@/components/DespesasExport';
import { Transaction } from '@/types/transaction';

interface FilterOptions {
  empresa?: string;
  categoria?: string;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
  status?: string;
}

interface DespesasActionsProps {
  onFilterChange: (newFilters: FilterOptions) => void;
  onClearFilters: () => void;
  onAddTransaction: () => void;
  filteredTransactions: Transaction[];
}

const DespesasActions: React.FC<DespesasActionsProps> = ({
  onFilterChange,
  onClearFilters,
  onAddTransaction,
  filteredTransactions
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <DespesasFilter 
            onFilterChange={onFilterChange}
            onClearFilters={onClearFilters}
          />
          <DespesasExport transactions={filteredTransactions} />
        </div>
        
        <Button 
          onClick={onAddTransaction}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          Nova Despesa
        </Button>
      </div>
    </div>
  );
};

export default DespesasActions;

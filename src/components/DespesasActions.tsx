
import React, { useState } from 'react';
import { Plus, Filter, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DespesasFilter from './DespesasFilter';
import DespesasExport from './DespesasExport';
import { Transaction } from '@/types/transaction';

interface DespesasActionsProps {
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  onAddTransaction?: () => void; // Made optional for non-admin users
  filteredTransactions: Transaction[];
}

const DespesasActions: React.FC<DespesasActionsProps> = ({ 
  onFilterChange, 
  onClearFilters, 
  onAddTransaction,
  filteredTransactions 
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mb-6">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
          <Filter className="h-5 w-5" />
          Ações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {onAddTransaction && (
            <Button 
              onClick={onAddTransaction}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200 rounded-2xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Despesa
            </Button>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="rounded-2xl border-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowExport(!showExport)}
            className="rounded-2xl border-2"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClearFilters}
            className="rounded-2xl text-gray-600"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>

        {showFilters && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
            <DespesasFilter onFilterChange={onFilterChange} />
          </div>
        )}

        {showExport && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border">
            <DespesasExport transactions={filteredTransactions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DespesasActions;

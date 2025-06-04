
import React from 'react';
import RecentTransactions from '../RecentTransactions';
import { Card } from '@/components/ui/card';
import { Despesa } from '@/hooks/useDespesas';

interface DashboardTransactionsProps {
  despesas: Despesa[];
}

const DashboardTransactions: React.FC<DashboardTransactionsProps> = ({ despesas }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Últimas Transações</h3>
        <select className="border border-gray-300 bg-white text-gray-700 rounded-2xl px-3 py-1 text-sm">
          <option>Todas Empresas</option>
          <option>Companhia do Churrasco</option>
          <option>Johnny Rockets</option>
        </select>
      </div>
      {despesas && despesas.length > 0 ? (
        <RecentTransactions despesas={despesas} />
      ) : (
        <Card className="p-6 text-center text-gray-600">
          <p>Não há transações recentes para mostrar.</p>
          <p className="text-sm mt-2">Adicione transações para ver os dados aqui.</p>
        </Card>
      )}
    </div>
  );
};

export default DashboardTransactions;

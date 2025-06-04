
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CompanyCardProps {
  name: string;
  totalDespesas: number;
  totalReceitas: number;
  color: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  totalDespesas,
  totalReceitas,
  color
}) => {
  const saldo = totalReceitas - totalDespesas;
  const isPositive = saldo >= 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Resumo Financeiro</p>
        </div>
        <div className={`w-4 h-4 rounded-full ${color}`}></div>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Despesas</p>
          <p className="text-xl font-bold text-red-600">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-1">Total Receitas</p>
          <p className="text-xl font-bold text-green-600">
            R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Saldo</p>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p className={`text-xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            R$ {Math.abs(saldo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

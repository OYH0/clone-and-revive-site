
import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface CompanyCardProps {
  name: string;
  totalDespesas: number;
  status: string;
  statusColor: 'green' | 'yellow';
  periodo: string;
  insumos?: number;
  variaveis?: number;
  fixas?: number;
  atrasados?: number;
  chartData: Array<{ value: number }>;
  chartColor: string;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  name,
  totalDespesas,
  status,
  statusColor,
  periodo,
  insumos,
  variaveis,
  fixas,
  atrasados,
  chartData,
  chartColor
}) => {
  const statusBgColor = statusColor === 'green' ? 'bg-green-500' : 'bg-yellow-500';

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="border-l-4 border-red-500 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{periodo}</p>
          </div>
          <span className={`px-3 py-1 rounded-2xl text-xs font-medium text-white ${statusBgColor}`}>
            {status}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Total Despesas</p>
          <p className="text-3xl font-bold text-gray-900">
            R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Por Categoria</p>
            {insumos !== undefined && (
              <p className="text-sm">
                <span className="text-gray-600">Insumos:</span>{' '}
                <span className="font-medium">R$ {insumos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            )}
            {variaveis !== undefined && (
              <p className="text-sm">
                <span className="text-gray-600">Variáveis:</span>{' '}
                <span className="font-medium">R$ {variaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            )}
            {fixas !== undefined && (
              <p className="text-sm">
                <span className="text-gray-600">Fixas:</span>{' '}
                <span className="font-medium">R$ {fixas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            )}
            {atrasados !== undefined && (
              <p className="text-sm">
                <span className="text-gray-600">Atrasados:</span>{' '}
                <span className="font-medium">R$ {atrasados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </p>
            )}
          </div>
        </div>

        <div className="h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={2}
                dot={{ fill: chartColor, strokeWidth: 2, r: 3 }}
                activeDot={{ r: 4, fill: chartColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

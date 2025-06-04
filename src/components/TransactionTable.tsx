
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

interface Transaction {
  date: string;
  company: string;
  description: string;
  category: string;
  value: string;
  status: 'PAGO' | 'PENDENTE';
}

interface TransactionTableProps {
  transactions: Transaction[];
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  selectedCompany,
  setSelectedCompany
}) => {
  const companies = ['Todas Empresas', 'Churrasco', 'Johnny'];
  
  return (
    <div className="bg-slate-700 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Últimas Transações</h3>
        <select 
          className="bg-slate-600 text-white px-4 py-2 rounded border border-slate-500"
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left text-white py-3 px-2">Data</th>
              <th className="text-left text-white py-3 px-2">Empresa</th>
              <th className="text-left text-white py-3 px-2">Descrição</th>
              <th className="text-left text-white py-3 px-2">Categoria</th>
              <th className="text-left text-white py-3 px-2">Valor</th>
              <th className="text-left text-white py-3 px-2">Status</th>
              <th className="text-left text-white py-3 px-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index} className="border-b border-slate-600">
                <td className="text-white py-3 px-2">{transaction.date}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    transaction.company === 'Churrasco' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-blue-500 text-white'
                  }`}>
                    {transaction.company}
                  </span>
                </td>
                <td className="text-white py-3 px-2">{transaction.description}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    transaction.category === 'INSUMOS' 
                      ? 'category-insumos' 
                      : 'category-fixas'
                  }`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="text-white py-3 px-2">{transaction.value}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    transaction.status === 'PAGO' 
                      ? 'status-paid' 
                      : 'status-pending'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

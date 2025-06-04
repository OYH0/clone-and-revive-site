
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CompanyCard from './CompanyCard';
import TransactionTable from './TransactionTable';
import ExpenseDistributionChart from './ExpenseDistributionChart';
import MonthlyEvolutionChart from './MonthlyEvolutionChart';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCompany, setSelectedCompany] = useState('Todas Empresas');
  const [currentPeriod, setCurrentPeriod] = useState('Mês');

  const companyData = [
    {
      name: 'Companhia do Churrasco',
      period: 'Maio 2025',
      totalExpenses: 'R$ 3.598,00',
      status: 'Atualizado' as const,
      categories: [
        { name: 'Insumos', value: 'R$ 3.138,00' },
        { name: 'Variáveis', value: 'R$ 460,00' }
      ],
      chartData: [
        { value: 3200 }, { value: 3000 }, { value: 3300 }, 
        { value: 3500 }, { value: 3400 }, { value: 3598 }
      ],
      chartColor: '#e74c3c'
    },
    {
      name: 'Johnny Rockets',
      period: 'Maio 2025',
      totalExpenses: 'R$ 122.900,59',
      status: 'Pendentes' as const,
      categories: [
        { name: 'Fixas', value: 'R$ 48.633,32' },
        { name: 'Insumos', value: 'R$ 36.713,79' },
        { name: 'Atrasados', value: 'R$ 36.808,58' }
      ],
      chartData: [
        { value: 120000 }, { value: 119000 }, { value: 121000 }, 
        { value: 122000 }, { value: 122500 }, { value: 122900 }
      ],
      chartColor: '#3498db'
    }
  ];

  const transactions = [
    {
      date: '27/05/2025',
      company: 'Churrasco',
      description: 'COMPRAS',
      category: 'INSUMOS',
      value: 'R$ 2250,00',
      status: 'PAGO' as const
    },
    {
      date: '27/05/2025',
      company: 'Johnny',
      description: 'MANUTENÇÃO VEÍCULOS',
      category: 'FIXAS',
      value: 'R$ 5200,00',
      status: 'PAGO' as const
    }
  ];

  const periods = ['Hoje', 'Semana', 'Mês', 'Ano'];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard Financeiro</h1>
            <div className="flex gap-2">
              {periods.map(period => (
                <button
                  key={period}
                  onClick={() => setCurrentPeriod(period)}
                  className={`px-4 py-2 rounded ${
                    currentPeriod === period
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center gap-2">
                + Nova Transação
              </button>
            </div>
          </div>

          {/* Company Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {companyData.map((company, index) => (
              <CompanyCard
                key={index}
                name={company.name}
                period={company.period}
                totalExpenses={company.totalExpenses}
                status={company.status}
                categories={company.categories}
                chartData={company.chartData}
                chartColor={company.chartColor}
              />
            ))}
          </div>

          {/* Transactions Table */}
          <div className="mb-6">
            <TransactionTable 
              transactions={transactions}
              selectedCompany={selectedCompany}
              setSelectedCompany={setSelectedCompany}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseDistributionChart />
            <MonthlyEvolutionChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

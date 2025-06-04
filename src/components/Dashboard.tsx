
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CompanyCard from './CompanyCard';
import TransactionTable from './TransactionTable';
import ExpenseDistributionChart from './ExpenseDistributionChart';
import MonthlyEvolutionChart from './MonthlyEvolutionChart';
import { useDespesas } from '@/hooks/useDespesas';
import { processCompanyData, processTransactionData, processCategoryDistribution } from '@/utils/dashboardData';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedCompany, setSelectedCompany] = useState('Todas Empresas');
  const [currentPeriod, setCurrentPeriod] = useState('Mês');

  const { data: despesas, isLoading, error } = useDespesas();

  const periods = ['Hoje', 'Semana', 'Mês', 'Ano'];

  // Processar dados quando disponíveis
  const companyData = despesas ? processCompanyData(despesas) : [];
  const transactions = despesas ? processTransactionData(despesas) : [];
  const categoryDistribution = despesas ? processCategoryDistribution(despesas) : [];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-2">Erro ao carregar dados</p>
            <p className="text-gray-600">Verifique a conexão com o banco de dados</p>
          </div>
        </div>
      </div>
    );
  }

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
            {companyData.length > 0 ? (
              companyData.map((company, index) => (
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
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                Nenhum dado de empresa encontrado
              </div>
            )}
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
            <ExpenseDistributionChart data={categoryDistribution} />
            <MonthlyEvolutionChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

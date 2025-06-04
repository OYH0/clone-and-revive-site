
import React from 'react';
import { LayoutDashboard, Settings, FileText, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'companhia', label: 'Companhia do Churrasco', icon: Settings },
    { id: 'johnny', label: 'Johnny Rockets', icon: Settings },
    { id: 'despesas', label: 'Despesas', icon: DollarSign },
    { id: 'receitas', label: 'Receitas', icon: DollarSign },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 sidebar-blue text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-600">
        <h1 className="text-xl font-bold">Gestão Financeira</h1>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 text-left transition-colors ${
                isActive 
                  ? 'bg-red-500 text-white' 
                  : 'hover:bg-gray-600 text-gray-300'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
          <span className="text-sm">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, DollarSign, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'companhia', label: 'Companhia do Churrasco', icon: Settings, path: '/companhia' },
    { id: 'johnny', label: 'Johnny Rockets', icon: Settings, path: '/johnny' },
    { id: 'despesas', label: 'Despesas', icon: DollarSign, path: '/despesas' },
    { id: 'receitas', label: 'Receitas', icon: DollarSign, path: '/receitas' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText, path: '/relatorios' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="w-64 sidebar-blue text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-600">
        <h1 className="text-xl font-bold">Gestão Financeira</h1>
      </div>
      
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
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
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
          <span className="text-sm">Admin</span>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full text-white border-gray-600 hover:bg-gray-600"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

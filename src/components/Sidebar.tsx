
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, DollarSign, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'companhia', label: 'Companhia do Churrasco', icon: Settings, path: '/companhia' },
    { 
      id: 'johnny', 
      label: 'Johnny Rockets', 
      icon: () => (
        <img 
          src="/lovable-uploads/5936f90a-7288-4156-bcc6-370856e5b384.png" 
          alt="Johnny Rockets" 
          className="w-4 h-4 object-contain"
        />
      ), 
      path: '/johnny' 
    },
    { id: 'despesas', label: 'Despesas', icon: DollarSign, path: '/despesas' },
    { id: 'receitas', label: 'Receitas', icon: DollarSign, path: '/receitas' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText, path: '/relatorios' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white h-screen flex flex-col z-50 shadow-xl">
      <div className="p-6 border-b border-blue-500/30">
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
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                  : 'hover:bg-white/10 text-blue-100 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => navigate('/admin')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 ${
            location.pathname === '/admin'
              ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
              : 'hover:bg-white/10 text-blue-100 hover:text-white'
          }`}
        >
          <Shield size={18} />
          <span className="text-sm">Admin</span>
        </button>
      </nav>
      
      <div className="p-4 border-t border-blue-500/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
          <span className="text-sm text-blue-100">{user?.email || 'Admin'}</span>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full text-white border-white/30 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200"
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

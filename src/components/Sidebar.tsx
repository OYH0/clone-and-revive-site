
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, DollarSign, LogOut, Shield, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'camerino', label: 'Camerino', icon: Settings, path: '/camerino' },
    { id: 'companhia', label: 'Companhia do Churrasco', icon: Settings, path: '/companhia' },
    { id: 'johnny', label: 'Johnny Rockets', icon: Settings, path: '/johnny' },
    { id: 'despesas', label: 'Despesas', icon: DollarSign, path: '/despesas' },
    { id: 'receitas', label: 'Receitas', icon: DollarSign, path: '/receitas' },
    { id: 'relatorios', label: 'Relatórios', icon: FileText, path: '/relatorios' },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, path: '/configuracoes' },
  ];

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked');
      await signOut();
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/auth';
    }
  };

  // Sidebar content extracted for DRY between desktop and mobile
  const renderSidebarContent = () => (
    <>
      <div className="p-6 border-b border-blue-500/30 flex items-center gap-3">
        <h1 className="text-xl font-bold">Gestão Financeira</h1>
      </div>
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
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
          onClick={() => {
            navigate('/admin');
            setMobileOpen(false);
          }}
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
          disabled={false}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: trigger always visible, shows Sidebar in Drawer */}
      <div className="md:hidden sticky top-0 z-50 bg-gradient-to-b from-blue-700 to-blue-800 flex items-center px-2 py-2 shadow">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileOpen(true)}>
          <MenuIcon size={26} />
        </Button>
        <span className="ml-3 text-lg font-bold text-white">Gestão Financeira</span>
      </div>
      {/* Drawer/Sheet on mobile */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white p-0 w-72 max-w-full">
          <div className="h-full flex flex-col">{renderSidebarContent()}</div>
        </SheetContent>
      </Sheet>
      {/* Desktop: fixed sidebar, hidden on mobile */}
      <div className="fixed left-0 top-0 w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white h-screen flex-col z-50 shadow-xl hidden md:flex">
        {renderSidebarContent()}
      </div>
    </>
  );
};

export default Sidebar;

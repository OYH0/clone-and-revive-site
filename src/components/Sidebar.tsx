
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, DollarSign, LogOut, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
      // Force redirect if there's an error
      window.location.href = '/auth';
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  const SidebarContent = () => (
    <div className="bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white h-full flex flex-col shadow-xl">
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
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 touch-target ${
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
          onClick={() => handleNavigation('/admin')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 touch-target ${
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
          <span className="text-sm text-blue-100 truncate">{user?.email || 'Admin'}</span>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full text-white border-white/30 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200 touch-target"
          disabled={false}
        >
          <LogOut size={16} className="mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 w-64 h-screen z-50">
        <SidebarContent />
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Gestão Financeira</h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="touch-target">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile content spacer */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Sidebar;

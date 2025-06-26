
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, FileText, DollarSign, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { state } = useSidebar();

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

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className="bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
      <SidebarHeader className="p-6 border-b border-blue-500/30">
        {!isCollapsed && (
          <h1 className="text-xl font-bold">Gestão Financeira</h1>
        )}
        {isCollapsed && (
          <div className="text-xl font-bold text-center">GF</div>
        )}
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={isActive}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                          : 'hover:bg-white/10 text-blue-100 hover:text-white'
                      }`}
                      tooltip={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={18} />
                      {!isCollapsed && <span className="text-sm">{item.label}</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate('/admin')}
                  isActive={location.pathname === '/admin'}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 text-left transition-all duration-200 ${
                    location.pathname === '/admin'
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'hover:bg-white/10 text-blue-100 hover:text-white'
                  }`}
                  tooltip={isCollapsed ? 'Admin' : undefined}
                >
                  <Shield size={18} />
                  {!isCollapsed && <span className="text-sm">Admin</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-blue-500/30">
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm"></div>
            <span className="text-sm text-blue-100">{user?.email || 'Admin'}</span>
          </div>
        )}
        
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size={isCollapsed ? "icon" : "sm"}
          className="w-full text-white border-white/30 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-all duration-200"
          disabled={false}
        >
          <LogOut size={16} className={isCollapsed ? "" : "mr-2"} />
          {!isCollapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;

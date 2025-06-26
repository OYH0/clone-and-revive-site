
import React, { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header sempre translúcido com intensidade que varia com o scroll */}
          <header className={`sticky top-0 z-40 flex h-14 items-center gap-4 border-b px-4 sm:px-6 transition-all duration-200 ${
            isScrolled 
              ? 'bg-white/90 backdrop-blur-md border-gray-200/60 shadow-md' 
              : 'bg-white/70 backdrop-blur-sm border-gray-200/40 shadow-sm'
          }`}>
            <SidebarTrigger />
          </header>
          
          {/* Conteúdo principal */}
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DespesasPage from "./pages/DespesasPage";
import ReceitasPage from "./pages/ReceitasPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import CamerinoPage from "./pages/CamerinoPage";
import CompanhiaPage from "./pages/CompanhiaPage";
import JohnnyPage from "./pages/JohnnyPage";
import ImplementacaoPage from "./pages/ImplementacaoPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

console.log('App.tsx loading...');

const queryClient = new QueryClient();

const App = () => {
  console.log('App component rendering...');
  
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <Index />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/despesas" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <DespesasPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/receitas" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <ReceitasPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <RelatoriosPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <ConfiguracoesPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/camerino" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <CamerinoPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/companhia" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <CompanhiaPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/johnny" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <JohnnyPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/implementacao" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <ImplementacaoPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <div className="flex min-h-screen">
                      <Sidebar />
                      <div className="flex-1">
                        <AdminPage />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return <div>Error loading application</div>;
  }
};

export default App;

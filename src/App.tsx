
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import DespesasPage from "./pages/DespesasPage";
import ReceitasPage from "./pages/ReceitasPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import CamerinoPage from "./pages/CamerinoPage";
import CompanhiaPage from "./pages/CompanhiaPage";
import JohnnyPage from "./pages/JohnnyPage";
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
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/despesas" element={
                  <ProtectedRoute>
                    <Layout>
                      <DespesasPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/receitas" element={
                  <ProtectedRoute>
                    <Layout>
                      <ReceitasPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/relatorios" element={
                  <ProtectedRoute>
                    <Layout>
                      <RelatoriosPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/configuracoes" element={
                  <ProtectedRoute>
                    <Layout>
                      <ConfiguracoesPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/camerino" element={
                  <ProtectedRoute>
                    <Layout>
                      <CamerinoPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/companhia" element={
                  <ProtectedRoute>
                    <Layout>
                      <CompanhiaPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/johnny" element={
                  <ProtectedRoute>
                    <Layout>
                      <JohnnyPage />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Layout>
                      <AdminPage />
                    </Layout>
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

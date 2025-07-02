import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import AdminRoute from '@/components/AdminRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, UserCheck, UserX, Search, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TabPermissionsManager from '@/components/TabPermissionsManager';

type UserRole = 'admin' | 'financeiro' | 'visualizador';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
}

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, is_admin, role, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários",
          variant: "destructive"
        });
      } else {
        setProfiles(data || []);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter(profile =>
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserRole = async (profileId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          is_admin: newRole === 'admin'
        })
        .eq('id', profileId);

      if (error) {
        console.error('Error updating user role:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar papel do usuário",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: `Papel do usuário atualizado para ${getRoleLabel(newRole)}`,
        });
        fetchProfiles();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar papel do usuário",
        variant: "destructive"
      });
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'financeiro':
        return 'Financeiro';
      case 'visualizador':
        return 'Visualizador';
      default:
        return 'Financeiro';
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'financeiro':
        return 'bg-blue-100 text-blue-800';
      case 'visualizador':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-100">
        <Sidebar />
        
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                    Painel de Administração
                  </h1>
                  <p className="text-gray-600 text-lg">Gerencie usuários e permissões do sistema</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{profiles.length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-lg">
                      <UserCheck className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{profiles.filter(p => p.role === 'admin').length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                      <UserCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{profiles.filter(p => p.role === 'financeiro').length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Visualizadores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                      <Eye className="h-5 w-5 text-green-500" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{profiles.filter(p => p.role === 'visualizador').length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* User Management */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl mb-8">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-800">Gerenciar Usuários</CardTitle>
                <CardDescription className="text-gray-600">
                  Visualize e gerencie os papéis dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <Label htmlFor="search" className="text-gray-700 font-medium">Buscar usuários</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Digite o email do usuário..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/50 border-gray-200"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando usuários...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredProfiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 bg-white/50 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{profile.email}</p>
                            <p className="text-sm text-gray-500">
                              Criado em: {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getRoleBadgeColor(profile.role || 'financeiro')}>
                            {getRoleLabel(profile.role || 'financeiro')}
                          </Badge>
                          <Select
                            value={profile.role || 'financeiro'}
                            onValueChange={(value: UserRole) => updateUserRole(profile.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrador</SelectItem>
                              <SelectItem value="financeiro">Financeiro</SelectItem>
                              <SelectItem value="visualizador">Visualizador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && filteredProfiles.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">Nenhum usuário encontrado</p>
                    <p className="text-sm">Tente ajustar os termos da sua busca</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tab Permissions Management */}
            <TabPermissionsManager profiles={profiles} />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminPage;

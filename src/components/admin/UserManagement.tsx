
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'admin' | 'financeiro' | 'visualizador';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
}

interface UserManagementProps {
  profiles: Profile[];
  loading: boolean;
  onRefresh: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ profiles, loading, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredProfiles = profiles.filter(profile =>
    profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserRole = async (profileId: string, newRole: UserRole) => {
    try {
      console.log('Updating user role to:', newRole);
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
          description: "Erro ao atualizar papel do usuário: " + error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Sucesso",
          description: `Papel do usuário atualizado para ${getRoleLabel(newRole)}`,
        });
        onRefresh();
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
  );
};

export default UserManagement;

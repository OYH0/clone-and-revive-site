
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Eye } from 'lucide-react';

type UserRole = 'admin' | 'financeiro' | 'visualizador';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  role: UserRole;
  created_at: string;
}

interface AdminStatsCardsProps {
  profiles: Profile[];
}

const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ profiles }) => {
  return (
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
  );
};

export default AdminStatsCards;

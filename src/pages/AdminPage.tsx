
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, UserCheck, UserX, Search } from 'lucide-react';

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, email: 'admin@teste.com', isAdmin: true, createdAt: '2024-01-15' },
    { id: 2, email: 'usuario@teste.com', isAdmin: false, createdAt: '2024-01-20' },
    { id: 3, email: 'gerente@teste.com', isAdmin: false, createdAt: '2024-02-01' },
  ]);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAdminStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, isAdmin: !user.isAdmin } : user
    ));
  };

  return (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{users.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Administradores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                    <UserCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{users.filter(u => u.isAdmin).length}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Usuários Comuns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                    <UserX className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="text-3xl font-bold text-gray-800">{users.filter(u => !u.isAdmin).length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Management */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="border-b border-gray-100">
              <CardTitle className="text-gray-800">Gerenciar Usuários</CardTitle>
              <CardDescription className="text-gray-600">
                Visualize e gerencie as permissões dos usuários
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

              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-white/50 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Criado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={user.isAdmin ? "default" : "secondary"}
                        className={user.isAdmin ? "bg-green-100 text-green-800" : ""}
                      >
                        {user.isAdmin ? 'Administrador' : 'Usuário'}
                      </Badge>
                      <Button
                        onClick={() => toggleAdminStatus(user.id)}
                        variant={user.isAdmin ? "destructive" : "default"}
                        size="sm"
                        className={user.isAdmin 
                          ? "bg-red-500 hover:bg-red-600" 
                          : "bg-green-500 hover:bg-green-600 text-white"
                        }
                      >
                        {user.isAdmin ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Remover Admin
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Tornar Admin
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredUsers.length === 0 && (
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
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

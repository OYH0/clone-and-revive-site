
import React from 'react';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const ConfiguracoesPage = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-blue-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-slate-500 to-slate-600 rounded-2xl shadow-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                  Configurações
                </h1>
                <p className="text-gray-600 text-lg">Gerencie as configurações do sistema</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* User Profile */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Perfil do Usuário
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="text-gray-700 font-medium">Nome</Label>
                    <Input id="nome" placeholder="Seu nome" className="bg-white/50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" className="bg-white/50 border-gray-200" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg">
                    <Bell className="h-5 w-5 text-yellow-600" />
                  </div>
                  Notificações
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configure suas preferências de notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-gray-700 font-medium">Notificações por Email</Label>
                    <p className="text-sm text-gray-500">Receba alertas sobre vencimentos</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-gray-700 font-medium">Relatórios Mensais</Label>
                    <p className="text-sm text-gray-500">Receba relatório mensal automaticamente</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-gray-700 font-medium">Alertas de Orçamento</Label>
                    <p className="text-sm text-gray-500">Seja notificado quando exceder o orçamento</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-red-100 to-red-200 rounded-lg">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  Segurança
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configurações de segurança da conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-gray-700 font-medium">Senha Atual</Label>
                    <Input id="current-password" type="password" className="bg-white/50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-700 font-medium">Nova Senha</Label>
                    <Input id="new-password" type="password" className="bg-white/50 border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-700 font-medium">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" className="bg-white/50 border-gray-200" />
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white">
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            {/* System */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-gray-800">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-green-200 rounded-lg">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  Sistema
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Configurações gerais do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-gray-100">
                  <div className="space-y-0.5">
                    <Label className="text-gray-700 font-medium">Backup Automático</Label>
                    <p className="text-sm text-gray-500">Fazer backup dos dados automaticamente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-gray-700 font-medium">Moeda Padrão</Label>
                  <select className="flex h-10 w-full rounded-md border border-gray-200 bg-white/50 px-3 py-2 text-sm">
                    <option value="BRL">Real Brasileiro (R$)</option>
                    <option value="USD">Dólar Americano ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
                <Button variant="outline" className="bg-white/50 hover:bg-white/80 border-gray-200">
                  Exportar Dados
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;

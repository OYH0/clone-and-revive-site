
import React, { useState } from 'react';
import { Settings, User, Bell, Database, Shield, Palette, Download, Upload } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ConfiguracoesPage = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: false,
    autoBackup: true,
    currency: 'BRL',
    language: 'pt-BR',
    backupFrequency: 'daily'
  });

  const { user } = useAuth();
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Aqui seria implementada a lógica para salvar as configurações
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso!",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export iniciado",
      description: "Seus dados estão sendo preparados para download...",
    });
  };

  const handleImportData = () => {
    toast({
      title: "Import em desenvolvimento",
      description: "Funcionalidade de importação será implementada em breve.",
    });
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-100">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow-lg">
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
            {/* Perfil do Usuário */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Perfil do Usuário</CardTitle>
                    <CardDescription>Informações da sua conta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="rounded-xl bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input 
                      id="nome" 
                      placeholder="Seu nome completo" 
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="empresa">Empresa Principal</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione sua empresa principal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="churrasco">Companhia do Churrasco</SelectItem>
                      <SelectItem value="johnny">Johnny Rockets</SelectItem>
                      <SelectItem value="ambas">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl">
                  Atualizar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Notificações */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Notificações</CardTitle>
                    <CardDescription>Configure suas preferências de notificação</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Notificações Push</Label>
                    <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                  </div>
                  <Switch 
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Alertas por Email</Label>
                    <p className="text-sm text-gray-500">Receba alertas importantes por email</p>
                  </div>
                  <Switch 
                    checked={settings.emailAlerts}
                    onCheckedChange={(checked) => setSettings({...settings, emailAlerts: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Relatórios Automáticos</Label>
                    <p className="text-sm text-gray-500">Receba relatórios mensais por email</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Aparência */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Aparência</CardTitle>
                    <CardDescription>Personalize a interface do sistema</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Modo Escuro</Label>
                    <p className="text-sm text-gray-500">Usar tema escuro na interface</p>
                  </div>
                  <Switch 
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Idioma</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es-ES">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Moeda</Label>
                    <Select value={settings.currency} onValueChange={(value) => setSettings({...settings, currency: value})}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup e Dados */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Backup e Dados</CardTitle>
                    <CardDescription>Gerencie seus dados e backups</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Backup Automático</Label>
                    <p className="text-sm text-gray-500">Fazer backup automático dos dados</p>
                  </div>
                  <Switch 
                    checked={settings.autoBackup}
                    onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
                  />
                </div>
                
                <Separator />
                
                <div>
                  <Label>Frequência do Backup</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => setSettings({...settings, backupFrequency: value})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleExportData}
                    variant="outline" 
                    className="flex-1 rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Dados
                  </Button>
                  <Button 
                    onClick={handleImportData}
                    variant="outline" 
                    className="flex-1 rounded-2xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Segurança */}
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-xl text-gray-800">Segurança</CardTitle>
                    <CardDescription>Configure as opções de segurança</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl"
                >
                  Alterar Senha
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full rounded-2xl"
                >
                  Configurar Autenticação em Duas Etapas
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full rounded-2xl"
                >
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>

            {/* Botão de Salvar */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg rounded-2xl px-8"
              >
                Salvar Todas as Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;

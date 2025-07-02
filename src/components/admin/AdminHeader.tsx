
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader = () => {
  return (
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
  );
};

export default AdminHeader;

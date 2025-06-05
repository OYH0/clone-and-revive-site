
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface DespesasFilterSimpleProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterEmpresa: string;
  setFilterEmpresa: (value: string) => void;
  filterCategoria: string;
  setFilterCategoria: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

const DespesasFilterSimple: React.FC<DespesasFilterSimpleProps> = ({
  searchTerm,
  setSearchTerm,
  filterEmpresa,
  setFilterEmpresa,
  filterCategoria,
  setFilterCategoria,
  filterStatus,
  setFilterStatus
}) => {
  const hasActiveFilters = searchTerm !== '' || filterEmpresa !== 'all' || filterCategoria !== 'all' || filterStatus !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterEmpresa('all');
    setFilterCategoria('all');
    setFilterStatus('all');
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl rounded-2xl mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-gray-600" />
            <CardTitle className="text-xl text-gray-800">Filtros</CardTitle>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 rounded-full h-8 px-3"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Buscar por descrição ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div>
            <Select value={filterEmpresa} onValueChange={setFilterEmpresa}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todas as empresas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as empresas</SelectItem>
                <SelectItem value="Churrasco">Churrasco</SelectItem>
                <SelectItem value="Johnny">Johnny</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                <SelectItem value="INSUMOS">Insumos</SelectItem>
                <SelectItem value="FIXAS">Fixas</SelectItem>
                <SelectItem value="VARIÁVEIS">Variáveis</SelectItem>
                <SelectItem value="ATRASADOS">Atrasados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="PAGO">Pago</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="ATRASADO">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DespesasFilterSimple;

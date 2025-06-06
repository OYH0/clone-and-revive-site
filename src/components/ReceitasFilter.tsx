
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ReceitasFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterEmpresa: string;
  setFilterEmpresa: (value: string) => void;
  filterCategoria: string;
  setFilterCategoria: (value: string) => void;
}

const ReceitasFilter: React.FC<ReceitasFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterEmpresa,
  setFilterEmpresa,
  filterCategoria,
  setFilterCategoria
}) => {
  const hasActiveFilters = searchTerm !== '' || filterEmpresa !== 'all' || filterCategoria !== 'all';

  const clearFilters = () => {
    setSearchTerm('');
    setFilterEmpresa('all');
    setFilterCategoria('all');
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <SelectItem value="Churrasco">Companhia do Churrasco</SelectItem>
                <SelectItem value="Johnny">Johnny Rockets</SelectItem>
                <SelectItem value="Camerino">Camerino</SelectItem>
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
                <SelectItem value="VENDAS">Vendas</SelectItem>
                <SelectItem value="VENDAS_DIARIAS">Vendas Diárias</SelectItem>
                <SelectItem value="SERVICOS">Serviços</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReceitasFilter;

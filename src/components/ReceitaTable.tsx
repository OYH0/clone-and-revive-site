
import React, { useState } from 'react';
import { Edit, Trash2, Lock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receita, useDeleteReceita } from '@/hooks/useReceitas';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ReceitaTableProps {
  receitas: Receita[];
}

const ReceitaTable: React.FC<ReceitaTableProps> = ({ receitas }) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const deleteReceita = useDeleteReceita();
  const { isAdmin } = useAdminAccess();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const handleDelete = () => {
    if (deleteId) {
      deleteReceita.mutate(deleteId, {
        onSuccess: () => setDeleteId(null)
      });
    }
  };

  const canEditReceita = (receita: Receita) => {
    return isAdmin || receita.user_id === user?.id;
  };

  const getCategoryBadge = (categoria: string) => {
    const colors = {
      VENDAS: 'bg-green-500',
      VENDAS_DIARIAS: 'bg-emerald-500',
      SERVICOS: 'bg-blue-500',
      OUTROS: 'bg-gray-500'
    };
    return colors[categoria as keyof typeof colors] || 'bg-gray-500';
  };

  const getEmpresaBadge = (empresa: string) => {
    const colors = {
      Churrasco: 'bg-red-500',
      Johnny: 'bg-blue-600',
      Camerino: 'bg-purple-500',
      Outros: 'bg-gray-600'
    };
    return colors[empresa as keyof typeof colors] || 'bg-gray-600';
  };

  // Function to format date correctly
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  if (receitas.length === 0) {
    return (
      <div className={`text-center ${isMobile ? 'py-6' : 'py-8'} text-gray-500`}>
        <p className={isMobile ? 'text-sm' : ''}>Nenhuma receita encontrada.</p>
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} mt-2`}>Adicione receitas para visualizá-las aqui.</p>
      </div>
    );
  }

  // Mobile card layout
  if (isMobile) {
    return (
      <>
        <div className="space-y-3">
          {receitas.map((receita) => {
            const canEdit = canEditReceita(receita);
            
            return (
              <div key={receita.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2">
                    <Badge className={`${getEmpresaBadge(receita.empresa)} text-white text-xs`}>
                      {receita.empresa}
                    </Badge>
                    <Badge className={`${getCategoryBadge(receita.categoria)} text-white text-xs`}>
                      {receita.categoria}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {canEdit ? (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit size={14} />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="opacity-50 h-8 w-8 p-0">
                        <Lock size={14} className="text-gray-400" />
                      </Button>
                    )}
                    
                    {canEdit ? (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteId(receita.id)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                      >
                        <Trash2 size={14} />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled className="opacity-50 h-8 w-8 p-0">
                        <Lock size={14} className="text-gray-400" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{receita.descricao}</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      R$ {receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(receita.data)}
                    </span>
                  </div>
                  
                  <div className="pt-2">
                    {receita.data_recebimento ? (
                      <Badge className="bg-green-500 text-white text-xs">
                        Recebido em {formatDate(receita.data_recebimento)}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-white text-xs">Pendente</Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent className="mx-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Desktop table layout
  return (
    <>
      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Recebimento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receitas.map((receita) => {
              const canEdit = canEditReceita(receita);
              
              return (
                <TableRow key={receita.id}>
                  <TableCell>
                    {formatDate(receita.data)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getEmpresaBadge(receita.empresa)} text-white`}>
                      {receita.empresa}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {receita.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getCategoryBadge(receita.categoria)} text-white`}>
                      {receita.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    R$ {receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    {receita.data_recebimento ? (
                      <Badge className="bg-green-500 text-white">
                        {formatDate(receita.data_recebimento)}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500 text-white">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {canEdit ? (
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled className="opacity-50">
                          <Lock size={16} className="text-gray-400" />
                        </Button>
                      )}
                      
                      {canEdit ? (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteId(receita.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled className="opacity-50">
                          <Lock size={16} className="text-gray-400" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta receita? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ReceitaTable;

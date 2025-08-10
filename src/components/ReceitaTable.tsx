
import React, { useState } from 'react';
import { Edit, Trash2, Lock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Receita, useDeleteReceita } from '@/hooks/useReceitas';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { useAuth } from '@/contexts/AuthContext';
import EditReceitaModal from '@/components/EditReceitaModal';
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
  const [editingReceita, setEditingReceita] = useState<Receita | null>(null);
  const deleteReceita = useDeleteReceita();
  const { isAdmin } = useAdminAccess();
  const { user } = useAuth();

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

  // Group receitas by received date for bank statement format
  const groupedReceitas = () => {
    const groups: { [date: string]: Receita[] } = {};
    
    receitas.forEach(receita => {
      // Use received date if available, otherwise group as "Pendentes"
      const groupKey = receita.data_recebimento 
        ? receita.data_recebimento 
        : 'pending';
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(receita);
    });
    
    return groups;
  };

  if (receitas.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma receita encontrada.</p>
        <p className="text-sm mt-2">Adicione receitas para visualizá-las aqui.</p>
      </div>
    );
  }

  const groups = groupedReceitas();
  const sortedDates = Object.keys(groups).sort((a, b) => {
    if (a === 'pending') return 1;
    if (b === 'pending') return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const calculateDailyTotal = (receitas: Receita[]) => {
    return receitas.reduce((total, receita) => total + receita.valor, 0);
  };

  return (
    <>
      <div className="space-y-6">
        {sortedDates.map((date) => {
          const dateReceitas = groups[date];
          const dailyTotal = calculateDailyTotal(dateReceitas);
          
          return (
            <div key={date}>
              {/* Data Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-primary px-6 py-4 mb-3 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-gray-800">
                    {date === 'pending' ? 'Pendentes' : formatDate(date)}
                  </h3>
                  <div className={`px-4 py-2 rounded-full font-bold text-sm shadow-md ${
                    dailyTotal >= 0 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {dailyTotal >= 0 ? '+' : ''}{dailyTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                </div>
              </div>
              
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
                    {dateReceitas.map((receita) => {
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
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setEditingReceita(receita)}
                                >
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
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      <EditReceitaModal
        isOpen={!!editingReceita}
        onClose={() => setEditingReceita(null)}
        receita={editingReceita}
      />

      {/* Delete Confirmation Dialog */}
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

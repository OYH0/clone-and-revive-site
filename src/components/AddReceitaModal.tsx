
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateReceita } from '@/hooks/useReceitas';
import { useUpdateSaldo } from '@/hooks/useSaldos';

interface AddReceitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmpresa?: string;
}

const AddReceitaModal: React.FC<AddReceitaModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultEmpresa 
}) => {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    data_recebimento: '',
    descricao: '',
    empresa: '',
    categoria: 'VENDAS',
    saldo_destino: 'conta' as 'conta' | 'cofre'
  });

  const createReceita = useCreateReceita();
  const updateSaldo = useUpdateSaldo();

  // Set default empresa when modal opens
  useEffect(() => {
    if (defaultEmpresa && isOpen) {
      setFormData(prev => ({ ...prev, empresa: defaultEmpresa }));
    }
  }, [defaultEmpresa, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const receitaData = {
      data: formData.data,
      valor: parseFloat(formData.valor),
      data_recebimento: formData.data_recebimento || undefined,
      descricao: formData.descricao,
      empresa: formData.empresa,
      categoria: formData.categoria
    };

    createReceita.mutate(receitaData, {
      onSuccess: () => {
        // Update saldo after successful receita creation
        updateSaldo.mutate({
          tipo: formData.saldo_destino,
          valor: parseFloat(formData.valor)
        });
        
        setFormData({
          data: '',
          valor: '',
          data_recebimento: '',
          descricao: '',
          empresa: defaultEmpresa || '',
          categoria: 'VENDAS',
          saldo_destino: 'conta'
        });
        onClose();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Receita</DialogTitle>
          <DialogDescription>
            Adicione uma nova receita ao sistema
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa">Empresa/Cliente</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, empresa: value })} value={formData.empresa}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Churrasco">Companhia do Churrasco</SelectItem>
                  <SelectItem value="Johnny">Johnny Rockets</SelectItem>
                  <SelectItem value="Camerino">Camerino</SelectItem>
                  <SelectItem value="Implementação">Implementação</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, categoria: value })} value={formData.categoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VENDAS">Vendas</SelectItem>
                  <SelectItem value="VENDAS_DIARIAS">Vendas Diárias</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                  <SelectItem value="EM_COFRE">Em Cofre</SelectItem>
                  <SelectItem value="EM_CONTA">Em Conta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="saldo_destino">Destino do Valor</Label>
              <Select onValueChange={(value: 'conta' | 'cofre') => setFormData({ ...formData, saldo_destino: value })} value={formData.saldo_destino}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conta">Conta</SelectItem>
                  <SelectItem value="cofre">Cofre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="data_recebimento">Data de Recebimento (opcional)</Label>
            <Input
              id="data_recebimento"
              type="date"
              value={formData.data_recebimento}
              onChange={(e) => setFormData({ ...formData, data_recebimento: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição da receita..."
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createReceita.isPending || updateSaldo.isPending}>
              {(createReceita.isPending || updateSaldo.isPending) ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReceitaModal;

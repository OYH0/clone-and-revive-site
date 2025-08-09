
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Receita, useUpdateReceita } from '@/hooks/useReceitas';

interface EditReceitaModalProps {
  isOpen: boolean;
  onClose: () => void;
  receita: Receita | null;
}

const EditReceitaModal: React.FC<EditReceitaModalProps> = ({ isOpen, onClose, receita }) => {
  const [formData, setFormData] = useState({
    data: '',
    descricao: '',
    empresa: '',
    categoria: '',
    valor: '',
    data_recebimento: ''
  });

  const { toast } = useToast();
  const updateReceita = useUpdateReceita();

  useEffect(() => {
    if (receita) {
      setFormData({
        data: receita.data || '',
        descricao: receita.descricao || '',
        empresa: receita.empresa || '',
        categoria: receita.categoria || '',
        valor: receita.valor?.toString() || '',
        data_recebimento: receita.data_recebimento || ''
      });
    }
  }, [receita]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!receita) return;

    try {
      const valor = parseFloat(formData.valor);
      if (isNaN(valor) || valor <= 0) {
        toast({
          title: "Erro",
          description: "Valor deve ser um número maior que zero",
          variant: "destructive",
        });
        return;
      }

      await updateReceita.mutateAsync({
        id: receita.id,
        data: formData.data,
        descricao: formData.descricao,
        empresa: formData.empresa,
        categoria: formData.categoria,
        valor: valor,
        data_recebimento: formData.data_recebimento || null
      });

      onClose();
    } catch (error) {
      console.error('Erro ao atualizar receita:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>
            Faça alterações na receita selecionada.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data">Data da Receita</Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.valor}
                onChange={(e) => handleChange('valor', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição da receita"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa">Empresa</Label>
              <Select value={formData.empresa} onValueChange={(value) => handleChange('empresa', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Churrasco">Companhia do Churrasco</SelectItem>
                  <SelectItem value="Johnny">Johnny Rockets</SelectItem>
                  <SelectItem value="Camerino">Camerino</SelectItem>
                  <SelectItem value="Implementacao">Implementação</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={formData.categoria} onValueChange={(value) => handleChange('categoria', value)}>
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
          </div>

          <div>
            <Label htmlFor="data_recebimento">Data de Recebimento (opcional)</Label>
            <Input
              id="data_recebimento"
              type="date"
              value={formData.data_recebimento}
              onChange={(e) => handleChange('data_recebimento', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={updateReceita.isPending}
            >
              {updateReceita.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReceitaModal;

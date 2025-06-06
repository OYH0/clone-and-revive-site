import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction } from '@/types/transaction';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onTransactionUpdated: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onTransactionUpdated
}) => {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    empresa: '',
    categoria: '',
    data_vencimento: '',
    descricao: '',
    valor_juros: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (transaction) {
      setFormData({
        data: transaction.date || '', // Don't fill with current date, use existing date or empty
        valor: transaction.valor.toString(),
        empresa: transaction.company,
        categoria: transaction.category,
        data_vencimento: transaction.data_vencimento || '',
        descricao: transaction.description,
        valor_juros: transaction.valor_juros?.toString() || ''
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !user) return;

    if (!formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Data de vencimento é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('despesas')
        .update({
          data: formData.data || null, // Don't use current date, leave empty if not provided
          valor: parseFloat(formData.valor),
          empresa: formData.empresa,
          categoria: formData.categoria,
          data_vencimento: formData.data_vencimento,
          descricao: formData.descricao,
          valor_juros: formData.valor_juros ? parseFloat(formData.valor_juros) : 0,
          user_id: user.id
        })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Despesa atualizada com sucesso!",
      });

      onTransactionUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar despesa:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar despesa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="data">Data de Pagamento</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              className="rounded-full"
            />
            <p className="text-xs text-gray-500 mt-1">Deixe vazio se ainda não foi paga. Será preenchida automaticamente ao marcar como paga.</p>
          </div>

          <div>
            <Label htmlFor="data_vencimento">Data de Vencimento *</Label>
            <Input
              id="data_vencimento"
              type="date"
              value={formData.data_vencimento}
              onChange={(e) => handleInputChange('data_vencimento', e.target.value)}
              required
              className="rounded-full"
            />
          </div>

          <div>
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              required
              className="rounded-full"
            />
          </div>

          <div>
            <Label htmlFor="valor_juros">Valor dos Juros</Label>
            <Input
              id="valor_juros"
              type="number"
              step="0.01"
              value={formData.valor_juros}
              onChange={(e) => handleInputChange('valor_juros', e.target.value)}
              className="rounded-full"
            />
          </div>

          <div>
            <Label htmlFor="empresa">Empresa *</Label>
            <Input
              id="empresa"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              required
              className="rounded-full"
            />
          </div>

          <div>
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                <SelectItem value="INSUMOS">Insumos</SelectItem>
                <SelectItem value="FIXAS">Fixas</SelectItem>
                <SelectItem value="VARIAVEIS">Variáveis</SelectItem>
                <SelectItem value="ATRASADOS">Atrasados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={3}
              className="rounded-2xl"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-full">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 rounded-full">
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;

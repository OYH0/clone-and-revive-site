import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  defaultEmpresa?: string;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded,
  defaultEmpresa
}) => {
  const [formData, setFormData] = useState({
    data: '',
    valor: '',
    empresa: '',
    descricao: '',
    categoria: 'INSUMOS',
    data_vencimento: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = ['INSUMOS', 'FIXAS', 'VARIÁVEIS', 'ATRASADOS'];
  const companies = ['Churrasco', 'Johnny', 'Camerino'];

  // Set default empresa when modal opens
  useEffect(() => {
    if (defaultEmpresa && isOpen) {
      setFormData(prev => ({ ...prev, empresa: defaultEmpresa }));
    }
  }, [defaultEmpresa, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para adicionar transações.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.data || !formData.valor || !formData.empresa) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validar data de vencimento para boletos atrasados
    if (formData.categoria === 'ATRASADOS' && !formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Data de vencimento é obrigatória para boletos atrasados.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const insertData: any = {
        data: formData.data,
        valor: parseFloat(formData.valor),
        empresa: formData.empresa,
        descricao: formData.descricao || 'Sem descrição',
        categoria: formData.categoria,
        user_id: user.id
      };

      // Adicionar data de vencimento apenas se for fornecida
      if (formData.data_vencimento) {
        insertData.data_vencimento = formData.data_vencimento;
      }

      const { error } = await supabase
        .from('despesas')
        .insert([insertData]);

      if (error) {
        console.error('Error inserting despesa:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar transação. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso!",
        description: "Transação adicionada com sucesso.",
      });

      // Reset form
      setFormData({
        data: '',
        valor: '',
        empresa: defaultEmpresa || '',
        descricao: '',
        categoria: 'INSUMOS',
        data_vencimento: ''
      });

      onTransactionAdded();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data *</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa *</Label>
            <select
              id="empresa"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Selecione uma empresa</option>
              {companies.map(company => (
                <option key={company} value={company}>{company}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <select
              id="categoria"
              value={formData.categoria}
              onChange={(e) => handleInputChange('categoria', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_vencimento">Data de Vencimento</Label>
            <Input
              id="data_vencimento"
              type="date"
              value={formData.data_vencimento}
              onChange={(e) => handleInputChange('data_vencimento', e.target.value)}
            />
          </div>

          {formData.categoria === 'ATRASADOS' && !formData.data_vencimento && (
            <p className="text-sm text-red-600">
              * Data de vencimento é obrigatória para boletos atrasados
            </p>
          )}

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição da despesa..."
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Transação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;

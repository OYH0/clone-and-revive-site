
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Transaction } from '@/types/transaction';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
    descricao: '',
    categoria: '',
    subcategoria: '',
    data_vencimento: '',
    valor_juros: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    { value: 'INSUMOS', label: 'Insumos' },
    { value: 'FIXAS', label: 'Fixas' },
    { value: 'VARIÁVEIS', label: 'Variáveis' },
    { value: 'ATRASADOS', label: 'Atrasados' },
    { value: 'RETIRADAS', label: 'Retiradas' },
    { value: 'IMPLEMENTACAO', label: 'Implementação' }
  ];

  const subcategories = {
    'INSUMOS': [
      { value: 'DESCARTAVEIS', label: 'Descartáveis' },
      { value: 'LIMPEZA', label: 'Limpeza' },
      { value: 'HORTIFRUTE', label: 'Hortifrute' },
      { value: 'CARNES', label: 'Carnes' },
      { value: 'BEBIDAS', label: 'Bebidas' },
      { value: 'PEIXES', label: 'Peixes' },
      { value: 'SUPERMERCADO', label: 'SuperMercado' }
    ],
    'FIXAS': [
      { value: 'IMPOSTOS', label: 'Impostos' },
      { value: 'EMPRESTIMOS', label: 'Empréstimos' }
    ],
    'VARIÁVEIS': [],
    'ATRASADOS': [],
    'RETIRADAS': [],
    'IMPLEMENTACAO': []
  };

  const companies = ['Churrasco', 'Johnny', 'Camerino', 'Implementação'];

  // Update form data when transaction changes
  useEffect(() => {
    if (transaction && isOpen) {
      setFormData({
        data: transaction.date || '',
        valor: transaction.valor?.toString() || '',
        empresa: transaction.company || '',
        descricao: transaction.description || '',
        categoria: transaction.category || '',
        subcategoria: transaction.subcategoria || '',
        data_vencimento: transaction.data_vencimento || '',
        valor_juros: transaction.valor_juros?.toString() || ''
      });
    }
  }, [transaction, isOpen]);

  // Function to create corresponding receita for Implementação category
  const createImplementacaoReceita = async (despesaData: any) => {
    try {
      const receitaData = {
        data: despesaData.data_vencimento || new Date().toISOString().split('T')[0],
        valor: despesaData.valor,
        data_recebimento: despesaData.data || null,
        descricao: `Receita da Implementação: ${despesaData.descricao}`,
        empresa: 'Implementação',
        categoria: 'IMPLEMENTACAO',
        user_id: user.id
      };

      const { error: receitaError } = await supabase
        .from('receitas')
        .insert([receitaData]);

      if (receitaError) {
        console.error('Error creating receita for Implementação:', receitaError);
        toast({
          title: "Aviso",
          description: "Despesa atualizada, mas houve erro ao criar a receita correspondente na Implementação.",
          variant: "destructive"
        });
      } else {
        console.log('Receita de Implementação criada com sucesso');
      }
    } catch (error) {
      console.error('Error in createImplementacaoReceita:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !transaction) {
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da transação.",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.valor || !formData.empresa || !formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const updateData: any = {
        data: formData.data || null,
        valor: parseFloat(formData.valor),
        empresa: formData.empresa,
        descricao: formData.descricao,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria || null,
        data_vencimento: formData.data_vencimento,
        valor_juros: formData.valor_juros ? parseFloat(formData.valor_juros) : 0
      };

      const { error } = await supabase
        .from('despesas')
        .update(updateData)
        .eq('id', transaction.id);

      if (error) {
        console.error('Error updating despesa:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar transação. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // If categoria changed to IMPLEMENTACAO and it wasn't before, create corresponding receita
      if (formData.categoria === 'IMPLEMENTACAO' && transaction.category !== 'IMPLEMENTACAO') {
        await createImplementacaoReceita(updateData);
      }

      toast({
        title: "Sucesso!",
        description: formData.categoria === 'IMPLEMENTACAO' && transaction.category !== 'IMPLEMENTACAO'
          ? "Transação atualizada e receita de Implementação criada com sucesso."
          : "Transação atualizada com sucesso.",
      });

      onTransactionUpdated();
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
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Reset subcategoria when categoria changes
      if (field === 'categoria') {
        newData.subcategoria = '';
      }
      
      return newData;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="data">Data de Pagamento</Label>
            <Input
              id="data"
              type="date"
              value={formData.data}
              onChange={(e) => handleInputChange('data', e.target.value)}
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
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

          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$) *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              required
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor_juros">Valor dos Juros (R$)</Label>
            <Input
              id="valor_juros"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valor_juros}
              onChange={(e) => handleInputChange('valor_juros', e.target.value)}
              className="rounded-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresa">Empresa *</Label>
            <Select value={formData.empresa} onValueChange={(value) => handleInputChange('empresa', value)}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {companies.map(company => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {formData.categoria === 'IMPLEMENTACAO' && transaction?.category !== 'IMPLEMENTACAO' && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Nota:</strong> Ao alterar para categoria Implementação, será criada uma receita correspondente para a empresa Implementação.
              </p>
            </div>
          )}

          {formData.categoria && subcategories[formData.categoria as keyof typeof subcategories]?.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Select value={formData.subcategoria} onValueChange={(value) => handleInputChange('subcategoria', value)}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Selecione uma subcategoria" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {subcategories[formData.categoria as keyof typeof subcategories].map(subcategory => (
                    <SelectItem key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descrição da despesa..."
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value)}
              rows={3}
              className="rounded-2xl"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="rounded-full">
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;

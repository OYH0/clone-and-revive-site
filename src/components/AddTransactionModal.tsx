
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
    { value: 'RETIRADAS', label: 'Retiradas' }
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
    'RETIRADAS': []
  };

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
    
    if (!formData.valor || !formData.empresa || !formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios (Valor, Empresa e Data de Vencimento).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const insertData: any = {
        data: formData.data || null,
        valor: parseFloat(formData.valor),
        empresa: formData.empresa,
        descricao: formData.descricao || 'Sem descrição',
        categoria: formData.categoria,
        subcategoria: formData.subcategoria || null,
        data_vencimento: formData.data_vencimento,
        valor_juros: formData.valor_juros ? parseFloat(formData.valor_juros) : 0,
        user_id: user.id
      };

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
        subcategoria: '',
        data_vencimento: '',
        valor_juros: ''
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
          <DialogTitle>Nova Transação</DialogTitle>
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
            <p className="text-xs text-gray-500">Deixe vazio se ainda não foi paga. Será preenchida automaticamente ao marcar como paga.</p>
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
              {isLoading ? 'Salvando...' : 'Salvar Transação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;

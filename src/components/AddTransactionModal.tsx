
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { companies, getSubcategoriesByCategory } from '@/utils/subcategories';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded
}) => {
  const [formData, setFormData] = useState({
    data_vencimento: '',
    valor: '',
    empresa: '',
    categoria: '',
    subcategoria: '',
    descricao: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.data_vencimento) {
      toast({
        title: "Erro",
        description: "Data de vencimento é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      toast({
        title: "Erro",
        description: "Valor deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.empresa) {
      toast({
        title: "Erro",
        description: "Empresa é obrigatória.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('despesas')
        .insert([{
          data_vencimento: formData.data_vencimento,
          valor: parseFloat(formData.valor),
          empresa: formData.empresa,
          categoria: formData.categoria || 'VARIÁVEIS',
          subcategoria: formData.subcategoria || null,
          descricao: formData.descricao,
          valor_juros: formData.valor_juros ? parseFloat(formData.valor_juros) : 0,
          user_id: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Despesa criada com sucesso!",
      });

      // Reset form
      setFormData({
        data_vencimento: '',
        valor: '',
        empresa: '',
        categoria: '',
        subcategoria: '',
        descricao: '',
        valor_juros: ''
      });

      onTransactionAdded();
    } catch (error) {
      console.error('Erro ao criar despesa:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar despesa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Limpar subcategoria quando categoria muda
      if (field === 'categoria') {
        newData.subcategoria = '';
      }
      
      return newData;
    });
  };

  const availableSubcategories = getSubcategoriesByCategory(formData.categoria);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Select value={formData.empresa} onValueChange={(value) => handleInputChange('empresa', value)}>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Selecione uma empresa" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {companies.map(company => (
                  <SelectItem key={company.value} value={company.value}>
                    {company.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
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

          {availableSubcategories.length > 0 && (
            <div>
              <Label htmlFor="subcategoria">Subcategoria</Label>
              <Select value={formData.subcategoria} onValueChange={(value) => handleInputChange('subcategoria', value)}>
                <SelectTrigger className="rounded-full">
                  <SelectValue placeholder="Selecione uma subcategoria" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {availableSubcategories.map(subcategory => (
                    <SelectItem key={subcategory.value} value={subcategory.value}>
                      {subcategory.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              {isLoading ? 'Criando...' : 'Criar Despesa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;

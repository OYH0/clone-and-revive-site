
export interface Transaction {
  id: number;
  date: string | null;
  valor: number;
  company: string;
  description: string;
  category: string;
  subcategoria?: string;
  data_vencimento?: string;
  comprovante?: string;
  status?: string | null;
  user_id: string;
  valor_juros?: number;
  valor_total?: number;
}

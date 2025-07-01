
export interface Transaction {
  id: number;
  date: string;
  valor: number;
  company: string;
  description: string;
  category: string;
  data_vencimento?: string;
  status?: string;
  comprovante?: string;
  user_id?: string;
  valor_juros?: number;
  valor_total?: number;
}

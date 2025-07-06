
import { Transaction } from '@/types/transaction';

export const filterDespesasCurrentMonth = (transactions: Transaction[], dateFrom?: string, dateTo?: string) => {
  if (!transactions || transactions.length === 0) return [];

  // Filtrar primeiro para excluir Camerino
  const transactionsSemCamerino = transactions.filter(transaction => {
    const empresa = transaction.company?.toLowerCase().trim() || '';
    return !empresa.includes('camerino');
  });

  console.log('=== FILTRO MÊS ATUAL ===');
  console.log('Total de transações:', transactions.length);
  console.log('Transações sem Camerino:', transactionsSemCamerino.length);
  console.log('Filtros de data - De:', dateFrom, 'Até:', dateTo);

  // Se foram fornecidas datas específicas, usar elas
  if (dateFrom || dateTo) {
    console.log('Usando filtros de data manuais');
    
    return transactionsSemCamerino.filter(transaction => {
      const transactionDate = transaction.data_vencimento || transaction.date;
      if (!transactionDate) return false;

      let itemDate: Date;
      if (transactionDate.includes('/')) {
        const [dia, mes, ano] = transactionDate.split('/');
        itemDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        itemDate = new Date(transactionDate + 'T00:00:00');
      }

      const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;

      return true;
    });
  }

  // Caso contrário, filtrar pelo mês atual + últimos 30 dias de pagamentos
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  console.log('Filtro automático - Início do mês atual:', currentMonthStart.toLocaleDateString('pt-BR'));
  console.log('Filtro automático - 30 dias atrás:', thirtyDaysAgo.toLocaleDateString('pt-BR'));

  const filtered = transactionsSemCamerino.filter(transaction => {
    const vencimento = transaction.data_vencimento;
    const pagamento = transaction.date;

    let includeTransaction = false;

    // Verificar data de vencimento (deve ser do mês atual)
    if (vencimento) {
      let vencimentoDate: Date;
      if (vencimento.includes('/')) {
        const [dia, mes, ano] = vencimento.split('/');
        vencimentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        vencimentoDate = new Date(vencimento + 'T00:00:00');
      }

      if (vencimentoDate >= currentMonthStart) {
        includeTransaction = true;
        console.log('Incluído por vencimento:', vencimento, transaction.description);
      }
    }

    // Verificar data de pagamento (deve ser dos últimos 30 dias)
    if (!includeTransaction && pagamento) {
      let pagamentoDate: Date;
      if (pagamento.includes('/')) {
        const [dia, mes, ano] = pagamento.split('/');
        pagamentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        pagamentoDate = new Date(pagamento + 'T00:00:00');
      }

      if (pagamentoDate >= thirtyDaysAgo) {
        includeTransaction = true;
        console.log('Incluído por pagamento recente:', pagamento, transaction.description);
      }
    }

    return includeTransaction;
  });

  console.log('Total filtrado (sem Camerino):', filtered.length);
  return filtered;
};

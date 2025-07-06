
import { Transaction } from '@/types/transaction';
import { Receita } from '@/hooks/useReceitas';

export const filterDespesasCurrentMonth = (transactions: Transaction[], dateFrom?: string, dateTo?: string, excludeCamerino: boolean = true) => {
  if (!transactions || transactions.length === 0) return [];

  // Filtrar Camerino apenas se excludeCamerino for true
  const filteredTransactions = excludeCamerino 
    ? transactions.filter(transaction => {
        const empresa = transaction.company?.toLowerCase().trim() || '';
        return !empresa.includes('camerino');
      })
    : transactions;

  console.log('=== FILTRO MÊS ATUAL ===');
  console.log('Total de transações:', transactions.length);
  console.log('Transações após filtro Camerino:', filteredTransactions.length);
  console.log('Excluir Camerino?', excludeCamerino);
  console.log('Filtros de data - De:', dateFrom, 'Até:', dateTo);

  // Se foram fornecidas datas específicas, usar elas
  if (dateFrom || dateTo) {
    console.log('Usando filtros de data manuais');
    
    return filteredTransactions.filter(transaction => {
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

  const filtered = filteredTransactions.filter(transaction => {
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

  console.log('Total filtrado:', filtered.length);
  return filtered;
};

export const filterReceitasCurrentMonth = (receitas: Receita[], dateFrom?: string, dateTo?: string, excludeCamerino: boolean = true) => {
  if (!receitas || receitas.length === 0) return [];

  // Filtrar Camerino apenas se excludeCamerino for true
  const filteredReceitas = excludeCamerino 
    ? receitas.filter(receita => {
        const empresa = receita.empresa?.toLowerCase().trim() || '';
        return !empresa.includes('camerino');
      })
    : receitas;

  console.log('=== FILTRO MÊS ATUAL - RECEITAS ===');
  console.log('Total de receitas:', receitas.length);
  console.log('Receitas após filtro Camerino:', filteredReceitas.length);
  console.log('Excluir Camerino?', excludeCamerino);
  console.log('Filtros de data - De:', dateFrom, 'Até:', dateTo);

  // Se foram fornecidas datas específicas, usar elas
  if (dateFrom || dateTo) {
    console.log('Usando filtros de data manuais');
    
    return filteredReceitas.filter(receita => {
      const receitaDate = receita.data_recebimento || receita.data;
      if (!receitaDate) return false;

      let itemDate: Date;
      if (receitaDate.includes('/')) {
        const [dia, mes, ano] = receitaDate.split('/');
        itemDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        itemDate = new Date(receitaDate + 'T00:00:00');
      }

      const fromDate = dateFrom ? new Date(dateFrom + 'T00:00:00') : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

      if (fromDate && itemDate < fromDate) return false;
      if (toDate && itemDate > toDate) return false;

      return true;
    });
  }

  // Caso contrário, filtrar pelo mês atual + últimos 30 dias de recebimentos
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);

  console.log('Filtro automático - Início do mês atual:', currentMonthStart.toLocaleDateString('pt-BR'));
  console.log('Filtro automático - 30 dias atrás:', thirtyDaysAgo.toLocaleDateString('pt-BR'));

  const filtered = filteredReceitas.filter(receita => {
    const dataReceita = receita.data;
    const dataRecebimento = receita.data_recebimento;

    let includeReceita = false;

    // Verificar data da receita (deve ser do mês atual)
    if (dataReceita) {
      let receitaDate: Date;
      if (dataReceita.includes('/')) {
        const [dia, mes, ano] = dataReceita.split('/');
        receitaDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        receitaDate = new Date(dataReceita + 'T00:00:00');
      }

      if (receitaDate >= currentMonthStart) {
        includeReceita = true;
        console.log('Incluído por data da receita:', dataReceita, receita.descricao);
      }
    }

    // Verificar data de recebimento (deve ser dos últimos 30 dias)
    if (!includeReceita && dataRecebimento) {
      let recebimentoDate: Date;
      if (dataRecebimento.includes('/')) {
        const [dia, mes, ano] = dataRecebimento.split('/');
        recebimentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        recebimentoDate = new Date(dataRecebimento + 'T00:00:00');
      }

      if (recebimentoDate >= thirtyDaysAgo) {
        includeReceita = true;
        console.log('Incluído por recebimento recente:', dataRecebimento, receita.descricao);
      }
    }

    return includeReceita;
  });

  console.log('Total filtrado:', filtered.length);
  return filtered;
};

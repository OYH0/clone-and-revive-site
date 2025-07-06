import { Transaction } from '@/types/transaction';
import { Receita } from '@/hooks/useReceitas';

export const filterDespesasCurrentMonth = (transactions: Transaction[], dateFrom?: string, dateTo?: string, excludeCamerino: boolean = true) => {
  if (!transactions || transactions.length === 0) return [];

  console.log('=== FILTRO MÊS ATUAL ===');
  console.log('Total de transações:', transactions.length);
  console.log('Filtros de data - De:', dateFrom, 'Até:', dateTo);
  console.log('Excluir Camerino?', excludeCamerino);

  // Se foram fornecidas datas específicas, usar elas
  if (dateFrom || dateTo) {
    console.log('Usando filtros de data manuais');
    
    const filteredByDate = transactions.filter(transaction => {
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

    // Aplicar filtro Camerino se necessário
    const finalFiltered = excludeCamerino 
      ? filteredByDate.filter(transaction => {
          const empresa = transaction.company?.toLowerCase().trim() || '';
          return !empresa.includes('camerino');
        })
      : filteredByDate;

    console.log('Total filtrado por data:', filteredByDate.length);
    console.log('Total após filtro Camerino:', finalFiltered.length);
    return finalFiltered;
  }

  // Caso contrário, filtrar APENAS pelo mês atual
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  console.log('Filtro automático - Início do mês atual:', currentMonthStart.toLocaleDateString('pt-BR'));
  console.log('Filtro automático - Fim do mês atual:', currentMonthEnd.toLocaleDateString('pt-BR'));

  const filtered = transactions.filter(transaction => {
    const vencimento = transaction.data_vencimento;
    const pagamento = transaction.date;

    let includeTransaction = false;

    // Se foi paga (tem data de pagamento), usar a data de pagamento como critério principal
    if (pagamento) {
      let pagamentoDate: Date;
      if (pagamento.includes('/')) {
        const [dia, mes, ano] = pagamento.split('/');
        pagamentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        pagamentoDate = new Date(pagamento + 'T00:00:00');
      }

      if (pagamentoDate >= currentMonthStart && pagamentoDate <= currentMonthEnd) {
        includeTransaction = true;
        console.log('Incluído por pagamento no mês atual:', pagamento, transaction.description);
      }
    }
    // Se não foi paga ainda, usar data de vencimento
    else if (vencimento) {
      let vencimentoDate: Date;
      if (vencimento.includes('/')) {
        const [dia, mes, ano] = vencimento.split('/');
        vencimentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        vencimentoDate = new Date(vencimento + 'T00:00:00');
      }

      if (vencimentoDate >= currentMonthStart && vencimentoDate <= currentMonthEnd) {
        includeTransaction = true;
        console.log('Incluído por vencimento no mês atual:', vencimento, transaction.description);
      }
    }

    return includeTransaction;
  });

  // Aplicar filtro Camerino se necessário
  const finalFiltered = excludeCamerino 
    ? filtered.filter(transaction => {
        const empresa = transaction.company?.toLowerCase().trim() || '';
        return !empresa.includes('camerino');
      })
    : filtered;

  console.log('Total filtrado para o mês atual:', filtered.length);
  console.log('Total após filtro Camerino:', finalFiltered.length);
  return finalFiltered;
};

export const filterReceitasCurrentMonth = (receitas: Receita[], dateFrom?: string, dateTo?: string, excludeCamerino: boolean = true) => {
  if (!receitas || receitas.length === 0) return [];

  console.log('=== FILTRO MÊS ATUAL - RECEITAS ===');
  console.log('Total de receitas:', receitas.length);
  console.log('Filtros de data - De:', dateFrom, 'Até:', dateTo);
  console.log('Excluir Camerino?', excludeCamerino);

  // Se foram fornecidas datas específicas, usar elas
  if (dateFrom || dateTo) {
    console.log('Usando filtros de data manuais');
    
    const filteredByDate = receitas.filter(receita => {
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

    // Aplicar filtro Camerino se necessário
    const finalFiltered = excludeCamerino 
      ? filteredByDate.filter(receita => {
          const empresa = receita.empresa?.toLowerCase().trim() || '';
          return !empresa.includes('camerino');
        })
      : filteredByDate;

    console.log('Total filtrado por data:', filteredByDate.length);
    console.log('Total após filtro Camerino:', finalFiltered.length);
    return finalFiltered;
  }

  // Caso contrário, filtrar APENAS pelo mês atual
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  console.log('Filtro automático - Início do mês atual:', currentMonthStart.toLocaleDateString('pt-BR'));
  console.log('Filtro automático - Fim do mês atual:', currentMonthEnd.toLocaleDateString('pt-BR'));

  const filtered = receitas.filter(receita => {
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

      if (receitaDate >= currentMonthStart && receitaDate <= currentMonthEnd) {
        includeReceita = true;
        console.log('Incluído por data da receita no mês atual:', dataReceita, receita.descricao);
      }
    }

    // Se não foi incluído por data da receita, verificar data de recebimento
    if (!includeReceita && dataRecebimento) {
      let recebimentoDate: Date;
      if (dataRecebimento.includes('/')) {
        const [dia, mes, ano] = dataRecebimento.split('/');
        recebimentoDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
      } else {
        recebimentoDate = new Date(dataRecebimento + 'T00:00:00');
      }

      if (recebimentoDate >= currentMonthStart && recebimentoDate <= currentMonthEnd) {
        includeReceita = true;
        console.log('Incluído por recebimento no mês atual:', dataRecebimento, receita.descricao);
      }
    }

    return includeReceita;
  });

  // Aplicar filtro Camerino se necessário
  const finalFiltered = excludeCamerino 
    ? filtered.filter(receita => {
        const empresa = receita.empresa?.toLowerCase().trim() || '';
        return !empresa.includes('camerino');
      })
    : filtered;

  console.log('Total filtrado para o mês atual:', filtered.length);
  console.log('Total após filtro Camerino:', finalFiltered.length);
  return finalFiltered;
};

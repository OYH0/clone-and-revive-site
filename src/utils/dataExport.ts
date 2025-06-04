
import { jsPDF } from 'jspdf';

export interface ExportData {
  despesas: any[];
  receitas: any[];
  configuracoes: any;
  dataExportacao: string;
}

export const exportDataToPDF = () => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Relatório de Dados - Sistema Financeiro', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Data de Exportação: ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
  
  // Despesas
  doc.setFontSize(16);
  doc.text('Despesas', 20, 65);
  
  // Receitas
  doc.text('Receitas', 20, 120);
  
  // Footer
  doc.setFontSize(10);
  doc.text('Gerado pelo Sistema de Gestão Financeira', 20, 280);
  
  // Save the PDF
  doc.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportDataToJSON = () => {
  const data: ExportData = {
    despesas: JSON.parse(localStorage.getItem('despesas') || '[]'),
    receitas: JSON.parse(localStorage.getItem('receitas') || '[]'),
    configuracoes: JSON.parse(localStorage.getItem('app-settings') || '{}'),
    dataExportacao: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-dados-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importDataFromJSON = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Arquivo inválido'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
};

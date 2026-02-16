// =====================================================
// PDF GENERATOR - FINAL WORKING VERSION
// Uses autoTable correctly with jsPDF v4
// =====================================================

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency, formatDate, getMonthName } from './helpers';

// Type augmentation for autoTable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface FinancialReportData {
  year: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  kalengData: any[];
  incomeData: any[];
  programsData: any[];
  categoriesData: any[];
  transactionsData: any[];
}

export function generateFinancialReportPDF(data: FinancialReportData) {
  // Create document with jsPDF v4
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  const checkNewPage = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string) => {
    checkNewPage(15);
    doc.setFillColor(16, 185, 129);
    doc.rect(margin, yPosition, contentWidth, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 5, yPosition + 7);
    yPosition += 15;
    doc.setTextColor(0, 0, 0);
  };

  // CRITICAL: This is the correct way to use autoTable in jsPDF v4
  const addTable = (headers: string[], rows: string[][], options: any = {}) => {
    if (!rows || rows.length === 0) {
      console.warn('No rows to display in table');
      return;
    }

    try {
      // Call autoTable directly - it's now part of the doc prototype
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: yPosition,
        margin: { left: margin, right: margin },
        theme: 'grid',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10,
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [0, 0, 0],
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
        ...options,
      });
      
      // Update yPosition from lastAutoTable
      yPosition = doc.lastAutoTable.finalY + 10;
    } catch (error) {
      console.error('Error adding table:', error);
      console.error('Table headers:', headers);
      console.error('Table rows count:', rows?.length || 0);
      // Fallback: just skip this table
      yPosition += 30;
    }
  };

  // ========================================
  // HEADER
  // ========================================
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('LAPORAN KEUANGAN', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('LazisNU Mulyoarjo', pageWidth / 2, 25, { align: 'center' });
  doc.text(`Tahun ${data.year}`, pageWidth / 2, 33, { align: 'center' });
  
  yPosition = 50;
  doc.setTextColor(0, 0, 0);

  // ========================================
  // A. RINGKASAN TAHUN
  // ========================================
  addSectionHeader('A. RINGKASAN TAHUN ' + data.year);
  
  console.log('Adding summary data:', { 
    income: data.totalIncome, 
    expense: data.totalExpense, 
    balance: data.balance 
  });
  
  const summaryData = [
    ['Total Pemasukan', formatCurrency(data.totalIncome)],
    ['Total Pengeluaran', formatCurrency(data.totalExpense)],
    ['Saldo', formatCurrency(data.balance)],
  ];
  
  addTable(['Keterangan', 'Jumlah'], summaryData, {
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' },
    },
  });

  // Category breakdown
  if (data.categoriesData && data.categoriesData.length > 0) {
    console.log('Adding categories:', data.categoriesData.length);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Rincian Pengeluaran per Kategori:', margin, yPosition);
    yPosition += 7;
    
    const categoryRows = data.categoriesData.map(cat => {
      const catPrograms = (data.programsData || []).filter(p => p.category_id === cat.id);
      const totalRealization = catPrograms.reduce((sum, p) => sum + (p.realization || 0), 0);
      return [
        cat.name || '',
        `${cat.percentage || 0}%`,
        formatCurrency(totalRealization),
      ];
    });
    
    addTable(
      ['Kategori', 'Alokasi', 'Realisasi'],
      categoryRows,
      {
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 30, halign: 'center' },
          2: { cellWidth: 'auto', halign: 'right' },
        },
      }
    );
  }

  // ========================================
  // B. PERSEBARAN KALENG
  // ========================================
  if (data.kalengData && data.kalengData.length > 0) {
    console.log('Adding kaleng data:', data.kalengData.length);
    
    doc.addPage();
    yPosition = margin;
    addSectionHeader('B. PERSEBARAN KALENG');
    
    const totalDistributed = data.kalengData.reduce((sum, d) => sum + (d.total_distributed || 0), 0);
    const totalCollected = data.kalengData.reduce((sum, d) => sum + (d.total_collected || 0), 0);
    const totalNotCollected = data.kalengData.reduce((sum, d) => sum + (d.total_not_collected || 0), 0);
    const collectionRate = totalDistributed > 0 ? Math.round((totalCollected / totalDistributed) * 100) : 0;
    
    const kalengSummary = [
      ['Total Terdistribusi', `${totalDistributed} kaleng`],
      ['Total Terkumpul', `${totalCollected} kaleng`],
      ['Belum Terkumpul', `${totalNotCollected} kaleng`],
      ['Tingkat Pengumpulan', `${collectionRate}%`],
    ];
    
    addTable(['Keterangan', 'Jumlah'], kalengSummary, {
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 'auto', halign: 'right' },
      },
    });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Data Bulanan per Dusun:', margin, yPosition);
    yPosition += 7;
    
    const dusunList = ['Pakutukan', 'Watugel', 'Paras', 'Ampelgading'];
    const months = [...new Set(data.kalengData.map(d => d.month))].sort((a, b) => a - b);
    
    for (let i = 0; i < months.length; i += 3) {
      const monthGroup = months.slice(i, i + 3);
      if (i > 0) checkNewPage(40);
      
      const monthHeaders = ['Dusun', ...monthGroup.map(m => getMonthName(m))];
      const monthRows = dusunList.map(dusun => {
        const row = [dusun];
        monthGroup.forEach(month => {
          const dusunData = data.kalengData.find(d => d.month === month && d.dusun === dusun);
          row.push(`${dusunData?.total_collected || 0}/${dusunData?.total_distributed || 0}`);
        });
        return row;
      });
      
      addTable(monthHeaders, monthRows, { 
        columnStyles: { 0: { cellWidth: 40 } } 
      });
    }
  }

  // ========================================
  // C. LAPORAN PEMASUKAN BULANAN
  // ========================================
  if (data.incomeData && data.incomeData.length > 0) {
    console.log('Adding income data:', data.incomeData.length);
    
    doc.addPage();
    yPosition = margin;
    addSectionHeader('C. LAPORAN PEMASUKAN BULANAN');
    
    const incomeRows = data.incomeData.map(item => {
      const netto = (item.gross_amount || 0) - (item.kaleng_wages || 0) - (item.spb_cost || 0);
      return [
        getMonthName(item.month),
        formatCurrency(item.gross_amount || 0),
        formatCurrency(item.kaleng_wages || 0),
        formatCurrency(item.spb_cost || 0),
        formatCurrency(netto),
        formatCurrency(item.jpzis_25_percent || 0),
        formatCurrency(item.jpzis_75_percent || 0),
      ];
    });
    
    const totals = data.incomeData.reduce(
      (acc, item) => {
        const netto = (item.gross_amount || 0) - (item.kaleng_wages || 0) - (item.spb_cost || 0);
        return {
          gross: acc.gross + (item.gross_amount || 0),
          wages: acc.wages + (item.kaleng_wages || 0),
          spb: acc.spb + (item.spb_cost || 0),
          netto: acc.netto + netto,
          jpzis25: acc.jpzis25 + (item.jpzis_25_percent || 0),
          jpzis75: acc.jpzis75 + (item.jpzis_75_percent || 0),
        };
      },
      { gross: 0, wages: 0, spb: 0, netto: 0, jpzis25: 0, jpzis75: 0 }
    );
    
    incomeRows.push([
      'TOTAL',
      formatCurrency(totals.gross),
      formatCurrency(totals.wages),
      formatCurrency(totals.spb),
      formatCurrency(totals.netto),
      formatCurrency(totals.jpzis25),
      formatCurrency(totals.jpzis75),
    ]);
    
    addTable(
      ['Bulan', 'Bruto', 'Upah', 'SPB', 'Netto', 'JPZIS 25%', 'JPZIS 75%'],
      incomeRows,
      {
        styles: { fontSize: 8 },
        headStyles: { fontSize: 9 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right' },
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
        },
      }
    );
  }

  // ========================================
  // D. PROGRAM KERJA
  // ========================================
  if (data.programsData && data.programsData.length > 0 && data.categoriesData && data.categoriesData.length > 0) {
    console.log('Adding programs:', data.programsData.length);
    
    doc.addPage();
    yPosition = margin;
    addSectionHeader('D. PROGRAM KERJA & REALISASI');
    
    for (const category of data.categoriesData) {
      checkNewPage(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${category.name} (${category.percentage}%)`, margin, yPosition);
      yPosition += 7;
      
      const catPrograms = data.programsData.filter(p => p.category_id === category.id);
      
      if (catPrograms.length === 0) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text('Tidak ada program', margin + 5, yPosition);
        yPosition += 10;
        continue;
      }
      
      const programRows = catPrograms.map(program => {
        const progress = program.budget > 0 
          ? Math.min(Math.round(((program.realization || 0) / program.budget) * 100), 100) 
          : 0;
        
        return [
          program.name || '',
          program.target_audience || '-',
          formatCurrency(program.budget || 0),
          formatCurrency(program.realization || 0),
          `${progress}%`,
          program.is_completed ? 'Selesai' : 'Proses',
        ];
      });
      
      addTable(
        ['Program', 'Target', 'Anggaran', 'Realisasi', 'Progress', 'Status'],
        programRows,
        {
          styles: { fontSize: 8 },
          headStyles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 35 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'center' },
            5: { halign: 'center' },
          },
        }
      );
    }
  }

  // ========================================
  // E. RINCIAN PENGELUARAN
  // ========================================
  if (data.transactionsData && data.transactionsData.length > 0 && data.categoriesData && data.categoriesData.length > 0) {
    console.log('Adding transactions:', data.transactionsData.length);
    
    doc.addPage();
    yPosition = margin;
    addSectionHeader('E. RINCIAN PENGELUARAN PER PROGRAM');
    
    for (const category of data.categoriesData) {
      const transactions = data.transactionsData.filter(
        t => t.category_id === category.id && t.transaction_type === 'expense'
      );
      
      if (transactions.length === 0) continue;
      
      checkNewPage(30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(category.name, margin, yPosition);
      yPosition += 7;
      
      const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
      );
      
      let balance = 0;
      const transactionRows = sortedTransactions.map(t => {
        balance += (t.amount || 0);
        return [
          formatDate(t.transaction_date),
          t.description || '',
          formatCurrency(t.amount || 0),
          formatCurrency(balance),
        ];
      });
      
      transactionRows.push([
        '',
        'TOTAL ' + category.name.toUpperCase(),
        formatCurrency(balance),
        '',
      ]);
      
      addTable(
        ['Tanggal', 'Keterangan', 'Kredit', 'Saldo'],
        transactionRows,
        {
          styles: { fontSize: 8 },
          headStyles: { fontSize: 9 },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 80 },
            2: { halign: 'right' },
            3: { halign: 'right' },
          },
          didParseCell: (data: any) => {
            if (data.row.index === transactionRows.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [229, 231, 235];
            }
          },
        }
      );
    }
  }

  // ========================================
  // FOOTER
  // ========================================
  const totalPages = doc.internal.pages.length - 1;
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`Dicetak: ${today}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    doc.text('LazisNU Mulyoarjo', margin, pageHeight - 10, { align: 'left' });
  }

  console.log('PDF generation completed');
  return doc;
}

export function downloadPDF(doc: any, filename: string) {
  doc.save(filename);
}

export async function generateAndDownloadFinancialReport(data: FinancialReportData) {
  try {
    console.log('=== PDF GENERATION START ===');
    console.log('Data structure:', {
      year: data.year,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
      balance: data.balance,
      kalengCount: data.kalengData?.length || 0,
      incomeCount: data.incomeData?.length || 0,
      programsCount: data.programsData?.length || 0,
      categoriesCount: data.categoriesData?.length || 0,
      transactionsCount: data.transactionsData?.length || 0,
    });
    
    const doc = generateFinancialReportPDF(data);
    const filename = `Laporan-Keuangan-LazisNU-${data.year}.pdf`;
    downloadPDF(doc, filename);
    
    console.log('=== PDF GENERATION SUCCESS ===');
    return { success: true };
  } catch (error) {
    console.error('=== PDF GENERATION ERROR ===');
    console.error('Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal membuat PDF';
    return { success: false, error: errorMessage };
  }
}
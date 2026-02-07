// PDF Generation utilities using jsPDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { ReportData, ReportOptions } from './reportData';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// NHS Color palette (mutable for jspdf-autotable compatibility)
const NHS_BLUE: [number, number, number] = [0, 94, 184];
const NHS_DARK_BLUE: [number, number, number] = [0, 48, 135];
const TEXT_DARK: [number, number, number] = [33, 43, 50];
const TEXT_GREY: [number, number, number] = [100, 100, 100];

// Progress callback type
export type ProgressCallback = (progress: number, message: string) => void;

export async function generatePDF(
  reportData: ReportData,
  onProgress?: ProgressCallback
): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add header and footer
  const addHeaderFooter = (pageNum: number, totalPages: number) => {
    if (pageNum === 1) {
      // Prominent Page 1 Header - NHS professional styling
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NHS_BLUE);
      doc.setFontSize(12);
      doc.text("St. Mary's NHS Foundation Trust", margin, 18);
      
      doc.setFontSize(24);
      doc.text('Resilience Board Report', margin, 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_GREY);
      doc.text(`Reporting Period: ${reportData.period}`, margin, 40);
      doc.text(`Generated: ${reportData.generatedDate}`, pageWidth - margin, 40, { align: 'right' });
      
      // Thick header line for page 1
      doc.setDrawColor(...NHS_BLUE);
      doc.setLineWidth(1);
      doc.line(margin, 45, pageWidth - margin, 45);
    } else {
      // Compact header for subsequent pages
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NHS_BLUE);
      doc.text('Resilience Board Report', margin, 15);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_GREY);
      doc.text("St. Mary's NHS Foundation Trust", pageWidth - margin, 15, { align: 'right' });
      
      // Thin header line for other pages
      doc.setDrawColor(...NHS_BLUE);
      doc.setLineWidth(0.5);
      doc.line(margin, 18, pageWidth - margin, 18);
    }
    
    // Footer (same for all pages)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_GREY);
    doc.text('Confidential - Board Use Only', margin, pageHeight - 10);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text('Powered by ResilienC Framework', pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Helper to check if we need a new page
  const checkNewPage = (currentY: number, neededSpace: number = 40): number => {
    if (currentY + neededSpace > pageHeight - 30) {
      doc.addPage();
      return 40;
    }
    return currentY;
  };

  let currentY = 52; // Start below page 1 header (which ends at y=45)
  let progress = 0;

  // Add demo disclaimer if selected
  if (reportData.options.includeDisclaimer) {
    onProgress?.(5, 'Adding disclaimer banner...');
    
    doc.setFillColor(227, 242, 253); // Light blue
    doc.setDrawColor(...NHS_BLUE);
    doc.roundedRect(margin, currentY, contentWidth, 25, 2, 2, 'FD');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_DARK_BLUE);
    doc.text('📊 DEMONSTRATION REPORT', margin + 5, currentY + 8);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    const disclaimerText = "This report uses illustrative data for St. Mary's NHS Foundation Trust as a demonstration of the ResilienC platform capabilities. Real implementation would use actual trust data integrated from source systems.";
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, contentWidth - 10);
    doc.text(splitDisclaimer, margin + 5, currentY + 14);
    
    currentY += 32;
  }

  // Executive Summary Section
  if (reportData.sections.includes('executive-summary')) {
    onProgress?.(10, 'Generating Executive Summary...');
    
    currentY = checkNewPage(currentY);
    
    // Section title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('EXECUTIVE SUMMARY', margin, currentY);
    currentY += 10;
    
    // Overall status box
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Resilience Status', margin, currentY);
    currentY += 6;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    const statusText = `Aggregate Score: ${reportData.aggregateScore}/100 (${reportData.aggregateStatus}, ${reportData.aggregateTrend})`;
    doc.text(statusText, margin, currentY);
    currentY += 8;
    
    // Summary paragraph
    const summaryLines = doc.splitTextToSize(reportData.executiveSummary, contentWidth);
    doc.text(summaryLines, margin, currentY);
    currentY += summaryLines.length * 5 + 10;
    
    // Five Capitals Table
    currentY = checkNewPage(currentY, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('Five Capitals Status Summary', margin, currentY);
    currentY += 5;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Capital', 'Score', 'Status', 'Trend']],
      body: reportData.capitals.map(c => [
        c.name,
        `${c.score}/100`,
        c.status,
        c.trend
      ]),
      theme: 'grid',
      headStyles: { fillColor: NHS_BLUE, textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 }
      }
    });
    
    currentY = doc.lastAutoTable.finalY + 15;
    
    // Critical Issues
    currentY = checkNewPage(currentY, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('Critical Issues for Board Attention', margin, currentY);
    currentY += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    reportData.criticalIssues.forEach((issue, index) => {
      currentY = checkNewPage(currentY, 8);
      doc.text(`${index + 1}. ${issue}`, margin + 3, currentY);
      currentY += 6;
    });
    
    currentY += 8;
    
    // Recommended Actions
    currentY = checkNewPage(currentY, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('Recommended Board Actions', margin, currentY);
    currentY += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    reportData.recommendedActions.forEach((action, index) => {
      currentY = checkNewPage(currentY, 10);
      const actionLines = doc.splitTextToSize(`${index + 1}. ${action}`, contentWidth - 5);
      doc.text(actionLines, margin + 3, currentY);
      currentY += actionLines.length * 5 + 3;
    });
  }

  // Five Capitals Analysis Section
  if (reportData.sections.includes('five-capitals')) {
    onProgress?.(30, 'Generating Five Capitals Analysis...');
    
    for (let i = 0; i < reportData.capitals.length; i++) {
      const capital = reportData.capitals[i];
      
      // Each capital on a new page
      doc.addPage();
      currentY = 40;
      
      onProgress?.(30 + (i + 1) * 8, `Processing ${capital.name} Capital...`);
      
      // Capital title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NHS_BLUE);
      doc.text(`${capital.name.toUpperCase()} CAPITAL`, margin, currentY);
      currentY += 12;
      
      // Current Status
      doc.setFontSize(12);
      doc.text('Current Status', margin, currentY);
      currentY += 6;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...TEXT_DARK);
      doc.text(`Score: ${capital.score}/100 (${capital.status}, ${capital.trend})`, margin, currentY);
      currentY += 8;
      
      // Commentary
      if (capital.commentary) {
        const commentaryLines = doc.splitTextToSize(capital.commentary, contentWidth);
        doc.text(commentaryLines, margin, currentY);
        currentY += commentaryLines.length * 5 + 10;
      }
      
      // KRI Table
      if (capital.kris && capital.kris.length > 0) {
        currentY = checkNewPage(currentY, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NHS_BLUE);
        doc.text('Key Risk Indicators', margin, currentY);
        currentY += 5;
        
        autoTable(doc, {
          startY: currentY,
          head: [['Metric', 'Current', 'Target', 'Trend']],
          body: capital.kris.map(kri => [
            kri.name,
            kri.value,
            kri.target,
            kri.trend
          ]),
          theme: 'grid',
          headStyles: { fillColor: NHS_BLUE, textColor: [255, 255, 255] },
          styles: { fontSize: 8, cellPadding: 2 },
          margin: { left: margin, right: margin }
        });
        
        currentY = doc.lastAutoTable.finalY + 10;
      }
      
      // Recent Changes
      if (capital.recentChanges && capital.recentChanges.length > 0) {
        currentY = checkNewPage(currentY, 40);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...NHS_BLUE);
        doc.text('Recent Developments', margin, currentY);
        currentY += 7;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...TEXT_DARK);
        
        capital.recentChanges.slice(0, 3).forEach(change => {
          currentY = checkNewPage(currentY, 8);
          const changeLines = doc.splitTextToSize(`• ${change}`, contentWidth - 5);
          doc.text(changeLines, margin + 3, currentY);
          currentY += changeLines.length * 4 + 3;
        });
      }
    }
  }

  // Essential Services Section
  if (reportData.sections.includes('essential-services') && reportData.services) {
    onProgress?.(70, 'Generating Essential Services Status...');
    
    doc.addPage();
    currentY = 40;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('ESSENTIAL SERVICES STATUS', margin, currentY);
    currentY += 12;
    
    doc.setFontSize(12);
    doc.text('Service Performance Summary', margin, currentY);
    currentY += 5;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Service', 'Status', 'Reason', 'Last Updated']],
      body: reportData.services.map(svc => [
        svc.name,
        svc.status,
        svc.reason,
        svc.lastUpdated
      ]),
      theme: 'grid',
      headStyles: { fillColor: NHS_BLUE, textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25 },
        2: { cellWidth: 70 },
        3: { cellWidth: 35 }
      }
    });
  }

  // Scenario Testing Section
  if (reportData.sections.includes('scenario-testing') && reportData.scenarios) {
    onProgress?.(80, 'Generating Scenario Testing Summary...');
    
    doc.addPage();
    currentY = 40;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('SCENARIO TESTING & LEARNING', margin, currentY);
    currentY += 12;
    
    doc.setFontSize(12);
    doc.text('Recent Tests Conducted', margin, currentY);
    currentY += 5;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Scenario', 'Last Tested', 'Status', 'Outcome']],
      body: reportData.scenarios.map(s => [
        s.name,
        s.lastTested,
        s.testStatus === 'recent' ? 'Recent' : s.testStatus === 'due-soon' ? 'Due Soon' : 'Overdue',
        s.outcome
      ]),
      theme: 'grid',
      headStyles: { fillColor: NHS_BLUE, textColor: [255, 255, 255] },
      styles: { fontSize: 8, cellPadding: 3 },
      margin: { left: margin, right: margin }
    });
  }

  // Forward Look Section
  if (reportData.sections.includes('forward-look')) {
    onProgress?.(90, 'Generating Forward Look...');
    
    doc.addPage();
    currentY = 40;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('FORWARD LOOK & RECOMMENDATIONS', margin, currentY);
    currentY += 12;
    
    // Upcoming tests
    doc.setFontSize(12);
    doc.text('Upcoming Resilience Tests', margin, currentY);
    currentY += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    const upcomingTests = [
      '15 Mar 2026: Cyber-attack desktop exercise',
      '22 Apr 2026: Major incident live drill',
      '10 Jun 2026: Heatwave preparedness table-top'
    ];
    
    upcomingTests.forEach(test => {
      doc.text(`• ${test}`, margin + 3, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Emerging risks
    currentY = checkNewPage(currentY, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('Emerging Risks', margin, currentY);
    currentY += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    const emergingRisks = [
      'Winter pressures may extend into Q2 due to flu season',
      'Cyber threat level remains elevated nationally',
      'Energy costs forecast to increase 8% in 2026/27'
    ];
    
    emergingRisks.forEach(risk => {
      doc.text(`• ${risk}`, margin + 3, currentY);
      currentY += 6;
    });
    
    currentY += 10;
    
    // Board Actions Required
    currentY = checkNewPage(currentY, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('BOARD ACTIONS REQUIRED', margin, currentY);
    currentY += 7;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    const boardActions = [
      'APPROVE: Workforce resilience improvement programme (£750K)',
      'APPROVE: HVAC replacement programme Phase 1 (£1.2M)',
      'NOTE: Progress on resilience investment delivery',
      'NOTE: Outcomes from Q1 scenario testing exercises'
    ];
    
    boardActions.forEach((action, index) => {
      doc.text(`${index + 1}. ${action}`, margin + 3, currentY);
      currentY += 6;
    });
  }

  // Add citations appendix if selected
  if (reportData.options.includeCitations) {
    onProgress?.(95, 'Adding data source citations...');
    
    doc.addPage();
    currentY = 40;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...NHS_BLUE);
    doc.text('DATA SOURCES & CITATIONS', margin, currentY);
    currentY += 12;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT_DARK);
    
    const citations = [
      '[1] NHS England Monthly Statistics (Winter 2024/25)',
      '[2] CQC Public Ratings Database (Last updated: July 2024)',
      '[3] NHS Digital Workforce Statistics',
      '[4] PHE Healthcare-Associated Infection Reports',
      '[5] ResilienC Five Capitals Assessment Framework',
      '[6] Trust internal operational dashboards',
      '[7] ESR (Electronic Staff Record) System',
      '[8] Finance Ledger and PMO Tracker',
      '',
      'Note: This demonstration report uses illustrative data representative of a large acute NHS trust.'
    ];
    
    citations.forEach(citation => {
      doc.text(citation, margin, currentY);
      currentY += 5;
    });
  }

  // Add headers and footers to all pages
  onProgress?.(98, 'Finalizing report...');
  
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderFooter(i, totalPages);
  }

  onProgress?.(100, 'Report complete!');

  // Return as Blob
  return doc.output('blob');
}

// Download helper function
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

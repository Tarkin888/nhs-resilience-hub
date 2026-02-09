import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetailedEssentialService } from '@/types/services';

// NHS Brand Colors
const NHS_BLUE = [0, 94, 184] as const;
const NHS_DARK_BLUE = [0, 48, 135] as const;

interface ContingencySection {
  title: string;
  content: string;
}

/**
 * Generates a PDF document for a contingency plan section
 */
export const generateContingencyPlanPdf = (
  service: DetailedEssentialService,
  sectionTitle: string,
  sectionContent: string
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Header with NHS branding
  doc.setFillColor(...NHS_BLUE);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTINGENCY PLAN', margin, 18);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(sectionTitle, margin, 28);

  yPos = 45;

  // Service information box
  doc.setFillColor(240, 244, 245);
  doc.rect(margin, yPos, pageWidth - margin * 2, 25, 'F');
  doc.setDrawColor(...NHS_BLUE);
  doc.setLineWidth(0.5);
  doc.rect(margin, yPos, pageWidth - margin * 2, 25, 'S');

  doc.setTextColor(33, 43, 50);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Service:', margin + 5, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(service.name, margin + 25, yPos + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Executive Owner:', margin + 5, yPos + 16);
  doc.setFont('helvetica', 'normal');
  doc.text(service.executiveOwner, margin + 45, yPos + 16);

  doc.setFont('helvetica', 'bold');
  doc.text('Document Generated:', pageWidth / 2, yPos + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }), pageWidth / 2 + 45, yPos + 8);

  yPos += 35;

  // Section header
  doc.setFillColor(...NHS_DARK_BLUE);
  doc.rect(margin, yPos, pageWidth - margin * 2, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(sectionTitle.toUpperCase(), margin + 5, yPos + 7);

  yPos += 15;

  // Content parsing and rendering
  doc.setTextColor(33, 43, 50);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const paragraphs = sectionContent.split('\n\n');
  
  paragraphs.forEach((paragraph) => {
    // Check if we need a new page
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = 20;
    }

    // Check if it's a header (bold text)
    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
      const headerText = paragraph.replace(/\*\*/g, '');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(headerText, margin, yPos);
      yPos += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      return;
    }

    // Check if it's a list
    if (paragraph.includes('\n-')) {
      const lines = paragraph.split('\n');
      
      // First line might be a description
      if (lines[0] && !lines[0].startsWith('-')) {
        const wrappedText = doc.splitTextToSize(lines[0], pageWidth - margin * 2);
        doc.text(wrappedText, margin, yPos);
        yPos += wrappedText.length * 5 + 3;
      }

      // List items
      lines.filter(l => l.startsWith('-')).forEach((item) => {
        if (yPos > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPos = 20;
        }
        const itemText = item.replace(/^-\s*/, '').replace(/\*\*/g, '');
        const wrappedItem = doc.splitTextToSize(`• ${itemText}`, pageWidth - margin * 2 - 5);
        doc.text(wrappedItem, margin + 5, yPos);
        yPos += wrappedItem.length * 5 + 2;
      });

      yPos += 5;
      return;
    }

    // Check for numbered lists
    if (paragraph.match(/^\d+\./m)) {
      const lines = paragraph.split('\n');
      
      lines.forEach((item) => {
        if (yPos > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPos = 20;
        }
        
        const match = item.match(/^(\d+)\.\s*(.*)/);
        if (match) {
          const [, number, content] = match;
          const cleanContent = content.replace(/\*\*/g, '');
          
          // Bold the part before colon if it exists
          if (cleanContent.includes(':')) {
            const [label, ...rest] = cleanContent.split(':');
            doc.setFont('helvetica', 'bold');
            doc.text(`${number}. ${label}:`, margin, yPos);
            doc.setFont('helvetica', 'normal');
            
            if (rest.length > 0) {
              const restText = rest.join(':');
              const labelWidth = doc.getTextWidth(`${number}. ${label}: `);
              const wrappedRest = doc.splitTextToSize(restText, pageWidth - margin * 2 - labelWidth);
              doc.text(wrappedRest, margin + labelWidth, yPos);
              yPos += wrappedRest.length * 5 + 2;
            } else {
              yPos += 7;
            }
          } else {
            const wrappedItem = doc.splitTextToSize(`${number}. ${cleanContent}`, pageWidth - margin * 2);
            doc.text(wrappedItem, margin, yPos);
            yPos += wrappedItem.length * 5 + 2;
          }
        }
      });

      yPos += 5;
      return;
    }

    // Regular paragraph
    const cleanParagraph = paragraph.replace(/\*\*/g, '');
    const wrappedText = doc.splitTextToSize(cleanParagraph, pageWidth - margin * 2);
    doc.text(wrappedText, margin, yPos);
    yPos += wrappedText.length * 5 + 5;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setDrawColor(...NHS_BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(
      `St. Mary's NHS Foundation Trust - ${service.name} Contingency Plan`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  // Download the PDF
  const fileName = `${service.name.toLowerCase().replace(/\s+/g, '-')}-${sectionTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  doc.save(fileName);
};

/**
 * Generates a complete contingency plan PDF with all sections
 */
export const generateFullContingencyPlanPdf = (
  service: DetailedEssentialService
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = 20;

  // Cover page header
  doc.setFillColor(...NHS_BLUE);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTINGENCY PLANS', margin, 25);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(service.name, margin, 40);

  yPos = 65;

  // Document info
  doc.setTextColor(33, 43, 50);
  doc.setFontSize(11);
  
  const infoData = [
    ['Service', service.name],
    ['Executive Owner', service.executiveOwner],
    ['Status', service.status.charAt(0).toUpperCase() + service.status.slice(1)],
    ['Document Generated', new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: infoData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 100 },
    },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Sections
  const sections: ContingencySection[] = [
    { title: 'Service Degradation Protocols', content: service.contingencyPlans.degradationProtocols },
    { title: 'Alternative Delivery Models', content: service.contingencyPlans.alternativeDelivery },
    { title: 'Mutual Aid Agreements', content: service.contingencyPlans.mutualAid },
    { title: 'Recovery Prioritisation Framework', content: service.contingencyPlans.recoveryPrioritisation },
  ];

  sections.forEach((section, sectionIndex) => {
    // New page for each section after the first
    if (sectionIndex > 0) {
      doc.addPage();
      yPos = 20;
    }

    // Section header
    doc.setFillColor(...NHS_DARK_BLUE);
    doc.rect(margin, yPos, pageWidth - margin * 2, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sectionIndex + 1}. ${section.title.toUpperCase()}`, margin + 5, yPos + 7);

    yPos += 18;

    // Content
    doc.setTextColor(33, 43, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const paragraphs = section.content.split('\n\n');
    
    paragraphs.forEach((paragraph) => {
      if (yPos > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        yPos = 20;
      }

      // Parse and render content similar to single section
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const headerText = paragraph.replace(/\*\*/g, '');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(headerText, margin, yPos);
        yPos += 7;
        doc.setFont('helvetica', 'normal');
        return;
      }

      if (paragraph.includes('\n-')) {
        const lines = paragraph.split('\n');
        
        if (lines[0] && !lines[0].startsWith('-')) {
          const wrappedText = doc.splitTextToSize(lines[0], pageWidth - margin * 2);
          doc.text(wrappedText, margin, yPos);
          yPos += wrappedText.length * 5 + 2;
        }

        lines.filter(l => l.startsWith('-')).forEach((item) => {
          if (yPos > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            yPos = 20;
          }
          const itemText = item.replace(/^-\s*/, '').replace(/\*\*/g, '');
          const wrappedItem = doc.splitTextToSize(`• ${itemText}`, pageWidth - margin * 2 - 5);
          doc.text(wrappedItem, margin + 5, yPos);
          yPos += wrappedItem.length * 5 + 2;
        });

        yPos += 3;
        return;
      }

      if (paragraph.match(/^\d+\./m)) {
        const lines = paragraph.split('\n');
        
        lines.forEach((item) => {
          if (yPos > doc.internal.pageSize.getHeight() - 30) {
            doc.addPage();
            yPos = 20;
          }
          
          const match = item.match(/^(\d+)\.\s*(.*)/);
          if (match) {
            const [, number, content] = match;
            const cleanContent = content.replace(/\*\*/g, '');
            
            if (cleanContent.includes(':')) {
              const [label, ...rest] = cleanContent.split(':');
              doc.setFont('helvetica', 'bold');
              doc.text(`${number}. ${label}:`, margin, yPos);
              doc.setFont('helvetica', 'normal');
              
              if (rest.length > 0) {
                const restText = rest.join(':');
                const labelWidth = doc.getTextWidth(`${number}. ${label}: `);
                const wrappedRest = doc.splitTextToSize(restText, pageWidth - margin * 2 - labelWidth);
                doc.text(wrappedRest, margin + labelWidth, yPos);
                yPos += wrappedRest.length * 5 + 2;
              } else {
                yPos += 6;
              }
            } else {
              const wrappedItem = doc.splitTextToSize(`${number}. ${cleanContent}`, pageWidth - margin * 2);
              doc.text(wrappedItem, margin, yPos);
              yPos += wrappedItem.length * 5 + 2;
            }
          }
        });

        yPos += 3;
        return;
      }

      const cleanParagraph = paragraph.replace(/\*\*/g, '');
      const wrappedText = doc.splitTextToSize(cleanParagraph, pageWidth - margin * 2);
      doc.text(wrappedText, margin, yPos);
      yPos += wrappedText.length * 5 + 4;
    });
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    
    doc.setDrawColor(...NHS_BLUE);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text(
      `St. Mary's NHS Foundation Trust - ${service.name} Contingency Plans`,
      margin,
      pageHeight - 8
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 8
    );
  }

  const fileName = `${service.name.toLowerCase().replace(/\s+/g, '-')}-contingency-plans.pdf`;
  doc.save(fileName);
};

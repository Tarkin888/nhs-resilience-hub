import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ExercisePackage } from '@/types/exercises';

const NHS_BLUE = '#005EB8';
const NHS_DARK = '#003087';

export const generateExercisePDF = async (exercisePackage: ExercisePackage): Promise<void> => {
  const { exercise, injects, evaluationCriteria, debriefQuestions } = exercisePackage;
  const doc = new jsPDF();
  let yPos = 20;

  // Helper functions
  const addPageIfNeeded = (requiredHeight: number) => {
    if (yPos + requiredHeight > 270) {
      doc.addPage();
      yPos = 20;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string) => {
    addPageIfNeeded(25);
    doc.setFillColor(NHS_BLUE);
    doc.rect(15, yPos, 180, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, yPos + 7);
    doc.setTextColor(0, 0, 0);
    yPos += 15;
  };

  // ===== COVER PAGE =====
  // NHS Header bar
  doc.setFillColor(NHS_BLUE);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Exercise Package', 105, 22, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text("St. Mary's NHS Foundation Trust", 105, 32, { align: 'center' });

  // Exercise title
  yPos = 60;
  doc.setTextColor(NHS_DARK);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(exercise.name, 170);
  doc.text(titleLines, 105, yPos, { align: 'center' });
  yPos += titleLines.length * 10 + 10;

  // Exercise type badge
  const typeColors = {
    desktop: '#2196F3',
    live: '#4CAF50',
    simulation: '#F44336'
  };
  doc.setFillColor(typeColors[exercise.type]);
  const typeLabel = exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1) + ' Exercise';
  doc.roundedRect(75, yPos, 60, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(typeLabel, 105, yPos + 7, { align: 'center' });
  yPos += 20;

  // Scenario name
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  const scenarioLines = doc.splitTextToSize(exercise.scenarioName, 160);
  doc.text(scenarioLines, 105, yPos, { align: 'center' });
  yPos += scenarioLines.length * 7 + 20;

  // Key details box
  doc.setDrawColor(NHS_BLUE);
  doc.setLineWidth(0.5);
  doc.rect(30, yPos, 150, 50);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Duration:', 40, yPos + 12);
  doc.text('Participants:', 40, yPos + 24);
  doc.text('Facilitator:', 40, yPos + 36);
  doc.text('Category:', 40, yPos + 48);
  
  doc.setFont('helvetica', 'normal');
  doc.text(exercise.duration, 85, yPos + 12);
  doc.text(`${exercise.participants.length} roles`, 85, yPos + 24);
  doc.text(exercise.facilitator, 85, yPos + 36);
  doc.text(exercise.scenarioCategory.charAt(0).toUpperCase() + exercise.scenarioCategory.slice(1), 85, yPos + 48);
  yPos += 60;

  // Generation date
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated: ${format(new Date(), 'dd MMMM yyyy HH:mm')}`, 105, 280, { align: 'center' });

  // ===== EXERCISE PLAN PAGE =====
  doc.addPage();
  yPos = 20;

  addSectionHeader('EXERCISE OBJECTIVES');
  
  exercise.objectives.forEach((objective, idx) => {
    addPageIfNeeded(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(`${idx + 1}. ${objective}`, 170);
    doc.text(lines, 20, yPos);
    yPos += lines.length * 5 + 5;
  });
  yPos += 10;

  addSectionHeader('PARTICIPANTS');
  
  const participantRows = exercise.participants.map((p, idx) => [String(idx + 1), p]);
  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Role']],
    body: participantRows,
    theme: 'striped',
    headStyles: { fillColor: [0, 94, 184], fontSize: 10 },
    bodyStyles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 15 } },
    margin: { left: 20, right: 20 }
  });
  yPos = (doc as any).lastAutoTable.finalY + 15;

  addSectionHeader('MATERIALS REQUIRED');
  
  exercise.materialsRequired.forEach((material) => {
    addPageIfNeeded(10);
    doc.setFontSize(10);
    doc.text(`• ${material}`, 25, yPos);
    yPos += 6;
  });
  yPos += 10;

  addSectionHeader('FACILITATOR RESPONSIBILITIES');
  
  const facilitatorTasks = [
    'Brief all participants before exercise start',
    'Deliver injects at specified times',
    'Observe and note decisions made',
    'Manage exercise pace and time',
    'Lead debrief session'
  ];
  facilitatorTasks.forEach((task) => {
    addPageIfNeeded(10);
    doc.setFontSize(10);
    doc.text(`• ${task}`, 25, yPos);
    yPos += 6;
  });

  // ===== SCENARIO INJECTS PAGE =====
  doc.addPage();
  yPos = 20;
  addSectionHeader('SCENARIO INJECTS');

  injects.forEach((inject, idx) => {
    addPageIfNeeded(60);
    
    // Time marker badge
    doc.setFillColor(NHS_BLUE);
    doc.roundedRect(20, yPos, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(inject.timeMarker, 37.5, yPos + 5.5, { align: 'center' });
    yPos += 12;

    // Description
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const descLines = doc.splitTextToSize(inject.description, 170);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 5 + 5;

    // Facilitator prompts
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Facilitator Prompts:', 20, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'italic');
    inject.facilitatorPrompts.forEach((prompt) => {
      addPageIfNeeded(8);
      const promptLines = doc.splitTextToSize(`"${prompt}"`, 160);
      doc.text(promptLines, 25, yPos);
      yPos += promptLines.length * 4 + 3;
    });

    // Expected responses
    if (inject.expectedResponses && inject.expectedResponses.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Expected Responses:', 20, yPos);
      yPos += 5;
      doc.setFont('helvetica', 'normal');
      inject.expectedResponses.forEach((response) => {
        addPageIfNeeded(8);
        doc.text(`✓ ${response}`, 25, yPos);
        yPos += 5;
      });
    }
    
    yPos += 10;
    
    // Separator line (except last inject)
    if (idx < injects.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(20, yPos - 5, 190, yPos - 5);
    }
  });

  // ===== EVALUATION CRITERIA PAGE =====
  doc.addPage();
  yPos = 20;
  addSectionHeader('EVALUATION CRITERIA');

  const evalRows = evaluationCriteria.map((criterion, idx) => [
    String(idx + 1),
    criterion.criterion,
    criterion.targetOutcome,
    '☐ YES  ☐ PARTIAL  ☐ NO'
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Criterion', 'Target', 'Result']],
    body: evalRows,
    theme: 'striped',
    headStyles: { fillColor: [0, 94, 184], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    columnStyles: { 
      0: { cellWidth: 10 },
      1: { cellWidth: 80 },
      2: { cellWidth: 25 },
      3: { cellWidth: 55 }
    },
    margin: { left: 15, right: 15 }
  });
  yPos = (doc as any).lastAutoTable.finalY + 20;

  // ===== DEBRIEF TEMPLATE PAGE =====
  addSectionHeader('DEBRIEF DISCUSSION TEMPLATE');

  debriefQuestions.forEach((question, idx) => {
    addPageIfNeeded(35);
    
    doc.setFillColor(NHS_BLUE);
    doc.circle(25, yPos + 2, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(String(idx + 1), 25, yPos + 4, { align: 'center' });
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const questionLines = doc.splitTextToSize(question, 155);
    doc.text(questionLines, 35, yPos + 3);
    yPos += questionLines.length * 5 + 8;
    
    // Notes box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([2, 2], 0);
    doc.rect(35, yPos, 155, 20);
    doc.setLineDashPattern([], 0);
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.setFont('helvetica', 'italic');
    doc.text('Notes...', 40, yPos + 5);
    doc.setTextColor(0, 0, 0);
    yPos += 28;
  });

  // ===== FOOTER ON ALL PAGES =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
    if (i > 1) {
      doc.text(`${exercise.name} | Resilience Exercise Package`, 20, 290);
    }
  }

  // Save the PDF
  const fileName = `Exercise_${exercise.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};

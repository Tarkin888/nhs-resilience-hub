import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  reportPeriods, 
  reportSections, 
  collectReportData,
  type ReportPeriod,
  type ReportOptions 
} from '@/lib/reportData';
import { generatePDF, downloadBlob } from '@/lib/pdfGenerator';

interface BoardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BoardReportModal = ({ isOpen, onClose }: BoardReportModalProps) => {
  const { toast } = useToast();
  
  // Form state
  const [selectedPeriodId, setSelectedPeriodId] = useState('current-quarter');
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(new Date());
  const [selectedSections, setSelectedSections] = useState<string[]>(
    reportSections.map(s => s.id)
  );
  const [options, setOptions] = useState<ReportOptions>({
    includeCitations: true,
    includeDisclaimer: true,
    includeRawData: false
  });
  
  // Loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  // Calculate estimated pages
  const estimatedPages = useMemo(() => {
    return reportSections
      .filter(s => selectedSections.includes(s.id))
      .reduce((sum, s) => sum + s.estimatedPages, 0);
  }, [selectedSections]);

  // Check if all sections are selected
  const allSectionsSelected = selectedSections.length === reportSections.length;

  // Get selected period object
  const selectedPeriod = useMemo(() => {
    const period = reportPeriods.find(p => p.id === selectedPeriodId);
    if (period && selectedPeriodId === 'custom' && customStartDate && customEndDate) {
      return {
        ...period,
        startDate: customStartDate,
        endDate: customEndDate,
        label: `${format(customStartDate, 'dd MMM yyyy')} - ${format(customEndDate, 'dd MMM yyyy')}`
      };
    }
    return period;
  }, [selectedPeriodId, customStartDate, customEndDate]);

  // Toggle section
  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Toggle all sections
  const toggleAllSections = () => {
    if (allSectionsSelected) {
      setSelectedSections([]);
    } else {
      setSelectedSections(reportSections.map(s => s.id));
    }
  };

  // Handle report generation
  const handleGenerateReport = async () => {
    if (!selectedPeriod || selectedSections.length === 0) {
      toast({
        title: 'Selection Required',
        description: 'Please select a reporting period and at least one section.',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressMessage('Preparing report data...');

    try {
      // Collect report data
      const reportData = collectReportData(selectedPeriod, selectedSections, options);

      // Generate PDF with progress callback
      const pdfBlob = await generatePDF(reportData, (prog, message) => {
        setProgress(prog);
        setProgressMessage(message);
      });

      // Create filename
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      const filename = `NHS-Resilience-Board-Report-${dateStr}.pdf`;

      // Download the file
      downloadBlob(pdfBlob, filename);

      toast({
        title: 'Report Generated',
        description: 'Your Board report has been downloaded successfully.',
      });

      onClose();
    } catch (error) {
      console.error('Report generation error:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setProgressMessage('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[85vh] overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Generate Board Report
          </DialogTitle>
          <DialogDescription>
            Configure and generate a professional PDF report for Board review.
          </DialogDescription>
        </DialogHeader>

        {isGenerating ? (
          // Loading state
          <div className="py-8 space-y-6">
            <div className="text-center space-y-2">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
              <p className="text-sm font-medium text-foreground">Generating Report...</p>
              <p className="text-sm text-muted-foreground">{progressMessage}</p>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-xs text-muted-foreground">
              Please wait, this may take 10-30 seconds
            </p>
          </div>
        ) : (
          // Configuration form
          <div className="space-y-6 py-4">
            {/* Reporting Period */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Reporting Period</Label>
              <RadioGroup 
                value={selectedPeriodId} 
                onValueChange={setSelectedPeriodId}
                className="space-y-2"
              >
                {reportPeriods.map(period => (
                  <div key={period.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={period.id} id={period.id} />
                    <Label 
                      htmlFor={period.id} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {period.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Custom date range pickers */}
              {selectedPeriodId === 'custom' && (
                <div className="flex gap-3 pl-6">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            "w-[140px] justify-start text-left font-normal",
                            !customStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customStartDate ? format(customStartDate, 'dd MMM yyyy') : 'Select'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customStartDate}
                          onSelect={setCustomStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={cn(
                            "w-[140px] justify-start text-left font-normal",
                            !customEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customEndDate ? format(customEndDate, 'dd MMM yyyy') : 'Select'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customEndDate}
                          onSelect={setCustomEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>

            {/* Report Sections */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Report Sections</Label>
                <span className="text-xs text-muted-foreground">
                  Est. {estimatedPages} pages
                </span>
              </div>
              
              {/* Select All */}
              <div className="flex items-center space-x-3 pb-2 border-b">
                <Checkbox 
                  id="select-all"
                  checked={allSectionsSelected}
                  onCheckedChange={toggleAllSections}
                />
                <Label 
                  htmlFor="select-all" 
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All
                </Label>
              </div>

              {/* Individual sections */}
              <div className="space-y-2">
                {reportSections.map(section => (
                  <div key={section.id} className="flex items-start space-x-3">
                    <Checkbox 
                      id={section.id}
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={() => toggleSection(section.id)}
                      className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                      <Label 
                        htmlFor={section.id} 
                        className="text-sm font-normal cursor-pointer"
                      >
                        {section.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {section.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Format */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Report Format</Label>
              <RadioGroup defaultValue="pdf" className="space-y-2">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="pdf" id="format-pdf" />
                  <Label htmlFor="format-pdf" className="text-sm font-normal cursor-pointer">
                    PDF (Recommended)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 opacity-50">
                  <RadioGroupItem value="pptx" id="format-pptx" disabled />
                  <Label htmlFor="format-pptx" className="text-sm font-normal cursor-not-allowed">
                    PowerPoint (Coming Soon)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Options</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="citations"
                    checked={options.includeCitations}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeCitations: checked as boolean }))
                    }
                  />
                  <Label htmlFor="citations" className="text-sm font-normal cursor-pointer">
                    Include data source citations
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="disclaimer"
                    checked={options.includeDisclaimer}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeDisclaimer: checked as boolean }))
                    }
                  />
                  <Label htmlFor="disclaimer" className="text-sm font-normal cursor-pointer">
                    Add demo disclaimer banner
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="raw-data"
                    checked={options.includeRawData}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeRawData: checked as boolean }))
                    }
                  />
                  <Label htmlFor="raw-data" className="text-sm font-normal cursor-pointer">
                    Include raw data appendix
                  </Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReport}
                disabled={selectedSections.length === 0}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BoardReportModal;

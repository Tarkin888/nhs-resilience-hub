import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  FileText, 
  ChevronDown, 
  Download,
  AlertCircle,
  RefreshCcw,
  Handshake,
  ListOrdered
} from 'lucide-react';
import { DetailedEssentialService } from '@/types/services';
import { cn } from '@/lib/utils';
import { generateContingencyPlanPdf } from '@/lib/contingencyPdfGenerator';
import { toast } from 'sonner';


interface ContingencyPlansCardProps {
  service: DetailedEssentialService;
}

const ContingencySection = ({ 
  title, 
  icon: Icon,
  content,
  defaultOpen = false,
  onDownloadPdf
}: { 
  title: string; 
  icon: React.ElementType;
  content: string;
  defaultOpen?: boolean;
  onDownloadPdf: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onDownloadPdf();
            }}
          >
            <Download className="h-3 w-3 mr-1" />
            PDF
          </Button>
          <ChevronDown className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )} />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 p-4 bg-background rounded-lg border">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {/* Simple markdown-like rendering */}
            {content.split('\n\n').map((paragraph, pIndex) => {
              // Check if it's a header
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h5 key={pIndex} className="font-semibold text-foreground mt-4 mb-2 first:mt-0">
                    {paragraph.replace(/\*\*/g, '')}
                  </h5>
                );
              }
              
              // Check if it's a list section
              if (paragraph.includes('\n-')) {
                const lines = paragraph.split('\n');
                return (
                  <div key={pIndex} className="mb-3">
                    {lines[0] && !lines[0].startsWith('-') && (
                      <p className="text-sm text-muted-foreground mb-1">{lines[0]}</p>
                    )}
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {lines.filter(l => l.startsWith('-')).map((item, i) => (
                        <li key={i} className="text-muted-foreground">
                          {item.replace(/^-\s*/, '').replace(/\*\*/g, '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              // Check for numbered lists
              if (paragraph.match(/^\d+\./m)) {
                const lines = paragraph.split('\n');
                return (
                  <div key={pIndex} className="mb-3">
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {lines.map((item, i) => {
                        const content = item.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '');
                        if (content.trim()) {
                          return (
                            <li key={i} className="text-muted-foreground">
                              <span className="font-medium text-foreground">
                                {content.split(':')[0]}
                              </span>
                              {content.includes(':') && `: ${content.split(':').slice(1).join(':')}`}
                            </li>
                          );
                        }
                        return null;
                      })}
                    </ol>
                  </div>
                );
              }

              // Regular paragraph
              return (
                <p key={pIndex} className="text-sm text-muted-foreground mb-3">
                  {paragraph.replace(/\*\*/g, '')}
                </p>
              );
            })}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ContingencyPlansCard = ({ service }: ContingencyPlansCardProps) => {
  const handleDownloadPdf = (sectionTitle: string, sectionContent: string) => {
    try {
      generateContingencyPlanPdf(service, sectionTitle, sectionContent);
      toast.success('PDF downloaded successfully', {
        description: `${sectionTitle} contingency plan saved.`,
        duration: 3000
      });
    } catch (error) {
      toast.error('Failed to generate PDF', {
        description: 'Please try again later.',
        duration: 3000
      });
    }
  };

  const sections = [
    {
      title: 'Service Degradation Protocols',
      icon: AlertCircle,
      content: service.contingencyPlans.degradationProtocols,
      defaultOpen: true,
    },
    {
      title: 'Alternative Delivery Models',
      icon: RefreshCcw,
      content: service.contingencyPlans.alternativeDelivery,
    },
    {
      title: 'Mutual Aid Agreements',
      icon: Handshake,
      content: service.contingencyPlans.mutualAid,
    },
    {
      title: 'Recovery Prioritisation Framework',
      icon: ListOrdered,
      content: service.contingencyPlans.recoveryPrioritisation,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Contingency Plans
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sections.map((section, index) => (
          <ContingencySection
            key={index}
            title={section.title}
            icon={section.icon}
            content={section.content}
            defaultOpen={section.defaultOpen}
            onDownloadPdf={() => handleDownloadPdf(section.title, section.content)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ContingencyPlansCard;

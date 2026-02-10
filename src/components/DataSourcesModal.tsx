import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Database, Globe, Shield, FileText, Users } from 'lucide-react';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dataSources = [
  {
    category: 'Public NHS Data',
    icon: Globe,
    sources: [
      { name: 'NHS England Statistics', description: 'A&E waiting times, elective care data', url: 'https://www.england.nhs.uk/statistics/' },
      { name: 'Friends & Family Test', description: 'Patient experience feedback', url: 'https://www.england.nhs.uk/fft/' },
      { name: 'ERIC Returns', description: 'Estates Returns Information Collection', url: 'https://digital.nhs.uk/data-and-information/publications/statistical/estates-returns-information-collection' },
    ],
  },
  {
    category: 'CQC Data',
    icon: Shield,
    sources: [
      { name: 'Care Quality Commission', description: 'Inspection ratings and reports', url: 'https://www.cqc.org.uk/' },
      { name: 'CQC Insights', description: 'Risk monitoring indicators', url: 'https://www.cqc.org.uk/about-us/how-we-use-information-and-data' },
    ],
  },
  {
    category: 'Trust Internal Systems',
    icon: Database,
    sources: [
      { name: 'Finance System', description: 'Cash flow, budgets, CIP tracking' },
      { name: 'HR System', description: 'Vacancy rates, sickness, workforce data' },
      { name: 'Operational Dashboard', description: 'Bed occupancy, patient flow' },
    ],
  },
  {
    category: 'Reporting & Assessment',
    icon: FileText,
    sources: [
      { name: 'Sustainability Report', description: 'Carbon emissions, environmental metrics' },
      { name: 'Board Reports', description: 'Strategic risk assessments' },
      { name: 'Annual Accounts', description: 'Financial performance data' },
    ],
  },
];

const DataSourcesModal = memo(({ isOpen, onClose }: DataSourcesModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-primary" />
            Data Sources
          </DialogTitle>
          <DialogDescription>
            This dashboard aggregates data from multiple sources to provide a comprehensive resilience assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {dataSources.map((category) => {
            const IconComponent = category.icon;
            return (
              <div key={category.category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{category.category}</h3>
                </div>
                <div className="grid gap-2 pl-6">
                  {category.sources.map((source) => (
                    <div
                      key={source.name}
                      className="flex items-start justify-between p-3 rounded-lg bg-muted/50 border"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-foreground">{source.name}</p>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                      </div>
                      {source.url ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0 ml-2"
                        >
                          Visit
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <Badge variant="secondary" className="text-[10px] shrink-0 ml-2">
                          Internal
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 p-3 rounded-lg bg-demo/50 border border-demo">
              <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium text-sm text-foreground">Demo Mode Notice</p>
                <p className="text-xs text-muted-foreground">
                  This demonstration uses a combination of real public NHS data and illustrative 
                  trust-level data to show realistic resilience assessment scenarios. 
                  Actual implementation would integrate with live trust systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

DataSourcesModal.displayName = 'DataSourcesModal';

export default DataSourcesModal;

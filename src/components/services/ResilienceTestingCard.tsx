import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TestTube, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  FileWarning,
  Wrench
} from 'lucide-react';
import { DetailedEssentialService } from '@/types/services';
import { cn } from '@/lib/utils';

interface ResilienceTestingCardProps {
  service: DetailedEssentialService;
}

const ResilienceTestingCard = ({ service }: ResilienceTestingCardProps) => {
  const { lastTest, nextTest } = service.resilienceTesting;
  const daysUntilNextTest = differenceInDays(nextTest.date, new Date());

  const getOutcomeBadge = (outcome: string) => {
    const config = {
      'well-managed': { 
        label: 'Well Managed', 
        className: 'bg-success text-success-foreground',
        icon: CheckCircle2
      },
      'adequate': { 
        label: 'Adequate', 
        className: 'bg-warning text-warning-foreground',
        icon: AlertTriangle
      },
      'poor': { 
        label: 'Poor', 
        className: 'bg-destructive text-destructive-foreground',
        icon: FileWarning
      },
    }[outcome] || { label: outcome, className: '', icon: AlertTriangle };

    const Icon = config.icon;
    
    return (
      <Badge className={cn('gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTestTypeBadge = (type: string) => {
    return (
      <Badge variant="outline" className="capitalize">
        {type}
      </Badge>
    );
  };

  const getMitigationStatusBadge = (status: string) => {
    const config = {
      completed: { className: 'bg-success/20 text-success border-success/30' },
      'in-progress': { className: 'bg-warning/20 text-warning border-warning/30' },
      planned: { className: 'bg-muted text-muted-foreground border-border' },
    }[status] || { className: '' };

    return (
      <Badge variant="outline" className={cn('text-xs capitalize', config.className)}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          Resilience Testing History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Last Test Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Last Test Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Last Test
            </h4>
            
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{format(lastTest.date, 'dd MMMM yyyy')}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatDistanceToNow(lastTest.date, { addSuffix: true })})
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Type:</span>
                {getTestTypeBadge(lastTest.type)}
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Outcome:</span>
                {getOutcomeBadge(lastTest.outcome)}
              </div>
            </div>
          </div>

          {/* Next Test Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Next Scheduled Test
            </h4>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="font-medium">{format(nextTest.date, 'dd MMMM yyyy')}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-xs',
                    daysUntilNextTest <= 14 ? 'border-warning text-warning' : 'border-primary text-primary'
                  )}
                >
                  {daysUntilNextTest} days
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-muted-foreground">Type:</span>
                <span className="font-medium">{nextTest.type}</span>
              </div>
              
              <div>
                <span className="text-sm text-muted-foreground">Scenario:</span>
                <p className="mt-1 text-sm">{nextTest.scenario}</p>
              </div>

              <Button size="sm" className="w-full sm:w-auto mt-2">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule New Test
              </Button>
            </div>
          </div>
        </div>

        {/* Vulnerabilities */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileWarning className="h-4 w-4 text-warning" />
            Vulnerabilities Identified
          </h4>
          <ul className="space-y-2">
            {lastTest.vulnerabilities.map((vulnerability, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground bg-warning/5 p-3 rounded-lg border border-warning/20"
              >
                <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                {vulnerability}
              </li>
            ))}
          </ul>
        </div>

        {/* Mitigations */}
        <div>
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" />
            Mitigation Actions
          </h4>
          <div className="space-y-2">
            {lastTest.mitigations.map((mitigation, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border bg-background"
              >
                <span className="text-sm flex-1">{mitigation.action}</span>
                {getMitigationStatusBadge(mitigation.status)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResilienceTestingCard;

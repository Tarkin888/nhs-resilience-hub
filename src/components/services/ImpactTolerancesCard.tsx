import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Shield } from 'lucide-react';
import { DetailedEssentialService } from '@/types/services';
import { cn } from '@/lib/utils';

interface ImpactTolerancesCardProps {
  service: DetailedEssentialService;
}

const ImpactTolerancesCard = ({ service }: ImpactTolerancesCardProps) => {
  const toleranceLevels = [
    { key: 'fullService', label: 'Full Service', severity: 'green' },
    { key: 'degradedService', label: 'Degraded Service', severity: 'amber' },
    { key: 'minimumViable', label: 'Minimum Viable', severity: 'amber-dark' },
    { key: 'serviceFailure', label: 'Service Failure', severity: 'red' },
  ] as const;

  const getSeverityStyles = (severity: string) => {
    return {
      'green': 'bg-success/10 border-l-4 border-l-success',
      'amber': 'bg-warning/10 border-l-4 border-l-warning',
      'amber-dark': 'bg-warning/20 border-l-4 border-l-warning',
      'red': 'bg-destructive/10 border-l-4 border-l-destructive',
    }[severity] || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Impact Tolerance Thresholds
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Service Level</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead className="hidden md:table-cell">Clinical Harm</TableHead>
                <TableHead className="hidden lg:table-cell">Regulatory Breach</TableHead>
                <TableHead className="hidden lg:table-cell">Reputational Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {toleranceLevels.map(({ key, label, severity }) => {
                const tolerance = service.impactTolerances[key];
                return (
                  <TableRow key={key} className={cn(getSeverityStyles(severity))}>
                    <TableCell className="font-semibold">{label}</TableCell>
                    <TableCell className="text-sm">{tolerance.definition}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{tolerance.clinicalHarm}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{tolerance.regulatoryBreach}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm">{tolerance.reputationalImpact}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile view - show additional columns as cards */}
        <div className="md:hidden mt-4 space-y-4">
          {toleranceLevels.map(({ key, label, severity }) => {
            const tolerance = service.impactTolerances[key];
            return (
              <div 
                key={`mobile-${key}`} 
                className={cn('p-3 rounded-lg', getSeverityStyles(severity))}
              >
                <h4 className="font-semibold text-foreground mb-2">{label}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Clinical Harm: </span>
                    <span>{tolerance.clinicalHarm}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Regulatory: </span>
                    <span>{tolerance.regulatoryBreach}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Reputational: </span>
                    <span>{tolerance.reputationalImpact}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpactTolerancesCard;

import { memo } from 'react';
import { format } from 'date-fns';
import { CheckCircle, AlertTriangle, XCircle, Clock, Route, Shield } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';

interface ServiceDetailSheetProps {
  service: EssentialService | null;
  isOpen: boolean;
  onClose: () => void;
}

const ServiceDetailSheet = memo(({ service, isOpen, onClose }: ServiceDetailSheetProps) => {
  if (!service) return null;

  const getStatusConfig = () => {
    switch (service.status) {
      case 'operational':
        return {
          icon: CheckCircle,
          label: 'Operational',
          bgClass: 'bg-success',
          textClass: 'text-success-foreground',
          borderClass: 'border-success/30',
        };
      case 'degraded':
        return {
          icon: AlertTriangle,
          label: 'Degraded',
          bgClass: 'bg-warning',
          textClass: 'text-warning-foreground',
          borderClass: 'border-warning/30',
        };
      default:
        return {
          icon: XCircle,
          label: 'At Risk',
          bgClass: 'bg-destructive',
          textClass: 'text-destructive-foreground',
          borderClass: 'border-destructive/30',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-xl font-bold text-foreground">
              {service.name}
            </SheetTitle>
            <span
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
                statusConfig.bgClass,
                statusConfig.textClass
              )}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {statusConfig.label}
            </span>
          </div>
          <SheetDescription className="text-left">
            Essential service status and impact assessment
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current Status */}
          <div className={cn('p-4 rounded-lg border', statusConfig.borderClass, 'bg-muted/30')}>
            <h3 className="font-semibold text-sm text-foreground mb-2">Current Status</h3>
            <p className="text-sm text-muted-foreground">{service.reason}</p>
          </div>

          <Separator />

          {/* Impact Tolerance */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Impact Tolerance</h3>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-lg font-bold text-foreground">{service.impactTolerance}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum acceptable time for service disruption before escalation
              </p>
            </div>
          </div>

          <Separator />

          {/* Critical Pathways */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Critical Pathways</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {service.criticalPathways.map((pathway) => (
                <Badge key={pathway} variant="secondary" className="text-xs">
                  {pathway}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resilience Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Resilience Actions</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {service.status === 'operational' && (
                <>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Continue standard monitoring protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>Maintain current staffing levels</span>
                  </li>
                </>
              )}
              {service.status === 'degraded' && (
                <>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span>Activate contingency capacity plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span>Review mutual aid arrangements</span>
                  </li>
                </>
              )}
              {service.status === 'at-risk' && (
                <>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Escalate to on-call director immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Activate emergency protocols</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Last Updated */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {format(service.lastUpdated, 'dd MMM yyyy, HH:mm')}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

ServiceDetailSheet.displayName = 'ServiceDetailSheet';

export default ServiceDetailSheet;

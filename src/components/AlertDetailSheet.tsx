import { memo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Clock, Link as LinkIcon, Building2, ArrowRight, Calendar } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
interface AlertDetailSheetProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

const AlertDetailSheet = memo(({ alert, isOpen, onClose }: AlertDetailSheetProps) => {
  const navigate = useNavigate();
  
  if (!alert) return null;

  const isRed = alert.severity === 'red';
  const isAmber = alert.severity === 'amber';

  const severityConfig = isRed
    ? {
        icon: AlertCircle,
        label: 'Critical',
        bgClass: 'bg-destructive',
        textClass: 'text-destructive-foreground',
        borderClass: 'border-destructive/30',
      }
    : {
        icon: AlertTriangle,
        label: 'Warning',
        bgClass: 'bg-warning',
        textClass: 'text-warning-foreground',
        borderClass: 'border-warning/30',
      };

  const SeverityIcon = severityConfig.icon;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <SheetTitle className="text-xl font-bold text-foreground text-left pr-8">
              {alert.title}
            </SheetTitle>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                severityConfig.bgClass,
                severityConfig.textClass
              )}
            >
              <SeverityIcon className="h-3.5 w-3.5" />
              {severityConfig.label}
            </span>
            <Badge variant="secondary" className="text-xs">
              {alert.relatedCapital}
            </Badge>
          </div>
          <SheetDescription className="text-left">
            Risk alert details and recommended actions
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Alert Description */}
          <div className={cn('p-4 rounded-lg border', severityConfig.borderClass, 'bg-muted/30')}>
            <h3 className="font-semibold text-sm text-foreground mb-2">Description</h3>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>

          <Separator />

          {/* Timestamp */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Raised At</h3>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium text-foreground">
                {format(alert.timestamp, 'EEEE, dd MMMM yyyy')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {format(alert.timestamp, 'HH:mm:ss')}
              </p>
            </div>
          </div>

          <Separator />

          {/* Related Capital */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Related Capital</h3>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium text-foreground">{alert.relatedCapital}</p>
              <p className="text-xs text-muted-foreground mt-1">
                This alert impacts the {alert.relatedCapital.toLowerCase()} resilience dimension
              </p>
            </div>
          </div>

          <Separator />

          {/* Recommended Actions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Recommended Actions</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {isRed ? (
                <>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Escalate to on-call director immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Review impact tolerance thresholds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                    <span>Consider activating business continuity procedures</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span>Monitor situation closely for escalation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span>Review and prepare contingency plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <span>Brief relevant stakeholders</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          <Separator />

          {/* Action Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Actions</h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                onClick={() => {
                  onClose();
                  navigate('/services');
                }}
              >
                <span className="text-sm">Open in operational dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                onClick={() => {
                  onClose();
                  navigate('/scenarios/exercises');
                }}
              >
                <span className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Next Test
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Alert ID: {alert.id}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
});

AlertDetailSheet.displayName = 'AlertDetailSheet';

export default AlertDetailSheet;

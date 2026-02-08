import { memo, useCallback } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, AlertTriangle, Clock, Link as LinkIcon, Building2, ArrowRight, Calendar, Target } from 'lucide-react';
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
import { toast } from 'sonner';

interface RecommendedAction {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  owner: string;
}
interface AlertDetailSheetProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return { color: 'bg-destructive text-destructive-foreground', label: 'High' };
    case 'medium':
      return { color: 'bg-warning text-warning-foreground', label: 'Medium' };
    case 'low':
      return { color: 'bg-success text-success-foreground', label: 'Low' };
  }
};

const getAlertActions = (alert: Alert): RecommendedAction[] => {
  // Generate context-specific actions based on alert type and severity
  const baseActions: Record<string, RecommendedAction[]> = {
    'Financial': [
      { id: '1', title: 'Review current budget position and variance report', priority: 'high', owner: 'Finance Director' },
      { id: '2', title: 'Identify immediate cost reduction opportunities', priority: 'high', owner: 'COO' },
      { id: '3', title: 'Brief audit committee on financial position', priority: 'medium', owner: 'CFO' },
    ],
    'Operational': [
      { id: '1', title: 'Activate operational escalation protocol', priority: 'high', owner: 'On-Call Director' },
      { id: '2', title: 'Review capacity and demand forecasts', priority: 'high', owner: 'Operations Manager' },
      { id: '3', title: 'Coordinate with partner organisations', priority: 'medium', owner: 'Partnerships Lead' },
    ],
    'Human': [
      { id: '1', title: 'Activate agency staff agreements', priority: 'high', owner: 'HR Director' },
      { id: '2', title: 'Review staff redeployment options', priority: 'high', owner: 'Workforce Lead' },
      { id: '3', title: 'Brief staff-side representatives', priority: 'medium', owner: 'Employee Relations' },
    ],
    'Reputational': [
      { id: '1', title: 'Prepare communications holding statement', priority: 'high', owner: 'Communications Director' },
      { id: '2', title: 'Brief executive team and board chair', priority: 'high', owner: 'CEO' },
      { id: '3', title: 'Monitor social media and press coverage', priority: 'medium', owner: 'Media Team' },
    ],
    'Environmental': [
      { id: '1', title: 'Assess immediate estate risks', priority: 'high', owner: 'Estates Director' },
      { id: '2', title: 'Activate environmental contingency plans', priority: 'high', owner: 'Facilities Manager' },
      { id: '3', title: 'Coordinate with local emergency services', priority: 'medium', owner: 'Emergency Planning' },
    ],
  };
  
  return baseActions[alert.relatedCapital] || [
    { id: '1', title: 'Escalate to on-call director immediately', priority: 'high', owner: 'On-Call Director' },
    { id: '2', title: 'Review impact tolerance thresholds', priority: 'medium', owner: 'Risk Manager' },
    { id: '3', title: 'Consider activating business continuity procedures', priority: 'medium', owner: 'BCM Lead' },
  ];
};

const AlertDetailSheet = memo(({ alert, isOpen, onClose }: AlertDetailSheetProps) => {
  const navigate = useNavigate();
  
  const handleActionClick = useCallback((action: RecommendedAction) => {
    toast.info('Action planning feature coming soon', {
      description: `"${action.title}" will be available in a future update.`,
      duration: 3000
    });
  }, []);
  
  if (!alert) return null;

  const isRed = alert.severity === 'red';
  const isAmber = alert.severity === 'amber';
  
  const recommendedActions = getAlertActions(alert);

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
              <Target className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Recommended Actions</h3>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="divide-y divide-border/50">
                {recommendedActions.map((action, index) => {
                  const priorityConfig = getPriorityConfig(action.priority);
                  return (
                    <div
                      key={action.id}
                      className="group py-3 first:pt-0 last:pb-0 cursor-pointer"
                      onClick={() => handleActionClick(action)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-primary shrink-0 mt-0.5 w-5">
                          {index + 1}.
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground leading-snug group-hover:text-primary group-hover:underline transition-colors text-sm">
                            {action.title}
                          </p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className={cn('text-xs px-2 py-0.5', priorityConfig.color)}
                            >
                              {priorityConfig.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Owner: <span className="font-medium">{action.owner}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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

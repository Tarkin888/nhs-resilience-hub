import { memo, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, XCircle, Clock, Route, Shield, ArrowRight, Calendar, Target } from 'lucide-react';
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
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecommendedAction {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  owner: string;
}

interface ServiceDetailSheetProps {
  service: EssentialService | null;
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

const getServiceActions = (service: EssentialService): RecommendedAction[] => {
  // Generate context-specific actions based on service and status
  const serviceActionMap: Record<string, Record<string, RecommendedAction[]>> = {
    'Emergency Care': {
      operational: [
        { id: '1', title: 'Continue 4-hour target monitoring', priority: 'low', owner: 'A&E Clinical Lead' },
        { id: '2', title: 'Maintain staffing at current levels', priority: 'low', owner: 'Nursing Director' },
        { id: '3', title: 'Review daily capacity forecasts', priority: 'medium', owner: 'Site Manager' },
      ],
      degraded: [
        { id: '1', title: 'Activate surge capacity protocol', priority: 'high', owner: 'On-Call Director' },
        { id: '2', title: 'Request mutual aid from neighbouring trusts', priority: 'high', owner: 'Operations Manager' },
        { id: '3', title: 'Implement patient flow improvement measures', priority: 'medium', owner: 'Flow Coordinator' },
      ],
      'at-risk': [
        { id: '1', title: 'Declare internal critical incident', priority: 'high', owner: 'CEO' },
        { id: '2', title: 'Implement emergency patient diversion', priority: 'high', owner: 'Medical Director' },
        { id: '3', title: 'Brief board and regulators', priority: 'high', owner: 'Communications Director' },
      ],
    },
    'Elective Surgery': {
      operational: [
        { id: '1', title: 'Maintain theatre utilisation above 85%', priority: 'low', owner: 'Theatre Manager' },
        { id: '2', title: 'Continue waiting list validation', priority: 'low', owner: 'Elective Care Lead' },
      ],
      degraded: [
        { id: '1', title: 'Review and prioritise urgent cases', priority: 'high', owner: 'Medical Director' },
        { id: '2', title: 'Activate insourcing/outsourcing agreements', priority: 'high', owner: 'COO' },
        { id: '3', title: 'Communicate delays to affected patients', priority: 'medium', owner: 'Patient Services' },
      ],
      'at-risk': [
        { id: '1', title: 'Suspend non-urgent elective activity', priority: 'high', owner: 'CEO' },
        { id: '2', title: 'Reallocate theatre staff to emergency care', priority: 'high', owner: 'Nursing Director' },
      ],
    },
    'Mental Health Crisis': {
      operational: [
        { id: '1', title: 'Maintain S136 suite availability', priority: 'low', owner: 'MH Service Lead' },
        { id: '2', title: 'Continue partnership protocols with police', priority: 'low', owner: 'Partnerships Lead' },
      ],
      degraded: [
        { id: '1', title: 'Activate overflow arrangements', priority: 'high', owner: 'MH Crisis Team Lead' },
        { id: '2', title: 'Request additional crisis team capacity', priority: 'high', owner: 'HR Director' },
      ],
      'at-risk': [
        { id: '1', title: 'Escalate to Mental Health Act administrators', priority: 'high', owner: 'Medical Director' },
        { id: '2', title: 'Coordinate with police custody healthcare', priority: 'high', owner: 'Partnerships Lead' },
        { id: '3', title: 'Brief CQC on patient safety measures', priority: 'high', owner: 'Quality Director' },
      ],
    },
  };

  // Default actions based on status
  const defaultActions: Record<string, RecommendedAction[]> = {
    operational: [
      { id: '1', title: 'Continue standard monitoring protocols', priority: 'low', owner: 'Service Lead' },
      { id: '2', title: 'Maintain current staffing levels', priority: 'low', owner: 'Operations Manager' },
    ],
    degraded: [
      { id: '1', title: 'Activate contingency capacity plans', priority: 'high', owner: 'On-Call Director' },
      { id: '2', title: 'Review mutual aid arrangements', priority: 'high', owner: 'Partnerships Lead' },
      { id: '3', title: 'Brief affected service users', priority: 'medium', owner: 'Communications Team' },
    ],
    'at-risk': [
      { id: '1', title: 'Escalate to on-call director immediately', priority: 'high', owner: 'Site Manager' },
      { id: '2', title: 'Activate emergency protocols', priority: 'high', owner: 'Emergency Planning' },
      { id: '3', title: 'Consider external escalation to regulators', priority: 'high', owner: 'Quality Director' },
    ],
  };

  const serviceActions = serviceActionMap[service.name];
  if (serviceActions && serviceActions[service.status]) {
    return serviceActions[service.status];
  }
  return defaultActions[service.status] || defaultActions['operational'];
};

const ServiceDetailSheet = memo(({ service, isOpen, onClose }: ServiceDetailSheetProps) => {
  const navigate = useNavigate();
  
  const handleActionClick = useCallback((action: RecommendedAction) => {
    toast.info('Action planning feature coming soon', {
      description: `"${action.title}" will be available in a future update.`,
      duration: 3000
    });
  }, []);
  
  if (!service) return null;
  
  const recommendedActions = getServiceActions(service);

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
              <ArrowRight className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors"
                onClick={() => {
                  onClose();
                  navigate(`/services/${service.id}`);
                }}
              >
                <span className="text-sm">View full service details</span>
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
                  Schedule Resilience Test
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
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

import { cn } from '@/lib/utils';
import { type TestStatus } from '@/lib/scenarioLibraryData';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, HelpCircle } from 'lucide-react';

interface TestStatusIndicatorProps {
  status: TestStatus;
  lastTested?: Date;
  className?: string;
}

// Badge styling configuration with proper background colors
const statusBadgeConfig = {
  recent: {
    label: 'Recent',
    className: 'bg-success text-success-foreground',
    icon: CheckCircle,
  },
  'due-soon': {
    label: 'Due Soon',
    className: 'bg-warning text-warning-foreground',
    icon: Clock,
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-destructive text-destructive-foreground font-semibold',
    icon: AlertTriangle,
  },
  'never-tested': {
    label: 'Never Tested',
    className: 'bg-muted text-muted-foreground italic',
    icon: HelpCircle,
  },
} as const;

export function TestStatusIndicator({ status, lastTested, className }: TestStatusIndicatorProps) {
  const config = statusBadgeConfig[status];
  const Icon = config.icon;
  
  const formattedDate = lastTested 
    ? format(lastTested, 'd MMM yyyy')
    : 'Never';
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span className="text-muted-foreground">Last tested: {formattedDate}</span>
      <span 
        className={cn(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs whitespace-nowrap',
          config.className
        )}
        role="status"
        aria-label={`Test status: ${config.label}`}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {config.label}
      </span>
    </span>
  );
}

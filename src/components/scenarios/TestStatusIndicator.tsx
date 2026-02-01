import { cn } from '@/lib/utils';
import { type TestStatus } from '@/lib/scenarioLibraryData';
import { format, differenceInDays, addDays } from 'date-fns';
import { AlertTriangle, CheckCircle, Clock, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TestStatusIndicatorProps {
  status: TestStatus;
  lastTested?: Date;
  className?: string;
}

// Annual testing cycle - tests are due within 365 days
const TESTING_CYCLE_DAYS = 365;
const DUE_SOON_THRESHOLD_DAYS = 270; // Due soon starts at 270 days

// Calculate days until test is due (overdue)
function calculateDaysUntilDue(lastTested?: Date): number | null {
  if (!lastTested) return null;
  const dueDate = addDays(lastTested, TESTING_CYCLE_DAYS);
  return differenceInDays(dueDate, new Date());
}

// Get dynamic label for due-soon status
function getDueSoonLabel(lastTested?: Date): string {
  const daysRemaining = calculateDaysUntilDue(lastTested);
  if (daysRemaining === null) return 'Due Soon';
  if (daysRemaining <= 0) return 'Overdue';
  if (daysRemaining === 1) return 'Due in 1 day';
  return `Due in ${daysRemaining} days`;
}

// Badge styling configuration with proper background colors
const statusBadgeConfig = {
  recent: {
    label: 'Recent',
    className: 'bg-success text-success-foreground',
    icon: CheckCircle,
    tooltip: 'Test completed within the last 9 months. Next test due in over 90 days.',
  },
  'due-soon': {
    label: 'Due Soon',
    className: 'bg-warning text-warning-foreground',
    icon: Clock,
    tooltip: 'Annual test approaching deadline. Schedule testing within the displayed timeframe.',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-destructive text-destructive-foreground font-semibold',
    icon: AlertTriangle,
    tooltip: 'Annual testing deadline has passed. Immediate action required to maintain compliance.',
  },
  'never-tested': {
    label: 'Never Tested',
    className: 'bg-muted text-muted-foreground italic',
    icon: HelpCircle,
    tooltip: 'This scenario has never been tested. Schedule an initial test to establish baseline.',
  },
} as const;

export function TestStatusIndicator({ status, lastTested, className }: TestStatusIndicatorProps) {
  const config = statusBadgeConfig[status];
  const Icon = config.icon;
  
  const formattedDate = lastTested 
    ? format(lastTested, 'd MMM yyyy')
    : 'Never';
  
  // For due-soon status, show dynamic "Due in X days" label
  const displayLabel = status === 'due-soon' 
    ? getDueSoonLabel(lastTested) 
    : config.label;
  
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs', className)}>
      <span className="text-muted-foreground">Last tested: {formattedDate}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs whitespace-nowrap cursor-help',
                config.className
              )}
              role="status"
              aria-label={`Test status: ${displayLabel}`}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              {displayLabel}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[250px] text-center">
            <p className="text-sm">{config.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </span>
  );
}

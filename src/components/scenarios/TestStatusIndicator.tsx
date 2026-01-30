import { cn } from '@/lib/utils';
import { testStatusStyles, type TestStatus } from '@/lib/scenarioLibraryData';
import { format } from 'date-fns';

interface TestStatusIndicatorProps {
  status: TestStatus;
  lastTested?: Date;
  className?: string;
}

export function TestStatusIndicator({ status, lastTested, className }: TestStatusIndicatorProps) {
  const style = testStatusStyles[status];
  
  const formattedDate = lastTested 
    ? format(lastTested, 'd MMM yyyy')
    : 'Never';
  
  return (
    <span className={cn('text-xs', className)}>
      <span className="text-muted-foreground">Last tested: {formattedDate}</span>
      {style.show && (
        <span className={cn('ml-1', style.color)}>
          {style.text}
        </span>
      )}
    </span>
  );
}

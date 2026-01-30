import { cn } from '@/lib/utils';
import { severityStyles, type Severity } from '@/lib/scenarioLibraryData';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const style = severityStyles[severity];
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
        style.bg,
        style.text,
        className
      )}
    >
      {style.label}
    </span>
  );
}

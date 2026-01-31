import { memo } from 'react';
import { CapitalHistoryPoint } from '@/lib/capitalHistoryData';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface HistoricalSparklineProps {
  history: CapitalHistoryPoint[];
  className?: string;
}

type TrendDirection = 'improving' | 'declining' | 'stable';

const getTrendDirection = (historyPoints: CapitalHistoryPoint[]): TrendDirection => {
  if (historyPoints.length < 2) return 'stable';
  
  const oldest = historyPoints[0].score;
  const current = historyPoints[historyPoints.length - 1].score;
  const difference = current - oldest;
  
  if (difference < -3) return 'declining';
  if (difference > 3) return 'improving';
  return 'stable';
};

const getTrendColorClass = (trend: TrendDirection): string => {
  switch (trend) {
    case 'declining':
      return 'text-destructive'; // #DC2626
    case 'improving':
      return 'text-success'; // #10B981
    case 'stable':
    default:
      return 'text-muted-foreground'; // grey
  }
};

const formatSparkline = (historyPoints: CapitalHistoryPoint[]): string => {
  return historyPoints
    .slice(-4) // Take last 4 points
    .map(point => point.score)
    .join(' → ');
};

const HistoricalSparkline = memo(({ history, className }: HistoricalSparklineProps) => {
  if (!history || history.length === 0) return null;

  const trend = getTrendDirection(history);
  const colorClass = getTrendColorClass(trend);
  const sparklineText = formatSparkline(history);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'text-[10px] md:text-[11px] font-normal cursor-help transition-opacity hover:opacity-80',
            colorClass,
            className
          )}
          aria-label={`Historical trend: ${sparklineText}, trend is ${trend}`}
        >
          {sparklineText}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-[200px] p-3 bg-[hsl(var(--tooltip-dark))] text-[hsl(var(--tooltip-dark-foreground))] border-0"
      >
        <div className="space-y-1.5 text-xs">
          <div className="font-semibold text-sm mb-2">Historical Trend</div>
          {history.slice(-4).map((point, index) => (
            <div key={index} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{point.assessmentPeriod}:</span>
              <span className="font-medium">
                {point.score}
                {index === history.length - 1 && (
                  <span className="text-muted-foreground ml-1">(Current)</span>
                )}
              </span>
            </div>
          ))}
          <div className={cn('mt-2 pt-2 border-t border-white/20 font-medium capitalize', colorClass)}>
            Trend: {trend}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

HistoricalSparkline.displayName = 'HistoricalSparkline';

export default HistoricalSparkline;

import { memo } from 'react';
import { CapitalHistoryPoint } from '@/lib/capitalHistoryData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

const getMiniChartColor = (trend: TrendDirection): string => {
  switch (trend) {
    case 'declining':
      return '#DC2626';
    case 'improving':
      return '#10B981';
    case 'stable':
    default:
      return '#9CA3AF';
  }
};

const getTrendArrow = (trend: TrendDirection): string => {
  switch (trend) {
    case 'declining':
      return '↘';
    case 'improving':
      return '↗';
    case 'stable':
    default:
      return '→';
  }
};

// Generate SVG path for mini sparkline chart
const generateSparklinePath = (points: number[]): string => {
  if (points.length < 2) return '';
  
  const width = 24;
  const height = 10;
  const padding = 1;
  
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  
  const xStep = (width - padding * 2) / (points.length - 1);
  
  const pathPoints = points.map((point, index) => {
    const x = padding + index * xStep;
    const y = height - padding - ((point - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });
  
  return `M ${pathPoints.join(' L ')}`;
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
  const chartColor = getMiniChartColor(trend);
  const trendArrow = getTrendArrow(trend);
  const sparklineText = formatSparkline(history);
  const scores = history.slice(-4).map(h => h.score);
  const sparklinePath = generateSparklinePath(scores);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex items-center gap-1.5 text-[10px] md:text-[11px] font-medium cursor-help transition-opacity hover:opacity-80',
            colorClass,
            className
          )}
          aria-label={`Historical trend: ${sparklineText}, trend is ${trend}`}
        >
          {/* Mini sparkline chart */}
          <svg 
            width="24" 
            height="10" 
            viewBox="0 0 24 10" 
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <path
              d={sparklinePath}
              fill="none"
              stroke={chartColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Trend arrow and scores */}
          <span>
            <span className="mr-0.5">{trendArrow}</span>
            {sparklineText}
          </span>
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

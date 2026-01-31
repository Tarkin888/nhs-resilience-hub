import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { EnhancedKRI } from '@/types/capitalDetails';
import KRIProgressBar from './KRIProgressBar';
import KRIInfoTooltip from './KRIInfoTooltip';
import { cn } from '@/lib/utils';

interface EnhancedKRICardProps {
  kri: EnhancedKRI;
}

const getBorderColor = (status: 'red' | 'amber' | 'green') => {
  switch (status) {
    case 'red':
      return 'border-l-[hsl(var(--status-red))]';
    case 'amber':
      return 'border-l-[hsl(var(--status-amber))]';
    case 'green':
      return 'border-l-[hsl(var(--status-green))]';
    default:
      return 'border-l-muted';
  }
};

const getTrendConfig = (trend: 'improving' | 'worsening' | 'stable') => {
  switch (trend) {
    case 'improving':
      return {
        icon: TrendingUp,
        text: 'Improving',
        color: 'text-[hsl(var(--status-green))]',
        symbol: '↑'
      };
    case 'worsening':
      return {
        icon: TrendingDown,
        text: 'Worsening',
        color: 'text-[hsl(var(--status-red))]',
        symbol: '↓'
      };
    default:
      return {
        icon: Minus,
        text: 'Stable',
        color: 'text-muted-foreground',
        symbol: '→'
      };
  }
};

const EnhancedKRICard = memo(({ kri }: EnhancedKRICardProps) => {
  const trendConfig = getTrendConfig(kri.trend);
  const TrendIcon = trendConfig.icon;

  return (
    <div
      className={cn(
        'bg-card rounded-lg border shadow-sm p-4 border-l-4 hover:shadow-md transition-shadow',
        getBorderColor(kri.status)
      )}
    >
      {/* Header Row: Name, Value, Info Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground text-base leading-tight">
            {kri.name}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-foreground">
            {kri.value}
          </span>
          <KRIInfoTooltip dataSource={kri.dataSource} status={kri.status} />
        </div>
      </div>

      {/* Target Row */}
      {kri.target && (
        <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="text-xs">🎯</span>
          <span>Target: {kri.target}</span>
        </div>
      )}

      {/* Trend Row */}
      <div className={cn('mt-2 flex items-center gap-1.5 text-sm font-medium', trendConfig.color)}>
        <TrendIcon className="h-4 w-4" />
        <span>{trendConfig.text}</span>
      </div>

      {/* Commentary */}
      <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {kri.commentary}
      </p>

      {/* Progress Bar */}
      {kri.showProgressBar && kri.numericValue !== undefined && kri.numericTarget !== undefined && (
        <KRIProgressBar
          currentValue={kri.numericValue}
          targetValue={kri.numericTarget}
          status={kri.status}
        />
      )}
    </div>
  );
});

EnhancedKRICard.displayName = 'EnhancedKRICard';

export default EnhancedKRICard;

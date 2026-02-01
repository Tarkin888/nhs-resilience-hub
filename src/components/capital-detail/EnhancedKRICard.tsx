import { memo } from 'react';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { EnhancedKRI } from '@/types/capitalDetails';
import KRIProgressBar from './KRIProgressBar';
import KRIInfoTooltip from './KRIInfoTooltip';
import { cn } from '@/lib/utils';

interface EnhancedKRICardProps {
  kri: EnhancedKRI;
  index?: number;
  compact?: boolean;
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

const sourceTypeBadgeConfig: Record<string, { label: string; dotColor: string }> = {
  public: {
    label: 'Public Data',
    dotColor: 'bg-[hsl(var(--source-public))]',
  },
  cqc: {
    label: 'CQC Reports',
    dotColor: 'bg-[hsl(var(--source-cqc))]',
  },
  standard: {
    label: 'Industry Standard',
    dotColor: 'bg-[hsl(var(--source-standard))]',
  },
  assessment: {
    label: 'Assessment',
    dotColor: 'bg-[hsl(var(--source-assessment))]',
  },
  demo: {
    label: 'Demo Data',
    dotColor: 'bg-[hsl(var(--source-demo))]',
  },
};

const EnhancedKRICard = memo(({ kri, index = 0, compact = false }: EnhancedKRICardProps) => {
  const trendConfig = getTrendConfig(kri.trend);
  const TrendIcon = trendConfig.icon;
  const sourceBadge = sourceTypeBadgeConfig[kri.dataSource.sourceType] || sourceTypeBadgeConfig.demo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={cn(
        'bg-card rounded-lg border shadow-sm border-l-4 hover:shadow-md hover:bg-accent/30 transition-all duration-200',
        getBorderColor(kri.status),
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Header Row: Name, Value, Info Icon */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'font-semibold text-foreground leading-tight',
            compact ? 'text-sm' : 'text-base'
          )}>
            {kri.name}
          </h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            'font-bold text-foreground',
            compact ? 'text-lg' : 'text-xl'
          )}>
            {kri.value}
          </span>
          <KRIInfoTooltip dataSource={kri.dataSource} status={kri.status} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/50 my-3" />

      {/* Target + Trend Row */}
      <div className={cn(
        'flex flex-wrap items-center gap-4',
        compact ? 'text-xs' : 'text-sm'
      )}>
        {kri.target && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Target className={cn(compact ? 'h-3 w-3' : 'h-4 w-4')} />
            <span>Target: {kri.target}</span>
          </div>
        )}
        
        <div className={cn('flex items-center gap-1.5 font-medium', trendConfig.color)}>
          <TrendIcon className={cn(compact ? 'h-3 w-3' : 'h-4 w-4')} />
          <span>{trendConfig.text}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {kri.showProgressBar && kri.numericValue !== undefined && kri.numericTarget !== undefined && (
        <KRIProgressBar
          currentValue={kri.numericValue}
          targetValue={kri.numericTarget}
          status={kri.status}
        />
      )}

      {/* Commentary */}
      <p className={cn(
        'text-muted-foreground leading-relaxed',
        compact ? 'mt-2 text-xs line-clamp-2' : 'mt-3 text-sm line-clamp-3'
      )}>
        {kri.commentary}
      </p>

      {/* Footer: Source Badge + Last Updated */}
      <div className="border-t border-border/50 mt-3 pt-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className={cn('w-2 h-2 rounded-full', sourceBadge.dotColor)} />
            <span>{sourceBadge.label}</span>
          </div>
          <span>Updated {format(kri.dataSource.lastUpdated, 'd MMM yyyy')}</span>
        </div>
      </div>
    </motion.div>
  );
});

EnhancedKRICard.displayName = 'EnhancedKRICard';

export default EnhancedKRICard;

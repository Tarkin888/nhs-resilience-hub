import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bed, UserX, Shield, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

const stats: StatCard[] = [
  {
    icon: Bed,
    label: 'Current bed occupancy',
    value: '87%',
    trend: 'stable',
    trendLabel: 'Stable',
  },
  {
    icon: UserX,
    label: 'Staff vacancies',
    value: '156 FTE',
    trend: 'up',
    trendLabel: '+12 this month',
  },
  {
    icon: Shield,
    label: 'Days since last major incident',
    value: '23',
  },
  {
    icon: Calendar,
    label: 'Next resilience test',
    value: '15 Dec 2025',
  },
];

const StatCardItem = memo(({ stat, index }: { stat: StatCard; index: number }) => {
  const getTrendIcon = useCallback((trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-destructive" aria-hidden="true" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-success" aria-hidden="true" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />;
      default:
        return null;
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card rounded-lg border shadow-card px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-3 transition-all duration-300 hover:shadow-card-hover"
    >
      <div 
        className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] md:text-xs text-muted-foreground truncate">
          {stat.label}
        </p>
        <div className="flex items-center gap-1 md:gap-2">
          <p className="text-base md:text-lg font-bold text-foreground truncate">
            {stat.value}
          </p>
          {stat.trend && (
            <div className="flex items-center gap-1" aria-label={`Trend: ${stat.trendLabel || stat.trend}`}>
              {getTrendIcon(stat.trend)}
              {stat.trendLabel && (
                <span className={cn(
                  'text-[10px] md:text-xs hidden xl:inline',
                  stat.trend === 'up' && 'text-destructive',
                  stat.trend === 'down' && 'text-success',
                  stat.trend === 'stable' && 'text-muted-foreground'
                )}>
                  {stat.trendLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

StatCardItem.displayName = 'StatCardItem';

const QuickStatsBar = memo(() => {
  return (
    <div className="bg-[hsl(var(--stats-bar))] border-b">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {stats.map((stat, index) => (
            <StatCardItem key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
});

QuickStatsBar.displayName = 'QuickStatsBar';

export default QuickStatsBar;

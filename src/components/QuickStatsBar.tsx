import { memo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bed, UserX, Shield, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAnimatedValue } from '@/hooks/useAnimatedValue';
import LiveMonitoringBadge from './LiveMonitoringBadge';
import InfoTooltip, { DataSourceInfo, SourceType } from './common/InfoTooltip';

interface StatCard {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  isDynamic?: boolean;
  dataSource: DataSourceInfo;
}

interface StatCardItemProps {
  stat: StatCard;
  index: number;
  isHighlighted?: boolean;
}

// Source type dot colors
const sourceTypeDotClass: Record<SourceType, string> = {
  public: 'bg-[hsl(var(--source-public))]',
  cqc: 'bg-[hsl(var(--source-cqc))]',
  standard: 'bg-[hsl(var(--source-standard))]',
  assessment: 'bg-[hsl(var(--source-assessment))]',
  demo: 'bg-[hsl(var(--source-demo))]',
};

const StatCardItem = memo(({ stat, index, isHighlighted }: StatCardItemProps) => {
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
      className={cn(
        "bg-card rounded-lg border shadow-card px-3 md:px-4 py-2.5 md:py-3 flex items-center gap-2 md:gap-3 transition-all duration-300 hover:shadow-card-hover",
        isHighlighted && "ring-2 ring-warning/50 bg-warning/5"
      )}
      aria-live={stat.isDynamic ? "polite" : undefined}
    >
      <div 
        className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          {/* Source type dot indicator */}
          <span 
            className={cn('w-1.5 h-1.5 rounded-full shrink-0', sourceTypeDotClass[stat.dataSource.sourceType])} 
            aria-hidden="true"
          />
          <p className="text-[11px] md:text-xs text-muted-foreground truncate">
            {stat.label}
          </p>
          <InfoTooltip dataSource={stat.dataSource} position="bottom" className="ml-0" />
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <p className="text-base md:text-lg font-bold text-foreground truncate">
            {stat.value}{stat.suffix || ''}
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

// Data source information for quick stats
const quickStatsDataSources: Record<string, DataSourceInfo> = {
  bedOccupancy: {
    source: 'NHS England Monthly Statistics (National Winter Average)',
    sourceType: 'public',
    lastUpdated: new Date('2025-01-24'),
    methodology: 'National average for acute trusts during winter period',
    sourceUrl: 'https://www.england.nhs.uk/statistics/'
  },
  staffVacancies: {
    source: 'Representative of large acute trust vacancy levels (NHS England Workforce Stats)',
    sourceType: 'demo',
    lastUpdated: new Date('2025-01-24'),
    methodology: 'Illustrative data based on national workforce statistics patterns'
  },
  daysSinceIncident: {
    source: 'Internal incident log (illustrative)',
    sourceType: 'demo',
    lastUpdated: new Date('2025-01-24')
  },
  nextTest: {
    source: 'Resilience testing schedule',
    sourceType: 'assessment',
    lastUpdated: new Date('2025-01-24'),
    methodology: 'Scheduled exercises aligned with NHS England resilience guidance'
  }
};

const QuickStatsBar = memo(() => {
  // Dynamic values with occasional updates
  const [bedOccupancy, setBedOccupancy] = useState(87);
  const [staffVacancies, setStaffVacancies] = useState(156);
  const [highlightedStat, setHighlightedStat] = useState<string | null>(null);

  // Animated display values for smooth transitions
  const animatedBedOccupancy = useAnimatedValue(bedOccupancy, 400);
  const animatedStaffVacancies = useAnimatedValue(staffVacancies, 400);

  // Random updates every 30-90 seconds
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // 30% chance to update bed occupancy
      if (Math.random() < 0.3) {
        setBedOccupancy(prev => {
          const change = Math.random() > 0.5 
            ? Math.floor(Math.random() * 2) + 1 
            : -(Math.floor(Math.random() * 2) + 1);
          const newValue = prev + change;
          // Keep between 80-94% (realistic range)
          return Math.max(80, Math.min(94, newValue));
        });
        setHighlightedStat('bed');
        setTimeout(() => setHighlightedStat(null), 1500);
      }

      // 25% chance to update staff vacancies
      if (Math.random() < 0.25) {
        setStaffVacancies(prev => {
          const change = Math.random() > 0.5 
            ? Math.floor(Math.random() * 3) + 1 
            : -(Math.floor(Math.random() * 3) + 1);
          const newValue = prev + change;
          // Keep between 140-170 FTE (realistic range)
          return Math.max(140, Math.min(170, newValue));
        });
        setHighlightedStat('staff');
        setTimeout(() => setHighlightedStat(null), 1500);
      }
    }, 45000); // Every 45 seconds

    return () => clearInterval(updateInterval);
  }, []);

  const stats: StatCard[] = [
    {
      id: 'bedOccupancy',
      icon: Bed,
      label: 'Current bed occupancy',
      value: animatedBedOccupancy,
      suffix: '%',
      trend: 'stable',
      trendLabel: 'Stable',
      isDynamic: true,
      dataSource: quickStatsDataSources.bedOccupancy,
    },
    {
      id: 'staffVacancies',
      icon: UserX,
      label: 'Staff vacancies',
      value: `${animatedStaffVacancies} FTE`,
      trend: 'up',
      trendLabel: '+12 this month',
      isDynamic: true,
      dataSource: quickStatsDataSources.staffVacancies,
    },
    {
      id: 'daysSinceIncident',
      icon: Shield,
      label: 'Days since last major incident',
      value: '23',
      dataSource: quickStatsDataSources.daysSinceIncident,
    },
    {
      id: 'nextTest',
      icon: Calendar,
      label: 'Next resilience test',
      value: '15 Mar 2026',
      dataSource: quickStatsDataSources.nextTest,
    },
  ];

  return (
    <div className="bg-[hsl(var(--stats-bar))] border-b">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-4">
          {/* Live Monitoring Badge */}
          <div className="flex-shrink-0">
            <LiveMonitoringBadge />
          </div>
          
          {/* Quick Stats Grid */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            {stats.map((stat, index) => (
              <StatCardItem 
                key={stat.id} 
                stat={stat} 
                index={index}
                isHighlighted={
                  (stat.id === 'bedOccupancy' && highlightedStat === 'bed') ||
                  (stat.id === 'staffVacancies' && highlightedStat === 'staff')
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

QuickStatsBar.displayName = 'QuickStatsBar';

export default QuickStatsBar;

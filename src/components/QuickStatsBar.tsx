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

const QuickStatsBar = () => {
  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-destructive" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-success" />;
      case 'stable':
        return <Minus className="h-3 w-3 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[hsl(var(--stats-bar))] border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-lg border px-4 py-3 flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">
                  {stat.label}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-foreground truncate">
                    {stat.value}
                  </p>
                  {stat.trend && (
                    <div className="flex items-center gap-1">
                      {getTrendIcon(stat.trend)}
                      {stat.trendLabel && (
                        <span className={cn(
                          'text-xs hidden xl:inline',
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStatsBar;

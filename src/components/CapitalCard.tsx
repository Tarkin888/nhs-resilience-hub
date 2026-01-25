import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { Capital } from '@/types';
import { cn } from '@/lib/utils';

interface CapitalCardProps {
  capital: Capital;
  index: number;
}

const CapitalCard = memo(({ capital, index }: CapitalCardProps) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'green':
        return 'bg-success';
      case 'amber':
        return 'bg-warning';
      case 'red':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  }, []);

  const getStatusBadgeClass = useCallback((status: string) => {
    switch (status) {
      case 'green':
        return 'status-badge-green';
      case 'amber':
        return 'status-badge-amber';
      case 'red':
        return 'status-badge-red';
      default:
        return '';
    }
  }, []);

  const getTrendIcon = useCallback((trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-success" aria-hidden="true" />;
      case 'declining':
        return <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" aria-hidden="true" />;
      default:
        return <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" aria-hidden="true" />;
    }
  }, []);

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning-foreground';
    return 'text-destructive';
  }, []);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="capital-card group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      tabIndex={0}
      role="button"
      aria-label={`${capital.name} capital - Score: ${capital.score}/100, Status: ${capital.status}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log('View capital:', capital.id);
        }
      }}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={cn('w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full', getStatusColor(capital.status))} aria-hidden="true" />
          <h3 className="font-semibold text-foreground text-sm sm:text-base">{capital.name}</h3>
        </div>
        <span className={cn('status-badge text-[10px] sm:text-xs', getStatusBadgeClass(capital.status))}>
          {capital.status.charAt(0).toUpperCase() + capital.status.slice(1)}
        </span>
      </div>

      <div className="flex items-end justify-between mb-3 sm:mb-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Resilience Score</p>
          <p className={cn('text-2xl sm:text-3xl font-bold', getScoreColor(capital.score))}>
            {capital.score}
            <span className="text-base sm:text-lg text-muted-foreground">/100</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
          {getTrendIcon(capital.trend)}
          <span className="capitalize">{capital.trend}</span>
        </div>
      </div>

      <div className="border-t pt-3 sm:pt-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-2">Key Risk Indicators</p>
        <div className="space-y-1.5 sm:space-y-2">
          {capital.kris.slice(0, 2).map((kri, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-foreground truncate mr-2">{kri.name}</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{kri.value}</span>
                {getTrendIcon(kri.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 sm:mt-4 flex items-center text-xs sm:text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        View Details <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" aria-hidden="true" />
      </div>
    </motion.article>
  );
});

CapitalCard.displayName = 'CapitalCard';

export default CapitalCard;

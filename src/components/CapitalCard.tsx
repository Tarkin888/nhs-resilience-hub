import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { Capital } from '@/types';
import { cn } from '@/lib/utils';

interface CapitalCardProps {
  capital: Capital;
  index: number;
}

const CapitalCard = ({ capital, index }: CapitalCardProps) => {
  const getStatusColor = (status: string) => {
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
  };

  const getStatusBadgeClass = (status: string) => {
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
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning-foreground';
    return 'text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="capital-card group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-3 h-3 rounded-full', getStatusColor(capital.status))} />
          <h3 className="font-semibold text-foreground">{capital.name}</h3>
        </div>
        <span className={cn('status-badge', getStatusBadgeClass(capital.status))}>
          {capital.status.charAt(0).toUpperCase() + capital.status.slice(1)}
        </span>
      </div>

      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Resilience Score</p>
          <p className={cn('text-3xl font-bold', getScoreColor(capital.score))}>
            {capital.score}
            <span className="text-lg text-muted-foreground">/100</span>
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {getTrendIcon(capital.trend)}
          <span className="capitalize">{capital.trend}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-sm text-muted-foreground mb-2">Key Risk Indicators</p>
        <div className="space-y-2">
          {capital.kris.slice(0, 2).map((kri, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-foreground truncate mr-2">{kri.name}</span>
              <div className="flex items-center gap-1">
                <span className="font-medium">{kri.value}</span>
                {getTrendIcon(kri.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        View Details <ChevronRight className="h-4 w-4 ml-1" />
      </div>
    </motion.div>
  );
};

export default CapitalCard;

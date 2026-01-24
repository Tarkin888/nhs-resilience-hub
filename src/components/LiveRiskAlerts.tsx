import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { Button } from '@/components/ui/button';

interface LiveRiskAlertsProps {
  alerts: Alert[];
}

const LiveRiskAlerts = ({ alerts }: LiveRiskAlertsProps) => {
  // Sort alerts by severity (red first) then by timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.severity === 'red' && b.severity !== 'red') return -1;
    if (a.severity !== 'red' && b.severity === 'red') return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const formatTimestamp = (date: Date) => {
    const timeStr = format(date, 'HH:mm');
    if (isToday(date)) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday(date)) {
      return `Yesterday, ${timeStr}`;
    }
    return format(date, 'dd MMM, HH:mm');
  };

  const redAlertCount = alerts.filter((a) => a.severity === 'red').length;
  const totalCount = alerts.length;

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Live Risk Alerts</h2>
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
            {totalCount}
          </span>
        </div>
        {redAlertCount > 0 && (
          <span className="text-xs text-destructive font-medium">
            {redAlertCount} critical
          </span>
        )}
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {sortedAlerts.map((alert, index) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            index={index}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
};

interface AlertCardProps {
  alert: Alert;
  index: number;
  formatTimestamp: (date: Date) => string;
}

const AlertCard = ({ alert, index, formatTimestamp }: AlertCardProps) => {
  const isRed = alert.severity === 'red';
  const isAmber = alert.severity === 'amber';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'flex items-start gap-4 p-4 rounded-lg border-l-4 bg-background transition-all duration-200 hover:shadow-md cursor-pointer',
        isRed && 'border-l-destructive',
        isAmber && 'border-l-warning'
      )}
    >
      {/* Severity Icon */}
      <motion.div
        animate={isRed ? { scale: [1, 1.05, 1] } : {}}
        transition={isRed ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isRed && 'bg-destructive/10',
          isAmber && 'bg-warning/20'
        )}
      >
        {isRed ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-warning-foreground" />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-base leading-tight">
          {alert.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {alert.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(alert.timestamp)}
          </span>
          <span className="text-xs text-primary font-medium">
            {alert.relatedCapital}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => console.log('View details:', alert.id)}
      >
        View Details
        <ChevronRight className="h-3 w-3 ml-1" />
      </Button>
    </motion.div>
  );
};

export default LiveRiskAlerts;

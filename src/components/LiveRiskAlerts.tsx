import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ChevronRight } from 'lucide-react';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { Button } from '@/components/ui/button';
import AlertDetailSheet from './AlertDetailSheet';

interface LiveRiskAlertsProps {
  alerts: Alert[];
}

const AlertCard = memo(({ alert, index, formatTimestamp, onViewDetails }: {
  alert: Alert;
  index: number;
  formatTimestamp: (date: Date) => string;
  onViewDetails: (alert: Alert) => void;
}) => {
  const isRed = alert.severity === 'red';
  const isAmber = alert.severity === 'amber';

  const handleClick = () => onViewDetails(alert);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        'flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border-l-4 bg-background transition-all duration-300 hover:shadow-card-hover cursor-pointer',
        isRed && 'border-l-destructive',
        isAmber && 'border-l-warning'
      )}
      role="article"
      aria-label={`${isRed ? 'Critical' : 'Warning'} alert: ${alert.title}`}
      onClick={handleClick}
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
        aria-hidden="true"
      >
        {isRed ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-warning-foreground" />
        )}
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm sm:text-base leading-tight">
          {alert.title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
          {alert.description}
        </p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {formatTimestamp(alert.timestamp)}
          </span>
          <span className="text-[10px] sm:text-xs text-primary font-medium">
            {alert.relatedCapital}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="ghost"
        size="sm"
        className="flex-shrink-0 text-xs text-muted-foreground hover:text-foreground self-start sm:self-center focus:ring-2 focus:ring-primary focus:ring-offset-2"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        aria-label={`View alert details: ${alert.title}`}
      >
        <span className="hidden sm:inline">View Alert</span>
        <span className="sm:hidden">View</span>
        <ChevronRight className="h-3 w-3 ml-1" aria-hidden="true" />
      </Button>
    </motion.div>
  );
});

AlertCard.displayName = 'AlertCard';

const LiveRiskAlerts = memo(({ alerts }: LiveRiskAlertsProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sort alerts by severity (red first) then by timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (a.severity === 'red' && b.severity !== 'red') return -1;
    if (a.severity !== 'red' && b.severity === 'red') return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const formatTimestamp = useCallback((date: Date) => {
    const timeStr = format(date, 'HH:mm');
    if (isToday(date)) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday(date)) {
      return `Yesterday, ${timeStr}`;
    }
    return format(date, 'dd MMM, HH:mm');
  }, []);

  const handleViewDetails = useCallback((alert: Alert) => {
    setSelectedAlert(alert);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const redAlertCount = alerts.filter((a) => a.severity === 'red').length;
  const totalCount = alerts.length;

  return (
    <section 
      className="bg-card rounded-lg shadow-card border p-4 sm:p-6 h-full transition-all duration-300 hover:shadow-card-hover"
      aria-labelledby="risk-alerts-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 id="risk-alerts-heading" className="text-lg sm:text-xl font-bold text-foreground">
            Live Risk Alerts
          </h2>
          <span 
            className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-bold"
            aria-label={`${totalCount} total alerts`}
          >
            {totalCount}
          </span>
        </div>
        {redAlertCount > 0 && (
          <span className="text-[10px] sm:text-xs text-destructive font-medium">
            {redAlertCount} critical
          </span>
        )}
      </div>

      {/* Alert Cards */}
      <div className="space-y-2 sm:space-y-3">
        {sortedAlerts.map((alert, index) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            index={index}
            formatTimestamp={formatTimestamp}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Alert Detail Sheet */}
      <AlertDetailSheet
        alert={selectedAlert}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </section>
  );
});

LiveRiskAlerts.displayName = 'LiveRiskAlerts';

export default LiveRiskAlerts;

import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AlertPanelProps {
  alerts: Alert[];
}

const AlertPanel = ({ alerts }: AlertPanelProps) => {
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'red':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'amber':
        return <AlertCircle className="h-5 w-5 text-warning-foreground" />;
      case 'green':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case 'red':
        return 'border-l-destructive';
      case 'amber':
        return 'border-l-warning';
      case 'green':
        return 'border-l-success';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Active Alerts</h2>
        <span className="text-sm text-muted-foreground">{alerts.length} alerts</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={cn('alert-card', getBorderColor(alert.severity))}
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-foreground text-sm">{alert.title}</h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-primary font-medium">
                    {alert.relatedCapital} Capital
                  </span>
                  <a
                    href={alert.actionUrl}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Take Action <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;

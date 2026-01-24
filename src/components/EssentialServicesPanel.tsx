import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';

interface EssentialServicesPanelProps {
  services: EssentialService[];
}

const EssentialServicesPanel = ({ services }: EssentialServicesPanelProps) => {
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

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">Essential Services Status</h2>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: EssentialService;
  index: number;
  formatTimestamp: (date: Date) => string;
}

const ServiceCard = ({ service, index, formatTimestamp }: ServiceCardProps) => {
  const isOperational = service.status === 'operational';
  const isDegraded = service.status === 'degraded';
  const isAtRisk = service.status === 'at-risk';

  const getStatusConfig = () => {
    if (isOperational) {
      return {
        icon: CheckCircle,
        label: 'Operational',
        bgClass: 'bg-success',
        textClass: 'text-success-foreground',
      };
    }
    if (isDegraded) {
      return {
        icon: AlertTriangle,
        label: 'Degraded',
        bgClass: 'bg-warning',
        textClass: 'text-warning-foreground',
      };
    }
    return {
      icon: XCircle,
      label: 'At Risk',
      bgClass: 'bg-destructive',
      textClass: 'text-destructive-foreground',
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="bg-background border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col min-h-[180px]"
      onClick={() => console.log('View service:', service.id)}
    >
      {/* Header with name and status */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-foreground text-base leading-tight">
          {service.name}
        </h3>
        <span
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
            statusConfig.bgClass,
            statusConfig.textClass
          )}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {statusConfig.label}
        </span>
      </div>

      {/* Reason */}
      <p className="text-sm text-muted-foreground flex-1 line-clamp-3">
        {service.reason}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <span className="text-xs text-muted-foreground">
          {formatTimestamp(service.lastUpdated)}
        </span>
        <button
          className="text-xs text-primary hover:underline flex items-center gap-0.5"
          onClick={(e) => {
            e.stopPropagation();
            console.log('View details:', service.id);
          }}
        >
          View Details
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};

export default EssentialServicesPanel;

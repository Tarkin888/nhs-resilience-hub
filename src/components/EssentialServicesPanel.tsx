import { memo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, ChevronRight, Info } from 'lucide-react';
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import ServiceDetailSheet from './ServiceDetailSheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface EssentialServicesPanelProps {
  services: EssentialService[];
}

const ServiceCard = memo(({ service, index, formatTimestamp, onViewDetails }: {
  service: EssentialService;
  index: number;
  formatTimestamp: (date: Date) => string;
  onViewDetails: (service: EssentialService) => void;
}) => {
  const isOperational = service.status === 'operational';
  const isDegraded = service.status === 'degraded';

  const getStatusConfig = useCallback(() => {
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
  }, [isOperational, isDegraded]);

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const handleClick = () => onViewDetails(service);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="bg-background border rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-card-hover cursor-pointer flex flex-col min-h-[140px] sm:min-h-[180px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      onClick={handleClick}
      tabIndex={0}
      role="button"
      aria-label={`${service.name} - Status: ${statusConfig.label}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Header with name and status */}
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <h3 className="font-bold text-foreground text-sm sm:text-base leading-tight">
          {service.name}
        </h3>
        <span
          className={cn(
            'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap',
            statusConfig.bgClass,
            statusConfig.textClass
          )}
        >
          <StatusIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
          {statusConfig.label}
        </span>
      </div>

      {/* Reason */}
      <p className="text-xs sm:text-sm text-muted-foreground flex-1 line-clamp-2 sm:line-clamp-3">
        {service.reason}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t">
        <span className="text-[10px] sm:text-xs text-muted-foreground">
          {formatTimestamp(service.lastUpdated)}
        </span>
        <button
          className="text-[10px] sm:text-xs text-primary hover:underline flex items-center gap-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label={`View status details for ${service.name}`}
        >
          View Status
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
});

ServiceCard.displayName = 'ServiceCard';

const EssentialServicesPanel = memo(({ services }: EssentialServicesPanelProps) => {
  const [selectedService, setSelectedService] = useState<EssentialService | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const handleViewDetails = useCallback((service: EssentialService) => {
    setSelectedService(service);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  return (
    <section 
      className="bg-card rounded-lg shadow-card border p-4 sm:p-6 h-full transition-all duration-300 hover:shadow-card-hover"
      aria-labelledby="essential-services-heading"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 id="essential-services-heading" className="text-lg sm:text-xl font-bold text-foreground">
            Essential Services Status
          </h2>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Learn about impact tolerances"
              >
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              align="start"
              className="max-w-xs p-4 bg-[hsl(var(--tooltip-dark))] text-[hsl(var(--tooltip-dark-foreground))] border-0"
            >
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Impact Tolerance:</p>
                <p className="text-xs text-muted-foreground">
                  Maximum acceptable disruption before serious harm occurs. For example:
                </p>
                <ul className="text-xs space-y-1 ml-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-success mt-0.5">●</span>
                    <span><strong>85-95%</strong> meeting 4hr standard = Degraded Service</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-warning mt-0.5">●</span>
                    <span><strong>Below 85%</strong> = Minimum Viable Service (serious harm risk)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-destructive mt-0.5">●</span>
                    <span><strong>Below 75%</strong> = Service Failure (Board escalation)</span>
                  </li>
                </ul>
                <a 
                  href="/services" 
                  className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                >
                  View full impact tolerance framework →
                </a>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            formatTimestamp={formatTimestamp}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Service Detail Sheet */}
      <ServiceDetailSheet
        service={selectedService}
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
      />
    </section>
  );
});

EssentialServicesPanel.displayName = 'EssentialServicesPanel';

export default EssentialServicesPanel;

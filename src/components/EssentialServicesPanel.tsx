import { memo, useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Info, 
  Clock,
  Activity,
  Scissors,
  Brain,
  Baby,
  Microscope,
  HeartPulse,
  Zap,
  Users
} from 'lucide-react';
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ServiceDetailSheet from './ServiceDetailSheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EssentialServicesPanelProps {
  services: EssentialService[];
}

// Map service IDs to their corresponding icons
const serviceIconMap: Record<string, React.ElementType> = {
  'es-1': Activity,        // Emergency Care
  'es-2': Scissors,        // Elective Surgery
  'es-3': Brain,           // Mental Health Crisis
  'es-4': Baby,            // Maternity Services
  'es-5': Microscope,      // Diagnostics
  'es-6': HeartPulse,      // Critical Care
  'es-7': Zap,             // Stroke Services
  'es-8': Users,           // Children's Services
  'emergency-care': Activity,
  'elective-surgery': Scissors,
  'mental-health-crisis': Brain,
  'maternity-services': Baby,
  'diagnostics': Microscope,
  'critical-care': HeartPulse,
  'stroke-services': Zap,
  'childrens-services': Users,
};

// Utility function for relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Updated just now';
  if (diffMins === 1) return 'Updated 1 min ago';
  if (diffMins < 60) return `Updated ${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return 'Updated 1 hour ago';
  if (diffHours < 24) return `Updated ${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Updated 1 day ago';
  return `Updated ${diffDays} days ago`;
}

const ServiceCard = memo(({ service, index, onViewDetails, updateTrigger }: {
  service: EssentialService;
  index: number;
  onViewDetails: (service: EssentialService) => void;
  updateTrigger: number;
}) => {
  const isOperational = service.status === 'operational';
  const isDegraded = service.status === 'degraded';

  const getStatusConfig = useCallback(() => {
    if (isOperational) {
      return {
        icon: CheckCircle,
        label: 'Operational',
        bgClass: 'bg-success/10',
        textClass: 'text-success',
        borderClass: 'border-l-success',
      };
    }
    if (isDegraded) {
      return {
        icon: AlertTriangle,
        label: 'Degraded',
        bgClass: 'bg-warning/20',
        textClass: 'text-warning-foreground',
        borderClass: 'border-l-warning',
      };
    }
    return {
      icon: XCircle,
      label: 'At Risk',
      bgClass: 'bg-destructive/10',
      textClass: 'text-destructive',
      borderClass: 'border-l-destructive',
    };
  }, [isOperational, isDegraded]);

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;
  const ServiceIcon = serviceIconMap[service.id] || Activity;

  const handleClick = () => onViewDetails(service);

  // Format absolute timestamp for tooltip
  const absoluteTimestamp = format(service.lastUpdated, "d MMM yyyy, HH:mm");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={cn(
        "bg-background border rounded-lg p-4 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border-l-4",
        statusConfig.borderClass
      )}
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
      {/* Header with icon and name */}
      <div className="flex items-center gap-2 mb-3">
        <ServiceIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" aria-hidden="true" />
        <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight">
          {service.name}
        </h3>
      </div>

      {/* Status Badge */}
      <div className="mb-2">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold',
            statusConfig.bgClass,
            statusConfig.textClass
          )}
          role="status"
          aria-label={`Status: ${statusConfig.label}`}
        >
          <StatusIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
          {statusConfig.label}
        </span>
      </div>

      {/* Status Explanation */}
      <p className="text-sm text-muted-foreground flex-1 line-clamp-2 mb-3">
        {service.reason}
      </p>

      {/* Footer with timestamp and action */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {getRelativeTime(service.lastUpdated)}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Last updated: {absoluteTimestamp}
          </TooltipContent>
        </Tooltip>
        <button
          className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-0.5 font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          aria-label={`View details for ${service.name}`}
        >
          View Details
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
});

ServiceCard.displayName = 'ServiceCard';

const EssentialServicesPanel = memo(({ services }: EssentialServicesPanelProps) => {
  const [selectedService, setSelectedService] = useState<EssentialService | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Auto-update timestamps every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = useCallback((service: EssentialService) => {
    setSelectedService(service);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  // Count services by status
  const atRiskCount = services.filter(s => s.status === 'at-risk').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;

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
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                aria-label="Learn about impact tolerances"
              >
                <Info className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              side="bottom" 
              align="start"
              className="w-80 p-4 z-[9999]"
              sideOffset={8}
            >
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-foreground">Impact Tolerance:</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Maximum acceptable disruption before serious harm occurs. For example:
                </p>
                <ul className="text-xs space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-0.5 text-base">●</span>
                    <span className="text-foreground"><strong>85-95%</strong> meeting 4hr standard = Degraded Service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-warning mt-0.5 text-base">●</span>
                    <span className="text-foreground"><strong>Below 85%</strong> = Minimum Viable Service (serious harm risk)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-0.5 text-base">●</span>
                    <span className="text-foreground"><strong>Below 75%</strong> = Service Failure (Board escalation)</span>
                  </li>
                </ul>
                <a 
                  href="/services" 
                  className="text-xs text-primary hover:underline flex items-center gap-1 pt-2 border-t border-border mt-3"
                >
                  View full impact tolerance framework →
                </a>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Status Summary Badges */}
        <div className="flex items-center gap-2">
          {atRiskCount > 0 && (
            <span 
              className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded"
              aria-label={`${atRiskCount} services at risk`}
            >
              {atRiskCount} At Risk
            </span>
          )}
          {degradedCount > 0 && (
            <span 
              className="px-2 py-1 bg-warning text-warning-foreground text-xs font-medium rounded"
              aria-label={`${degradedCount} services degraded`}
            >
              {degradedCount} Degraded
            </span>
          )}
        </div>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={index}
            onViewDetails={handleViewDetails}
            updateTrigger={updateTrigger}
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

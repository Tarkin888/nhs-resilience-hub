import { motion } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { EssentialService } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ServiceStatusProps {
  services: EssentialService[];
}

const ServiceStatus = ({ services }: ServiceStatusProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'degraded':
        return <Activity className="h-5 w-5 text-warning-foreground" />;
      case 'at-risk':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = 'status-badge';
    switch (status) {
      case 'operational':
        return cn(baseClass, 'status-badge-green');
      case 'degraded':
        return cn(baseClass, 'status-badge-amber');
      case 'at-risk':
        return cn(baseClass, 'status-badge-red');
      default:
        return baseClass;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'at-risk':
        return 'At Risk';
      default:
        return status;
    }
  };

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Essential Services</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Operational</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">Degraded</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">At Risk</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <h3 className="font-medium text-foreground">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{service.reason}</p>
                </div>
              </div>
              <span className={getStatusBadge(service.status)}>
                {getStatusLabel(service.status)}
              </span>
            </div>

            <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Impact Tolerance:</span>{' '}
                {service.impactTolerance}
              </div>
              <div>
                <span className="font-medium text-foreground">Updated:</span>{' '}
                {format(service.lastUpdated, 'HH:mm')}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {service.criticalPathways.map((pathway, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                >
                  {pathway}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceStatus;

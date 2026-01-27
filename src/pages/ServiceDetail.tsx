import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  ChevronRight, 
  ChevronLeft, 
  Pencil, 
  Calendar,
  Info
} from 'lucide-react';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getServiceById } from '@/lib/servicesData';
import { cn } from '@/lib/utils';
import DataSourcesModal from '@/components/DataSourcesModal';

// Import service detail section components
import ServiceDefinitionCard from '@/components/services/ServiceDefinitionCard';
import ImpactTolerancesCard from '@/components/services/ImpactTolerancesCard';
import PerformanceMetricsCard from '@/components/services/PerformanceMetricsCard';
import DependenciesCard from '@/components/services/DependenciesCard';
import ResilienceTestingCard from '@/components/services/ResilienceTestingCard';
import ContingencyPlansCard from '@/components/services/ContingencyPlansCard';

const ServiceDetail = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);

  const service = serviceId ? getServiceById(serviceId) : undefined;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const getStatusConfig = (status: string) => {
    return {
      operational: { 
        label: 'Operational', 
        className: 'bg-success text-success-foreground',
        dotColor: 'bg-success'
      },
      degraded: { 
        label: 'Degraded', 
        className: 'bg-warning text-warning-foreground',
        dotColor: 'bg-warning'
      },
      'at-risk': { 
        label: 'At Risk', 
        className: 'bg-destructive text-destructive-foreground',
        dotColor: 'bg-destructive'
      },
    }[status] || { label: status, className: '', dotColor: '' };
  };

  const statusConfig = getStatusConfig(service.status);

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner 
        onOpenMethodology={() => setIsMethodologyOpen(true)} 
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
      />
      
      <Header 
        isMethodologyOpen={isMethodologyOpen} 
        onMethodologyOpenChange={setIsMethodologyOpen}
        onStartTour={() => setIsTourOpen(true)}
      />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/services" className="hover:text-foreground transition-colors">
            Essential Services
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{service.name}</span>
        </nav>

        {/* Back Button */}
        <Link 
          to="/services"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {/* Header Section */}
        <header className="bg-card rounded-lg border shadow-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {service.name}
                </h1>
                <Badge className={cn('text-sm px-3 py-1', statusConfig.className)}>
                  <span className={cn('w-2 h-2 rounded-full mr-2', statusConfig.dotColor)} />
                  {statusConfig.label}
                </Badge>
              </div>
              
              <p className="text-muted-foreground mb-4">{service.statusReason}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last updated:</span>
                  <span className="font-medium">
                    {format(service.lastUpdated, 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Executive Owner:</span>
                  <span className="font-medium">{service.executiveOwner}</span>
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Service
            </Button>
          </div>
        </header>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Service Definition */}
          <ServiceDefinitionCard service={service} />

          {/* Impact Tolerances */}
          <ImpactTolerancesCard service={service} />

          {/* Performance Metrics */}
          <PerformanceMetricsCard service={service} />

          {/* Dependencies */}
          <DependenciesCard service={service} />

          {/* Resilience Testing */}
          <ResilienceTestingCard service={service} />

          {/* Contingency Plans */}
          <ContingencyPlansCard service={service} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 St. Mary's NHS Foundation Trust. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link to="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <DataSourcesModal isOpen={isDataSourcesOpen} onClose={() => setIsDataSourcesOpen(false)} />
    </div>
  );
};

export default ServiceDetail;

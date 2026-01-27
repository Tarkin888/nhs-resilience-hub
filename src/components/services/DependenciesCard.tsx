import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Network, 
  ChevronDown, 
  Building2, 
  Wrench, 
  Monitor, 
  Users,
  Truck,
  Zap,
  Handshake,
  AlertTriangle
} from 'lucide-react';
import { DetailedEssentialService, Dependency, DependencyType } from '@/types/services';
import { cn } from '@/lib/utils';

interface DependenciesCardProps {
  service: DetailedEssentialService;
}

const getTypeIcon = (type: DependencyType) => {
  const icons: Record<DependencyType, React.ReactNode> = {
    facility: <Building2 className="h-4 w-4" />,
    equipment: <Wrench className="h-4 w-4" />,
    it: <Monitor className="h-4 w-4" />,
    staff: <Users className="h-4 w-4" />,
    supplier: <Truck className="h-4 w-4" />,
    utility: <Zap className="h-4 w-4" />,
    partner: <Handshake className="h-4 w-4" />,
  };
  return icons[type] || null;
};

const getCriticalityBadge = (criticality: string) => {
  const config = {
    critical: { label: 'Critical', className: 'bg-destructive text-destructive-foreground' },
    high: { label: 'High', className: 'bg-warning text-warning-foreground' },
    medium: { label: 'Medium', className: 'bg-secondary text-secondary-foreground' },
    low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  }[criticality] || { label: criticality, className: '' };

  return (
    <Badge variant="outline" className={cn('text-xs', config.className)}>
      {config.label}
    </Badge>
  );
};

const DependencyItem = ({ dependency }: { dependency: Dependency }) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-between p-3 rounded-lg border transition-colors',
        dependency.singlePointOfFailure && 'border-destructive bg-destructive/5'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          {getTypeIcon(dependency.type)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{dependency.name}</span>
            {dependency.singlePointOfFailure && (
              <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                <AlertTriangle className="h-3 w-3" />
                SPOF
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground capitalize">{dependency.type}</span>
        </div>
      </div>
      {getCriticalityBadge(dependency.criticality)}
    </div>
  );
};

const DependencySection = ({ 
  title, 
  dependencies, 
  defaultOpen = true 
}: { 
  title: string; 
  dependencies: Dependency[];
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const spofCount = dependencies.filter(d => d.singlePointOfFailure).length;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{title}</span>
          <Badge variant="secondary" className="text-xs">
            {dependencies.length}
          </Badge>
          {spofCount > 0 && (
            <Badge className="text-xs bg-destructive text-destructive-foreground">
              {spofCount} SPOF
            </Badge>
          )}
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform',
          isOpen && 'rotate-180'
        )} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 space-y-2">
          {dependencies.map((dep, index) => (
            <DependencyItem key={index} dependency={dep} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const DependenciesCard = ({ service }: DependenciesCardProps) => {
  const allDependencies = [...service.internalDependencies, ...service.externalDependencies];
  const spofDependencies = allDependencies.filter(d => d.singlePointOfFailure);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          Dependencies
          {spofDependencies.length > 0 && (
            <Badge className="ml-2 bg-destructive text-destructive-foreground">
              {spofDependencies.length} Single Points of Failure
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DependencySection 
          title="Internal Dependencies" 
          dependencies={service.internalDependencies}
        />
        <DependencySection 
          title="External Dependencies" 
          dependencies={service.externalDependencies}
        />

        {/* Visual Dependency Map */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-semibold text-foreground mb-4">Dependency Map</h4>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Center node */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <span className="text-xs font-semibold text-center px-2 text-primary">
                  {service.name}
                </span>
              </div>
              
              {/* Connected nodes */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                {spofDependencies.slice(0, 1).map((dep, i) => (
                  <div 
                    key={i}
                    className="w-16 h-16 rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center"
                  >
                    <span className="text-[10px] font-medium text-center px-1 text-destructive">
                      {dep.name.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="text-xs space-y-2 ml-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary border border-primary" />
                <span className="text-muted-foreground">This Service</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/50 border border-destructive" />
                <span className="text-muted-foreground">Single Point of Failure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted border border-border" />
                <span className="text-muted-foreground">Standard Dependency</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DependenciesCard;

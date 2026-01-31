import { memo } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Info } from 'lucide-react';
import { DataSource, KRIStatus } from '@/types/capitalDetails';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

interface KRIInfoTooltipProps {
  dataSource: DataSource;
  status: KRIStatus;
}

const getStatusColor = (status: KRIStatus) => {
  switch (status) {
    case 'red':
      return 'text-[hsl(var(--status-red))] hover:text-[hsl(var(--status-red))]/80';
    case 'amber':
      return 'text-[hsl(var(--status-amber))] hover:text-[hsl(var(--status-amber))]/80';
    case 'green':
      return 'text-[hsl(var(--status-green))] hover:text-[hsl(var(--status-green))]/80';
    default:
      return 'text-muted-foreground';
  }
};

const KRIInfoTooltip = memo(({ dataSource, status }: KRIInfoTooltipProps) => {
  return (
    <HoverCard openDelay={300}>
      <HoverCardTrigger asChild>
        <button
          className={cn(
            'transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full p-0.5',
            getStatusColor(status)
          )}
          aria-label="View data source information"
        >
          <Info className="h-4 w-4" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-4 bg-[hsl(var(--tooltip-dark))] text-[hsl(var(--tooltip-dark-foreground))] border-0 shadow-lg"
        side="left"
        align="start"
      >
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Data Source</span>
            <p className="font-medium mt-0.5">{dataSource.name}</p>
          </div>
          
          {dataSource.nationalAverage && (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">National Average</span>
              <p className="font-medium mt-0.5">{dataSource.nationalAverage}</p>
            </div>
          )}
          
          {dataSource.trustValue && (
            <div>
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Trust Value</span>
              <p className="font-medium mt-0.5">{dataSource.trustValue}</p>
            </div>
          )}
          
          <div>
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Last Updated</span>
            <p className="font-medium mt-0.5">{format(dataSource.lastUpdated, 'd MMM yyyy')}</p>
          </div>
          
          {dataSource.url && (
            <a
              href={dataSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors mt-2"
            >
              View Full Data Source
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
});

KRIInfoTooltip.displayName = 'KRIInfoTooltip';

export default KRIInfoTooltip;

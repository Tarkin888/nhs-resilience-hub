import { memo, useState } from 'react';
import { format } from 'date-fns';
import { ExternalLink, Info, X } from 'lucide-react';
import { DataSource, KRIStatus } from '@/types/capitalDetails';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface KRIInfoTooltipProps {
  dataSource: DataSource;
  status: KRIStatus;
}

const sourceTypeConfig: Record<string, { label: string; className: string }> = {
  public: {
    label: 'Public NHS Data',
    className: 'bg-[hsl(var(--source-public))] text-white',
  },
  cqc: {
    label: 'CQC Reports',
    className: 'bg-[hsl(var(--source-cqc))] text-white',
  },
  standard: {
    label: 'Industry Standards',
    className: 'bg-[hsl(var(--source-standard))] text-[hsl(var(--foreground))]',
  },
  assessment: {
    label: 'ResilienC Assessment',
    className: 'bg-[hsl(var(--source-assessment))] text-white',
  },
  demo: {
    label: 'Illustrative Demo Data',
    className: 'bg-[hsl(var(--source-demo))] text-white',
  },
};

const KRIInfoTooltip = memo(({ dataSource, status }: KRIInfoTooltipProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const sourceConfig = sourceTypeConfig[dataSource.sourceType] || sourceTypeConfig.demo;

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };

  return (
    <Tooltip 
      open={isMobile ? isOpen : undefined} 
      onOpenChange={isMobile ? setIsOpen : undefined}
      delayDuration={200}
    >
      <TooltipTrigger asChild>
        <button
          onClick={handleTriggerClick}
          className={cn(
            'inline-flex items-center justify-center p-0.5 rounded-full',
            'text-[hsl(var(--info-icon))] hover:text-[hsl(var(--info-icon-hover))]',
            'transition-colors duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
          )}
          aria-label="View data source information"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        sideOffset={8}
        className={cn(
          'z-[1000] max-w-[320px] p-0 border-0',
          'bg-[hsl(var(--tooltip-dark))] text-[hsl(var(--tooltip-dark-foreground))]',
          'rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        onPointerDownOutside={() => isMobile && setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <div className="p-3 space-y-2.5 text-sm" role="tooltip">
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close tooltip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          
          {/* Source Name */}
          <div>
            <span className="text-white/60 text-xs uppercase tracking-wider">Data Source</span>
            <p className="font-semibold text-white mt-0.5">{dataSource.name}</p>
          </div>
          
          {/* Divider */}
          <div className="border-t border-white/20" />
          
          {/* Source Type Badge + Last Updated */}
          <div className="flex items-center justify-between gap-3">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-xs font-medium',
              sourceConfig.className
            )}>
              {sourceConfig.label}
            </span>
            <span className="text-white/70 text-xs">
              {format(dataSource.lastUpdated, 'd MMM yyyy')}
            </span>
          </div>
          
          {/* National Average & Trust Value */}
          {(dataSource.nationalAverage || dataSource.trustValue) && (
            <>
              <div className="border-t border-white/20" />
              <div className="grid grid-cols-2 gap-2">
                {dataSource.nationalAverage && (
                  <div>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider">National Avg</span>
                    <p className="font-medium text-white text-xs mt-0.5">{dataSource.nationalAverage}</p>
                  </div>
                )}
                {dataSource.trustValue && (
                  <div>
                    <span className="text-white/60 text-[10px] uppercase tracking-wider">Trust Value</span>
                    <p className="font-medium text-white text-xs mt-0.5">{dataSource.trustValue}</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Methodology */}
          {dataSource.methodology && (
            <>
              <div className="border-t border-white/20" />
              <p className="text-white/80 text-xs leading-relaxed">
                {dataSource.methodology}
              </p>
            </>
          )}
          
          {/* Source URL Link */}
          {dataSource.url && (
            <a
              href={dataSource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors text-xs font-medium mt-1"
            >
              View Full Source
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

KRIInfoTooltip.displayName = 'KRIInfoTooltip';

export default KRIInfoTooltip;

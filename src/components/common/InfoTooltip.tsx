import { memo, useState } from 'react';
import { format } from 'date-fns';
import { Info, ExternalLink, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

export type SourceType = 'public' | 'cqc' | 'standard' | 'assessment' | 'demo';

export interface DataSourceInfo {
  source: string;
  sourceType: SourceType;
  lastUpdated: Date;
  methodology?: string;
  sourceUrl?: string;
}

export interface InfoTooltipProps {
  dataSource: DataSourceInfo;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const sourceTypeConfig: Record<SourceType, { label: string; className: string }> = {
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

const InfoTooltip = memo(({ dataSource, position = 'top', className }: InfoTooltipProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  
  const sourceConfig = sourceTypeConfig[dataSource.sourceType];

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
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
          onKeyDown={handleKeyDown}
          className={cn(
            'inline-flex items-center justify-center ml-1.5 p-0.5 rounded-full',
            'text-[hsl(var(--info-icon))] hover:text-[hsl(var(--info-icon-hover))]',
            'transition-colors duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1',
            className
          )}
          aria-label="View data source information"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side={position}
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
            <p className="font-semibold text-white mt-0.5">{dataSource.source}</p>
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
          {dataSource.sourceUrl && (
            <a
              href={dataSource.sourceUrl}
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

InfoTooltip.displayName = 'InfoTooltip';

export default InfoTooltip;

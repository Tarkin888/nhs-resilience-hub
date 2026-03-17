import { memo, useState } from 'react';
import { Info, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export interface ProvenanceInfo {
  tab: string;
  providerName: string;
  providerCode: string;
  period: string;
  fieldDescription: string;
  testName?: string;
  sourceUrl?: string;
}

const DataProvenanceTooltip = memo(({ tab, providerName, providerCode, period, fieldDescription, testName }: ProvenanceInfo) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const fileName = `Monthly Diagnostics – Provider – ${period} (XLS)`;

  const handleClick = (e: React.MouseEvent) => {
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
          onClick={handleClick}
          className={cn(
            'inline-flex items-center justify-center p-0.5 rounded-full',
            'text-[#757575] hover:text-[#1976D2]',
            'transition-colors duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1'
          )}
          aria-label="View data provenance"
        >
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        sideOffset={8}
        className={cn(
          'z-[1000] max-w-[380px] p-3 border-0',
          'bg-[#1E293B] text-white',
          'rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.3)]',
          'animate-in fade-in-0 zoom-in-95 duration-200'
        )}
        onPointerDownOutside={() => isMobile && setIsOpen(false)}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <div className="space-y-1.5 text-xs leading-relaxed" role="tooltip">
          <p><span className="mr-1.5">📄</span><span className="text-white/60">File:</span> {fileName}</p>
          <p><span className="mr-1.5">📑</span><span className="text-white/60">Tab:</span> {tab}</p>
          <p><span className="mr-1.5">🏥</span><span className="text-white/60">Provider:</span> {providerName} ({providerCode})</p>
          {testName && (
            <p><span className="mr-1.5">🔬</span><span className="text-white/60">Test:</span> {testName}</p>
          )}
          <p><span className="mr-1.5">📊</span><span className="text-white/60">Field:</span> {fieldDescription}</p>
          <p><span className="mr-1.5">🔗</span><span className="text-white/60">Source:</span>{' '}
            <a
              href="https://www.england.nhs.uk/statistics/statistical-work-areas/diagnostics-waiting-times-and-activity/monthly-diagnostics-waiting-times-and-activity/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-[#93C5FD] hover:text-white transition-colors cursor-pointer"
            >
              NHS England DM01 Monthly Diagnostics
              <ExternalLink className="inline-block ml-1 h-3 w-3" aria-hidden="true" />
            </a>
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
});

DataProvenanceTooltip.displayName = 'DataProvenanceTooltip';

export default DataProvenanceTooltip;

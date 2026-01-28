import { BarChart3, Info, ExternalLink, Target } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DemoBannerProps {
  onOpenMethodology: () => void;
  onOpenDataSources: () => void;
}

const DemoBanner = ({ onOpenMethodology, onOpenDataSources }: DemoBannerProps) => {
  return (
    <div className="bg-demo text-demo-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center justify-center gap-2 text-sm">
        {/* Main line with pulsing icon */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="animate-pulse">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <span className="font-bold tracking-wide">DEMO MODE</span>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <span className="text-center">
            Illustrative data for St. Mary's NHS Foundation Trust
          </span>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <span className="font-medium text-primary">ResilienC Framework + xPercept.ai</span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="ml-1 hover:text-primary transition-colors">
                <Info className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm">
              <p>
                This demonstration uses a combination of public NHS data and 
                illustrative trust-level data to show realistic resilience assessment
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Second line - data verification hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Every metric has a data source — hover over</span>
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">ⓘ</span>
          <span>icons to verify</span>
        </div>

        {/* Links row */}
        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={onOpenMethodology}
            className="flex items-center gap-1 hover:underline hover:text-primary transition-colors"
          >
            Methodology Guide
            <ExternalLink className="h-3 w-3" />
          </button>
          <button 
            onClick={onOpenDataSources}
            className="flex items-center gap-1 hover:underline hover:text-primary transition-colors"
          >
            Data Sources
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;

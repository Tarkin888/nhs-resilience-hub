import { BarChart3, Info, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DemoBannerProps {
  onOpenMethodology: () => void;
}

const DemoBanner = ({ onOpenMethodology }: DemoBannerProps) => {
  return (
    <div className="bg-demo text-demo-foreground">
      <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="font-semibold">DEMO MODE</span>
          <span className="hidden sm:inline">|</span>
          <span className="text-center sm:text-left">
            Illustrative Data for St. Mary's NHS Foundation Trust
          </span>
          
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

        <div className="flex items-center gap-4 text-xs">
          <button 
            onClick={onOpenMethodology}
            className="flex items-center gap-1 hover:underline hover:text-primary transition-colors"
          >
            Methodology Guide
            <ExternalLink className="h-3 w-3" />
          </button>
          <a 
            href="#data-sources" 
            className="flex items-center gap-1 hover:underline hover:text-primary transition-colors"
          >
            Data Sources
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;

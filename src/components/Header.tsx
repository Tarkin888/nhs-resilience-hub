import { HelpCircle, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import MethodologyPanel from './MethodologyPanel';

interface HeaderProps {
  isMethodologyOpen: boolean;
  onMethodologyOpenChange: (open: boolean) => void;
  onStartTour: () => void;
}

const Header = ({ isMethodologyOpen, onMethodologyOpenChange, onStartTour }: HeaderProps) => {
  return (
    <>
      <header data-tour="header" className="bg-card border-b shadow-card">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            {/* Left: Title */}
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                NHS Trust Resilience Command Centre
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                St. Mary's NHS Foundation Trust
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="text-[10px] sm:text-xs text-muted-foreground">
                <span className="hidden sm:inline">Last updated: </span>
                <span className="font-medium text-foreground">
                  {format(new Date(), 'dd MMM yyyy, HH:mm')}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open methodology guide"
                onClick={() => onMethodologyOpenChange(true)}
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </Button>

              <Button 
                size="sm" 
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2" 
                onClick={onStartTour}
                aria-label="Start demo walkthrough"
              >
                <PlayCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Demo Walkthrough</span>
                <span className="sm:hidden">Demo</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MethodologyPanel
        isOpen={isMethodologyOpen}
        onClose={() => onMethodologyOpenChange(false)}
      />
    </>
  );
};

export default Header;

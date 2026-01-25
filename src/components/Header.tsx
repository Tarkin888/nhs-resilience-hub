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
      <header data-tour="header" className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Left: Title */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary">
                NHS Trust Resilience Command Centre
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                St. Mary's NHS Foundation Trust
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-xs text-muted-foreground">
                <span className="hidden sm:inline">Last updated: </span>
                <span className="font-medium text-foreground">
                  {format(new Date(), 'dd MMM yyyy, HH:mm')}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Methodology"
                onClick={() => onMethodologyOpenChange(true)}
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              <Button size="sm" className="gap-2" onClick={onStartTour}>
                <PlayCircle className="h-4 w-4" />
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

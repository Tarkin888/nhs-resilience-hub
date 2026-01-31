import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HelpCircle, ClipboardList, FlaskConical, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import MethodologyPanel from './MethodologyPanel';
import BoardReportModal from './BoardReportModal';
import LiveClock from './LiveClock';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isMethodologyOpen: boolean;
  onMethodologyOpenChange: (open: boolean) => void;
}

const Header = ({ isMethodologyOpen, onMethodologyOpenChange }: HeaderProps) => {
  const location = useLocation();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  const isServicesActive = location.pathname.startsWith('/services');
  const isScenariosActive = location.pathname.startsWith('/scenarios');

  return (
    <>
      <header data-tour="header" className="bg-card border-b shadow-card">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            {/* Left: Title and Nav */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <Link to="/" className="group">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  NHS Trust Resilience Command Centre
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  St. Mary's NHS Foundation Trust
                </p>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-1 sm:gap-2">
                <Link
                  to="/"
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
                    location.pathname === '/' 
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  Dashboard
                  {location.pathname === '/' && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
                <Link
                  to="/services"
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5",
                    isServicesActive
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ClipboardList className="h-4 w-4" />
                  <span className="hidden sm:inline">Essential Services</span>
                  <span className="sm:hidden">Services</span>
                  {isServicesActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
                <Link
                  to="/scenarios/exercises"
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5",
                    isScenariosActive
                      ? "text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <FlaskConical className="h-4 w-4" />
                  <span className="hidden sm:inline">Scenario Testing</span>
                  <span className="sm:hidden">Scenarios</span>
                  {isScenariosActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              </nav>
            </div>

            {/* Right: Live Clock and Actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Live Clock */}
              <LiveClock />

              {/* Generate Board Report Button */}
              <Button
                variant="default"
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-4 gap-1.5 font-semibold bg-primary hover:bg-primary/90"
                onClick={() => setIsReportModalOpen(true)}
              >
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span className="hidden lg:inline">Generate Board Report</span>
                <span className="hidden md:inline lg:hidden">Board Report</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 sm:h-9 sm:w-9 p-0 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Open methodology guide"
                onClick={() => onMethodologyOpenChange(true)}
              >
                <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MethodologyPanel
        isOpen={isMethodologyOpen}
        onClose={() => onMethodologyOpenChange(false)}
      />

      <BoardReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
};

export default Header;

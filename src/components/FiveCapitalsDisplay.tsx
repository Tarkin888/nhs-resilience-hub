import { useState, memo, useCallback } from 'react';
import { Capital } from '@/types';
import { HelpCircle } from 'lucide-react';
import CapitalScoreCircle from './CapitalScoreCircle';
import CapitalDetailPanel from './CapitalDetailPanel';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface FiveCapitalsDisplayProps {
  capitals: Capital[];
  onOpenMethodology?: () => void;
}

const FiveCapitalsDisplay = memo(({ capitals, onOpenMethodology }: FiveCapitalsDisplayProps) => {
  const [selectedCapital, setSelectedCapital] = useState<Capital | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleCapitalClick = useCallback((capital: Capital) => {
    setSelectedCapital(capital);
    setIsPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setIsPanelOpen(false);
  }, []);

  return (
    <section className="py-4 sm:py-8" data-tour="five-capitals" aria-labelledby="five-capitals-heading">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-2">
          <h2 id="five-capitals-heading" className="text-lg sm:text-xl font-bold text-foreground">
            Five Capitals Health Score
          </h2>
          <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
              <button
                className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                aria-label="Learn about the Five Capitals framework"
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 sm:w-96" align="center">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Five Capitals Resilience Framework</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="font-medium text-foreground">Financial:</span>{' '}
                    <span className="text-muted-foreground">Cash reserves, budget resilience, cost control</span>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Operational:</span>{' '}
                    <span className="text-muted-foreground">Facilities, equipment, supply chains, service capacity</span>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Human:</span>{' '}
                    <span className="text-muted-foreground">Workforce availability, skills, wellbeing, succession planning</span>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Reputational:</span>{' '}
                    <span className="text-muted-foreground">Trust ratings, patient satisfaction, regulatory standing</span>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Environmental:</span>{' '}
                    <span className="text-muted-foreground">Building condition, utilities, climate adaptation</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground pt-1 border-t">
                  Each capital is scored 0-100 based on structured assessment of Key Risk Indicators.
                </p>
                {onOpenMethodology && (
                  <button
                    onClick={onOpenMethodology}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
                  >
                    Learn more about methodology →
                  </button>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Real-time resilience assessment across key organisational dimensions
        </p>
      </div>

      <div className="flex justify-center">
        {/* Desktop: 5 columns, Tablet: 2-2-1, Mobile: single column */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-6 xl:gap-10">
          {capitals.map((capital, index) => (
            <CapitalScoreCircle
              key={capital.id}
              capital={capital}
              index={index}
              onClick={() => handleCapitalClick(capital)}
              dataTourId={`capital-${capital.name.toLowerCase()}`}
            />
          ))}
        </div>
      </div>

      <CapitalDetailPanel
        capital={selectedCapital}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
    </section>
  );
});

FiveCapitalsDisplay.displayName = 'FiveCapitalsDisplay';

export default FiveCapitalsDisplay;

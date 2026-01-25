import { useState, memo, useCallback } from 'react';
import { Capital } from '@/types';
import CapitalScoreCircle from './CapitalScoreCircle';
import CapitalDetailPanel from './CapitalDetailPanel';

interface FiveCapitalsDisplayProps {
  capitals: Capital[];
}

const FiveCapitalsDisplay = memo(({ capitals }: FiveCapitalsDisplayProps) => {
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
        <h2 id="five-capitals-heading" className="text-lg sm:text-xl font-bold text-foreground">
          Five Capitals Health Score
        </h2>
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

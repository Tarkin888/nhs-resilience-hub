import { useState } from 'react';
import { Capital } from '@/types';
import CapitalScoreCircle from './CapitalScoreCircle';
import CapitalDetailPanel from './CapitalDetailPanel';

interface FiveCapitalsDisplayProps {
  capitals: Capital[];
}

const FiveCapitalsDisplay = ({ capitals }: FiveCapitalsDisplayProps) => {
  const [selectedCapital, setSelectedCapital] = useState<Capital | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleCapitalClick = (capital: Capital) => {
    setSelectedCapital(capital);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-foreground">
          Five Capitals Health Score
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time resilience assessment across key organisational dimensions
        </p>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-10">
          {capitals.map((capital, index) => (
            <CapitalScoreCircle
              key={capital.id}
              capital={capital}
              index={index}
              onClick={() => handleCapitalClick(capital)}
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
};

export default FiveCapitalsDisplay;

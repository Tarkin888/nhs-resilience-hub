import { memo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { KRIStatus } from '@/types/capitalDetails';

interface KRIProgressBarProps {
  currentValue: number;
  targetValue: number;
  status: KRIStatus;
  isInverse?: boolean; // For metrics where lower is better (e.g., vacancies)
}

const getStatusColor = (status: KRIStatus) => {
  switch (status) {
    case 'red':
      return 'bg-[hsl(var(--status-red))]';
    case 'amber':
      return 'bg-[hsl(var(--status-amber))]';
    case 'green':
      return 'bg-[hsl(var(--status-green))]';
    default:
      return 'bg-muted';
  }
};

const KRIProgressBar = memo(({ currentValue, targetValue, status, isInverse = false }: KRIProgressBarProps) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  // Calculate percentage - handle both regular and inverse metrics
  const maxValue = Math.max(currentValue, targetValue) * 1.2;
  const fillPercentage = Math.min((currentValue / maxValue) * 100, 100);
  const targetPosition = Math.min((targetValue / maxValue) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedWidth(fillPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [fillPercentage]);

  return (
    <div className="mt-3 space-y-1">
      <div className="relative h-2 w-full bg-muted rounded-full overflow-visible">
        {/* Progress fill */}
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', getStatusColor(status))}
          style={{ width: `${animatedWidth}%` }}
        />
        
        {/* Target marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/60"
          style={{ left: `${targetPosition}%` }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>Current: {currentValue}</span>
        <span>Target: {targetValue}</span>
      </div>
    </div>
  );
});

KRIProgressBar.displayName = 'KRIProgressBar';

export default KRIProgressBar;

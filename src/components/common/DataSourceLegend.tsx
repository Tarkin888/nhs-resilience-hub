import { memo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataSourceLegendProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  defaultExpanded?: boolean;
}

interface DataSourceType {
  id: string;
  dotClass: string;
  label: string;
  description: string;
}

const dataSourceTypes: DataSourceType[] = [
  {
    id: 'public',
    dotClass: 'bg-[hsl(var(--source-public))]',
    label: 'Public NHS Data',
    description: 'NHS England statistics, official publications'
  },
  {
    id: 'cqc',
    dotClass: 'bg-[hsl(var(--source-cqc))]',
    label: 'CQC Reports',
    description: 'Care Quality Commission ratings and inspection findings'
  },
  {
    id: 'standard',
    dotClass: 'bg-[hsl(var(--source-standard))]',
    label: 'Industry Standards',
    description: 'NHS operational targets and benchmarks'
  },
  {
    id: 'assessment',
    dotClass: 'bg-[hsl(var(--source-assessment))]',
    label: 'ResilienC Assessment',
    description: 'Structured expert assessment using Five Capitals framework'
  },
  {
    id: 'demo',
    dotClass: 'bg-[hsl(var(--source-demo))]',
    label: 'Illustrative Demo Data',
    description: 'Representative data for demonstration purposes'
  }
];

const STORAGE_KEY = 'dataSourceLegendExpanded';

const DataSourceLegend = memo(({ 
  position = 'bottom-right', 
  defaultExpanded = false 
}: DataSourceLegendProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === 'true' : defaultExpanded;
    }
    return defaultExpanded;
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isExpanded));
  }, [isExpanded]);

  // Close on escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isExpanded) {
      setIsExpanded(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Close on click outside
  const handleClickOutside = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isExpanded && !target.closest('[data-legend-container]')) {
      setIsExpanded(false);
    }
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isExpanded, handleClickOutside]);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  // Mobile positioning
  const mobilePositionClass = isMobile ? 'bottom-4 left-1/2 -translate-x-1/2' : positionClasses[position];

  // Animation origin based on position
  const getAnimationOrigin = () => {
    if (isMobile) return { originX: 0.5, originY: 1 };
    switch (position) {
      case 'bottom-right': return { originX: 1, originY: 1 };
      case 'bottom-left': return { originX: 0, originY: 1 };
      case 'top-right': return { originX: 1, originY: 0 };
      case 'top-left': return { originX: 0, originY: 0 };
      default: return { originX: 1, originY: 1 };
    }
  };

  const animationOrigin = getAnimationOrigin();

  return (
    <div 
      className={cn('fixed z-[900]', mobilePositionClass)}
      data-legend-container
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed State - Circle Button
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className={cn(
              'w-12 h-12 rounded-full bg-card border shadow-lg',
              'flex items-center justify-center',
              'hover:bg-accent transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'group'
            )}
            aria-label="Open Data Source Legend"
            title="Data Source Legend"
          >
            <Info className="h-5 w-5 text-[hsl(var(--info-icon-hover))] group-hover:scale-110 transition-transform" />
          </motion.button>
        ) : (
          // Expanded State - Card
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, ...animationOrigin }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ transformOrigin: `${animationOrigin.originX * 100}% ${animationOrigin.originY * 100}%` }}
            className={cn(
              'bg-card border rounded-lg shadow-xl',
              isMobile ? 'w-[calc(100vw-2rem)] max-w-sm' : 'w-80'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h3 className="font-semibold text-foreground">Data Source Legend</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className={cn(
                  'p-1.5 rounded-full hover:bg-muted transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-primary'
                )}
                aria-label="Close legend"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {dataSourceTypes.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className={cn('w-3 h-3 rounded-full shrink-0 mt-1', source.dotClass)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{source.label}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                      {source.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

DataSourceLegend.displayName = 'DataSourceLegend';

export default DataSourceLegend;

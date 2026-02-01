import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Coins,
  Building2,
  Users,
  Award,
  Leaf,
  LucideIcon,
} from 'lucide-react';
import { Capital, Trend } from '@/types';
import { enhancedCapitalDetails } from '@/lib/enhancedCapitalData';
import { EnhancedCapitalDetail, KRIStatus } from '@/types/capitalDetails';
import {
  EnhancedKRICard,
  RecommendedActionsSection,
  PriorityAssessmentBox,
} from '@/components/capital-detail';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface CapitalDetailPanelProps {
  capital: Capital | null;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Financial: Coins,
  Operational: Building2,
  Human: Users,
  Reputational: Award,
  Environmental: Leaf,
};

const getStatusConfig = (status: KRIStatus) => {
  switch (status) {
    case 'red':
      return {
        color: 'hsl(var(--status-red))',
        bgColor: 'bg-[hsl(var(--status-red))]',
        label: 'At Risk (Red)',
      };
    case 'amber':
      return {
        color: 'hsl(var(--status-amber))',
        bgColor: 'bg-[hsl(var(--status-amber))]',
        label: 'Adequate (Amber)',
      };
    case 'green':
      return {
        color: 'hsl(var(--status-green))',
        bgColor: 'bg-[hsl(var(--status-green))]',
        label: 'Resilient (Green)',
      };
    default:
      return {
        color: 'hsl(var(--muted-foreground))',
        bgColor: 'bg-muted',
        label: 'Unknown',
      };
  }
};

const getTrendConfig = (trend: Trend) => {
  switch (trend) {
    case 'improving':
      return {
        icon: TrendingUp,
        symbol: '↑',
        label: 'Improving',
        color: 'text-[hsl(var(--status-green))]',
      };
    case 'declining':
      return {
        icon: TrendingDown,
        symbol: '↓',
        label: 'Declining',
        color: 'text-[hsl(var(--status-red))]',
      };
    default:
      return {
        icon: Minus,
        symbol: '→',
        label: 'Stable',
        color: 'text-muted-foreground',
      };
  }
};

// Loading skeleton for the panel content
const PanelSkeleton = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    {/* Score Explanation Skeleton */}
    <div className="rounded-lg p-5 bg-muted/50">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>

    {/* KRI Cards Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border rounded-lg p-4 border-l-4 border-l-muted">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-24 mt-2" />
          <Skeleton className="h-4 w-20 mt-2" />
          <Skeleton className="h-3 w-full mt-3" />
          <Skeleton className="h-2 w-full mt-3" />
        </div>
      ))}
    </div>

    {/* Actions Skeleton */}
    <div className="bg-primary/5 rounded-lg p-5">
      <Skeleton className="h-5 w-44 mb-4" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 mb-3">
          <Skeleton className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-40 mt-1" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CapitalDetailPanel = ({ capital, isOpen, onClose }: CapitalDetailPanelProps) => {
  const [isContentReady, setIsContentReady] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Coordinate panel open with content reveal for smooth animation
  useEffect(() => {
    if (isOpen && capital) {
      setIsContentReady(false);
      setShowContent(false);

      const contentTimer = setTimeout(() => {
        setIsContentReady(true);
        requestAnimationFrame(() => {
          setShowContent(true);
        });
      }, 150);

      return () => clearTimeout(contentTimer);
    } else {
      setIsContentReady(false);
      setShowContent(false);
    }
  }, [isOpen, capital?.id]);

  if (!capital) return null;

  const Icon = iconMap[capital.name] || Coins;
  const details: EnhancedCapitalDetail | undefined = enhancedCapitalDetails[capital.id];
  const statusConfig = getStatusConfig(capital.status as KRIStatus);
  const trendConfig = getTrendConfig(capital.trend);
  const TrendIcon = trendConfig.icon;

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
              opacity: { duration: 0.15 },
            }}
            className="fixed right-0 top-0 h-full bg-background shadow-2xl z-50 overflow-hidden flex flex-col
                       w-full md:w-[600px] lg:w-1/2 lg:min-w-[600px] lg:max-w-[800px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="capital-panel-title"
          >
            {/* NHS Blue Header */}
            <div className="bg-[hsl(var(--nhs-blue))] text-white px-6 py-5 shrink-0">
              <div className="flex items-start justify-between">
                {/* Left: Capital Name and Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2
                      id="capital-panel-title"
                      className="text-2xl font-bold text-white truncate"
                    >
                      {capital.name} Capital
                    </h2>
                  </div>

                  {/* Status and Trend row */}
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    {/* Status Badge */}
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-sm font-medium',
                        statusConfig.bgColor,
                        'text-white'
                      )}
                    >
                      {statusConfig.label}
                    </span>

                    {/* Trend */}
                    <div className="flex items-center gap-1.5 text-white/90">
                      <TrendIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{trendConfig.label}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Score and Close */}
                <div className="flex items-start gap-4 shrink-0">
                  {/* Score */}
                  <div className="text-right">
                    <span className="text-4xl font-bold text-white">
                      {capital.score}
                    </span>
                    <span className="text-lg text-white/80">/100</span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors -mr-2 -mt-1"
                    aria-label="Close panel"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {!isContentReady ? (
                <PanelSkeleton />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="p-6 space-y-6"
                >
                  {/* Score Explanation */}
                  <section className="bg-muted/50 rounded-lg p-5">
                    <p className="text-sm text-foreground leading-relaxed">
                      {details?.scoreExplanation || 'No explanation available.'}
                    </p>
                  </section>

                  {/* Enhanced KRI Cards */}
                  <section>
                    <h3 className="font-semibold text-lg text-foreground mb-4">
                      Key Risk Indicators
                    </h3>
                    <div className="space-y-4">
                      {details?.kris.map((kri, index) => (
                        <EnhancedKRICard key={kri.id} kri={kri} index={index} />
                      ))}
                    </div>
                  </section>

                  {/* Recommended Actions */}
                  {details?.recommendedActions && details.recommendedActions.length > 0 && (
                    <RecommendedActionsSection actions={details.recommendedActions} />
                  )}

                  {/* Priority Assessment Box */}
                  {details?.priorityAssessment && (
                    <PriorityAssessmentBox assessment={details.priorityAssessment} />
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CapitalDetailPanel;

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TourStep {
  id: string;
  targetSelector: string;
  title?: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    targetSelector: '[data-tour="header"]',
    title: 'Welcome',
    content:
      'Welcome to the NHS Resilience Command Centre. This demonstrates how strategic resilience methodology transforms into a digital assessment tool.',
    position: 'bottom',
  },
  {
    id: 'five-capitals',
    targetSelector: '[data-tour="five-capitals"]',
    title: 'Five Capitals',
    content:
      'These Five Capitals represent your complete resilience profile. Each score comes from weighted Key Risk Indicators. Click any ⓘ icon to see data sources.',
    position: 'top',
  },
  {
    id: 'data-transparency',
    targetSelector: '[data-tour="capital-financial"] [data-tour="info-icon"]',
    title: 'Data Transparency',
    content:
      'Every metric has a transparent data source. Hover over any ⓘ icon to verify.',
    position: 'right',
  },
  {
    id: 'scenario-testing',
    targetSelector: '[data-tour="scenario-selector"]',
    title: 'Scenario Testing',
    content:
      "Test resilience through 'extreme but plausible' scenarios based on real NHS incidents (WannaCry, COVID-19, heatwaves).",
    position: 'top',
  },
  {
    id: 'drill-down',
    targetSelector: '[data-tour="capital-human"]',
    title: 'Drill-Down',
    content:
      'Click any capital to see detailed Key Risk Indicators and improvement actions. Tour complete!',
    position: 'top',
  },
];

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOUR_COMPLETED_KEY = 'nhs-resilience-tour-completed';

export const GuidedTour = ({ isOpen, onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);

  const step = tourSteps[currentStep];

  const updateTargetPosition = useCallback(() => {
    if (!step) return;

    const target = document.querySelector(step.targetSelector);
    if (target) {
      const rect = target.getBoundingClientRect();
      setTargetRect(rect);
    }
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;

    updateTargetPosition();

    // Update position on scroll/resize
    window.addEventListener('scroll', updateTargetPosition, true);
    window.addEventListener('resize', updateTargetPosition);

    return () => {
      window.removeEventListener('scroll', updateTargetPosition, true);
      window.removeEventListener('resize', updateTargetPosition);
    };
  }, [isOpen, currentStep, updateTargetPosition]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    setCurrentStep(0);
    onClose();
  };

  const handleSkip = () => {
    setShowSkipConfirm(true);
  };

  const confirmSkip = () => {
    setShowSkipConfirm(false);
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    setCurrentStep(0);
    onClose();
  };

  const getPopupPosition = () => {
    if (!targetRect) return { top: '50%', left: '50%' };

    const padding = 16;
    const popupWidth = 400;
    const popupHeight = 200;

    switch (step.position) {
      case 'bottom':
        return {
          top: targetRect.bottom + padding,
          left: Math.max(
            padding,
            Math.min(
              targetRect.left + targetRect.width / 2 - popupWidth / 2,
              window.innerWidth - popupWidth - padding
            )
          ),
        };
      case 'top':
        return {
          top: targetRect.top - popupHeight - padding,
          left: Math.max(
            padding,
            Math.min(
              targetRect.left + targetRect.width / 2 - popupWidth / 2,
              window.innerWidth - popupWidth - padding
            )
          ),
        };
      case 'left':
        return {
          top: targetRect.top + targetRect.height / 2 - popupHeight / 2,
          left: targetRect.left - popupWidth - padding,
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - popupHeight / 2,
          left: targetRect.right + padding,
        };
      default:
        return { top: '50%', left: '50%' };
    }
  };

  const getArrowStyle = () => {
    switch (step.position) {
      case 'bottom':
        return 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-white border-l-transparent border-r-transparent border-t-transparent border-8';
      case 'top':
        return 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-white border-l-transparent border-r-transparent border-b-transparent border-8';
      case 'left':
        return 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-white border-t-transparent border-b-transparent border-r-transparent border-8';
      case 'right':
        return 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-white border-t-transparent border-b-transparent border-l-transparent border-8';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  const popupPosition = getPopupPosition();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* SVG Overlay with cutout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] pointer-events-none"
            >
              <svg className="w-full h-full">
                <defs>
                  <mask id="tour-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {targetRect && (
                      <rect
                        x={targetRect.left - 8}
                        y={targetRect.top - 8}
                        width={targetRect.width + 16}
                        height={targetRect.height + 16}
                        rx="8"
                        fill="black"
                      />
                    )}
                  </mask>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.7)"
                  mask="url(#tour-mask)"
                />
              </svg>
            </motion.div>

            {/* Highlight glow effect */}
            {targetRect && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed z-[101] pointer-events-none rounded-lg"
                style={{
                  top: targetRect.top - 8,
                  left: targetRect.left - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                  boxShadow: '0 0 0 4px rgba(0, 94, 184, 0.3), 0 0 20px rgba(0, 94, 184, 0.6)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }}
              />
            )}

            {/* Popup Card */}
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed z-[102] w-[400px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-2xl p-6"
              style={{
                top: typeof popupPosition.top === 'number' ? popupPosition.top : popupPosition.top,
                left: typeof popupPosition.left === 'number' ? popupPosition.left : popupPosition.left,
              }}
            >
              {/* Arrow */}
              <div className={`absolute w-0 h-0 ${getArrowStyle()}`} />

              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
                aria-label="Close tour"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Content */}
              <div className="pr-6">
                {step.title && (
                  <h3 className="text-lg font-bold text-[hsl(var(--nhs-blue))] mb-2">
                    {step.title}
                  </h3>
                )}
                <p className="text-base text-foreground leading-relaxed">
                  {step.content}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Skip Tour
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleNext}
                    className="bg-[hsl(var(--nhs-blue))] hover:bg-[hsl(var(--nhs-dark-blue))] text-white gap-1"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                    {currentStep < tourSteps.length - 1 && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Skip Confirmation Dialog */}
      <AlertDialog open={showSkipConfirm} onOpenChange={setShowSkipConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip demo walkthrough?</AlertDialogTitle>
            <AlertDialogDescription>
              You can restart the tour anytime by clicking the "Demo Walkthrough"
              button in the header.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Tour</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSkip}
              className="bg-[hsl(var(--nhs-blue))] hover:bg-[hsl(var(--nhs-dark-blue))]"
            >
              Skip Tour
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* CSS for pulse animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(0, 94, 184, 0.3), 0 0 20px rgba(0, 94, 184, 0.6);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(0, 94, 184, 0.4), 0 0 30px rgba(0, 94, 184, 0.8);
          }
        }
      `}</style>
    </>
  );
};

export default GuidedTour;

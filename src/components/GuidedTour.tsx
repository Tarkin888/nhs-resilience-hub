import { useState, useEffect, useCallback, useRef } from 'react';
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
const TOUR_DISMISSED_SESSION_KEY = 'nhs-resilience-tour-dismissed-session';

export const GuidedTour = ({ isOpen, onClose }: GuidedTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Refs to track mounted state and prevent stale closures
  const isMountedRef = useRef(true);
  const scrollListenerRef = useRef<(() => void) | null>(null);
  const resizeListenerRef = useRef<(() => void) | null>(null);

  const step = tourSteps[currentStep];

  // Check if tour was dismissed this session - prevent auto-reopen
  useEffect(() => {
    if (isOpen) {
      const wasDismissedThisSession = sessionStorage.getItem(TOUR_DISMISSED_SESSION_KEY);
      if (wasDismissedThisSession === 'true') {
        // Tour was already dismissed, close it immediately
        onClose();
      }
    }
  }, [isOpen, onClose]);

  // Cleanup function to reset all tour state
  const handleTourExit = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // Mark as dismissed for this session
    sessionStorage.setItem(TOUR_DISMISSED_SESSION_KEY, 'true');
    
    // Reset all state
    setCurrentStep(0);
    setTargetRect(null);
    setShowSkipConfirm(false);
    setIsTransitioning(false);
    
    // Re-enable scroll
    document.body.style.overflow = 'auto';
    
    // Remove any lingering event listeners
    if (scrollListenerRef.current) {
      window.removeEventListener('scroll', scrollListenerRef.current, true);
      scrollListenerRef.current = null;
    }
    if (resizeListenerRef.current) {
      window.removeEventListener('resize', resizeListenerRef.current);
      resizeListenerRef.current = null;
    }
    
    onClose();
  }, [onClose]);

  const updateTargetPosition = useCallback(() => {
    if (!isMountedRef.current || !step || isTransitioning) return;

    const target = document.querySelector(step.targetSelector);
    if (target) {
      const rect = target.getBoundingClientRect();
      const isInViewport = 
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth;

      if (!isInViewport) {
        // Temporarily enable scroll
        document.body.style.overflow = 'auto';
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
          if (isMountedRef.current) {
            document.body.style.overflow = 'hidden';
            const newRect = target.getBoundingClientRect();
            setTargetRect(newRect);
          }
        }, 300);
      } else {
        setTargetRect(rect);
      }
    } else {
      setTargetRect(null);
    }
  }, [step, isTransitioning]);

  // Track mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Lock scroll when tour is active
  useEffect(() => {
    if (isOpen && !isTransitioning) {
      document.body.style.overflow = 'hidden';
    } else if (!isOpen) {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isTransitioning]);

  // Set up event listeners with proper cleanup
  useEffect(() => {
    if (!isOpen) {
      // Clean up listeners when closed
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current, true);
        scrollListenerRef.current = null;
      }
      if (resizeListenerRef.current) {
        window.removeEventListener('resize', resizeListenerRef.current);
        resizeListenerRef.current = null;
      }
      return;
    }

    updateTargetPosition();

    // Create new listener references
    scrollListenerRef.current = updateTargetPosition;
    resizeListenerRef.current = updateTargetPosition;

    window.addEventListener('scroll', scrollListenerRef.current, true);
    window.addEventListener('resize', resizeListenerRef.current);

    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current, true);
      }
      if (resizeListenerRef.current) {
        window.removeEventListener('resize', resizeListenerRef.current);
      }
    };
  }, [isOpen, currentStep, updateTargetPosition]);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    handleTourExit();
  }, [handleTourExit]);

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    
    if (currentStep < tourSteps.length - 1) {
      setIsTransitioning(true);
      const nextStep = currentStep + 1;
      const nextTarget = document.querySelector(tourSteps[nextStep].targetSelector);
      
      // Temporarily enable scroll
      document.body.style.overflow = 'auto';
      
      if (nextTarget) {
        nextTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      setTimeout(() => {
        if (isMountedRef.current) {
          document.body.style.overflow = 'hidden';
          setCurrentStep(nextStep);
          setIsTransitioning(false);
        }
      }, 350);
    } else {
      completeTour();
    }
  }, [currentStep, completeTour, isTransitioning]);

  const handleSkip = useCallback(() => {
    setShowSkipConfirm(true);
  }, []);

  const confirmSkip = useCallback(() => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    handleTourExit();
  }, [handleTourExit]);

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

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);
  
  const isMountedRef = useRef(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const step = tourSteps[currentStep];

  // Check if tour was dismissed this session
  useEffect(() => {
    if (isOpen) {
      const wasDismissedThisSession = sessionStorage.getItem(TOUR_DISMISSED_SESSION_KEY);
      if (wasDismissedThisSession === 'true') {
        onClose();
        return;
      }
      // Small delay before showing to ensure DOM is ready
      const showTimer = setTimeout(() => {
        if (isMountedRef.current) {
          setIsVisible(true);
        }
      }, 100);
      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle tour exit with full cleanup
  const handleTourExit = useCallback(() => {
    sessionStorage.setItem(TOUR_DISMISSED_SESSION_KEY, 'true');
    setIsVisible(false);
    setCurrentStep(0);
    setTargetRect(null);
    setShowSkipConfirm(false);
    document.body.style.overflow = 'auto';
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    onClose();
  }, [onClose]);

  // Update target position - simplified without event listeners that cause loops
  const updateTargetPosition = useCallback(() => {
    if (!isMountedRef.current || !step) return;

    const target = document.querySelector(step.targetSelector);
    if (target) {
      const rect = target.getBoundingClientRect();
      const isInViewport = 
        rect.top >= -50 &&
        rect.left >= -50 &&
        rect.bottom <= window.innerHeight + 50 &&
        rect.right <= window.innerWidth + 50;

      if (!isInViewport) {
        document.body.style.overflow = 'auto';
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        updateTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            document.body.style.overflow = 'hidden';
            const newRect = target.getBoundingClientRect();
            setTargetRect(newRect);
          }
        }, 350);
      } else {
        setTargetRect(rect);
        document.body.style.overflow = 'hidden';
      }
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Update position when step changes
  useEffect(() => {
    if (isVisible && isOpen) {
      updateTargetPosition();
    }
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [isVisible, isOpen, currentStep, updateTargetPosition]);

  const completeTour = useCallback(() => {
    localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    handleTourExit();
  }, [handleTourExit]);

  const handleNext = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1;
      const nextTarget = document.querySelector(tourSteps[nextStep].targetSelector);
      
      document.body.style.overflow = 'auto';
      
      if (nextTarget) {
        nextTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          document.body.style.overflow = 'hidden';
          setCurrentStep(nextStep);
        }
      }, 350);
    } else {
      completeTour();
    }
  }, [currentStep, completeTour]);

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
          top: Math.max(padding, targetRect.top - popupHeight - padding),
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
          left: Math.max(padding, targetRect.left - popupWidth - padding),
        };
      case 'right':
        return {
          top: targetRect.top + targetRect.height / 2 - popupHeight / 2,
          left: Math.min(targetRect.right + padding, window.innerWidth - popupWidth - padding),
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

  // Don't render if not open or not visible
  if (!isOpen || !isVisible) return null;

  const popupPosition = getPopupPosition();

  return (
    <>
      {/* Dark overlay with cutout - using CSS only, no framer-motion */}
      <div 
        className="fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300"
        style={{ opacity: 1 }}
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
      </div>

      {/* Highlight border - simple border, no animation */}
      {targetRect && (
        <div
          className="fixed z-[101] pointer-events-none rounded-lg border-2 border-[hsl(var(--nhs-blue))]"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            boxShadow: '0 0 0 4px rgba(0, 94, 184, 0.3)',
          }}
        />
      )}

      {/* Popup Card - simple CSS transitions instead of framer-motion */}
      <div
        key={step.id}
        className="fixed z-[102] w-[400px] max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-2xl p-6 transition-all duration-200"
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
      </div>

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
    </>
  );
};

export default GuidedTour;

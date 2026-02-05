import { useState, useEffect, memo } from 'react';
import { Calendar, TrendingUp, TrendingDown, Minus, ChevronRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { AIPrediction, Severity, Trend, Confidence, ImpactType } from '@/lib/aiPredictionsData';

interface AIPredictionCardProps {
  prediction: AIPrediction;
  index: number;
}

const getSeverityBorderColor = (severity: Severity): string => {
  switch (severity) {
    case 'critical':
      return 'border-l-[#DC2626]';
    case 'high':
      return 'border-l-[#F97316]';
    case 'medium':
      return 'border-l-[#EAB308]';
    case 'low':
      return 'border-l-success';
    default:
      return 'border-l-muted';
  }
};

const getSeverityBadgeClass = (severity: Severity): string => {
  switch (severity) {
    case 'critical':
      return 'bg-[#DC2626] text-white hover:bg-[#DC2626]';
    case 'high':
      return 'bg-[#F97316] text-white hover:bg-[#F97316]';
    case 'medium':
      return 'bg-[#EAB308] text-white hover:bg-[#EAB308]';
    case 'low':
      return 'bg-success text-success-foreground hover:bg-success';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getSeverityDot = (severity: Severity): string => {
  switch (severity) {
    case 'critical':
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
};

const getTrendIcon = (trend: Trend) => {
  switch (trend) {
    case 'increasing':
      return <TrendingUp className="h-3.5 w-3.5 text-[#DC2626]" />;
    case 'decreasing':
      return <TrendingDown className="h-3.5 w-3.5 text-success" />;
    case 'stable':
      return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
  }
};

const getTrendText = (trend: Trend): { text: string; className: string } => {
  switch (trend) {
    case 'increasing':
      return { text: 'Increasing', className: 'text-[#DC2626]' };
    case 'decreasing':
      return { text: 'Decreasing', className: 'text-success' };
    case 'stable':
      return { text: 'Stable', className: 'text-muted-foreground' };
  }
};

const getConfidenceColor = (confidence: Confidence): string => {
  switch (confidence) {
    case 'high':
      return 'text-success';
    case 'medium':
      return 'text-[#EAB308]';
    case 'low':
      return 'text-[#DC2626]';
  }
};

const getImpactColor = (impactType: ImpactType): string => {
  switch (impactType) {
    case 'operational':
      return 'text-[#F97316]';
    case 'financial':
      return 'text-success';
    case 'human':
      return 'text-[#EAB308]';
    case 'reputational':
      return 'text-primary';
    case 'environmental':
      return 'text-[#10B981]';
    default:
      return 'text-muted-foreground';
  }
};

const AIPredictionCard = memo(({ prediction, index }: AIPredictionCardProps) => {
  const [animatedProbability, setAnimatedProbability] = useState(0);
  const Icon = prediction.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        setAnimatedProbability(Math.round(prediction.probability * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, index * 200); // Stagger animation start

    return () => clearTimeout(timer);
  }, [prediction.probability, index]);

  const handleCreateActionPlan = () => {
    toast.info('Action planning feature coming soon', {
      description: `Action plan for "${prediction.title}" will be available in a future update.`,
      duration: 4000
    });
  };

  return (
    <div
      className={cn(
        'bg-[#F8F9FF] rounded-lg p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-l-4 mb-4 transition-all duration-200',
        getSeverityBorderColor(prediction.severity)
      )}
    >
      {/* Title Row */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <Icon className="h-6 w-6 text-secondary flex-shrink-0" />
          <h3 className="text-lg font-bold text-secondary">{prediction.title}</h3>
        </div>
        <Badge className={cn('capitalize flex-shrink-0', getSeverityBadgeClass(prediction.severity))}>
          {prediction.severity}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-muted-foreground text-base mb-4 line-clamp-2">
        {prediction.description}
      </p>

      {/* Probability Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-foreground">{animatedProbability}%</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{prediction.timeframe}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-[#E5E7EB] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-[#3B82F6] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedProbability}%` }}
          />
        </div>

        {/* Confidence & Impact Row */}
        <div className="flex items-center justify-between mt-2 text-sm">
          <span>
            Confidence:{' '}
            <span className={cn('font-medium capitalize', getConfidenceColor(prediction.confidence))}>
              {prediction.confidence}
            </span>
          </span>
          <span className={cn('capitalize font-medium', getImpactColor(prediction.impactType))}>
            {prediction.impactType} impact
          </span>
        </div>
      </div>

      {/* Key Risk Drivers */}
      <div className="mb-5">
        <h4 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <span>⚡</span> Key Risk Drivers
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {prediction.keyRiskDrivers.map((driver, idx) => {
            const trendInfo = getTrendText(driver.trend);
            return (
              <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex-shrink-0">{getSeverityDot(driver.severity)}</span>
                  <span className="truncate text-foreground">{driver.name}</span>
                </div>
                <div className={cn('flex items-center gap-1 flex-shrink-0', trendInfo.className)}>
                  {getTrendIcon(driver.trend)}
                  <span className="text-xs">{trendInfo.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preventive Actions */}
      <div className="mb-5">
        <h4 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <span>🎯</span> Recommended Preventive Actions
        </h4>
        <ul className="space-y-2">
          {prediction.preventiveActions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Create Action Plan Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={handleCreateActionPlan}
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Create Action Plan
        </Button>
      </div>
    </div>
  );
});

AIPredictionCard.displayName = 'AIPredictionCard';

export default AIPredictionCard;

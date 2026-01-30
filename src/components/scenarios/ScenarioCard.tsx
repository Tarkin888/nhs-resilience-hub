import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Calendar, 
  Clock, 
  Target,
  Shield,
  AlertTriangle,
  Package,
  WifiOff,
  AlertCircle,
  Siren,
  Bug,
  Pill,
  Thermometer,
  Droplets,
  Zap,
  FileWarning,
  Mail,
  UserX,
  UserMinus,
  Stethoscope,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SeverityBadge } from './SeverityBadge';
import { TestStatusIndicator } from './TestStatusIndicator';
import { cn } from '@/lib/utils';
import type { EnhancedScenario } from '@/lib/scenarioLibraryData';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Shield,
  AlertTriangle,
  Package,
  WifiOff,
  AlertCircle,
  Siren,
  Bug,
  Pill,
  Thermometer,
  Droplets,
  Zap,
  FileWarning,
  Mail,
  UserX,
  UserMinus,
  Stethoscope,
};

interface ScenarioCardProps {
  scenario: EnhancedScenario;
  onRun: (scenario: EnhancedScenario) => void;
}

export const ScenarioCard = memo(function ScenarioCard({ scenario, onRun }: ScenarioCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  
  const Icon = iconMap[scenario.icon] || AlertCircle;
  
  const handleRun = async () => {
    setIsRunning(true);
    // Simulate a brief loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    onRun(scenario);
    setIsRunning(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-lg border border-border p-5 mb-3 hover:shadow-card-hover transition-shadow duration-200"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Left Section - Info */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground truncate">
                  {scenario.name}
                </h4>
                <SeverityBadge severity={scenario.severity} />
              </div>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2 ml-[52px]">
            {scenario.description}
          </p>
          
          {/* Metadata Row */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 ml-[52px]">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <TestStatusIndicator 
                status={scenario.testStatus} 
                lastTested={scenario.lastTested} 
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Duration: {scenario.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>Impact: {scenario.impactAreasCount} areas</span>
            </div>
          </div>
        </div>
        
        {/* Right Section - Action Button */}
        <div className="flex-shrink-0 flex items-center sm:items-stretch">
          <Button
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              "w-full sm:w-auto sm:h-full min-w-[130px] gap-2",
              "bg-primary hover:bg-primary/90 text-primary-foreground"
            )}
            aria-label={`Run ${scenario.name} scenario`}
          >
            {isRunning ? (
              <>
                <LoadingSpinner size="sm" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run Scenario
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
});

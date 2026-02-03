import { useState, useCallback, useMemo, memo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Info,
  Leaf,
  Settings,
  Users,
  PoundSterling,
  Award,
  ArrowRight,
  Play,
  RotateCcw,
  TrendingDown,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Mapping from ScenarioLibrary IDs to Visualiser IDs
const scenarioIdMapping: Record<string, string> = {
  'cyber-ransomware': 'ransomware',
  'equipment-failure': 'power', // Maps to closest equivalent
  'supply-chain': 'pandemic', // Maps to closest equivalent
  'it-outage': 'ransomware', // Maps to closest equivalent
  'building-evacuation': 'power', // Maps to closest equivalent
  'mass-casualty': 'pandemic',
  'infection-outbreak': 'pandemic',
  'medication-error': 'strike',
  'heatwave': 'heatwave',
  'flooding': 'power',
  'power-outage': 'power',
  'data-breach': 'ransomware',
  'phishing-attack': 'ransomware',
  'social-engineering': 'ransomware',
  'nursing-strike': 'strike',
  'doctor-strike': 'strike',
  'key-staff-departure': 'strike',
  'whistleblowing': 'strike',
};

export interface ScenarioImpactVisualiserRef {
  runScenarioById: (scenarioId: string) => void;
}

export interface ScenarioImpactVisualiserProps {
  id?: string;
  onExecutionStart?: () => void;
  onExecutionEnd?: () => void;
}

interface ScenarioImpact {
  capital: string;
  icon: typeof Leaf;
  impact: number;
  explanation: string;
  color: string;
}

interface Scenario {
  id: string;
  name: string;
  impacts: ScenarioImpact[];
}

const scenarios: Scenario[] = [
  {
    id: 'heatwave',
    name: 'Prolonged Heatwave (7 days, 35°C+)',
    impacts: [
      {
        capital: 'Environmental',
        icon: Leaf,
        impact: -35,
        explanation: 'Building cooling failure, vulnerable patients at extreme risk',
        color: 'hsl(var(--status-green))',
      },
      {
        capital: 'Operational',
        icon: Settings,
        impact: -18,
        explanation: 'A&E surge +40%, elective surgery cancellations, equipment failures',
        color: 'hsl(var(--nhs-blue))',
      },
      {
        capital: 'Human',
        icon: Users,
        impact: -12,
        explanation: 'Staff heat stress, increased sickness absence, exhaustion',
        color: 'hsl(var(--status-amber))',
      },
      {
        capital: 'Financial',
        icon: PoundSterling,
        impact: -8,
        explanation: 'Agency costs spike, lost elective income, emergency HVAC repairs',
        color: 'hsl(var(--status-red))',
      },
      {
        capital: 'Reputational',
        icon: Award,
        impact: -5,
        explanation: 'Media coverage of patient harm, CQC concern, family complaints',
        color: 'hsl(142, 76%, 36%)',
      },
    ],
  },
  {
    id: 'ransomware',
    name: 'Ransomware Attack on EPR System',
    impacts: [
      {
        capital: 'Environmental',
        icon: Leaf,
        impact: -5,
        explanation: 'Environmental monitoring systems offline, HVAC disruption',
        color: 'hsl(var(--status-green))',
      },
      {
        capital: 'Operational',
        icon: Settings,
        impact: -45,
        explanation: 'Complete EPR failure, paper records, cancelled appointments',
        color: 'hsl(var(--nhs-blue))',
      },
      {
        capital: 'Human',
        icon: Users,
        impact: -20,
        explanation: 'Staff stress, manual workarounds, extended shifts',
        color: 'hsl(var(--status-amber))',
      },
      {
        capital: 'Financial',
        icon: PoundSterling,
        impact: -30,
        explanation: 'Recovery costs, lost income, potential ransom, regulatory fines',
        color: 'hsl(var(--status-red))',
      },
      {
        capital: 'Reputational',
        icon: Award,
        impact: -25,
        explanation: 'National news coverage, patient data concerns, trust erosion',
        color: 'hsl(142, 76%, 36%)',
      },
    ],
  },
  {
    id: 'strike',
    name: 'Coordinated Nursing Strike (5 days)',
    impacts: [
      {
        capital: 'Environmental',
        icon: Leaf,
        impact: -2,
        explanation: 'Minimal direct environmental impact',
        color: 'hsl(var(--status-green))',
      },
      {
        capital: 'Operational',
        icon: Settings,
        impact: -30,
        explanation: 'Reduced capacity, cancelled surgeries, emergency-only care',
        color: 'hsl(var(--nhs-blue))',
      },
      {
        capital: 'Human',
        icon: Users,
        impact: -35,
        explanation: 'Remaining staff overstretched, morale impact, colleague tensions',
        color: 'hsl(var(--status-amber))',
      },
      {
        capital: 'Financial',
        icon: PoundSterling,
        impact: -15,
        explanation: 'Lost elective income, agency premium rates, backlog costs',
        color: 'hsl(var(--status-red))',
      },
      {
        capital: 'Reputational',
        icon: Award,
        impact: -20,
        explanation: 'Public perception, political attention, staff relations damage',
        color: 'hsl(142, 76%, 36%)',
      },
    ],
  },
  {
    id: 'power',
    name: 'Major Power Outage (24 hours)',
    impacts: [
      {
        capital: 'Environmental',
        icon: Leaf,
        impact: -25,
        explanation: 'HVAC failure, temperature control loss, generator emissions',
        color: 'hsl(var(--status-green))',
      },
      {
        capital: 'Operational',
        icon: Settings,
        impact: -40,
        explanation: 'Critical systems on backup, theatre closures, patient transfers',
        color: 'hsl(var(--nhs-blue))',
      },
      {
        capital: 'Human',
        icon: Users,
        impact: -15,
        explanation: 'Staff called in, manual processes, patient safety stress',
        color: 'hsl(var(--status-amber))',
      },
      {
        capital: 'Financial',
        icon: PoundSterling,
        impact: -20,
        explanation: 'Equipment damage, fuel costs, lost activity, repairs',
        color: 'hsl(var(--status-red))',
      },
      {
        capital: 'Reputational',
        icon: Award,
        impact: -10,
        explanation: 'Local media coverage, patient experience complaints',
        color: 'hsl(142, 76%, 36%)',
      },
    ],
  },
  {
    id: 'pandemic',
    name: 'Novel Respiratory Pandemic',
    impacts: [
      {
        capital: 'Environmental',
        icon: Leaf,
        impact: -10,
        explanation: 'Increased PPE waste, ventilation demands, supply chain stress',
        color: 'hsl(var(--status-green))',
      },
      {
        capital: 'Operational',
        icon: Settings,
        impact: -50,
        explanation: 'Surge capacity, cancelled electives, redeployed services',
        color: 'hsl(var(--nhs-blue))',
      },
      {
        capital: 'Human',
        icon: Users,
        impact: -40,
        explanation: 'Staff infection, burnout, PTSD, long-term absence',
        color: 'hsl(var(--status-amber))',
      },
      {
        capital: 'Financial',
        icon: PoundSterling,
        impact: -35,
        explanation: 'Emergency spending, lost income, recovery costs, PPE procurement',
        color: 'hsl(var(--status-red))',
      },
      {
        capital: 'Reputational',
        icon: Award,
        impact: -15,
        explanation: 'Public scrutiny, political pressure, staff hero/victim narrative',
        color: 'hsl(142, 76%, 36%)',
      },
    ],
  },
];

export const ScenarioImpactVisualiser = memo(forwardRef<ScenarioImpactVisualiserRef, ScenarioImpactVisualiserProps>(
  function ScenarioImpactVisualiser({ id, onExecutionStart, onExecutionEnd }, ref) {
    const [selectedScenario, setSelectedScenario] = useState<string>('');
    const [isRunning, setIsRunning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [visibleCards, setVisibleCards] = useState<number>(0);
    const [isPreparing, setIsPreparing] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const currentScenario = useMemo(() => 
      scenarios.find((s) => s.id === selectedScenario),
      [selectedScenario]
    );

    const runScenario = useCallback(() => {
      if (!selectedScenario || !currentScenario) return;

      setIsPreparing(false);
      setIsRunning(true);
      setShowResults(true);
      setVisibleCards(0);

      // Animate cards appearing sequentially
      const totalCards = currentScenario.impacts.length;
      for (let i = 0; i < totalCards; i++) {
        setTimeout(() => {
          setVisibleCards((prev) => prev + 1);
        }, (i + 1) * 500);
      }

      setTimeout(() => {
        setIsRunning(false);
        onExecutionEnd?.();
      }, totalCards * 500 + 500);
    }, [selectedScenario, currentScenario, onExecutionEnd]);

    // External trigger to run a scenario by ID (from ScenarioLibrary)
    const runScenarioById = useCallback((libraryScenarioId: string) => {
      // Map the library scenario ID to visualiser scenario ID
      const visualiserScenarioId = scenarioIdMapping[libraryScenarioId] || libraryScenarioId;
      
      // Check if the mapped scenario exists
      const scenario = scenarios.find(s => s.id === visualiserScenarioId);
      if (!scenario) {
        console.warn(`Scenario not found: ${libraryScenarioId} -> ${visualiserScenarioId}`);
        return;
      }

      // Show preparing state and highlight
      setIsPreparing(true);
      setIsHighlighted(true);
      onExecutionStart?.();

      // Reset state and set the scenario
      setShowResults(false);
      setVisibleCards(0);
      setSelectedScenario(visualiserScenarioId);

      // Remove highlight after 2 seconds
      setTimeout(() => {
        setIsHighlighted(false);
      }, 2000);
    }, [onExecutionStart]);

    // Expose the runScenarioById method via ref
    useImperativeHandle(ref, () => ({
      runScenarioById
    }), [runScenarioById]);

    // Auto-run when selectedScenario changes from external trigger
    useEffect(() => {
      if (selectedScenario && !showResults && !isRunning && isPreparing) {
        // Delay to show the preparing banner
        const timer = setTimeout(() => {
          runScenario();
        }, 800);
        return () => clearTimeout(timer);
      }
    }, [selectedScenario, showResults, isRunning, isPreparing, runScenario]);

    const resetScenario = useCallback(() => {
      setShowResults(false);
      setVisibleCards(0);
      setSelectedScenario('');
      setIsPreparing(false);
    }, []);

    const handleScenarioChange = useCallback((value: string) => {
      setSelectedScenario(value);
      setShowResults(false);
      setVisibleCards(0);
      setIsPreparing(false);
    }, []);

    const totalImpact = useMemo(() => 
      currentScenario?.impacts.reduce((sum, i) => sum + i.impact, 0) || 0,
      [currentScenario]
    );

    return (
      <Card 
        id={id} 
        className={`bg-card shadow-card rounded-lg transition-all duration-500 hover:shadow-card-hover relative ${
          isHighlighted ? 'ring-4 ring-[hsl(var(--nhs-blue))]/30 shadow-lg shadow-[hsl(var(--nhs-blue))]/20' : ''
        }`}
      >
        {/* Highlight glow overlay */}
        <AnimatePresence>
          {isHighlighted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-b from-[hsl(var(--nhs-blue))]/10 to-transparent"
            />
          )}
        </AnimatePresence>

        <CardHeader className="pb-4 px-4 sm:px-6">
          <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
            Scenario Impact Visualiser
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Execution Progress Banner */}
          <AnimatePresence>
            {isPreparing && currentScenario && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 p-4 bg-[#E3F2FD] rounded-lg border border-[hsl(var(--nhs-blue))]/20">
                  <div className="animate-spin h-5 w-5 border-2 border-[hsl(var(--nhs-blue))] border-t-transparent rounded-full" />
                  <span className="text-sm font-medium text-[hsl(var(--nhs-dark-blue))]">
                    🔄 Executing scenario: <span className="font-semibold">{currentScenario.name}</span>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center" data-tour="scenario-selector">
          <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select
              value={selectedScenario}
              onValueChange={handleScenarioChange}
              disabled={isRunning}
            >
              <SelectTrigger 
                className="w-full sm:w-[350px] bg-card focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Select a scenario"
              >
                <SelectValue placeholder="Select a scenario..." />
              </SelectTrigger>
              <SelectContent className="bg-card z-50">
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="hidden sm:flex p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    aria-label="More information about scenarios"
                  >
                    <Info className="h-5 w-5" aria-hidden="true" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs bg-foreground text-background p-3">
                  <p className="text-sm">
                    Each scenario is based on historical NHS incidents (WannaCry 2017,
                    COVID-19, July 2022 heatwave). Impact calculations use evidence from
                    NHS England data and expert assessment.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            onClick={runScenario}
            disabled={!selectedScenario || isRunning}
            className="bg-primary hover:bg-secondary text-primary-foreground gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 min-w-[140px]"
            aria-label={isRunning ? "Running scenario..." : "Run selected scenario"}
          >
            {isRunning ? (
              <>
                <LoadingSpinner size="sm" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" aria-hidden="true" />
                Run Scenario
              </>
            )}
          </Button>
        </div>

        {/* Impact Display Area */}
        <div className="min-h-[250px] sm:min-h-[300px] border border-border rounded-lg p-4 sm:p-6 bg-muted/30">
          {!showResults ? (
            <div className="h-full flex items-center justify-center text-center">
              <p className="text-muted-foreground text-lg max-w-md">
                Select a scenario above to see how disruption cascades across all five
                capitals
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Impact Cards */}
              <div className="space-y-4">
                <AnimatePresence>
                  {currentScenario?.impacts.map((impact, index) => {
                    const Icon = impact.icon;
                    const isVisible = index < visibleCards;

                    return (
                      <div key={impact.capital}>
                        {isVisible && (
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex items-center gap-4"
                          >
                            {/* Impact Card */}
                            <div
                              className="flex-1 bg-white rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow"
                              style={{ borderLeftColor: impact.color }}
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-10 h-10 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: `${impact.color}20` }}
                                >
                                  <Icon
                                    className="h-5 w-5"
                                    style={{ color: impact.color }}
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-foreground">
                                      {impact.capital}
                                    </h4>
                                    <span className="text-2xl font-bold text-[hsl(var(--status-red))]">
                                      {impact.impact}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {impact.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Arrow to next card */}
                            {index < (currentScenario?.impacts.length || 0) - 1 && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="hidden lg:block text-muted-foreground/50"
                              >
                                <ArrowRight className="h-5 w-5 rotate-90" />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Total Impact Summary */}
              <AnimatePresence>
                {visibleCards === currentScenario?.impacts.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="pt-4 border-t border-border"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-[hsl(var(--status-red))]/10">
                          <TrendingDown className="h-6 w-6 text-[hsl(var(--status-red))]" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Resilience Impact
                          </p>
                          <p className="text-3xl font-bold text-[hsl(var(--status-red))]">
                            {totalImpact} points
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={resetScenario}
                          className="gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reset
                        </Button>
                        <Button className="bg-[hsl(var(--nhs-blue))] hover:bg-[hsl(var(--nhs-dark-blue))] text-white">
                          View Full Analysis
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}));

ScenarioImpactVisualiser.displayName = 'ScenarioImpactVisualiser';

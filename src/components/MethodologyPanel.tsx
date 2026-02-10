import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  Coins,
  Building2,
  Users,
  Award,
  Leaf,
  Info,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MethodologyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const capitalDescriptions = [
  {
    name: 'Financial',
    icon: Coins,
    color: 'hsl(var(--status-red))',
    description:
      'Measures the organisation\'s financial health, sustainability, and ability to invest in resilience. Includes cash reserves, cost improvement delivery, and capital programme progress.',
  },
  {
    name: 'Operational',
    icon: Building2,
    color: 'hsl(var(--nhs-blue))',
    description:
      'Assesses the delivery of core services and operational performance. Covers A&E performance, bed occupancy, elective capacity, and critical infrastructure reliability.',
  },
  {
    name: 'Human',
    icon: Users,
    color: 'hsl(var(--status-amber))',
    description:
      'Evaluates workforce stability, wellbeing, and capability. Tracks vacancies, sickness absence, training compliance, and staff engagement scores.',
  },
  {
    name: 'Reputational',
    icon: Award,
    color: 'hsl(142, 76%, 36%)',
    description:
      'Monitors stakeholder confidence and public perception. Includes patient satisfaction, CQC ratings, complaints handling, and media sentiment.',
  },
  {
    name: 'Environmental',
    icon: Leaf,
    color: 'hsl(var(--status-green))',
    description:
      'Tracks physical infrastructure and sustainability. Covers estate condition, carbon emissions, energy efficiency, and climate adaptation readiness.',
  },
];

const whatThisToolIs = [
  'Strategic framework & foundation for resilience planning',
  'Assessment & planning tool for executive decision-making',
  'Governance dashboard for board-level oversight',
  'Methodology demonstration of Five Capitals approach',
];

const whatThisToolIsNot = [
  'NOT a simulation engine for tactical scenarios',
  'NOT predictive modelling for specific outcomes',
  'NOT technical execution for operational delivery',
];

const dataSources = [
  { color: '#005EB8', label: 'Public NHS Data', description: 'Published statistics from NHS England' },
  { color: '#00A651', label: 'CQC Reports', description: 'Care Quality Commission assessments' },
  { color: '#FFB81C', label: 'Industry Standards', description: 'NHS benchmarks and best practice' },
  { color: '#FF7518', label: 'ResilienC Assessment', description: 'Proprietary methodology inputs' },
  { color: '#DA291C', label: 'Illustrative Demo Data', description: 'Sample data for demonstration' },
];

const MethodologyPanel = ({ isOpen, onClose }: MethodologyPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
            onTouchMove={(e) => e.stopPropagation()}
          />

          {/* Panel - slides from LEFT */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed left-0 top-0 h-full bg-card shadow-2xl z-50 overflow-y-auto overscroll-contain
                       w-full md:w-[400px]"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b z-10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">About This Tool</h2>
                  <p className="text-sm text-[hsl(var(--nhs-blue))] font-medium mt-1">
                    ResilienC Five Capitals Framework
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* What This Tool IS */}
              <section>
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  What This Tool IS
                </h3>
                <ul className="space-y-3">
                  {whatThisToolIs.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[hsl(var(--status-green))] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* What This Tool IS NOT */}
              <section>
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  What This Tool IS NOT
                </h3>
                <ul className="space-y-3">
                  {whatThisToolIsNot.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-[hsl(var(--status-red))] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* The Five Capitals */}
              <section>
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  The Five Capitals
                </h3>
                <div className="space-y-3">
                  {capitalDescriptions.map((capital) => {
                    const Icon = capital.icon;
                    return (
                      <div
                        key={capital.name}
                        className="rounded-lg p-4 border-l-4"
                        style={{
                          borderLeftColor: capital.color,
                          backgroundColor: `${capital.color}08`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${capital.color}20` }}
                          >
                            <Icon className="h-4 w-4" style={{ color: capital.color }} />
                          </div>
                          <span className="font-semibold text-foreground text-sm">
                            {capital.name}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {capital.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* How Scores Are Calculated */}
              <section className="bg-muted/50 rounded-lg p-5">
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  How Scores Are Calculated
                </h3>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-[hsl(var(--nhs-blue))] flex-shrink-0 mt-0.5" />
                    <span>Each capital has 4-8 Key Risk Indicators (KRIs)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-[hsl(var(--nhs-blue))] flex-shrink-0 mt-0.5" />
                    <span>KRIs are assessed and weighted using ResilienC methodology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-[hsl(var(--nhs-blue))] flex-shrink-0 mt-0.5" />
                    <span>Exact weighting is proprietary, but framework is transparent</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-[hsl(var(--nhs-blue))] flex-shrink-0 mt-0.5" />
                    <span>
                      Click any{' '}
                      <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border text-[10px]">
                        i
                      </span>{' '}
                      icon to see data sources
                    </span>
                  </li>
                </ul>
              </section>

              {/* Strategic vs Simulation */}
              <section>
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  Strategic vs Simulation
                </h3>
                <div className="space-y-3">
                  <div className="bg-[hsl(var(--nhs-blue))]/5 rounded-lg p-4 border border-[hsl(var(--nhs-blue))]/20">
                    <p className="font-semibold text-[hsl(var(--nhs-blue))] text-sm mb-2">
                      This Tool (Strategy)
                    </p>
                    <p className="text-xs text-foreground">
                      What to test, where to invest, governance oversight
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <p className="font-semibold text-foreground text-sm mb-2">
                      Simulation Tools (Execution)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Detailed stress-testing, tactical validation
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                  </div>
                  <div className="bg-[hsl(var(--status-green))]/10 rounded-lg p-4 border border-[hsl(var(--status-green))]/20">
                    <p className="font-semibold text-[hsl(var(--status-green))] text-sm mb-2">
                      Together
                    </p>
                    <p className="text-xs text-foreground">Complete resilience solution</p>
                  </div>
                </div>
              </section>

              {/* Data Sources */}
              <section>
                <h3 className="font-semibold text-[hsl(var(--nhs-blue))] mb-4 text-base">
                  Data Sources
                </h3>
                <ul className="space-y-3">
                  {dataSources.map((source, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: source.color }}
                      />
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          {source.label}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          — {source.description}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MethodologyPanel;

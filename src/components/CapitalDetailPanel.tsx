import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ExternalLink,
  Coins,
  Building2,
  Users,
  Award,
  Leaf,
  LucideIcon,
  FlaskConical,
  FileText,
  Wallet,
} from 'lucide-react';
import { Capital, Trend } from '@/types';
import { capitalDetails, CapitalKRI, RecentChange } from '@/lib/capitalDetails';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'red':
      return 'hsl(var(--status-red))';
    case 'amber':
      return 'hsl(var(--status-amber))';
    case 'green':
      return 'hsl(var(--status-green))';
    default:
      return 'hsl(var(--muted-foreground))';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'red':
      return 'bg-[hsl(var(--status-red))]/10';
    case 'amber':
      return 'bg-[hsl(var(--status-amber))]/10';
    case 'green':
      return 'bg-[hsl(var(--status-green))]/10';
    default:
      return 'bg-muted';
  }
};

const getTrendIcon = (trend: Trend) => {
  switch (trend) {
    case 'improving':
      return <TrendingUp className="h-4 w-4 text-[hsl(var(--status-green))]" />;
    case 'declining':
      return <TrendingDown className="h-4 w-4 text-[hsl(var(--status-red))]" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const getTrendArrow = (trend: Trend) => {
  switch (trend) {
    case 'improving':
      return { symbol: '↑', color: 'text-[hsl(var(--status-green))]' };
    case 'declining':
      return { symbol: '↓', color: 'text-[hsl(var(--status-red))]' };
    default:
      return { symbol: '→', color: 'text-muted-foreground' };
  }
};

const getTrendLabel = (trend: Trend) => {
  switch (trend) {
    case 'improving':
      return 'Improving';
    case 'declining':
      return 'Declining';
    default:
      return 'Stable';
  }
};

const KRIRow = ({ kri, index }: { kri: CapitalKRI; index: number }) => {
  const trendArrow = getTrendArrow(kri.trend);

  return (
    <tr
      className={cn(
        'hover:bg-muted/50 transition-colors',
        index % 2 === 0 ? 'bg-[#F8F9FA]' : 'bg-white'
      )}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{kri.name}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-foreground text-background max-w-xs">
                <p className="text-xs">Data source: {kri.dataSource}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </td>
      <td className="px-4 py-3 font-semibold text-foreground">{kri.currentValue}</td>
      <td className="px-4 py-3">
        <span className={cn('text-lg font-bold', trendArrow.color)}>
          {trendArrow.symbol}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{kri.target}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{kri.commentary}</td>
    </tr>
  );
};

const TimelineItem = ({
  change,
  isLast,
}: {
  change: RecentChange;
  isLast: boolean;
}) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[hsl(var(--nhs-blue))] border-2 border-white shadow" />
        {!isLast && <div className="w-0.5 flex-1 bg-border mt-2" />}
      </div>
      <div className="pb-6">
        <p className="text-xs text-muted-foreground mb-1">
          {format(change.date, 'd MMM yyyy')}
        </p>
        <p className="text-sm text-foreground">{change.description}</p>
      </div>
    </div>
  );
};

const CapitalDetailPanel = ({ capital, isOpen, onClose }: CapitalDetailPanelProps) => {
  if (!capital) return null;

  const Icon = iconMap[capital.name] || Coins;
  const statusColor = getStatusColor(capital.status);
  const details = capitalDetails[capital.id];
  const trendArrow = getTrendArrow(capital.trend);

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
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 h-full bg-white shadow-2xl z-50 overflow-y-auto
                       w-full md:w-[600px] lg:w-1/2 lg:min-w-[600px]"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${statusColor}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: statusColor }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{capital.name}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={cn(trendArrow.color, 'text-lg font-bold')}
                        aria-hidden="true"
                      >
                        {trendArrow.symbol}
                      </span>
                      <span className={cn('text-sm', trendArrow.color)}>
                        {getTrendLabel(capital.trend)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Score Badge */}
                  <div
                    className="px-4 py-2 rounded-full text-white font-bold text-lg"
                    style={{ backgroundColor: statusColor }}
                  >
                    {capital.score}/100
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    aria-label="Close panel"
                  >
                    <X className="h-6 w-6 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Score Explanation */}
              <section
                className={cn('rounded-lg p-5', getStatusBgColor(capital.status))}
              >
                <h3 className="font-semibold text-foreground mb-2">Current Status</h3>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {details?.explanation || 'No explanation available.'}
                </p>
              </section>

              {/* Key Risk Indicators Table */}
              <section>
                <h3 className="font-semibold text-foreground mb-4">
                  Key Risk Indicators
                </h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          KRI
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Current
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Trend
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Target
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Commentary
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {details?.kris.map((kri, index) => (
                        <KRIRow key={kri.name} kri={kri} index={index} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Recent Changes Timeline */}
              <section>
                <h3 className="font-semibold text-foreground mb-4">Recent Changes</h3>
                <div className="pl-2">
                  {details?.recentChanges.map((change, index) => (
                    <TimelineItem
                      key={index}
                      change={change}
                      isLast={index === (details?.recentChanges.length || 0) - 1}
                    />
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="border-t pt-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-[hsl(var(--nhs-blue))] border-[hsl(var(--nhs-blue))]/30 hover:bg-[hsl(var(--nhs-blue))]/5"
                  >
                    <FileText className="h-4 w-4" />
                    View detailed resilience model
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-[hsl(var(--nhs-blue))] border-[hsl(var(--nhs-blue))]/30 hover:bg-[hsl(var(--nhs-blue))]/5"
                  >
                    <FlaskConical className="h-4 w-4" />
                    Scenario test: {details?.relevantScenario.split(' ').slice(0, 2).join(' ')}...
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-[hsl(var(--nhs-blue))] border-[hsl(var(--nhs-blue))]/30 hover:bg-[hsl(var(--nhs-blue))]/5"
                  >
                    <Wallet className="h-4 w-4" />
                    Review enhancement investments
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CapitalDetailPanel;

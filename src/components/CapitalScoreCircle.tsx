import { useState, useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, TrendingUp, TrendingDown, Minus, Coins, Building2, Users, Award, Leaf, LucideIcon } from 'lucide-react';
import { Capital } from '@/types';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import HistoricalSparkline from '@/components/HistoricalSparkline';
import { getCapitalHistory, CapitalHistoryPoint } from '@/lib/capitalHistoryData';

interface CapitalScoreCircleProps {
  capital: Capital;
  index: number;
  onClick?: () => void;
  dataTourId?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Financial: Coins,
  Operational: Building2,
  Human: Users,
  Reputational: Award,
  Environmental: Leaf,
};

const CapitalScoreCircle = memo(({ capital, index, onClick, dataTourId }: CapitalScoreCircleProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Get historical data for this capital
  const history: CapitalHistoryPoint[] = getCapitalHistory(capital.id);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = capital.score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= capital.score) {
        setAnimatedScore(capital.score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [capital.score]);

  const getStatusColor = useCallback((score: number) => {
    if (score >= 80) return '#00A651';
    if (score >= 60) return '#FFB81C';
    return '#DA291C';
  }, []);

  const getStatusLabel = useCallback((score: number) => {
    if (score >= 80) return 'Green';
    if (score >= 60) return 'Amber';
    return 'Red';
  }, []);

  const getTrendIcon = useCallback(() => {
    switch (capital.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" aria-hidden="true" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
    }
  }, [capital.trend]);

  const getTrendArrow = useCallback(() => {
    switch (capital.trend) {
      case 'improving':
        return '↑';
      case 'declining':
        return '↓';
      default:
        return '→';
    }
  }, [capital.trend]);

  const Icon = iconMap[capital.name] || Coins;
  const statusColor = getStatusColor(capital.score);
  const unfilledColor = '#E8EDEE';

  const pieData = [
    { name: 'score', value: animatedScore },
    { name: 'remaining', value: 100 - animatedScore },
  ];

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center"
      data-tour={dataTourId}
    >
      <div
        className={cn(
          'relative cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl p-2',
          isHovered && 'scale-105'
        )}
        style={{
          filter: isHovered ? `drop-shadow(0 0 20px ${statusColor}40)` : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`${capital.name} capital score: ${capital.score} out of 100, status ${getStatusLabel(capital.score)}, trend ${capital.trend}`}
      >
        {/* Icon above circle */}
        <div className="flex justify-center mb-2">
          <div
            className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5" style={{ color: statusColor }} aria-hidden="true" />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="90%"
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill={statusColor} />
                <Cell fill={unfilledColor} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-baseline">
              <span className="text-xl md:text-2xl font-bold text-foreground">
                {animatedScore}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          {/* DEMO badge in top-right */}
          <div className="absolute -top-1 -right-8 md:-right-10">
            <span className="text-[8px] md:text-[9px] font-bold tracking-wider bg-demo text-primary px-1.5 py-0.5 rounded border border-primary/30">
              DEMO
            </span>
          </div>

          {/* Trend arrow on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -right-1 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <span
                className={cn(
                  'text-lg font-bold',
                  capital.trend === 'improving' && 'text-success',
                  capital.trend === 'declining' && 'text-destructive',
                  capital.trend === 'stable' && 'text-muted-foreground'
                )}
              >
                {getTrendArrow()}
              </span>
            </motion.div>
          )}

          {/* Info Tooltip - positioned to avoid overlap */}
          <div className="absolute -top-1 -right-1 z-10" data-tour="info-icon">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <button 
                  className="w-5 h-5 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 shadow-sm"
                  aria-label={`More information about ${capital.name} capital`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="start"
                sideOffset={12}
                className="z-[1000] max-w-[300px] p-4 border-0 shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                style={{
                  backgroundColor: '#2C3E50',
                  color: '#FFFFFF',
                }}
              >
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/90">Score:</span>
                    <span className="text-white">
                      {capital.score}/100 ({getStatusLabel(capital.score)},{' '}
                      <span className="capitalize">{capital.trend}</span>)
                    </span>
                    {getTrendIcon()}
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Source:</span>{' '}
                    <span className="text-white">ResilienC Five Capitals Assessment</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Methodology:</span>{' '}
                    <span className="text-white">Weighted average of {capital.kris.length} Key Risk Indicators</span>
                  </div>
                  <div>
                    <span className="font-semibold text-white/90">Last Assessed:</span>{' '}
                    <span className="text-white">15 Jan 2025</span>
                  </div>
                  <p className="text-xs text-white/70 pt-2 border-t border-white/20 mt-2">
                    Click the circle to view detailed metrics
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Capital name */}
        <p className="mt-3 text-sm md:text-base font-semibold text-foreground text-center">
          {capital.name}
        </p>

        {/* Historical Sparkline */}
        <div className="mt-1">
          <HistoricalSparkline history={history} className="text-center" />
        </div>
      </div>
    </motion.div>
  );
});

CapitalScoreCircle.displayName = 'CapitalScoreCircle';

export default CapitalScoreCircle;

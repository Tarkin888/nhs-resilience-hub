import { useState, useEffect } from 'react';
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

interface CapitalScoreCircleProps {
  capital: Capital;
  index: number;
  onClick?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Financial: Coins,
  Operational: Building2,
  Human: Users,
  Reputational: Award,
  Environmental: Leaf,
};

const CapitalScoreCircle = ({ capital, index, onClick }: CapitalScoreCircleProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  const getStatusColor = (score: number) => {
    if (score >= 80) return '#00A651';
    if (score >= 60) return '#FFB81C';
    return '#DA291C';
  };

  const getStatusLabel = (score: number) => {
    if (score >= 80) return 'Green';
    if (score >= 60) return 'Amber';
    return 'Red';
  };

  const getTrendIcon = () => {
    switch (capital.trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendArrow = () => {
    switch (capital.trend) {
      case 'improving':
        return '↑';
      case 'declining':
        return '↓';
      default:
        return '→';
    }
  };

  const Icon = iconMap[capital.name] || Coins;
  const statusColor = getStatusColor(capital.score);
  const unfilledColor = '#E8EDEE';

  const pieData = [
    { name: 'score', value: animatedScore },
    { name: 'remaining', value: 100 - animatedScore },
  ];

  const handleClick = () => {
    onClick?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col items-center"
    >
      <div
        className={cn(
          'relative cursor-pointer transition-all duration-300',
          isHovered && 'scale-105'
        )}
        style={{
          filter: isHovered ? `drop-shadow(0 0 20px ${statusColor}40)` : 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Icon above circle */}
        <div className="flex justify-center mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Icon className="h-5 w-5" style={{ color: statusColor }} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative w-[120px] h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={55}
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
              <span className="text-4xl font-bold text-foreground">
                {animatedScore}
              </span>
              <span className="text-xl text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Trend arrow on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -right-1 top-1/2 -translate-y-1/2"
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

          {/* Info Tooltip */}
          <div className="absolute -top-1 -right-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="w-5 h-5 rounded-full bg-card border flex items-center justify-center hover:bg-muted transition-colors">
                  <Info className="h-3 w-3 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[300px] p-3 bg-[hsl(var(--tooltip-dark))] text-[hsl(var(--tooltip-dark-foreground))] border-0"
              >
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Score:</span>
                    <span>
                      {capital.score}/100 ({getStatusLabel(capital.score)},{' '}
                      <span className="capitalize">{capital.trend}</span>)
                    </span>
                    {getTrendIcon()}
                  </div>
                  <div>
                    <span className="font-semibold">Source:</span>{' '}
                    ResilienC Five Capitals Assessment
                  </div>
                  <div>
                    <span className="font-semibold">Methodology:</span>{' '}
                    Weighted average of {capital.kris.length} Key Risk Indicators
                  </div>
                  <div>
                    <span className="font-semibold">Last Assessed:</span>{' '}
                    15 Jan 2025
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Capital name */}
        <p className="mt-3 text-base font-semibold text-foreground text-center">
          {capital.name}
        </p>
      </div>
    </motion.div>
  );
};

export default CapitalScoreCircle;

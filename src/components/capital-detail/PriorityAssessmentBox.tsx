import { memo } from 'react';
import { AlertTriangle, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { PriorityAssessment, PriorityLevel } from '@/types/capitalDetails';
import { cn } from '@/lib/utils';

interface PriorityAssessmentBoxProps {
  assessment: PriorityAssessment;
}

const getLevelConfig = (level: PriorityLevel) => {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-[hsl(var(--status-red))]/10',
        border: 'border-[hsl(var(--status-red))]',
        textColor: 'text-[hsl(var(--status-red))]',
        icon: AlertTriangle,
        iconBg: 'bg-[hsl(var(--status-red))]/20'
      };
    case 'high':
      return {
        bg: 'bg-[hsl(var(--status-amber))]/10',
        border: 'border-[hsl(var(--status-amber))]',
        textColor: 'text-[hsl(var(--status-amber))]',
        icon: Zap,
        iconBg: 'bg-[hsl(var(--status-amber))]/20'
      };
    case 'medium':
      return {
        bg: 'bg-[hsl(var(--status-amber))]/5',
        border: 'border-[hsl(var(--status-amber))]/60',
        textColor: 'text-[hsl(var(--status-amber))]',
        icon: Info,
        iconBg: 'bg-[hsl(var(--status-amber))]/15'
      };
    case 'good':
    default:
      return {
        bg: 'bg-[hsl(var(--status-green))]/10',
        border: 'border-[hsl(var(--status-green))]',
        textColor: 'text-[hsl(var(--status-green))]',
        icon: Info,
        iconBg: 'bg-[hsl(var(--status-green))]/20'
      };
  }
};

const PriorityAssessmentBox = memo(({ assessment }: PriorityAssessmentBoxProps) => {
  // Don't render if show is false
  if (!assessment.show) {
    return null;
  }

  const config = getLevelConfig(assessment.level);
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={cn(
        'rounded-lg border-2 p-5',
        config.bg,
        config.border
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn('rounded-full p-2 shrink-0', config.iconBg)}>
          <Icon className={cn('h-5 w-5', config.textColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn('font-bold text-lg', config.textColor)}>
            ⚠️ {assessment.title}
          </h4>
          <p className={cn('mt-1 text-sm leading-relaxed', config.textColor, 'opacity-90')}>
            {assessment.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

PriorityAssessmentBox.displayName = 'PriorityAssessmentBox';

export default PriorityAssessmentBox;

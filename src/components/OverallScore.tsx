import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Capital } from '@/types';
import { cn } from '@/lib/utils';

interface OverallScoreProps {
  capitals: Capital[];
}

const OverallScore = memo(({ capitals }: OverallScoreProps) => {
  const overallScore = Math.round(
    capitals.reduce((acc, cap) => acc + cap.score, 0) / capitals.length
  );

  const getScoreColor = useCallback((score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning-foreground';
    return 'text-destructive';
  }, []);

  const getScoreLabel = useCallback((score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Moderate';
    return 'At Risk';
  }, []);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <section 
      className="bg-card rounded-lg border shadow-card p-4 sm:p-6 transition-all duration-300 hover:shadow-card-hover"
      aria-labelledby="overall-score-heading"
    >
      <h2 id="overall-score-heading" className="text-base sm:text-lg font-semibold text-foreground mb-4">
        Overall Resilience
      </h2>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative" role="img" aria-label={`Overall resilience score: ${overallScore} out of 100`}>
          <svg className="w-24 h-24 sm:w-28 sm:h-28 transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className={getScoreColor(overallScore)}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                strokeDasharray: circumference,
              }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className={cn('text-xl sm:text-2xl font-bold', getScoreColor(overallScore))}
            >
              {overallScore}
            </motion.span>
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <p className={cn('text-base sm:text-lg font-semibold', getScoreColor(overallScore))}>
            {getScoreLabel(overallScore)}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Based on {capitals.length} capital assessments
          </p>
          
          <div className="mt-3 space-y-1.5 sm:space-y-2">
            {capitals.map((capital) => (
              <div key={capital.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    capital.status === 'green' && 'bg-success',
                    capital.status === 'amber' && 'bg-warning',
                    capital.status === 'red' && 'bg-destructive'
                  )}
                  aria-hidden="true"
                />
                <span className="text-xs sm:text-sm text-foreground flex-1">{capital.name}</span>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">{capital.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

OverallScore.displayName = 'OverallScore';

export default OverallScore;

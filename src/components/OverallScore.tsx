import { motion } from 'framer-motion';
import { Capital } from '@/types';
import { cn } from '@/lib/utils';

interface OverallScoreProps {
  capitals: Capital[];
}

const OverallScore = ({ capitals }: OverallScoreProps) => {
  const overallScore = Math.round(
    capitals.reduce((acc, cap) => acc + cap.score, 0) / capitals.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning-foreground';
    return 'text-destructive';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Moderate';
    return 'At Risk';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Overall Resilience</h2>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <svg className="w-28 h-28 transform -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted"
            />
            <motion.circle
              cx="56"
              cy="56"
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
              className={cn('text-2xl font-bold', getScoreColor(overallScore))}
            >
              {overallScore}
            </motion.span>
          </div>
        </div>

        <div className="flex-1">
          <p className={cn('text-lg font-semibold', getScoreColor(overallScore))}>
            {getScoreLabel(overallScore)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {capitals.length} capital assessments
          </p>
          
          <div className="mt-3 space-y-2">
            {capitals.map((capital) => (
              <div key={capital.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full',
                    capital.status === 'green' && 'bg-success',
                    capital.status === 'amber' && 'bg-warning',
                    capital.status === 'red' && 'bg-destructive'
                  )}
                />
                <span className="text-sm text-foreground flex-1">{capital.name}</span>
                <span className="text-sm font-medium text-muted-foreground">{capital.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallScore;

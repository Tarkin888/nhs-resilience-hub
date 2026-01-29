import { memo } from 'react';
import { Brain, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AIPredictionCard from '@/components/AIPredictionCard';
import { aiPredictions } from '@/lib/aiPredictionsData';

const AIRiskPredictionSection = memo(() => {
  return (
    <section className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">AI Risk Prediction</h2>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium">
            BETA
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {aiPredictions.length} Predictions
        </span>
      </div>

      {/* Prediction Cards */}
      <div className="space-y-4">
        {aiPredictions.map((prediction, index) => (
          <AIPredictionCard key={prediction.id} prediction={prediction} index={index} />
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-[#EFF6FF] border border-[#93C5FD] rounded-md">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-1">AI Prediction Disclaimer</h4>
            <p className="text-sm text-muted-foreground">
              Predictions are based on machine learning analysis of historical data, current trends, and external factors. 
              These should be used as early warning indicators alongside clinical judgment and operational expertise. 
              Model accuracy improves with additional data and regular calibration.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

AIRiskPredictionSection.displayName = 'AIRiskPredictionSection';

export default AIRiskPredictionSection;

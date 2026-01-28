import { useState, memo } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const StatusLegend = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-[140px] sm:top-[120px] right-4 z-40">
      <div className="bg-card border rounded-lg shadow-lg overflow-hidden max-w-[280px]">
        {/* Header / Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors",
            isExpanded && "border-b"
          )}
          aria-expanded={isExpanded}
          aria-controls="status-legend-content"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
            <span>Status Legend</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id="status-legend-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-4 text-xs">
                {/* Status Indicators Section */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Status Indicators</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="w-3 h-3 rounded-full bg-success flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Green / Operational</span>
                        <p className="text-muted-foreground">Performing within target range</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3 h-3 rounded-full bg-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Amber / Degraded</span>
                        <p className="text-muted-foreground">Below target, action needed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-3 h-3 rounded-full bg-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-foreground">Red / At Risk</span>
                        <p className="text-muted-foreground">Critical threshold breached</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t" />

                {/* Capital Score Ranges Section */}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Capital Score Ranges</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-success" />
                        <span className="text-foreground">80–100</span>
                      </div>
                      <span className="text-muted-foreground">Resilient</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-warning" />
                        <span className="text-foreground">60–79</span>
                      </div>
                      <span className="text-muted-foreground">Adequate, risks identified</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-destructive" />
                        <span className="text-foreground">0–59</span>
                      </div>
                      <span className="text-muted-foreground">Vulnerable, urgent action</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

StatusLegend.displayName = 'StatusLegend';

export default StatusLegend;

import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, AlertTriangle, Info } from 'lucide-react';
import { CapitalDependency, capitalNodes } from '@/lib/capitalDependenciesData';
import { Button } from '@/components/ui/button';

interface DependencyDetailModalProps {
  dependency: CapitalDependency | null;
  isOpen: boolean;
  onClose: () => void;
}

const getCapitalName = (capitalId: string): string => {
  const node = capitalNodes.find(n => n.id === capitalId);
  return node?.name || capitalId;
};

const getCapitalStatus = (capitalId: string): 'red' | 'amber' | 'green' => {
  const node = capitalNodes.find(n => n.id === capitalId);
  return node?.status || 'green';
};

const getStatusColor = (status: 'red' | 'amber' | 'green'): string => {
  switch (status) {
    case 'red': return 'hsl(var(--status-red))';
    case 'amber': return 'hsl(var(--status-amber))';
    case 'green': return 'hsl(var(--status-green))';
  }
};

const getStrengthConfig = (strength: CapitalDependency['strength']) => {
  switch (strength) {
    case 'high':
      return { color: 'text-red-500', bgColor: 'bg-red-500/10', label: 'High Impact' };
    case 'medium':
      return { color: 'text-amber-500', bgColor: 'bg-amber-500/10', label: 'Medium Impact' };
    case 'low':
      return { color: 'text-green-500', bgColor: 'bg-green-500/10', label: 'Low Impact' };
  }
};

const formatMultiplier = (multiplier: number): string => {
  return `${Math.round(multiplier * 100)}%`;
};

const DependencyDetailModal = memo(({ dependency, isOpen, onClose }: DependencyDetailModalProps) => {
  if (!dependency) return null;

  const sourceName = getCapitalName(dependency.sourceCapital);
  const targetName = getCapitalName(dependency.targetCapital);
  const sourceStatus = getCapitalStatus(dependency.sourceCapital);
  const targetStatus = getCapitalStatus(dependency.targetCapital);
  const strengthConfig = getStrengthConfig(dependency.strength);

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                       w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-foreground">
                Dependency Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Visual source → target */}
              <div className="flex items-center justify-center gap-4 py-4">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${getStatusColor(sourceStatus)}20` }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ color: getStatusColor(sourceStatus) }}
                    >
                      {sourceName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">{sourceName}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <ArrowRight className="h-8 w-8 text-primary" />
                  <span className={`text-xs font-medium ${strengthConfig.color}`}>
                    {strengthConfig.label}
                  </span>
                </div>

                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${getStatusColor(targetStatus)}20` }}
                  >
                    <span 
                      className="text-lg font-bold"
                      style={{ color: getStatusColor(targetStatus) }}
                    >
                      {targetName.charAt(0)}
                    </span>
                  </div>
                  <span className="font-semibold text-foreground">{targetName}</span>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      How {sourceName} impacts {targetName}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {dependency.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Cascade Strength Indicator */}
              <div className={`rounded-lg p-4 ${strengthConfig.bgColor}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${strengthConfig.color}`} />
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Cascade Impact Strength
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`font-bold text-lg ${strengthConfig.color} capitalize`}>
                        {dependency.strength}
                      </span>
                      <span className="text-muted-foreground">
                        ({formatMultiplier(dependency.cascadeMultiplier)} multiplier effect)
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      A {dependency.strength} strength dependency means changes in {sourceName} capital 
                      will have a {dependency.strength === 'high' ? 'significant' : dependency.strength === 'medium' ? 'moderate' : 'minor'} cascading 
                      effect on {targetName} capital resilience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/30">
              <Button 
                onClick={onClose} 
                className="w-full"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

DependencyDetailModal.displayName = 'DependencyDetailModal';

export default DependencyDetailModal;

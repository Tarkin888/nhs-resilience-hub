import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MousePointer, Hand, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NetworkHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NetworkHelpModal = memo(({ isOpen, onClose }: NetworkHelpModalProps) => {
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
                       w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  How to Use This Graph
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close help modal"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Hover instruction */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <MousePointer className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Hover for Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Move your cursor over any capital node or connection line to see detailed 
                    information including scores, trends, and dependency explanations.
                  </p>
                </div>
              </div>

              {/* Click instruction */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Hand className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Click to Explore</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on a capital node to open its detailed view with Key Risk Indicators 
                    and recent changes. Click on connection lines to see full dependency analysis.
                  </p>
                </div>
              </div>

              {/* Connection meaning */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Understanding Connections</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-blue-500 rounded" style={{ height: '4px' }}></span>
                    <span>Thick lines = High impact dependency</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-blue-500 rounded" style={{ height: '2.5px' }}></span>
                    <span>Medium lines = Moderate impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-8 h-1 bg-blue-500 rounded" style={{ height: '1.5px' }}></span>
                    <span>Thin lines = Low impact</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/30">
              <Button onClick={onClose} className="w-full">
                Got it
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

NetworkHelpModal.displayName = 'NetworkHelpModal';

export default NetworkHelpModal;

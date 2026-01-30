import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScenarioCategoryHeader } from './ScenarioCategoryHeader';
import { ScenarioCard } from './ScenarioCard';
import { scenarioCategories, type EnhancedScenario } from '@/lib/scenarioLibraryData';

interface ScenarioLibraryProps {
  onRunScenario?: (scenario: EnhancedScenario) => void;
}

export const ScenarioLibrary = memo(function ScenarioLibrary({ onRunScenario }: ScenarioLibraryProps) {
  // Initialize expanded state with categories marked as defaultExpanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    scenarioCategories
      .filter(cat => cat.defaultExpanded)
      .map(cat => cat.id)
  );
  
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);
  
  const handleRunScenario = useCallback((scenario: EnhancedScenario) => {
    onRunScenario?.(scenario);
  }, [onRunScenario]);
  
  return (
    <Card className="bg-card shadow-card rounded-lg">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
          Scenario Testing Library
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Select and run resilience scenarios to test organizational readiness
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 sm:px-6">
        {scenarioCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <div key={category.id} className="space-y-3">
              <ScenarioCategoryHeader
                icon={category.icon}
                name={category.name}
                description={category.description}
                scenarioCount={category.scenarios.length}
                isExpanded={isExpanded}
                onToggle={() => toggleCategory(category.id)}
              />
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`category-content-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pl-2 sm:pl-4 pt-2 space-y-3">
                      {category.scenarios.map((scenario, index) => (
                        <motion.div
                          key={scenario.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05,
                            ease: 'easeOut'
                          }}
                        >
                          <ScenarioCard
                            scenario={scenario}
                            onRun={handleRunScenario}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
});

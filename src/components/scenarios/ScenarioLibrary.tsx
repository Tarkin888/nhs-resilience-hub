import { useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScenarioCategoryHeader } from './ScenarioCategoryHeader';
import { ScenarioCard } from './ScenarioCard';
import { scenarioCategories, type EnhancedScenario, type TestStatus } from '@/lib/scenarioLibraryData';
import { Filter } from 'lucide-react';

interface ScenarioLibraryProps {
  onRunScenario?: (scenario: EnhancedScenario) => void;
}

type StatusFilter = 'all' | TestStatus;

const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Scenarios' },
  { value: 'overdue', label: 'Overdue for Testing' },
  { value: 'due-soon', label: 'Due Soon' },
  { value: 'recent', label: 'Recently Tested' },
  { value: 'never-tested', label: 'Never Tested' },
];

export const ScenarioLibrary = memo(function ScenarioLibrary({ onRunScenario }: ScenarioLibraryProps) {
  // Initialize expanded state with categories marked as defaultExpanded
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    scenarioCategories
      .filter(cat => cat.defaultExpanded)
      .map(cat => cat.id)
  );
  
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  
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
  
  // Filter categories and their scenarios based on status filter
  const filteredCategories = useMemo(() => {
    if (statusFilter === 'all') {
      return scenarioCategories;
    }
    
    return scenarioCategories
      .map(category => ({
        ...category,
        scenarios: category.scenarios.filter(s => s.testStatus === statusFilter)
      }))
      .filter(category => category.scenarios.length > 0);
  }, [statusFilter]);
  
  // Count scenarios by status for display
  const statusCounts = useMemo(() => {
    let overdue = 0;
    let dueSoon = 0;
    let recent = 0;
    let neverTested = 0;
    
    scenarioCategories.forEach(cat => {
      cat.scenarios.forEach(s => {
        if (s.testStatus === 'overdue') overdue++;
        else if (s.testStatus === 'due-soon') dueSoon++;
        else if (s.testStatus === 'recent') recent++;
        else if (s.testStatus === 'never-tested') neverTested++;
      });
    });
    
    return { overdue, dueSoon, recent, neverTested };
  }, []);
  
  return (
    <Card className="bg-card shadow-card rounded-lg">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg sm:text-xl font-bold text-foreground">
              Scenario Testing Library
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select and run resilience scenarios to test organizational readiness
            </p>
          </div>
          
          {/* Status Filter and Summary */}
          <div className="flex items-center gap-3">
            {/* Quick status summary badges */}
            <div className="hidden md:flex items-center gap-2">
              {statusCounts.overdue > 0 && (
                <span 
                  className="px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded"
                  aria-label={`${statusCounts.overdue} overdue scenarios`}
                >
                  {statusCounts.overdue} Overdue
                </span>
              )}
              {statusCounts.neverTested > 0 && (
                <span 
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded"
                  aria-label={`${statusCounts.neverTested} never tested scenarios`}
                >
                  {statusCounts.neverTested} Untested
                </span>
              )}
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" aria-hidden="true" />
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                <SelectTrigger className="w-[180px] text-xs h-9" aria-label="Filter scenarios by test status">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusFilterOptions.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-xs">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 px-4 sm:px-6">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No scenarios match the selected filter.
          </div>
        ) : (
          filteredCategories.map((category) => {
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
          })
        )}
      </CardContent>
    </Card>
  );
});

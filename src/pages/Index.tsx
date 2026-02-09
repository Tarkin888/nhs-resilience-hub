import { useState, memo, useRef, useCallback } from 'react';
import DemoBanner from '@/components/common/DemoBanner';
import DataSourceLegend from '@/components/common/DataSourceLegend';
import Header from '@/components/Header';
import QuickStatsBar from '@/components/QuickStatsBar';
import FiveCapitalsDisplay from '@/components/FiveCapitalsDisplay';
import LiveRiskAlerts from '@/components/LiveRiskAlerts';
import EssentialServicesPanel from '@/components/EssentialServicesPanel';
import { ScenarioImpactVisualiser, ScenarioImpactVisualiserRef } from '@/components/ScenarioImpactVisualiser';
import { ScenarioLibrary } from '@/components/scenarios/ScenarioLibrary';

import DataSourcesModal from '@/components/DataSourcesModal';
import StatusLegend from '@/components/StatusLegend';
import AIRiskPredictionSection from '@/components/AIRiskPredictionSection';
import StatusFooter from '@/components/StatusFooter';
// import CapitalDependenciesNetwork from '@/components/dashboard/CapitalDependenciesNetwork';
import { Skeleton } from '@/components/ui/skeleton';
import { capitals, alerts, essentialServices } from '@/lib/data';
import type { EnhancedScenario } from '@/lib/scenarioLibraryData';

// Memoized section components for performance
const MemoizedFiveCapitalsDisplay = memo(FiveCapitalsDisplay);
const MemoizedLiveRiskAlerts = memo(LiveRiskAlerts);
const MemoizedEssentialServicesPanel = memo(EssentialServicesPanel);

const MemoizedAIRiskPredictionSection = memo(AIRiskPredictionSection);
const MemoizedStatusFooter = memo(StatusFooter);
// const MemoizedCapitalDependenciesNetwork = memo(CapitalDependenciesNetwork);

// Loading skeleton for sections
const SectionSkeleton = () => (
  <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
    <Skeleton className="h-6 w-48" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
);

const Index = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);
  const [runningScenarioId, setRunningScenarioId] = useState<string | null>(null);
  const visualiserRef = useRef<ScenarioImpactVisualiserRef>(null);

  // Handle scenario run from ScenarioLibrary
  const handleRunScenario = useCallback((scenario: EnhancedScenario) => {
    // Set the running scenario ID for loading state
    setRunningScenarioId(scenario.id);
    
    // First trigger the scenario execution in the visualiser (updates dropdown immediately)
    visualiserRef.current?.runScenarioById(scenario.id);
    
    // Then scroll to visualiser section with a slight delay to ensure the UI updates first
    requestAnimationFrame(() => {
      const visualiserElement = document.getElementById('scenario-impact-visualiser');
      if (visualiserElement) {
        // Use a small offset to account for sticky header
        const yOffset = -80;
        const y = visualiserElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  }, []);

  // Handle execution end
  const handleExecutionEnd = useCallback(() => {
    setRunningScenarioId(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner - Full bleed, sticky */}
      <DemoBanner 
        onMethodologyClick={() => setIsMethodologyOpen(true)} 
        onDataSourcesClick={() => setIsDataSourcesOpen(true)}
      />
      
      {/* Status Legend - Fixed position, top-right */}
      <StatusLegend />
      
      {/* Data Source Legend - Fixed position, bottom-right */}
      <DataSourceLegend position="bottom-right" />
      
      {/* Header - Full bleed */}
      <Header 
        isMethodologyOpen={isMethodologyOpen} 
        onMethodologyOpenChange={setIsMethodologyOpen}
      />
      
      {/* Quick Stats - 24px margin top */}
      <div className="mt-6">
        <QuickStatsBar />
      </div>
      
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Five Capitals Display - 32px margin top, 48px margin bottom */}
        <section className="mt-0 mb-12">
          <MemoizedFiveCapitalsDisplay 
            capitals={capitals} 
            onOpenMethodology={() => setIsMethodologyOpen(true)} 
          />
        </section>

        {/* Live Risk Alerts + Essential Services - Side-by-side, 24px gap */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemoizedLiveRiskAlerts alerts={alerts} />
          <MemoizedEssentialServicesPanel services={essentialServices} />
        </section>

        {/* Capital Dependencies Network - Hidden for now */}
        {/* <MemoizedCapitalDependenciesNetwork /> */}

        {/* Scenario Testing Library - Full width, between Essential Services and Impact Visualiser */}
        <section className="mt-8 mb-8">
          <ScenarioLibrary 
            onRunScenario={handleRunScenario} 
            runningScenarioId={runningScenarioId}
          />
        </section>

        {/* Scenario Impact Visualiser - 32px margin top, full width */}
        <section className="mt-8">
          <ScenarioImpactVisualiser 
            ref={visualiserRef} 
            id="scenario-impact-visualiser"
            onExecutionEnd={handleExecutionEnd}
          />
        </section>


        {/* AI Risk Prediction Section */}
        <MemoizedAIRiskPredictionSection />
      </main>

      {/* Enhanced Status Footer */}
      <MemoizedStatusFooter onOpenMethodology={() => setIsMethodologyOpen(true)} />

      {/* Data Sources Modal */}
      <DataSourcesModal isOpen={isDataSourcesOpen} onClose={() => setIsDataSourcesOpen(false)} />
    </div>
  );
};

export default Index;

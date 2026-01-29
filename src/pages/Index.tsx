import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import QuickStatsBar from '@/components/QuickStatsBar';
import FiveCapitalsDisplay from '@/components/FiveCapitalsDisplay';
import LiveRiskAlerts from '@/components/LiveRiskAlerts';
import EssentialServicesPanel from '@/components/EssentialServicesPanel';
import { ScenarioImpactVisualiser } from '@/components/ScenarioImpactVisualiser';
import CapitalCard from '@/components/CapitalCard';
import DataSourcesModal from '@/components/DataSourcesModal';
import StatusLegend from '@/components/StatusLegend';
import AIRiskPredictionSection from '@/components/AIRiskPredictionSection';
// import CapitalDependenciesNetwork from '@/components/dashboard/CapitalDependenciesNetwork';
import { Skeleton } from '@/components/ui/skeleton';
import { capitals, alerts, essentialServices } from '@/lib/data';

// Memoized section components for performance
const MemoizedFiveCapitalsDisplay = memo(FiveCapitalsDisplay);
const MemoizedLiveRiskAlerts = memo(LiveRiskAlerts);
const MemoizedEssentialServicesPanel = memo(EssentialServicesPanel);
const MemoizedScenarioImpactVisualiser = memo(ScenarioImpactVisualiser);
const MemoizedCapitalCard = memo(CapitalCard);
const MemoizedAIRiskPredictionSection = memo(AIRiskPredictionSection);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner - Full bleed, sticky */}
      <DemoBanner 
        onOpenMethodology={() => setIsMethodologyOpen(true)} 
        onOpenDataSources={() => setIsDataSourcesOpen(true)}
      />
      
      {/* Status Legend - Fixed position, top-right */}
      <StatusLegend />
      
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

        {/* Scenario Impact Visualiser - 32px margin top, full width */}
        <section className="mt-8">
          <MemoizedScenarioImpactVisualiser />
        </section>

        {/* Capital Cards Section */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Capital Details</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {capitals.map((capital, index) => (
              <MemoizedCapitalCard key={capital.id} capital={capital} index={index} />
            ))}
          </div>
        </section>

        {/* AI Risk Prediction Section */}
        <MemoizedAIRiskPredictionSection />
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
          <div className="space-y-4">
            {/* Built With */}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">Demo Application Built With:</p>
              <p className="text-sm text-muted-foreground">
                ResilienC Five Capitals Framework | xPercept.ai | Sector-Agnostic Resilience Methodology
              </p>
            </div>

            {/* Disclaimer */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This is a demonstration prototype using illustrative data. 
                St. Mary's NHS Foundation Trust is a fictional organization. Not affiliated with NHS England.
              </p>
            </div>

            {/* Support */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <strong>Support:</strong> For demo inquiries:{' '}
                <a 
                  href="mailto:demo@example.com"
                  className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  demo@example.com
                </a>
              </p>
            </div>

            {/* Copyright and Links */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-2 border-t border-border text-sm text-muted-foreground">
              <p>© 2026 ResilienC Framework</p>
              <span className="hidden md:inline">|</span>
              <div className="flex items-center gap-4">
                <Link 
                  to="/privacy"
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Privacy
                </Link>
                <Link 
                  to="/accessibility"
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Accessibility
                </Link>
                <button
                  onClick={() => setIsMethodologyOpen(true)}
                  className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  Methodology
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Data Sources Modal */}
      <DataSourcesModal isOpen={isDataSourcesOpen} onClose={() => setIsDataSourcesOpen(false)} />
    </div>
  );
};

export default Index;

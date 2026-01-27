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
import OverallScore from '@/components/OverallScore';
import GuidedTour from '@/components/GuidedTour';
import { Skeleton } from '@/components/ui/skeleton';
import { capitals, alerts, essentialServices } from '@/lib/data';

// Memoized section components for performance
const MemoizedFiveCapitalsDisplay = memo(FiveCapitalsDisplay);
const MemoizedLiveRiskAlerts = memo(LiveRiskAlerts);
const MemoizedEssentialServicesPanel = memo(EssentialServicesPanel);
const MemoizedScenarioImpactVisualiser = memo(ScenarioImpactVisualiser);
const MemoizedCapitalCard = memo(CapitalCard);
const MemoizedOverallScore = memo(OverallScore);

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
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleStartTour = () => {
    setIsTourOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Banner - Full bleed */}
      <DemoBanner onOpenMethodology={() => setIsMethodologyOpen(true)} />
      
      {/* Header - Full bleed */}
      <Header 
        isMethodologyOpen={isMethodologyOpen} 
        onMethodologyOpenChange={setIsMethodologyOpen}
        onStartTour={handleStartTour}
      />
      
      {/* Quick Stats - 24px margin top */}
      <div className="mt-6">
        <QuickStatsBar />
      </div>
      
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        {/* Five Capitals Display - 32px margin top, 48px margin bottom */}
        <section className="mt-0 mb-12">
          <MemoizedFiveCapitalsDisplay capitals={capitals} />
        </section>

        {/* Live Risk Alerts + Essential Services - Side-by-side, 24px gap */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MemoizedLiveRiskAlerts alerts={alerts} />
          <MemoizedEssentialServicesPanel services={essentialServices} />
        </section>

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

        {/* Overall Resilience Summary */}
        <section className="mt-8">
          <MemoizedOverallScore capitals={capitals} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 St. Mary's NHS Foundation Trust. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link 
                to="/privacy"
                className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/accessibility"
                className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Accessibility
              </Link>
              <a 
                href="mailto:support@stmarys-nhs.example.uk"
                className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Guided Tour */}
      <GuidedTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </div>
  );
};

export default Index;

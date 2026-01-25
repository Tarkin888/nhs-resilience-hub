import { useState } from 'react';
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
import { capitals, alerts, essentialServices } from '@/lib/data';

const Index = () => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const handleStartTour = () => {
    setIsTourOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner onOpenMethodology={() => setIsMethodologyOpen(true)} />
      <Header 
        isMethodologyOpen={isMethodologyOpen} 
        onMethodologyOpenChange={setIsMethodologyOpen}
        onStartTour={handleStartTour}
      />
      <QuickStatsBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Five Capitals Display - Centrepiece */}
        <FiveCapitalsDisplay capitals={capitals} />

        {/* Live Risk Alerts and Essential Services */}
        <div className="grid lg:grid-cols-2 gap-6 mt-8">
          {/* Left: Live Risk Alerts */}
          <div>
            <LiveRiskAlerts alerts={alerts} />
          </div>

          {/* Right: Essential Services Status */}
          <div>
            <EssentialServicesPanel services={essentialServices} />
          </div>
        </div>

        {/* Scenario Impact Visualiser - Full Width */}
        <section className="mt-8">
          <ScenarioImpactVisualiser />
        </section>

        {/* Capital Cards Section */}
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Capital Details</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {capitals.map((capital, index) => (
              <CapitalCard key={capital.id} capital={capital} index={index} />
            ))}
          </div>
        </section>

        {/* Overall Resilience Summary */}
        <section className="mt-8">
          <OverallScore capitals={capitals} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 St. Mary's NHS Foundation Trust. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Accessibility</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
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

import { format } from 'date-fns';
import DemoBanner from '@/components/DemoBanner';
import Header from '@/components/Header';
import CapitalCard from '@/components/CapitalCard';
import AlertPanel from '@/components/AlertPanel';
import ServiceStatus from '@/components/ServiceStatus';
import OverallScore from '@/components/OverallScore';
import { capitals, alerts, essentialServices } from '@/lib/data';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Resilience Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {format(new Date(), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>

        {/* Top Section: Overview and Alerts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <OverallScore capitals={capitals} />
          </div>
          <div className="lg:col-span-2">
            <AlertPanel alerts={alerts} />
          </div>
        </div>

        {/* Capital Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Capital Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {capitals.map((capital, index) => (
              <CapitalCard key={capital.id} capital={capital} index={index} />
            ))}
          </div>
        </section>

        {/* Essential Services */}
        <section>
          <ServiceStatus services={essentialServices} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2024 Example NHS Trust. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Accessibility</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

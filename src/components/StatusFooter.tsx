import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Database, Zap, Clock } from 'lucide-react';

interface StatusFooterProps {
  onOpenMethodology: () => void;
}

const StatusFooter = memo(({ onOpenMethodology }: StatusFooterProps) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Update timestamp every minute
    const timer = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = lastUpdated.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <footer className="mt-12 bg-gradient-to-r from-muted/50 to-muted border-t-2 border-border py-6">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {/* NHS-style logo */}
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-foreground" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                NHS Trust Resilience Dashboard
              </h3>
              <p className="text-xs text-muted-foreground">v2.1.0</p>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div 
          className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 text-sm"
          aria-label="System status indicators"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Data:</span>
            <span className="font-semibold text-primary">Real-time</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Systems:</span>
            <span className="font-semibold text-success">Operational</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Updated:</span>
            <span className="font-mono text-foreground text-xs">{formattedTime}</span>
          </div>
        </div>

        {/* Operational context */}
        <div 
          className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6"
          role="note"
          aria-label="Dashboard information"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> This is a demonstration prototype using illustrative data. 
            St. Mary's NHS Foundation Trust is a fictional organization. Not affiliated with NHS England.
            Data is simulated for demonstration purposes only.
          </p>
        </div>

        {/* Built With */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-foreground mb-1">Demo Application Built With:</p>
          <p className="text-sm text-muted-foreground">
            ResilienC Five Capitals Framework | xPercept.ai | Sector-Agnostic Resilience Methodology
          </p>
        </div>

        {/* Support */}
        <div className="text-center mb-4">
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
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
          <p>© 2026 ResilienC Framework</p>
          <span className="hidden md:inline">|</span>
          <p className="text-center">
            Powered by{' '}
            <span className="font-semibold text-primary">
              ResilienC Resilience Platform
            </span>
          </p>
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
              onClick={onOpenMethodology}
              className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              Methodology
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
});

StatusFooter.displayName = 'StatusFooter';

export default StatusFooter;

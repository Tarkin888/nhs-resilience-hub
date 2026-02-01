import { BarChart3, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface DemoBannerProps {
  organizationName?: string;
  onMethodologyClick?: () => void;
  onDataSourcesClick?: () => void;
}

const DemoBanner = ({ 
  organizationName = "St. Mary's NHS Foundation Trust",
  onMethodologyClick,
  onDataSourcesClick 
}: DemoBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full sticky top-0 z-50"
      style={{
        backgroundColor: '#E3F2FD',
        borderBottom: '1px solid #90CAF9',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      }}
      role="banner"
      aria-label="Demo mode notification banner"
    >
      <div className="max-w-[1400px] mx-auto px-6 py-4">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Left: Icon + DEMO MODE */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <BarChart3 className="h-5 w-5" style={{ color: '#1565C0' }} />
            <span 
              className="font-bold tracking-wide text-sm"
              style={{ color: '#1565C0' }}
            >
              DEMO MODE
            </span>
          </div>

          {/* Center: Description */}
          <p 
            className="text-sm text-center flex-1"
            style={{ color: '#424242' }}
          >
            Illustrative Data for {organizationName}
          </p>

          {/* Right: Links */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={onMethodologyClick}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
              style={{ color: '#1565C0' }}
            >
              Methodology Guide
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onDataSourcesClick}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
              style={{ color: '#1565C0' }}
            >
              Data Sources
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile layout - stacked vertically */}
        <div className="flex md:hidden flex-col items-center gap-3">
          {/* Top: Icon + DEMO MODE */}
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" style={{ color: '#1565C0' }} />
            <span 
              className="font-bold tracking-wide text-sm"
              style={{ color: '#1565C0' }}
            >
              DEMO MODE
            </span>
          </div>

          {/* Middle: Description */}
          <p 
            className="text-sm text-center"
            style={{ color: '#424242' }}
          >
            Illustrative Data for {organizationName}
          </p>

          {/* Bottom: Links */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMethodologyClick}
              className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
              style={{ color: '#1565C0' }}
            >
              Methodology Guide
              <ExternalLink className="h-3 w-3" />
            </button>
            <button
              onClick={onDataSourcesClick}
              className="flex items-center gap-1 text-xs font-medium transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded"
              style={{ color: '#1565C0' }}
            >
              Data Sources
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DemoBanner;

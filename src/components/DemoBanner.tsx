import { Info } from 'lucide-react';

const DemoBanner = () => {
  return (
    <div className="demo-banner flex items-center justify-center gap-2">
      <Info className="h-4 w-4" />
      <span>Demo Environment - Sample data for demonstration purposes only</span>
    </div>
  );
};

export default DemoBanner;

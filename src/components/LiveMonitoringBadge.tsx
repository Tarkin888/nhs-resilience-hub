import { memo } from 'react';

const LiveMonitoringBadge = memo(() => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg shadow-sm border">
      {/* Animated pulse dot */}
      <div className="relative flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-success rounded-full" />
        <div className="absolute w-2.5 h-2.5 bg-success rounded-full animate-ping opacity-75" />
      </div>
      
      {/* Text */}
      <span className="text-xs sm:text-sm text-foreground font-medium">
        <span className="hidden sm:inline">Live monitoring active</span>
        <span className="sm:hidden">Live</span>
      </span>
      
      {/* Status badge */}
      <span className="px-2 py-0.5 text-[10px] sm:text-xs font-medium text-success-foreground bg-success rounded-full">
        Operational
      </span>
    </div>
  );
});

LiveMonitoringBadge.displayName = 'LiveMonitoringBadge';

export default LiveMonitoringBadge;

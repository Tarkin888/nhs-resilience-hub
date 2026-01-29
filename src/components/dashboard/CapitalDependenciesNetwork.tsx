import { memo } from 'react';
import { capitalNodes, dependencies } from '@/lib/capitalDependenciesData';

const CapitalDependenciesNetwork = memo(() => {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Capital Dependencies Network
        </h2>
        <span className="text-sm font-medium text-primary">
          Interactive Graph
        </span>
      </div>
      
      <div 
        className="min-h-[500px] rounded-lg shadow-card bg-[#F8F9FA] p-6"
        role="img"
        aria-label="Capital dependencies network graph showing relationships between the five capitals"
      >
        {/* Placeholder for network visualization */}
        <div className="flex items-center justify-center h-full min-h-[450px] text-muted-foreground">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium">Network Graph Visualization</p>
            <p className="text-xs">
              {capitalNodes.length} capitals • {dependencies.length} dependencies
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

CapitalDependenciesNetwork.displayName = 'CapitalDependenciesNetwork';

export default CapitalDependenciesNetwork;

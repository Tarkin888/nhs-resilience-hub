import { memo, useMemo } from 'react';
import { capitalNodes, dependencies, CapitalNode } from '@/lib/capitalDependenciesData';

const getStrokeWidth = (strength: 'high' | 'medium' | 'low'): number => {
  switch (strength) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1.5;
  }
};

const CapitalDependenciesNetwork = memo(() => {
  const nodeMap = useMemo(() => {
    const map = new Map<string, CapitalNode>();
    capitalNodes.forEach(node => map.set(node.id, node));
    return map;
  }, []);

  const connectionLines = useMemo(() => {
    return dependencies.map(dep => {
      const source = nodeMap.get(dep.sourceCapital);
      const target = nodeMap.get(dep.targetCapital);
      
      if (!source || !target) return null;
      
      return {
        key: `${dep.sourceCapital}-${dep.targetCapital}`,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        strokeWidth: getStrokeWidth(dep.strength),
        strength: dep.strength,
      };
    }).filter(Boolean);
  }, [nodeMap]);

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
        className="min-h-[500px] rounded-lg shadow-card bg-[#F8F9FA] p-6 flex items-center justify-center"
        role="img"
        aria-label="Capital dependencies network graph showing relationships between the five capitals"
      >
        <svg 
          width={600} 
          height={400} 
          viewBox="0 0 500 400"
          className="overflow-visible"
        >
          {/* Connection lines - rendered first to appear behind nodes */}
          {connectionLines.map(line => line && (
            <line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#3B82F6"
              strokeWidth={line.strokeWidth}
              strokeOpacity={0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </svg>
      </div>
    </section>
  );
});

CapitalDependenciesNetwork.displayName = 'CapitalDependenciesNetwork';

export default CapitalDependenciesNetwork;

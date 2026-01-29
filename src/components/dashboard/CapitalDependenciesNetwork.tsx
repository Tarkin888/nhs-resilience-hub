import { memo, useMemo } from 'react';
import { Coins, Building2, Users, Award, Leaf, LucideIcon } from 'lucide-react';
import { capitalNodes, dependencies, CapitalNode } from '@/lib/capitalDependenciesData';

const getStrokeWidth = (strength: 'high' | 'medium' | 'low'): number => {
  switch (strength) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1.5;
  }
};

const getStatusColor = (status: 'red' | 'amber' | 'green'): string => {
  switch (status) {
    case 'red': return '#DC2626';
    case 'amber': return '#F59E0B';
    case 'green': return '#10B981';
  }
};

const iconMap: Record<string, LucideIcon> = {
  Coins,
  Building2,
  Users,
  Award,
  Leaf,
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
          {/* Drop shadow filter definition */}
          <defs>
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow 
                dx="2" 
                dy="2" 
                stdDeviation="4" 
                floodOpacity="0.2"
              />
            </filter>
          </defs>

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

          {/* Capital nodes - rendered after lines to appear on top */}
          {capitalNodes.map(node => {
            const Icon = iconMap[node.icon];
            
            return (
              <g 
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Circle background */}
                <circle
                  cx={0}
                  cy={0}
                  r={45}
                  fill={getStatusColor(node.status)}
                  stroke="white"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  filter="url(#dropShadow)"
                />
                
                {/* Icon - centered in circle using foreignObject */}
                <foreignObject 
                  x={-14} 
                  y={-16} 
                  width={28} 
                  height={28}
                >
                  <div className="flex items-center justify-center w-full h-full">
                    {Icon && (
                      <Icon 
                        size={28} 
                        color="#FFFFFF" 
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </foreignObject>
                
                {/* Capital name label */}
                <text
                  x={0}
                  y={60}
                  textAnchor="middle"
                  fill="#1F2937"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {node.name}
                </text>
                
                {/* Score label */}
                <text
                  x={0}
                  y={78}
                  textAnchor="middle"
                  fill="#6B7280"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                  }}
                >
                  {node.score}/100
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
});

CapitalDependenciesNetwork.displayName = 'CapitalDependenciesNetwork';

export default CapitalDependenciesNetwork;

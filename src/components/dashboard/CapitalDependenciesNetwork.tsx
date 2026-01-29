import { memo, useMemo, useState, useCallback } from 'react';
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
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodeMap = useMemo(() => {
    const map = new Map<string, CapitalNode>();
    capitalNodes.forEach(node => map.set(node.id, node));
    return map;
  }, []);

  // Find all nodes connected to a given node
  const getConnectedNodeIds = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>();
    dependencies.forEach(dep => {
      if (dep.sourceCapital === nodeId) {
        connected.add(dep.targetCapital);
      }
      if (dep.targetCapital === nodeId) {
        connected.add(dep.sourceCapital);
      }
    });
    return connected;
  }, []);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return new Set<string>();
    return getConnectedNodeIds(hoveredNodeId);
  }, [hoveredNodeId, getConnectedNodeIds]);

  const connectionLines = useMemo(() => {
    return dependencies.map(dep => {
      const source = nodeMap.get(dep.sourceCapital);
      const target = nodeMap.get(dep.targetCapital);
      
      if (!source || !target) return null;

      const isConnectedToHovered = hoveredNodeId && 
        (dep.sourceCapital === hoveredNodeId || dep.targetCapital === hoveredNodeId);
      
      return {
        key: `${dep.sourceCapital}-${dep.targetCapital}`,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        strokeWidth: getStrokeWidth(dep.strength) + (isConnectedToHovered ? 1 : 0),
        strength: dep.strength,
        isHighlighted: isConnectedToHovered,
      };
    }).filter(Boolean);
  }, [nodeMap, hoveredNodeId]);

  const handleMouseEnter = useCallback((nodeId: string) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

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
            <filter id="glowFilter" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
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
              strokeOpacity={line.isHighlighted ? 1.0 : 0.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'stroke-width 200ms ease, stroke-opacity 200ms ease',
              }}
            />
          ))}

          {/* Capital nodes - rendered after lines to appear on top */}
          {capitalNodes.map(node => {
            const Icon = iconMap[node.icon];
            const isHovered = hoveredNodeId === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const statusColor = getStatusColor(node.status);
            
            return (
              <g 
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => handleMouseEnter(node.id)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: 'pointer' }}
              >
                {/* Glow circle - shown when hovered */}
                {isHovered && (
                  <circle
                    cx={0}
                    cy={0}
                    r={55}
                    fill={statusColor}
                    opacity={0.3}
                    style={{
                      transition: 'opacity 200ms ease',
                    }}
                  />
                )}
                
                {/* Circle background */}
                <circle
                  cx={0}
                  cy={0}
                  r={isHovered ? 50 : 45}
                  fill={statusColor}
                  stroke="white"
                  strokeWidth={3}
                  strokeLinejoin="round"
                  filter="url(#dropShadow)"
                  opacity={hoveredNodeId && !isHovered && !isConnected ? 0.6 : 1}
                  style={{
                    transition: 'r 200ms ease, opacity 200ms ease',
                  }}
                />
                
                {/* Icon - centered in circle using foreignObject */}
                <foreignObject 
                  x={-14} 
                  y={-16} 
                  width={28} 
                  height={28}
                  style={{ pointerEvents: 'none' }}
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
                  y={isHovered ? 65 : 60}
                  textAnchor="middle"
                  fill="#1F2937"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'y 200ms ease',
                    pointerEvents: 'none',
                  }}
                >
                  {node.name}
                </text>
                
                {/* Score label */}
                <text
                  x={0}
                  y={isHovered ? 83 : 78}
                  textAnchor="middle"
                  fill="#6B7280"
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    transition: 'y 200ms ease',
                    pointerEvents: 'none',
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

import { memo, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Building2, Users, Award, Leaf, LucideIcon, HelpCircle, Monitor } from 'lucide-react';
import { capitalNodes, dependencies, CapitalNode, CapitalDependency } from '@/lib/capitalDependenciesData';
import { Capital } from '@/types';
import CapitalNodeTooltip from './CapitalNodeTooltip';
import ConnectionLineTooltip from './ConnectionLineTooltip';
import DependencyDetailModal from './DependencyDetailModal';
import NetworkHelpModal from './NetworkHelpModal';
import CapitalDetailPanel from '@/components/CapitalDetailPanel';
import { useIsMobile } from '@/hooks/use-mobile';

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

const getStatusLabel = (status: 'red' | 'amber' | 'green'): string => {
  switch (status) {
    case 'red': return 'Vulnerable';
    case 'amber': return 'Adequate';
    case 'green': return 'Resilient';
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
  const [hoveredLineId, setHoveredLineId] = useState<string | null>(null);
  const [selectedCapital, setSelectedCapital] = useState<Capital | null>(null);
  const [selectedDependency, setSelectedDependency] = useState<CapitalDependency | null>(null);
  const [isCapitalPanelOpen, setIsCapitalPanelOpen] = useState(false);
  const [isDependencyModalOpen, setIsDependencyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [focusedNodeIndex, setFocusedNodeIndex] = useState<number>(-1);
  const isMobile = useIsMobile();
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);

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

      const lineId = `${dep.sourceCapital}-${dep.targetCapital}`;
      const isConnectedToHovered = hoveredNodeId && 
        (dep.sourceCapital === hoveredNodeId || dep.targetCapital === hoveredNodeId);
      const isLineHovered = hoveredLineId === lineId;
      
      // Calculate stroke width with hover effects
      let strokeWidth = getStrokeWidth(dep.strength);
      if (isConnectedToHovered || isLineHovered) {
        strokeWidth += 1;
      }
      
      // Calculate stroke color - darker when line itself is hovered
      const strokeColor = isLineHovered ? '#2563EB' : '#3B82F6';
      
      // Calculate opacity
      const strokeOpacity = isConnectedToHovered || isLineHovered ? 1.0 : 0.6;
      
      return {
        key: lineId,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
        strokeWidth,
        strokeColor,
        strokeOpacity,
        strength: dep.strength,
        isHighlighted: isConnectedToHovered || isLineHovered,
      };
    }).filter(Boolean);
  }, [nodeMap, hoveredNodeId, hoveredLineId]);

  const handleLineMouseEnter = useCallback((lineId: string) => {
    setHoveredLineId(lineId);
  }, []);

  const handleLineMouseLeave = useCallback(() => {
    setHoveredLineId(null);
  }, []);

  const handleMouseEnter = useCallback((nodeId: string) => {
    setHoveredNodeId(nodeId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, []);

  // Convert CapitalNode to Capital type for the panel
  const convertToCapital = useCallback((node: CapitalNode): Capital => {
    return {
      id: node.id,
      name: node.name,
      score: node.score,
      status: node.status,
      trend: node.trend,
      kris: [], // KRIs are loaded from capitalDetails in the panel
    };
  }, []);

  const handleNodeClick = useCallback((node: CapitalNode) => {
    setSelectedCapital(convertToCapital(node));
    setIsCapitalPanelOpen(true);
  }, [convertToCapital]);

  const handleCloseCapitalPanel = useCallback(() => {
    setIsCapitalPanelOpen(false);
    // Delay clearing selected capital for exit animation
    setTimeout(() => setSelectedCapital(null), 300);
  }, []);

  const handleLineClick = useCallback((lineId: string) => {
    const [sourceId, targetId] = lineId.split('-');
    const dep = dependencies.find(
      d => d.sourceCapital === sourceId && d.targetCapital === targetId
    );
    if (dep) {
      setSelectedDependency(dep);
      setIsDependencyModalOpen(true);
    }
  }, []);

  const handleCloseDependencyModal = useCallback(() => {
    setIsDependencyModalOpen(false);
    setTimeout(() => setSelectedDependency(null), 300);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent, node: CapitalNode, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node);
    } else if (e.key === 'Tab') {
      setFocusedNodeIndex(e.shiftKey ? index - 1 : index + 1);
    }
  }, [handleNodeClick]);

  // Mobile message
  if (isMobile) {
    return (
      <section className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Capital Dependencies Network
          </h2>
        </div>
        <div className="min-h-[200px] rounded-lg shadow-card bg-[#F8F9FA] p-6 flex flex-col items-center justify-center gap-4">
          <Monitor className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground text-center">
            View on a larger screen to explore the interactive dependencies network
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="mt-8 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Capital Dependencies Network
        </h2>
        <button
          onClick={() => setIsHelpModalOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
          aria-label="Learn how to use the interactive graph"
        >
          <HelpCircle className="h-4 w-4" />
          Interactive Graph
        </button>
      </div>
      
      <div 
        className="min-h-[500px] rounded-lg shadow-card bg-[#F8F9FA] p-6 flex items-center justify-center lg:scale-100 md:scale-90 transition-transform"
        role="group"
        aria-label="Capital dependencies network graph showing relationships between the five capitals"
      >
        <svg 
          width={600} 
          height={400} 
          viewBox="0 0 500 400"
          className="overflow-visible"
          role="img"
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
          {connectionLines.map((line, index) => line && (
            <motion.line
              key={line.key}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.strokeColor}
              strokeWidth={line.strokeWidth}
              strokeOpacity={line.strokeOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
              onMouseEnter={() => handleLineMouseEnter(line.key)}
              onMouseLeave={handleLineMouseLeave}
              onClick={() => handleLineClick(line.key)}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: line.strokeOpacity }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
              style={{
                cursor: 'pointer',
                transition: 'stroke-width 200ms ease, stroke 200ms ease',
              }}
              role="button"
              tabIndex={0}
              aria-label={`Dependency from ${line.key.split('-')[0]} to ${line.key.split('-')[1]}`}
            />
          ))}

          {/* Capital nodes - rendered after lines to appear on top */}
          {capitalNodes.map((node, index) => {
            const Icon = iconMap[node.icon];
            const isHovered = hoveredNodeId === node.id;
            const isConnected = connectedNodeIds.has(node.id);
            const statusColor = getStatusColor(node.status);
            const isFocused = focusedNodeIndex === index;
            
            return (
              <motion.g 
                key={node.id}
                ref={(el) => { nodeRefs.current[index] = el; }}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => handleMouseEnter(node.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleNodeClick(node)}
                onKeyDown={(e) => handleKeyDown(e, node, index)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                style={{ cursor: 'pointer' }}
                tabIndex={0}
                role="button"
                aria-label={`${node.name} Capital - Score ${node.score}/100 - ${getStatusLabel(node.status)}`}
              >
                {/* Focus ring for keyboard navigation */}
                {isFocused && (
                  <circle
                    cx={0}
                    cy={0}
                    r={52}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    strokeDasharray="4 2"
                  />
                )}
                
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
              </motion.g>
            );
          })}

          {/* Node Tooltip - rendered last to appear on top */}
          {hoveredNodeId && nodeMap.get(hoveredNodeId) && (
            <CapitalNodeTooltip 
              node={nodeMap.get(hoveredNodeId)!}
              x={nodeMap.get(hoveredNodeId)!.x}
              y={nodeMap.get(hoveredNodeId)!.y}
            />
          )}

          {/* Connection Line Tooltip */}
          {hoveredLineId && (() => {
            const [sourceId, targetId] = hoveredLineId.split('-');
            const dep = dependencies.find(
              d => d.sourceCapital === sourceId && d.targetCapital === targetId
            );
            const source = nodeMap.get(sourceId);
            const target = nodeMap.get(targetId);
            
            if (!dep || !source || !target) return null;
            
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;
            
            return (
              <ConnectionLineTooltip 
                dependency={dep}
                x={midX}
                y={midY}
              />
            );
          })()}
        </svg>
      </div>

      {/* Capital Detail Panel */}
      <CapitalDetailPanel 
        capital={selectedCapital}
        isOpen={isCapitalPanelOpen}
        onClose={handleCloseCapitalPanel}
      />

      {/* Dependency Detail Modal */}
      <DependencyDetailModal
        dependency={selectedDependency}
        isOpen={isDependencyModalOpen}
        onClose={handleCloseDependencyModal}
      />

      {/* Help Modal */}
      <NetworkHelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </motion.section>
  );
});

CapitalDependenciesNetwork.displayName = 'CapitalDependenciesNetwork';

export default CapitalDependenciesNetwork;

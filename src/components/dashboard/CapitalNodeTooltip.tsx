import { memo } from 'react';
import { CapitalNode } from '@/lib/capitalDependenciesData';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CapitalNodeTooltipProps {
  node: CapitalNode;
  x: number;
  y: number;
}

const getTrendIcon = (trend: CapitalNode['trend']) => {
  switch (trend) {
    case 'improving':
      return <TrendingUp size={14} className="text-green-400" />;
    case 'declining':
      return <TrendingDown size={14} className="text-red-400" />;
    case 'stable':
      return <Minus size={14} className="text-gray-400" />;
  }
};

const getTrendLabel = (trend: CapitalNode['trend']) => {
  switch (trend) {
    case 'improving': return 'Improving';
    case 'declining': return 'Declining';
    case 'stable': return 'Stable';
  }
};

const getStatusLabel = (status: CapitalNode['status']) => {
  switch (status) {
    case 'green': return 'Resilient';
    case 'amber': return 'Adequate';
    case 'red': return 'Vulnerable';
  }
};

const CapitalNodeTooltip = memo(({ node, x, y }: CapitalNodeTooltipProps) => {
  // Position tooltip above node, centered
  const tooltipX = x;
  const tooltipY = y - 75; // 20px above node (node radius ~50 + offset)

  return (
    <g 
      transform={`translate(${tooltipX}, ${tooltipY})`}
      style={{ pointerEvents: 'none' }}
    >
      <foreignObject 
        x={-120} 
        y={-70} 
        width={240} 
        height={90}
        style={{ overflow: 'visible' }}
      >
        <div 
          className="animate-fade-in"
          style={{
            background: '#2C3E50',
            color: 'white',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '240px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Capital name */}
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>
            {node.name} Capital
          </div>
          
          {/* Score and status */}
          <div style={{ fontSize: '13px', color: '#E5E7EB', marginBottom: '2px' }}>
            Score: {node.score}/100 ({getStatusLabel(node.status)})
          </div>
          
          {/* Trend */}
          <div style={{ 
            fontSize: '13px', 
            color: '#E5E7EB', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            marginBottom: '4px' 
          }}>
            Trend: {getTrendIcon(node.trend)} {getTrendLabel(node.trend)}
          </div>
          
          {/* Helper text */}
          <div style={{ fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic' }}>
            Click to view details
          </div>
        </div>
        
        {/* Arrow pointing down to node */}
        <div 
          style={{
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: '12px',
            height: '12px',
            background: '#2C3E50',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </foreignObject>
    </g>
  );
});

CapitalNodeTooltip.displayName = 'CapitalNodeTooltip';

export default CapitalNodeTooltip;

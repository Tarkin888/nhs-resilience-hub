import { memo } from 'react';
import { CapitalDependency, capitalNodes } from '@/lib/capitalDependenciesData';

interface ConnectionLineTooltipProps {
  dependency: CapitalDependency;
  x: number;
  y: number;
}

const getStrengthColor = (strength: CapitalDependency['strength']) => {
  switch (strength) {
    case 'high': return '#F87171'; // Red-400
    case 'medium': return '#FBBF24'; // Amber-400
    case 'low': return '#34D399'; // Green-400
  }
};

const getCapitalName = (capitalId: string): string => {
  const node = capitalNodes.find(n => n.id === capitalId);
  return node?.name || capitalId;
};

const formatMultiplier = (multiplier: number): string => {
  return `${Math.round(multiplier * 100)}%`;
};

const ConnectionLineTooltip = memo(({ dependency, x, y }: ConnectionLineTooltipProps) => {
  // Position tooltip at midpoint, offset to the right and up
  const tooltipX = x + 30;
  const tooltipY = y - 20;

  const sourceName = getCapitalName(dependency.sourceCapital);
  const targetName = getCapitalName(dependency.targetCapital);
  const strengthColor = getStrengthColor(dependency.strength);

  return (
    <g 
      transform={`translate(${tooltipX}, ${tooltipY})`}
      style={{ pointerEvents: 'none' }}
    >
      <foreignObject 
        x={0} 
        y={-80} 
        width={320} 
        height={120}
        style={{ overflow: 'visible' }}
      >
        <div 
          className="animate-fade-in"
          style={{
            background: '#2C3E50',
            color: 'white',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '320px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Dependency title */}
          <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
            {sourceName} → {targetName} Dependency
          </div>
          
          {/* Explanation text */}
          <div style={{ 
            fontSize: '13px', 
            color: '#E5E7EB', 
            marginBottom: '10px',
            lineHeight: '1.4',
          }}>
            {dependency.explanation}
          </div>
          
          {/* Impact cascade strength */}
          <div style={{ 
            fontSize: '13px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
          }}>
            <span style={{ color: '#9CA3AF' }}>Impact Cascade:</span>
            <span 
              style={{ 
                color: strengthColor, 
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {dependency.strength}
            </span>
            <span style={{ color: '#9CA3AF' }}>
              ({formatMultiplier(dependency.cascadeMultiplier)})
            </span>
          </div>
        </div>
      </foreignObject>
    </g>
  );
});

ConnectionLineTooltip.displayName = 'ConnectionLineTooltip';

export default ConnectionLineTooltip;

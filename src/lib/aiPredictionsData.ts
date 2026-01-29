import { LucideIcon, Bed, DollarSign, Users } from 'lucide-react';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type Trend = 'increasing' | 'decreasing' | 'stable';
export type Confidence = 'high' | 'medium' | 'low';
export type ImpactType = 'operational' | 'financial' | 'human' | 'reputational' | 'environmental';

export interface RiskDriver {
  name: string;
  severity: Severity;
  trend: Trend;
}

export interface AIPrediction {
  id: string;
  icon: LucideIcon;
  title: string;
  severity: Severity;
  description: string;
  probability: number;
  confidence: Confidence;
  timeframe: string;
  impactType: ImpactType;
  keyRiskDrivers: RiskDriver[];
  preventiveActions: string[];
}

export const aiPredictions: AIPrediction[] = [
  {
    id: 'critical-care-capacity',
    icon: Bed,
    title: 'Critical Care Capacity Crisis',
    severity: 'critical',
    description: 'Predicted critical care capacity crisis with potential service disruption',
    probability: 78,
    confidence: 'high',
    timeframe: '14 days',
    impactType: 'operational',
    keyRiskDrivers: [
      { name: 'Seasonal flu surge', severity: 'critical', trend: 'increasing' },
      { name: 'Bed occupancy trend', severity: 'critical', trend: 'increasing' },
      { name: 'Staff leave patterns', severity: 'high', trend: 'increasing' },
      { name: 'Emergency admissions', severity: 'high', trend: 'increasing' }
    ],
    preventiveActions: [
      'Implement winter surge protocols early',
      'Review and restrict non-essential leave',
      'Activate mutual aid agreements',
      'Increase discharge planning capacity'
    ]
  },
  {
    id: 'financial-resilience',
    icon: DollarSign,
    title: 'Financial Resilience Declining',
    severity: 'high',
    description: 'High probability of Q4 financial deficit impacting operational capacity',
    probability: 63,
    confidence: 'medium',
    timeframe: 'Q4 2025',
    impactType: 'financial',
    keyRiskDrivers: [
      { name: 'Agency spend variance', severity: 'critical', trend: 'increasing' },
      { name: 'Elective surgery cancellations', severity: 'critical', trend: 'increasing' },
      { name: 'Winter pressures costs', severity: 'high', trend: 'increasing' },
      { name: 'Energy cost inflation', severity: 'medium', trend: 'stable' }
    ],
    preventiveActions: [
      'Accelerate cost improvement programme',
      'Review agency usage policies',
      'Prioritise high-value elective procedures',
      'Negotiate emergency funding arrangements'
    ]
  },
  {
    id: 'workforce-burnout',
    icon: Users,
    title: 'Workforce Burnout Escalation',
    severity: 'medium',
    description: 'Predicted significant increase in staff turnover and sickness absence',
    probability: 45,
    confidence: 'medium',
    timeframe: '8 weeks',
    impactType: 'human',
    keyRiskDrivers: [
      { name: 'Current sickness absence rate', severity: 'high', trend: 'increasing' },
      { name: 'Wellbeing survey scores', severity: 'critical', trend: 'decreasing' },
      { name: 'Overtime hours', severity: 'high', trend: 'increasing' },
      { name: 'Exit interview feedback', severity: 'medium', trend: 'stable' }
    ],
    preventiveActions: [
      'Launch enhanced wellbeing programme',
      'Review shift patterns and workload',
      'Implement rapid recruitment initiatives',
      'Increase management support visibility'
    ]
  }
];

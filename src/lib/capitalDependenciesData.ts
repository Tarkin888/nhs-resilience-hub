export interface CapitalNode {
  id: string;
  name: 'Financial' | 'Operational' | 'Human' | 'Reputational' | 'Environmental';
  score: number;
  status: 'red' | 'amber' | 'green';
  trend: 'improving' | 'declining' | 'stable';
  icon: string;
  x: number;
  y: number;
}

export interface CapitalDependency {
  sourceCapital: string;
  targetCapital: string;
  strength: 'high' | 'medium' | 'low';
  explanation: string;
  cascadeMultiplier: number;
}

export const capitalNodes: CapitalNode[] = [
  {
    id: 'financial',
    name: 'Financial',
    score: 68,
    status: 'amber',
    trend: 'stable',
    icon: 'Coins',
    x: 200,
    y: 150,
  },
  {
    id: 'operational',
    name: 'Operational',
    score: 72,
    status: 'green',
    trend: 'improving',
    icon: 'Building2',
    x: 400,
    y: 250,
  },
  {
    id: 'human',
    name: 'Human',
    score: 54,
    status: 'red',
    trend: 'declining',
    icon: 'Users',
    x: 100,
    y: 250,
  },
  {
    id: 'reputational',
    name: 'Reputational',
    score: 81,
    status: 'green',
    trend: 'improving',
    icon: 'Award',
    x: 300,
    y: 350,
  },
  {
    id: 'environmental',
    name: 'Environmental',
    score: 45,
    status: 'red',
    trend: 'declining',
    icon: 'Leaf',
    x: 250,
    y: 50,
  },
];

export const dependencies: CapitalDependency[] = [
  {
    sourceCapital: 'human',
    targetCapital: 'financial',
    strength: 'high',
    explanation: 'Staff shortages increase agency costs and reduce productivity, directly impacting financial reserves',
    cascadeMultiplier: 1.8,
  },
  {
    sourceCapital: 'human',
    targetCapital: 'operational',
    strength: 'high',
    explanation: 'Workforce availability directly determines service delivery capacity and operational continuity',
    cascadeMultiplier: 2.0,
  },
  {
    sourceCapital: 'environmental',
    targetCapital: 'operational',
    strength: 'medium',
    explanation: 'Facility condition and climate resilience affect ability to maintain service operations',
    cascadeMultiplier: 1.5,
  },
  {
    sourceCapital: 'environmental',
    targetCapital: 'financial',
    strength: 'medium',
    explanation: 'Building maintenance costs and energy efficiency impact operational budgets',
    cascadeMultiplier: 1.3,
  },
  {
    sourceCapital: 'operational',
    targetCapital: 'reputational',
    strength: 'high',
    explanation: 'Service quality and delivery reliability directly influence public trust and regulatory standing',
    cascadeMultiplier: 1.7,
  },
  {
    sourceCapital: 'financial',
    targetCapital: 'operational',
    strength: 'medium',
    explanation: 'Budget constraints limit equipment investment, maintenance, and service expansion',
    cascadeMultiplier: 1.4,
  },
  {
    sourceCapital: 'financial',
    targetCapital: 'human',
    strength: 'medium',
    explanation: 'Financial health affects recruitment capability, training investment, and staff retention',
    cascadeMultiplier: 1.5,
  },
];

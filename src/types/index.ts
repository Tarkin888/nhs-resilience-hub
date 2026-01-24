export type CapitalName = 'Financial' | 'Operational' | 'Human' | 'Reputational' | 'Environmental';
export type Status = 'red' | 'amber' | 'green';
export type Trend = 'improving' | 'stable' | 'declining';
export type SourceType = 'public' | 'cqc' | 'standard' | 'assessment' | 'demo';
export type ServiceStatus = 'operational' | 'degraded' | 'at-risk';

export interface KRI {
  name: string;
  value: string;
  trend: Trend;
  commentary: string;
  dataSource: string;
  sourceType: SourceType;
  lastUpdated: Date;
}

export interface Capital {
  id: string;
  name: CapitalName;
  score: number; // 0-100
  status: Status;
  trend: Trend;
  kris: KRI[];
}

export interface Alert {
  id: string;
  severity: Status;
  title: string;
  description: string;
  timestamp: Date;
  relatedCapital: string;
  actionUrl: string;
}

export interface EssentialService {
  id: string;
  name: string;
  status: ServiceStatus;
  reason: string;
  lastUpdated: Date;
  impactTolerance: string;
  criticalPathways: string[];
}

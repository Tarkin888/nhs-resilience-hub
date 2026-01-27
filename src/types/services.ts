export type ServiceStatusType = 'operational' | 'degraded' | 'at-risk';
export type CriticalityLevel = 'critical' | 'high' | 'medium' | 'low';
export type TestType = 'desktop' | 'live' | 'simulation';
export type TestOutcome = 'well-managed' | 'adequate' | 'poor';
export type TrendDirection = 'improving' | 'stable' | 'declining';
export type RAGStatus = 'red' | 'amber' | 'green';
export type DependencyType = 'facility' | 'equipment' | 'it' | 'staff' | 'supplier' | 'utility' | 'partner';

export interface ImpactToleranceLevel {
  definition: string;
  clinicalHarm: string;
  regulatoryBreach: string;
  reputationalImpact: string;
}

export interface ServiceMetric {
  name: string;
  currentValue: string;
  target: string;
  trend: TrendDirection;
  status: RAGStatus;
  history: Array<{ date: string; value: number }>;
  dataSource: string;
}

export interface Dependency {
  name: string;
  type: DependencyType;
  criticality: CriticalityLevel;
  singlePointOfFailure: boolean;
}

export interface MitigationAction {
  action: string;
  status: 'completed' | 'in-progress' | 'planned';
}

export interface ResilienceTest {
  date: Date;
  type: TestType;
  outcome: TestOutcome;
  vulnerabilities: string[];
  mitigations: MitigationAction[];
}

export interface NextTest {
  date: Date;
  type: string;
  scenario: string;
}

export interface ContingencyPlans {
  degradationProtocols: string;
  alternativeDelivery: string;
  mutualAid: string;
  recoveryPrioritisation: string;
}

export interface DetailedEssentialService {
  id: string;
  name: string;
  status: ServiceStatusType;
  statusReason: string;
  lastUpdated: Date;
  executiveOwner: string;
  lastTested: Date;
  
  // Definition
  description: string;
  criticalPathways: string[];
  regulatoryRequirements: string[];
  communityImpact: string;
  
  // Impact Tolerances
  impactTolerances: {
    fullService: ImpactToleranceLevel;
    degradedService: ImpactToleranceLevel;
    minimumViable: ImpactToleranceLevel;
    serviceFailure: ImpactToleranceLevel;
  };
  
  // Performance
  metrics: ServiceMetric[];
  
  // Dependencies
  internalDependencies: Dependency[];
  externalDependencies: Dependency[];
  
  // Testing
  resilienceTesting: {
    lastTest: ResilienceTest;
    nextTest: NextTest;
  };
  
  // Contingency
  contingencyPlans: ContingencyPlans;
}

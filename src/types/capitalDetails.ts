import { Trend } from './index';

export type KRIStatus = 'red' | 'amber' | 'green';
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'good';
export type ActionPriority = 'high' | 'medium' | 'low';
export type SourceType = 'public' | 'cqc' | 'standard' | 'assessment' | 'demo';

export interface DataSource {
  name: string;
  sourceType: SourceType;
  nationalAverage?: string;
  trustValue?: string;
  lastUpdated: Date;
  methodology?: string;
  url?: string;
}

export interface EnhancedKRI {
  id: string;
  name: string;
  value: string | number;
  numericValue?: number;
  target?: string | number;
  numericTarget?: number;
  trend: 'improving' | 'worsening' | 'stable';
  status: KRIStatus;
  commentary: string;
  dataSource: DataSource;
  showProgressBar: boolean;
}

export interface RecommendedAction {
  id: string;
  number: number;
  title: string;
  priority: ActionPriority;
  owner: string;
  clickable: boolean;
}

export interface PriorityAssessment {
  level: PriorityLevel;
  title: string;
  description: string;
  show: boolean;
}

export interface EnhancedCapitalDetail {
  capitalId: string;
  capitalName: string;
  score: number;
  status: KRIStatus;
  trend: Trend;
  scoreExplanation: string;
  kris: EnhancedKRI[];
  recommendedActions: RecommendedAction[];
  priorityAssessment: PriorityAssessment;
}

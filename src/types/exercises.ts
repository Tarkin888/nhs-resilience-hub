// Exercise and Scenario Testing Types

export interface Exercise {
  id: string;
  name: string;
  type: 'desktop' | 'live' | 'simulation';
  scenarioId: string;
  scenarioName: string;
  scenarioCategory: 'clinical' | 'operational' | 'environmental' | 'cyber' | 'workforce';
  duration: string;
  participants: string[];
  objectives: string[];
  facilitator: string;
  status: 'template' | 'scheduled' | 'completed';
  lastRun?: Date;
  materialsRequired: string[];
}

export interface ExerciseInject {
  id: string;
  timeMarker: string; // "T+0", "T+2hrs"
  description: string;
  facilitatorPrompts: string[];
  expectedResponses?: string[];
}

export interface EvaluationCriterion {
  id: string;
  criterion: string;
  targetOutcome: string;
  result?: 'yes' | 'no' | 'partial';
}

export interface ExercisePackage {
  exercise: Exercise;
  injects: ExerciseInject[];
  evaluationCriteria: EvaluationCriterion[];
  debriefQuestions: string[];
}

export interface CapitalImpact {
  capitalName: string;
  preScore: number;
  postScore: number;
  change: number;
  recoveryTime: string;
}

export interface DecisionReview {
  id: string;
  description: string;
  choiceMade: string;
  outcome: 'positive' | 'neutral' | 'negative';
  alternatives: string[];
  recommendation: string;
}

export interface Vulnerability {
  id: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  mitigation: string;
  owner: string;
  dueDate: Date;
  status: 'identified' | 'planned' | 'in-progress' | 'completed';
}

export interface Action {
  id: string;
  description: string;
  owner: string;
  dueDate: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  completionDate?: Date;
  notes?: string;
}

export interface ComparisonData {
  previousDate: Date;
  previousOutcome: 'well-managed' | 'adequate' | 'poor';
  improvements: string[];
  deteriorations: string[];
  capitalComparison: Array<{
    capitalName: string;
    previousChange: number;
    currentChange: number;
  }>;
}

export interface ExerciseResult {
  id: string;
  exerciseId: string;
  exerciseName: string;
  date: Date;
  participants: string[];
  outcome: 'well-managed' | 'adequate' | 'poor';
  impactAnalysis: CapitalImpact[];
  decisionsReviewed: DecisionReview[];
  vulnerabilities: Vulnerability[];
  actions: Action[];
  comparisonWithPrevious?: ComparisonData;
}

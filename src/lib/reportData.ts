// Report generation data types and utilities
import { capitals, alerts, essentialServices } from './data';
import { capitalDetails } from './capitalDetails';
import { scenarioCategories } from './scenarioLibraryData';
import { format } from 'date-fns';

export interface ReportPeriod {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface ReportSection {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  estimatedPages: number;
}

export interface ReportOptions {
  includeCitations: boolean;
  includeDisclaimer: boolean;
  includeRawData: boolean;
}

export interface CapitalSummary {
  name: string;
  score: number;
  status: string;
  trend: string;
  commentary: string;
  kris: Array<{
    name: string;
    value: string;
    target: string;
    status: string;
    trend: string;
  }>;
  recentChanges: string[];
  risks: Array<{
    description: string;
    mitigation: string;
  }>;
}

export interface ServiceSummary {
  name: string;
  status: string;
  reason: string;
  lastUpdated: string;
}

export interface ScenarioSummary {
  name: string;
  lastTested: string;
  testStatus: string;
  outcome: string;
}

export interface ReportData {
  period: string;
  generatedDate: string;
  sections: string[];
  options: ReportOptions;
  
  // Executive Summary data
  aggregateScore: number;
  aggregateStatus: string;
  aggregateTrend: string;
  executiveSummary: string;
  capitals: CapitalSummary[];
  criticalIssues: string[];
  recommendedActions: string[];
  
  // Section-specific data
  services?: ServiceSummary[];
  scenarios?: ScenarioSummary[];
}

// Report periods - adjusted to current temporal context (Jan 2026)
export const reportPeriods: ReportPeriod[] = [
  {
    id: 'current-quarter',
    label: 'Current Quarter (Q1 2026)',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-03-31')
  },
  {
    id: 'last-quarter',
    label: 'Last Quarter (Q4 2025)',
    startDate: new Date('2025-10-01'),
    endDate: new Date('2025-12-31')
  },
  {
    id: 'annual',
    label: 'Annual Report (2025)',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31')
  },
  {
    id: 'custom',
    label: 'Custom Date Range',
    startDate: new Date(),
    endDate: new Date()
  }
];

export const reportSections: ReportSection[] = [
  {
    id: 'executive-summary',
    label: 'Executive Summary',
    description: 'Overall resilience status, key changes, critical issues',
    enabled: true,
    estimatedPages: 1
  },
  {
    id: 'five-capitals',
    label: 'Five Capitals Analysis',
    description: 'Detailed breakdown of each capital with KRIs and trends',
    enabled: true,
    estimatedPages: 5
  },
  {
    id: 'essential-services',
    label: 'Essential Services Status',
    description: 'Current status and performance of critical healthcare services',
    enabled: true,
    estimatedPages: 2
  },
  {
    id: 'scenario-testing',
    label: 'Scenario Testing & Learning',
    description: 'Tests conducted, vulnerabilities identified, actions completed',
    enabled: true,
    estimatedPages: 2
  },
  {
    id: 'investment-programme',
    label: 'Resilience Investment Programme',
    description: 'Investment summary and priority projects status',
    enabled: true,
    estimatedPages: 2
  },
  {
    id: 'regulatory-assurance',
    label: 'Regulatory & Assurance',
    description: 'CQC status, audit findings, regulatory correspondence',
    enabled: true,
    estimatedPages: 1
  },
  {
    id: 'forward-look',
    label: 'Forward Look & Recommendations',
    description: 'Upcoming tests, investment milestones, emerging risks',
    enabled: true,
    estimatedPages: 1
  }
];

// Calculate aggregate score from capitals
export function calculateAggregateScore(): number {
  const total = capitals.reduce((sum, cap) => sum + cap.score, 0);
  return Math.round(total / capitals.length);
}

// Determine aggregate status
export function determineAggregateStatus(): string {
  const score = calculateAggregateScore();
  if (score >= 80) return 'Green';
  if (score >= 60) return 'Amber';
  return 'Red';
}

// Generate executive summary text
export function generateExecutiveSummary(): string {
  const score = calculateAggregateScore();
  const status = determineAggregateStatus();
  const redCapitals = capitals.filter(c => c.status === 'red');
  
  let summary = `The Trust's overall resilience position is ${status.toLowerCase()}, with an aggregate score of ${score}/100. `;
  
  if (redCapitals.length > 0) {
    const redNames = redCapitals.map(c => c.name).join(' and ');
    summary += `Priority attention is required for ${redNames} Capital${redCapitals.length > 1 ? 's' : ''}, which ${redCapitals.length > 1 ? 'are' : 'is'} currently rated as vulnerable. `;
  }
  
  const atRiskServices = essentialServices.filter(s => s.status === 'at-risk');
  if (atRiskServices.length > 0) {
    summary += `${atRiskServices.length} essential service${atRiskServices.length > 1 ? 's are' : ' is'} currently at risk, requiring immediate attention.`;
  }
  
  return summary;
}

// Collect all report data
export function collectReportData(
  period: ReportPeriod,
  sections: string[],
  options: ReportOptions
): ReportData {
  const capitalSummaries: CapitalSummary[] = capitals.map(cap => {
    const details = capitalDetails[cap.id];
    return {
      name: cap.name,
      score: cap.score,
      status: cap.status === 'green' ? 'Green' : cap.status === 'amber' ? 'Amber' : 'Red',
      trend: cap.trend === 'improving' ? 'Improving' : cap.trend === 'declining' ? 'Declining' : 'Stable',
      commentary: details?.explanation || '',
      kris: details?.kris.map(kri => ({
        name: kri.name,
        value: kri.currentValue,
        target: kri.target,
        status: kri.trend === 'improving' ? 'Green' : kri.trend === 'declining' ? 'Red' : 'Amber',
        trend: kri.trend === 'improving' ? 'Improving' : kri.trend === 'declining' ? 'Declining' : 'Stable'
      })) || [],
      recentChanges: details?.recentChanges.map(rc => 
        `${format(rc.date, 'dd MMM yyyy')}: ${rc.description}`
      ) || [],
      risks: [
        {
          description: `${cap.name} resilience pressure`,
          mitigation: 'Ongoing monitoring and improvement initiatives'
        }
      ]
    };
  });

  const serviceSummaries: ServiceSummary[] = essentialServices.map(svc => ({
    name: svc.name,
    status: svc.status === 'operational' ? 'Operational' : svc.status === 'degraded' ? 'Degraded' : 'At Risk',
    reason: svc.reason,
    lastUpdated: format(svc.lastUpdated, 'dd MMM yyyy, HH:mm')
  }));

  // Collect scenario test data
  const allScenarios = scenarioCategories.flatMap(cat => cat.scenarios);
  const testedScenarios = allScenarios
    .filter(s => s.lastTested)
    .sort((a, b) => (b.lastTested?.getTime() || 0) - (a.lastTested?.getTime() || 0))
    .slice(0, 5);

  const scenarioSummaries: ScenarioSummary[] = testedScenarios.map(s => ({
    name: s.name,
    lastTested: s.lastTested ? format(s.lastTested, 'dd MMM yyyy') : 'Never',
    testStatus: s.testStatus,
    outcome: s.testStatus === 'recent' ? 'Well-Managed' : s.testStatus === 'due-soon' ? 'Adequate' : 'Needs Review'
  }));

  // Get critical issues from alerts
  const criticalIssues = alerts
    .filter(a => a.severity === 'red' || a.severity === 'amber')
    .slice(0, 4)
    .map(a => a.title);

  // Generate recommended actions
  const recommendedActions = [
    'Review and address critical workforce shortages in nursing (Human Capital)',
    'Progress HVAC replacement programme to mitigate infrastructure risk (Environmental Capital)',
    'Strengthen scenario testing schedule for overdue exercises',
    'Note progress on resilience investment programme delivery'
  ];

  return {
    period: period.label,
    generatedDate: format(new Date(), 'dd MMMM yyyy, HH:mm'),
    sections,
    options,
    aggregateScore: calculateAggregateScore(),
    aggregateStatus: determineAggregateStatus(),
    aggregateTrend: 'Stable',
    executiveSummary: generateExecutiveSummary(),
    capitals: capitalSummaries,
    criticalIssues,
    recommendedActions,
    services: serviceSummaries,
    scenarios: scenarioSummaries
  };
}

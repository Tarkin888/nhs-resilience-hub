import { CapitalName, Trend } from '@/types';

export interface CapitalKRI {
  name: string;
  currentValue: string;
  trend: Trend;
  target: string;
  commentary: string;
  dataSource: string;
}

export interface RecentChange {
  date: Date;
  description: string;
}

export interface CapitalDetail {
  capitalId: string;
  explanation: string;
  kris: CapitalKRI[];
  recentChanges: RecentChange[];
  relevantScenario: string;
}

export const capitalDetails: Record<string, CapitalDetail> = {
  financial: {
    capitalId: 'financial',
    explanation:
      'Financial resilience is currently amber and stable, reflecting a balanced position with some underlying pressures. While cash flow remains healthy, agency staff costs continue to exceed budget, and the cost improvement programme requires sustained focus to meet annual targets. Capital investment decisions are being carefully prioritised.',
    kris: [
      {
        name: 'Cash reserves',
        currentValue: '£12.3M',
        trend: 'stable',
        target: '>£10M',
        commentary: 'Healthy position maintained through Q4',
        dataSource: 'Finance Ledger',
      },
      {
        name: 'Agency spend vs budget',
        currentValue: '+23%',
        trend: 'declining',
        target: '<5%',
        commentary: 'Driven by nursing vacancies',
        dataSource: 'Workforce Dashboard',
      },
      {
        name: 'CIP delivery',
        currentValue: '78%',
        trend: 'improving',
        target: '>95%',
        commentary: 'On track for year-end target',
        dataSource: 'PMO Tracker',
      },
      {
        name: 'Capital programme',
        currentValue: '62%',
        trend: 'stable',
        target: '>90%',
        commentary: 'Some schemes deferred to 2025/26',
        dataSource: 'Capital Planning',
      },
    ],
    recentChanges: [
      {
        date: new Date('2025-01-22'),
        description: 'Agency cost threshold breached for third consecutive month',
      },
      {
        date: new Date('2025-01-18'),
        description: 'Q3 financial position confirmed as breakeven',
      },
      {
        date: new Date('2025-01-10'),
        description: 'Capital programme reprioritisation approved by Board',
      },
    ],
    relevantScenario: 'Coordinated Nursing Strike (5 days)',
  },
  operational: {
    capitalId: 'operational',
    explanation:
      'Operational resilience is currently green and improving, reflecting sustained performance across most pathways. A&E performance remains challenging due to winter pressures, but improvement actions are showing early results. Bed occupancy continues to run high, requiring careful management to maintain patient flow.',
    kris: [
      {
        name: 'A&E 4-hour performance',
        currentValue: '76.2%',
        trend: 'improving',
        target: '>80%',
        commentary: 'Gradual improvement from 74.1% last month',
        dataSource: 'NHS England',
      },
      {
        name: 'Bed occupancy',
        currentValue: '94.5%',
        trend: 'stable',
        target: '<92%',
        commentary: 'Above safe threshold, discharge focus continues',
        dataSource: 'Bed Management',
      },
      {
        name: 'Elective backlog',
        currentValue: '2,340',
        trend: 'declining',
        target: '<1,500',
        commentary: 'Winter bed pressures impacting throughput',
        dataSource: 'RTT Dashboard',
      },
      {
        name: 'Critical care capacity',
        currentValue: '94%',
        trend: 'declining',
        target: '<85%',
        commentary: 'Approaching mutual aid threshold',
        dataSource: 'Critical Care',
      },
    ],
    recentChanges: [
      {
        date: new Date('2025-01-24'),
        description: 'Critical care occupancy reached 94%, contingency plans activated',
      },
      {
        date: new Date('2025-01-21'),
        description: 'New discharge lounge opened, improving flow by 8 beds/day',
      },
      {
        date: new Date('2025-01-15'),
        description: 'A&E performance improved for second consecutive week',
      },
    ],
    relevantScenario: 'Major Power Outage (24 hours)',
  },
  human: {
    capitalId: 'human',
    explanation:
      'Human resilience is currently red and declining, driven by critical staff vacancies, rising sickness absence, and deteriorating wellbeing scores. Nursing and allied health vacancies are particularly severe, forcing unsustainable reliance on agency staff. Urgent action is required to stabilise the workforce.',
    kris: [
      {
        name: 'Staff vacancies',
        currentValue: '156 FTE',
        trend: 'declining',
        target: '<50 FTE',
        commentary: 'Critical shortage in nursing (78 FTE)',
        dataSource: 'ESR System',
      },
      {
        name: 'Sickness absence',
        currentValue: '5.2%',
        trend: 'declining',
        target: '<4.8%',
        commentary: 'Above NHS England average',
        dataSource: 'ESR System',
      },
      {
        name: 'Training compliance',
        currentValue: '78%',
        trend: 'stable',
        target: '>90%',
        commentary: 'Adequate but below target',
        dataSource: 'OLM System',
      },
      {
        name: 'Wellbeing score',
        currentValue: '6.1/10',
        trend: 'declining',
        target: '>7.5/10',
        commentary: 'Decreased from 6.8 last quarter',
        dataSource: 'Staff Survey',
      },
    ],
    recentChanges: [
      {
        date: new Date('2025-01-24'),
        description: 'Nursing vacancies increased to 78 FTE (highest on record)',
      },
      {
        date: new Date('2025-01-20'),
        description: 'Staff wellbeing survey results published (6.1/10)',
      },
      {
        date: new Date('2025-01-12'),
        description: 'Critical care turnover reached 18%',
      },
    ],
    relevantScenario: 'Coordinated Nursing Strike (5 days)',
  },
  reputational: {
    capitalId: 'reputational',
    explanation:
      'Reputational resilience is currently green and improving, reflecting strong patient satisfaction scores and positive CQC feedback. Media coverage has been balanced, with recent recognition for innovation in digital services. Community engagement remains strong, supporting the Trust\'s position as a valued local institution.',
    kris: [
      {
        name: 'Patient satisfaction',
        currentValue: '87%',
        trend: 'improving',
        target: '>85%',
        commentary: 'Above regional and national average',
        dataSource: 'Friends & Family',
      },
      {
        name: 'CQC rating',
        currentValue: 'Good',
        trend: 'stable',
        target: 'Good+',
        commentary: 'Maintained across all domains',
        dataSource: 'CQC Report',
      },
      {
        name: 'Complaints response',
        currentValue: '92%',
        trend: 'improving',
        target: '>95%',
        commentary: 'Within 25 working days target',
        dataSource: 'PALS System',
      },
      {
        name: 'Media sentiment',
        currentValue: '+42%',
        trend: 'improving',
        target: '>+30%',
        commentary: 'Positive coverage of digital innovation',
        dataSource: 'Media Monitoring',
      },
    ],
    recentChanges: [
      {
        date: new Date('2025-01-23'),
        description: 'Trust featured in HSJ for digital patient portal success',
      },
      {
        date: new Date('2025-01-19'),
        description: 'Patient satisfaction reached 87% (highest in 2 years)',
      },
      {
        date: new Date('2025-01-14'),
        description: 'CQC engagement visit completed with positive feedback',
      },
    ],
    relevantScenario: 'Novel Respiratory Pandemic',
  },
  environmental: {
    capitalId: 'environmental',
    explanation:
      'Environmental resilience is currently red and declining, primarily due to deteriorating estate condition and delayed capital investment. While carbon reduction targets are on track, critical infrastructure including HVAC systems and electrical distribution require urgent attention. Climate adaptation planning is also behind schedule.',
    kris: [
      {
        name: 'Carbon emissions',
        currentValue: '-8% YoY',
        trend: 'improving',
        target: '-10% YoY',
        commentary: 'On track for Net Zero 2040',
        dataSource: 'Sustainability',
      },
      {
        name: 'Estate condition',
        currentValue: 'C Rating',
        trend: 'declining',
        target: 'B Rating',
        commentary: 'Backlog maintenance growing',
        dataSource: 'ERIC Returns',
      },
      {
        name: 'HVAC compliance',
        currentValue: '68%',
        trend: 'declining',
        target: '>95%',
        commentary: 'Multiple systems beyond service life',
        dataSource: 'Estates CAFM',
      },
      {
        name: 'Energy efficiency',
        currentValue: '142 kWh/m²',
        trend: 'stable',
        target: '<120 kWh/m²',
        commentary: 'LED programme 40% complete',
        dataSource: 'Energy Bureau',
      },
    ],
    recentChanges: [
      {
        date: new Date('2025-01-22'),
        description: 'HVAC failure in Block C required emergency repair (£45k)',
      },
      {
        date: new Date('2025-01-17'),
        description: 'Estate condition downgraded to C Rating in annual assessment',
      },
      {
        date: new Date('2025-01-08'),
        description: 'Solar panel installation completed on main building',
      },
    ],
    relevantScenario: 'Prolonged Heatwave (7 days, 35°C+)',
  },
};

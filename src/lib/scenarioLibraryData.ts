// Enhanced Scenario Library Data
import type { LucideIcon } from 'lucide-react';

export type Severity = 'critical' | 'high' | 'medium' | 'low';
export type TestStatus = 'overdue' | 'due-soon' | 'recent' | 'never-tested';

export interface CapitalImpact {
  capital: string;
  impactScore: number;
  explanation: string;
  order: number;
  evidenceBase: string;
}

export interface EnhancedScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: Severity;
  lastTested?: Date;
  testStatus: TestStatus;
  duration: string;
  impactAreasCount: number;
  category: string;
  historicalPrecedent: string;
  dataSource: string;
  impacts: CapitalImpact[];
}

export interface ScenarioCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  scenarios: EnhancedScenario[];
  defaultExpanded?: boolean;
}

// Helper function to calculate test status based on last tested date
export function calculateTestStatus(lastTested?: Date): TestStatus {
  if (!lastTested) return 'never-tested';
  
  const now = new Date();
  const daysSinceTest = Math.floor((now.getTime() - lastTested.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceTest > 365) return 'overdue';
  if (daysSinceTest > 270) return 'due-soon';
  return 'recent';
}

// Operational Scenarios
const operationalScenarios: EnhancedScenario[] = [
  {
    id: 'cyber-ransomware',
    name: 'Cyber Attack (Ransomware)',
    description: 'Malicious software encrypts critical systems and demands payment',
    icon: 'Shield',
    severity: 'critical',
    lastTested: new Date('2025-10-15'),
    testStatus: 'due-soon',
    duration: '4-6 hours',
    impactAreasCount: 3,
    category: 'operational',
    historicalPrecedent: 'WannaCry Ransomware - May 2017 NHS Attack',
    dataSource: 'National Audit Office WannaCry Investigation Report 2018',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -40,
        explanation: 'Total loss of EPR, paper-based processes, severe delays',
        order: 1,
        evidenceBase: 'WannaCry: 19,000 appointments cancelled, 5 A&Es diverted'
      },
      {
        capital: 'Human',
        impactScore: -22,
        explanation: 'Extreme staff stress, manual processes, no patient history access',
        order: 2,
        evidenceBase: 'Post-WannaCry staff surveys: 40% increase in work stress'
      },
      {
        capital: 'Reputational',
        impactScore: -18,
        explanation: 'National media coverage, ICO investigation, patient confidence erosion',
        order: 3,
        evidenceBase: 'WannaCry: 600+ media articles, ICO investigation, parliamentary inquiry'
      }
    ]
  },
  {
    id: 'equipment-failure',
    name: 'Critical Equipment Failure',
    description: 'Major diagnostic equipment breakdown affecting patient pathways',
    icon: 'AlertTriangle',
    severity: 'high',
    lastTested: new Date('2024-11-20'),
    testStatus: 'recent',
    duration: '3-4 hours',
    impactAreasCount: 2,
    category: 'operational',
    historicalPrecedent: 'Multiple NHS CT scanner failures 2023-2024',
    dataSource: 'NHS England Medical Equipment Incidents Database',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -25,
        explanation: 'Diagnostic delays, patient diversions, theatre cancellations',
        order: 1,
        evidenceBase: 'Typical CT outage: 40-60 patient diversions per day'
      },
      {
        capital: 'Financial',
        impactScore: -12,
        explanation: 'Emergency repair costs, lost revenue, patient diversion costs',
        order: 2,
        evidenceBase: 'CT scanner emergency repair: £80K + lost revenue £20K/day'
      }
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain Disruption',
    description: 'Critical medical supplies shortage affecting patient care',
    icon: 'Package',
    severity: 'high',
    testStatus: 'never-tested',
    duration: '2-3 hours',
    impactAreasCount: 3,
    category: 'operational',
    historicalPrecedent: 'Post-Brexit medicine shortages 2021-2022',
    dataSource: 'NHS Supply Chain Resilience Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -30,
        explanation: 'Procedure cancellations, alternative product sourcing, clinical delays',
        order: 1,
        evidenceBase: 'Medicine shortages: 15% increase in cancelled procedures'
      },
      {
        capital: 'Financial',
        impactScore: -15,
        explanation: 'Premium pricing for emergency procurement, lost revenue',
        order: 2,
        evidenceBase: 'Emergency procurement: 40% price premium typical'
      },
      {
        capital: 'Reputational',
        impactScore: -10,
        explanation: 'Patient complaints, media coverage of service disruption',
        order: 3,
        evidenceBase: 'Supply disruptions generate negative local media coverage'
      }
    ]
  },
  {
    id: 'it-outage',
    name: 'IT System Outage',
    description: 'Network failure causing widespread system unavailability',
    icon: 'WifiOff',
    severity: 'high',
    lastTested: new Date('2025-01-12'),
    testStatus: 'recent',
    duration: '3-4 hours',
    impactAreasCount: 2,
    category: 'operational',
    historicalPrecedent: 'Various NHS trust network failures 2020-2025',
    dataSource: 'NHS Digital Incident Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -35,
        explanation: 'EPR unavailable, diagnostic systems offline, manual workarounds',
        order: 1,
        evidenceBase: 'Network outages: Average 4-hour resolution, 200+ patients affected'
      },
      {
        capital: 'Human',
        impactScore: -15,
        explanation: 'Staff frustration, manual process stress, communication difficulties',
        order: 2,
        evidenceBase: 'IT outages significantly increase staff stress and overtime'
      }
    ]
  },
  {
    id: 'building-evacuation',
    name: 'Emergency Building Evacuation',
    description: 'Fire alarm or structural issue requiring immediate evacuation',
    icon: 'AlertCircle',
    severity: 'medium',
    lastTested: new Date('2024-09-15'),
    testStatus: 'overdue',
    duration: '2-3 hours',
    impactAreasCount: 3,
    category: 'operational',
    historicalPrecedent: 'Multiple NHS hospital evacuations 2015-2025',
    dataSource: 'NHS Fire Safety Incident Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -20,
        explanation: 'Service interruption, patient movement, temporary capacity loss',
        order: 1,
        evidenceBase: 'Evacuations: Average 2-hour disruption, 50-100 patients affected'
      },
      {
        capital: 'Human',
        impactScore: -10,
        explanation: 'Staff deployment for evacuation, psychological impact',
        order: 2,
        evidenceBase: 'Evacuations require rapid staff mobilization and cause stress'
      },
      {
        capital: 'Environmental',
        impactScore: -15,
        explanation: 'Building integrity concerns, potential fire damage',
        order: 3,
        evidenceBase: 'Fire incidents: Building damage £50K-£500K range'
      }
    ]
  }
];

// Clinical Scenarios
const clinicalScenarios: EnhancedScenario[] = [
  {
    id: 'mass-casualty',
    name: 'Mass Casualty Incident',
    description: 'Major incident requiring rapid surge capacity and triage',
    icon: 'Siren',
    severity: 'critical',
    lastTested: new Date('2024-06-20'),
    testStatus: 'overdue',
    duration: '6-8 hours',
    impactAreasCount: 4,
    category: 'clinical',
    historicalPrecedent: 'Manchester Arena bombing 2017',
    dataSource: 'NHS England Major Incident Response Framework',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -45,
        explanation: 'All electives cancelled, emergency surge protocols activated',
        order: 1,
        evidenceBase: 'Major incidents: 100% elective cancellation, 48-72hr recovery'
      },
      {
        capital: 'Human',
        impactScore: -35,
        explanation: 'Staff trauma, extended shifts, psychological impact',
        order: 2,
        evidenceBase: 'Post-incident PTSD rates: 15-25% of frontline staff'
      },
      {
        capital: 'Financial',
        impactScore: -25,
        explanation: 'Surge costs, lost income, extended recovery period',
        order: 3,
        evidenceBase: 'Major incident response: £500K-£2M additional costs'
      },
      {
        capital: 'Reputational',
        impactScore: -10,
        explanation: 'National scrutiny, media attention, public expectations',
        order: 4,
        evidenceBase: 'Major incidents attract intensive media coverage'
      }
    ]
  },
  {
    id: 'infection-outbreak',
    name: 'Hospital-Acquired Infection Outbreak',
    description: 'Serious infection cluster requiring ward closures and enhanced IPC',
    icon: 'Bug',
    severity: 'high',
    lastTested: new Date('2025-03-10'),
    testStatus: 'recent',
    duration: '3-4 hours',
    impactAreasCount: 3,
    category: 'clinical',
    historicalPrecedent: 'C. difficile and MRSA outbreaks across NHS',
    dataSource: 'PHE Healthcare-Associated Infection Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -30,
        explanation: 'Ward closures, bed capacity reduction, admission restrictions',
        order: 1,
        evidenceBase: 'Outbreak: Average 20-40 bed closure for 2-4 weeks'
      },
      {
        capital: 'Reputational',
        impactScore: -25,
        explanation: 'Media coverage, CQC scrutiny, patient safety concerns',
        order: 2,
        evidenceBase: 'Infection outbreaks generate significant negative publicity'
      },
      {
        capital: 'Financial',
        impactScore: -15,
        explanation: 'Enhanced cleaning, additional staffing, lost income',
        order: 3,
        evidenceBase: 'Outbreak response: £100K-£500K additional costs'
      }
    ]
  },
  {
    id: 'medication-error',
    name: 'Serious Medication Error',
    description: 'Significant drug error requiring rapid response and investigation',
    icon: 'Pill',
    severity: 'high',
    testStatus: 'never-tested',
    duration: '2-3 hours',
    impactAreasCount: 3,
    category: 'clinical',
    historicalPrecedent: 'Various NHS medication incident investigations',
    dataSource: 'MHRA Drug Safety Updates, NHS Improvement Reports',
    impacts: [
      {
        capital: 'Human',
        impactScore: -20,
        explanation: 'Staff distress, disciplinary concerns, morale impact',
        order: 1,
        evidenceBase: 'Second victim syndrome affects 10-43% of involved staff'
      },
      {
        capital: 'Reputational',
        impactScore: -25,
        explanation: 'Patient harm publicity, family complaints, coroner inquiry',
        order: 2,
        evidenceBase: 'Serious incidents attract media attention and legal action'
      },
      {
        capital: 'Financial',
        impactScore: -15,
        explanation: 'Legal costs, compensation, additional safety measures',
        order: 3,
        evidenceBase: 'Medication error claims: Average £50K-£500K settlement'
      }
    ]
  }
];

// Environmental Scenarios
const environmentalScenarios: EnhancedScenario[] = [
  {
    id: 'heatwave',
    name: 'Prolonged Heatwave',
    description: 'Extended period of extreme heat affecting patients and infrastructure',
    icon: 'Thermometer',
    severity: 'high',
    lastTested: new Date('2024-07-15'),
    testStatus: 'overdue',
    duration: '4-5 hours',
    impactAreasCount: 4,
    category: 'environmental',
    historicalPrecedent: 'UK July 2022 Heatwave (40.3°C record)',
    dataSource: 'UKHSA Heatwave Mortality Reports',
    impacts: [
      {
        capital: 'Environmental',
        impactScore: -35,
        explanation: 'Building cooling failure, vulnerable patients at extreme risk',
        order: 1,
        evidenceBase: 'July 2022: 3,271 excess deaths in England'
      },
      {
        capital: 'Operational',
        impactScore: -20,
        explanation: 'A&E surge, cancelled surgeries, equipment failures',
        order: 2,
        evidenceBase: 'Heatwaves: 40% increase in emergency admissions'
      },
      {
        capital: 'Human',
        impactScore: -15,
        explanation: 'Staff heat stress, increased sickness absence',
        order: 3,
        evidenceBase: 'Heat: 15-20% increase in staff sickness'
      },
      {
        capital: 'Financial',
        impactScore: -10,
        explanation: 'Emergency cooling, agency costs, lost elective income',
        order: 4,
        evidenceBase: 'Heatwave costs: £50K-£200K additional spending'
      }
    ]
  },
  {
    id: 'flooding',
    name: 'Major Flooding Event',
    description: 'Severe flooding affecting hospital access and infrastructure',
    icon: 'Droplets',
    severity: 'high',
    testStatus: 'never-tested',
    duration: '4-6 hours',
    impactAreasCount: 4,
    category: 'environmental',
    historicalPrecedent: 'Storm Desmond 2015, Various hospital floods',
    dataSource: 'Environment Agency Flood Reports',
    impacts: [
      {
        capital: 'Environmental',
        impactScore: -40,
        explanation: 'Infrastructure damage, contamination risks, access blocked',
        order: 1,
        evidenceBase: 'Hospital flooding: £1M-£10M damage typical'
      },
      {
        capital: 'Operational',
        impactScore: -35,
        explanation: 'Service closures, patient transfers, reduced capacity',
        order: 2,
        evidenceBase: 'Flood events: 50-100% capacity reduction possible'
      },
      {
        capital: 'Human',
        impactScore: -15,
        explanation: 'Staff unable to travel, accommodation needed, stress',
        order: 3,
        evidenceBase: 'Floods: 20-40% staff unable to attend'
      },
      {
        capital: 'Financial',
        impactScore: -25,
        explanation: 'Repair costs, lost income, temporary measures',
        order: 4,
        evidenceBase: 'Flood recovery: £500K-£5M typical costs'
      }
    ]
  },
  {
    id: 'power-outage',
    name: 'Major Power Outage',
    description: 'Extended loss of mains power requiring emergency generator use',
    icon: 'Zap',
    severity: 'high',
    lastTested: new Date('2025-02-01'),
    testStatus: 'recent',
    duration: '3-4 hours',
    impactAreasCount: 4,
    category: 'environmental',
    historicalPrecedent: 'Various NHS trust power failures 2018-2024',
    dataSource: 'NHS Estates Emergency Planning Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -40,
        explanation: 'Critical systems on backup, theatre closures, patient transfers',
        order: 1,
        evidenceBase: 'Power outage: 100% theatre closure, ED diversion typical'
      },
      {
        capital: 'Environmental',
        impactScore: -25,
        explanation: 'HVAC failure, temperature control loss, generator emissions',
        order: 2,
        evidenceBase: 'Power loss: Building temperature critical within 4 hours'
      },
      {
        capital: 'Human',
        impactScore: -15,
        explanation: 'Staff called in, manual processes, patient safety stress',
        order: 3,
        evidenceBase: 'Power incidents: All-staff recall, extended shifts'
      },
      {
        capital: 'Financial',
        impactScore: -20,
        explanation: 'Equipment damage, fuel costs, lost activity, repairs',
        order: 4,
        evidenceBase: 'Power outage costs: £100K-£500K typical'
      }
    ]
  }
];

// Cyber & Security Scenarios
const cyberScenarios: EnhancedScenario[] = [
  {
    id: 'data-breach',
    name: 'Patient Data Breach',
    description: 'Unauthorized access to patient records requiring ICO notification',
    icon: 'FileWarning',
    severity: 'critical',
    lastTested: new Date('2024-12-01'),
    testStatus: 'due-soon',
    duration: '3-4 hours',
    impactAreasCount: 3,
    category: 'cyber',
    historicalPrecedent: 'Various NHS data breach investigations',
    dataSource: 'ICO Enforcement Actions, NHS Digital Security Reports',
    impacts: [
      {
        capital: 'Reputational',
        impactScore: -40,
        explanation: 'Patient trust erosion, media coverage, regulatory scrutiny',
        order: 1,
        evidenceBase: 'Data breaches: Significant long-term trust damage'
      },
      {
        capital: 'Financial',
        impactScore: -30,
        explanation: 'ICO fines (up to 4% turnover), legal costs, remediation',
        order: 2,
        evidenceBase: 'GDPR fines: £10K-£20M depending on severity'
      },
      {
        capital: 'Operational',
        impactScore: -15,
        explanation: 'System lockdown, investigation disruption, process changes',
        order: 3,
        evidenceBase: 'Breach response: 2-4 weeks intensive investigation'
      }
    ]
  },
  {
    id: 'phishing-attack',
    name: 'Targeted Phishing Campaign',
    description: 'Sophisticated phishing attack compromising staff credentials',
    icon: 'Mail',
    severity: 'medium',
    lastTested: new Date('2025-01-20'),
    testStatus: 'recent',
    duration: '2-3 hours',
    impactAreasCount: 2,
    category: 'cyber',
    historicalPrecedent: 'NHS phishing incidents 2020-2025',
    dataSource: 'NHS Digital Cyber Security Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -20,
        explanation: 'Account lockouts, password resets, system access restricted',
        order: 1,
        evidenceBase: 'Phishing: 10-20% credential compromise typical in attacks'
      },
      {
        capital: 'Human',
        impactScore: -10,
        explanation: 'Staff anxiety, mandatory training, blame culture risk',
        order: 2,
        evidenceBase: 'Phishing victims experience stress and embarrassment'
      }
    ]
  }
];

// Workforce Scenarios
const workforceScenarios: EnhancedScenario[] = [
  {
    id: 'nursing-strike',
    name: 'Coordinated Nursing Strike',
    description: 'Industrial action by nursing staff affecting all wards',
    icon: 'UserX',
    severity: 'high',
    lastTested: new Date('2023-12-15'),
    testStatus: 'overdue',
    duration: '4-5 hours',
    impactAreasCount: 4,
    category: 'workforce',
    historicalPrecedent: 'RCN Strike Action December 2022 - May 2023',
    dataSource: 'NHS England Strike Derogation Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -35,
        explanation: 'Cancelled surgeries, reduced capacity, emergency-only care',
        order: 1,
        evidenceBase: 'Strike days: 50-70% elective activity cancelled'
      },
      {
        capital: 'Human',
        impactScore: -30,
        explanation: 'Remaining staff overstretched, morale impact, colleague tensions',
        order: 2,
        evidenceBase: 'Strike impact: Significant morale damage reported'
      },
      {
        capital: 'Financial',
        impactScore: -20,
        explanation: 'Lost elective income, agency premium rates, backlog costs',
        order: 3,
        evidenceBase: 'Strike day: £2-5M lost activity per trust typical'
      },
      {
        capital: 'Reputational',
        impactScore: -15,
        explanation: 'Public perception, political attention, staff relations',
        order: 4,
        evidenceBase: 'Industrial action generates sustained media coverage'
      }
    ]
  },
  {
    id: 'consultant-exodus',
    name: 'Consultant Resignation Wave',
    description: 'Multiple consultant departures affecting service continuity',
    icon: 'UserMinus',
    severity: 'high',
    testStatus: 'never-tested',
    duration: '3-4 hours',
    impactAreasCount: 3,
    category: 'workforce',
    historicalPrecedent: 'NHS workforce crisis 2022-2025',
    dataSource: 'GMC Workforce Reports, NHS Digital Workforce Statistics',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -30,
        explanation: 'Service gaps, waiting list growth, locum dependency',
        order: 1,
        evidenceBase: 'Consultant vacancy: 3-6 months to recruit replacement'
      },
      {
        capital: 'Financial',
        impactScore: -25,
        explanation: 'Locum costs (2-3x salary), recruitment costs, lost activity',
        order: 2,
        evidenceBase: 'Consultant locum: £150-250/hour vs £75/hour employed'
      },
      {
        capital: 'Human',
        impactScore: -20,
        explanation: 'Remaining staff workload, burnout risk, training disruption',
        order: 3,
        evidenceBase: 'Vacancy cover: 20-40% increased workload for remaining staff'
      }
    ]
  },
  {
    id: 'junior-doctor-strike',
    name: 'Junior Doctor Industrial Action',
    description: 'Extended junior doctor walkout affecting all specialties',
    icon: 'Stethoscope',
    severity: 'high',
    lastTested: new Date('2024-08-20'),
    testStatus: 'overdue',
    duration: '4-5 hours',
    impactAreasCount: 4,
    category: 'workforce',
    historicalPrecedent: 'BMA Junior Doctor Strikes 2023-2024',
    dataSource: 'NHS England Industrial Action Reports',
    impacts: [
      {
        capital: 'Operational',
        impactScore: -40,
        explanation: 'Major service reductions, consultant-only cover, cancellations',
        order: 1,
        evidenceBase: 'JD strikes: 75-90% elective activity cancelled'
      },
      {
        capital: 'Human',
        impactScore: -25,
        explanation: 'Consultant burnout, inter-grade tensions, recruitment concerns',
        order: 2,
        evidenceBase: 'Strike periods: Significant consultant workload increase'
      },
      {
        capital: 'Financial',
        impactScore: -30,
        explanation: 'Massive lost income, consultant overtime, recovery costs',
        order: 3,
        evidenceBase: 'Strike week: £5-15M lost activity per trust'
      },
      {
        capital: 'Reputational',
        impactScore: -15,
        explanation: 'National media focus, patient frustration, political scrutiny',
        order: 4,
        evidenceBase: 'JD strikes: Extensive national media coverage'
      }
    ]
  }
];

// Combine all scenarios into categories
export const scenarioCategories: ScenarioCategory[] = [
  {
    id: 'operational',
    name: 'Operational Disruptions',
    icon: 'Building2',
    description: 'Scenarios affecting core hospital operations and service delivery',
    defaultExpanded: true,
    scenarios: operationalScenarios
  },
  {
    id: 'clinical',
    name: 'Clinical Emergencies',
    icon: 'Activity',
    description: 'Patient care crises and clinical safety scenarios',
    defaultExpanded: false,
    scenarios: clinicalScenarios
  },
  {
    id: 'environmental',
    name: 'Environmental & Infrastructure',
    icon: 'Cloud',
    description: 'Weather events, building failures, and utilities disruptions',
    defaultExpanded: false,
    scenarios: environmentalScenarios
  },
  {
    id: 'cyber',
    name: 'Cyber & Information Security',
    icon: 'ShieldAlert',
    description: 'Technology failures, cyber attacks, and data breaches',
    defaultExpanded: false,
    scenarios: cyberScenarios
  },
  {
    id: 'workforce',
    name: 'Workforce & Industrial Relations',
    icon: 'Users',
    description: 'Staffing crises, strikes, and human resource challenges',
    defaultExpanded: false,
    scenarios: workforceScenarios
  }
];

// Severity styling configuration
export const severityStyles = {
  critical: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    label: 'Critical'
  },
  high: {
    bg: 'bg-warning',
    text: 'text-warning-foreground',
    label: 'High'
  },
  medium: {
    bg: 'bg-yellow-500',
    text: 'text-black',
    label: 'Medium'
  },
  low: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    label: 'Low'
  }
} as const;

// Test status styling configuration
export const testStatusStyles = {
  overdue: {
    text: '⚠️ Overdue',
    color: 'text-destructive',
    show: true
  },
  'due-soon': {
    text: '(Due Soon)',
    color: 'text-warning',
    show: true
  },
  recent: {
    text: '(Recent)',
    color: 'text-success',
    show: true
  },
  'never-tested': {
    text: '(Never tested)',
    color: 'text-muted-foreground',
    show: true
  }
} as const;

import { ExercisePackage, ExerciseResult } from '@/types/exercises';

export const exercisePackages: ExercisePackage[] = [
  {
    exercise: {
      id: 'ex-cyber-001',
      name: 'EPR Ransomware Attack',
      type: 'desktop',
      scenarioId: 'cyber-attack',
      scenarioName: 'Ransomware Attack on EPR System',
      scenarioCategory: 'cyber',
      duration: '3 hours',
      participants: [
        'CEO',
        'Chief Operating Officer',
        'Chief Information Officer',
        'Medical Director',
        'Communications Director',
        'Legal Advisor'
      ],
      objectives: [
        'Test Gold command activation and decision-making',
        'Assess communication protocols (internal, external, regulatory)',
        'Evaluate paper-based contingency readiness',
        'Test cyber incident response plan'
      ],
      facilitator: 'Resilience Manager',
      status: 'template',
      materialsRequired: [
        'Scenario briefing pack',
        'Gold command structure diagram',
        'Paper-based process templates',
        'Communications cascade chart'
      ]
    },
    injects: [
      {
        id: 'inject-001',
        timeMarker: 'T+0 (Day 1, 08:00)',
        description: 'IT systems slow overnight. At 08:00, EPR crashes. Reboot attempts fail. IT team discovers ransomware message demanding £2M in Bitcoin within 72 hours.',
        facilitatorPrompts: [
          'What is your immediate response?',
          'Who do you notify?',
          'Do you activate incident management structure?'
        ],
        expectedResponses: [
          'Activate Gold command',
          'Notify NHS Digital and NCSC',
          'Isolate affected systems'
        ]
      },
      {
        id: 'inject-002',
        timeMarker: 'T+2 hours (Day 1, 10:00)',
        description: 'NHS Digital confirms widespread attack affecting multiple trusts. NCSC advises against paying ransom. Media requests comment.',
        facilitatorPrompts: [
          'How do you manage media enquiries?',
          'What is your position on ransom payment?',
          'What operational decisions do you make regarding patient care?'
        ]
      },
      {
        id: 'inject-003',
        timeMarker: 'T+6 hours (Day 1, 14:00)',
        description: 'Paper-based processes struggling. Clinical staff reporting delays. One patient deteriorates due to lack of access to allergy information.',
        facilitatorPrompts: [
          'Do you declare a major incident?',
          'Do you request mutual aid?',
          'How do you manage clinical safety?'
        ]
      },
      {
        id: 'inject-004',
        timeMarker: 'T+24 hours (Day 2, 08:00)',
        description: 'CQC requests patient safety assurance. ICO notification deadline approaching (72 hours). Recovery estimated 10-14 days.',
        facilitatorPrompts: [
          'How do you respond to CQC?',
          'What is your ICO notification strategy?',
          'What long-term actions do you initiate?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'eval-001', criterion: 'Gold command activated within 30 minutes', targetOutcome: 'YES' },
      { id: 'eval-002', criterion: 'All key stakeholders notified within 1 hour', targetOutcome: 'YES' },
      { id: 'eval-003', criterion: 'Paper-based processes deployed within 2 hours', targetOutcome: 'YES' },
      { id: 'eval-004', criterion: 'Media holding statement issued within 3 hours', targetOutcome: 'YES' },
      { id: 'eval-005', criterion: 'Clinical safety protocols followed', targetOutcome: 'YES' },
      { id: 'eval-006', criterion: 'CQC and ICO notifications handled appropriately', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'How effective was the Gold command structure?',
      'Were communication protocols clear and followed?',
      'Was the paper-based contingency adequate?',
      'What vulnerabilities were exposed?',
      'What actions should be taken before a real incident?'
    ]
  },
  {
    exercise: {
      id: 'ex-heat-001',
      name: 'Prolonged Heatwave Response',
      type: 'desktop',
      scenarioId: 'heatwave',
      scenarioName: 'Extreme Heatwave (40°C+)',
      scenarioCategory: 'environmental',
      duration: '2.5 hours',
      participants: [
        'Chief Operating Officer',
        'Director of Estates',
        'Medical Director',
        'Head of Nursing',
        'Procurement Manager'
      ],
      objectives: [
        'Test heatwave contingency plan activation',
        'Assess cooling and ventilation capabilities',
        'Evaluate patient and staff welfare protocols',
        'Test supply chain resilience for critical items'
      ],
      facilitator: 'Emergency Planning Officer',
      status: 'completed',
      lastRun: new Date('2025-01-24'),
      materialsRequired: [
        'Heatwave contingency plan',
        'HVAC system specifications',
        'Vulnerable patient register',
        'Supplier contact list'
      ]
    },
    injects: [
      {
        id: 'heat-inject-001',
        timeMarker: 'T+0 (Day 1, 06:00)',
        description: 'Met Office issues Amber warning for extreme heat. Temperatures expected to reach 38°C today, rising to 42°C by Day 3. Warning to last 5 days.',
        facilitatorPrompts: [
          'What immediate actions do you take?',
          'Do you activate the heatwave plan?',
          'How do you communicate with staff?'
        ]
      },
      {
        id: 'heat-inject-002',
        timeMarker: 'T+8 hours (Day 1, 14:00)',
        description: 'Ward temperatures reach 32°C. HVAC struggling. Three elderly patients showing signs of heat exhaustion. Staff reporting fatigue.',
        facilitatorPrompts: [
          'What cooling measures can you deploy?',
          'Do you need to relocate patients?',
          'How do you protect staff welfare?'
        ]
      },
      {
        id: 'heat-inject-003',
        timeMarker: 'T+24 hours (Day 2, 06:00)',
        description: 'HVAC unit on Nightingale Ward fails. No portable cooling units available from supplier. National shortage reported.',
        facilitatorPrompts: [
          'What are your options?',
          'Do you escalate externally?',
          'What clinical decisions are needed?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'heat-eval-001', criterion: 'Heatwave plan activated within 2 hours of warning', targetOutcome: 'YES' },
      { id: 'heat-eval-002', criterion: 'Vulnerable patients identified and monitored', targetOutcome: 'YES' },
      { id: 'heat-eval-003', criterion: 'Cooling measures deployed effectively', targetOutcome: 'YES' },
      { id: 'heat-eval-004', criterion: 'Staff welfare provisions adequate', targetOutcome: 'YES' },
      { id: 'heat-eval-005', criterion: 'Escalation to external partners timely', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'Was the heatwave plan fit for purpose?',
      'Were cooling resources adequate?',
      'How effective was staff communication?',
      'What single points of failure were identified?',
      'What capital investment is needed?'
    ]
  },
  {
    exercise: {
      id: 'ex-flu-001',
      name: 'Pandemic Influenza Surge',
      type: 'simulation',
      scenarioId: 'pandemic',
      scenarioName: 'High-Consequence Pandemic',
      scenarioCategory: 'clinical',
      duration: '4 hours',
      participants: [
        'Executive Team',
        'Divisional Directors',
        'Infection Control Team',
        'Communications Lead',
        'HR Director'
      ],
      objectives: [
        'Test pandemic surge capacity protocols',
        'Assess PPE stockpile adequacy',
        'Evaluate staff absence contingencies',
        'Test patient flow and cohorting decisions'
      ],
      facilitator: 'Director of Infection Prevention',
      status: 'scheduled',
      materialsRequired: [
        'Pandemic flu plan',
        'PPE inventory report',
        'Staff absence modelling data',
        'ICU surge capacity plans'
      ]
    },
    injects: [
      {
        id: 'flu-inject-001',
        timeMarker: 'T+0 (Week 1)',
        description: 'WHO declares novel influenza strain pandemic. First UK cases confirmed. Government activates pandemic plan. Trust asked to prepare.',
        facilitatorPrompts: [
          'What preparatory actions do you take?',
          'How do you brief staff?',
          'What supplies do you check?'
        ]
      },
      {
        id: 'flu-inject-002',
        timeMarker: 'T+1 week (Week 2)',
        description: 'Cases rising rapidly. A&E seeing 40% increase. 15% of nursing staff absent sick. PPE usage double normal rate.',
        facilitatorPrompts: [
          'How do you manage increased demand?',
          'What staff redeployment options exist?',
          'Do you activate mutual aid?'
        ]
      },
      {
        id: 'flu-inject-003',
        timeMarker: 'T+2 weeks (Week 3)',
        description: 'ICU at 120% capacity. Elective surgery suspended. 25% staff absence. PPE supplies projected to run out in 5 days.',
        facilitatorPrompts: [
          'What ethical framework guides rationing decisions?',
          'How do you source additional PPE?',
          'What public messaging is needed?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'flu-eval-001', criterion: 'Pandemic plan activated appropriately', targetOutcome: 'YES' },
      { id: 'flu-eval-002', criterion: 'Surge capacity deployed within target times', targetOutcome: 'YES' },
      { id: 'flu-eval-003', criterion: 'PPE management effective', targetOutcome: 'YES' },
      { id: 'flu-eval-004', criterion: 'Staff welfare maintained', targetOutcome: 'YES' },
      { id: 'flu-eval-005', criterion: 'Ethical decision framework applied', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'Were surge capacity plans realistic?',
      'How adequate were PPE stockpiles?',
      'Were staff redeployment plans workable?',
      'What ethical dilemmas arose?',
      'What lessons apply to future planning?'
    ]
  },
  {
    exercise: {
      id: 'ex-power-001',
      name: 'Critical Power Failure',
      type: 'live',
      scenarioId: 'power-failure',
      scenarioName: 'Total Power Loss',
      scenarioCategory: 'operational',
      duration: '2 hours',
      participants: [
        'Estates Manager',
        'On-call Manager',
        'Clinical Site Coordinator',
        'ICU Lead Nurse',
        'Theatre Coordinator'
      ],
      objectives: [
        'Test generator changeover procedures',
        'Assess critical equipment continuity',
        'Evaluate patient safety during transition',
        'Test communication during power loss'
      ],
      facilitator: 'Director of Estates',
      status: 'template',
      materialsRequired: [
        'Generator testing protocols',
        'Critical equipment list',
        'Emergency lighting maps',
        'Radio communication equipment'
      ]
    },
    injects: [
      {
        id: 'power-inject-001',
        timeMarker: 'T+0 (09:00)',
        description: 'Mains power fails across entire site. Emergency lighting activates. Generators begin automatic start sequence.',
        facilitatorPrompts: [
          'What is your immediate action?',
          'Where do you go?',
          'Who do you contact?'
        ]
      },
      {
        id: 'power-inject-002',
        timeMarker: 'T+5 minutes',
        description: 'Generator 2 fails to start. Only Generator 1 online. Load shedding required. Theatre 3 mid-operation.',
        facilitatorPrompts: [
          'What systems do you prioritise?',
          'How do you manage the theatre situation?',
          'What backup options exist?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'power-eval-001', criterion: 'Generators activated within 30 seconds', targetOutcome: 'YES' },
      { id: 'power-eval-002', criterion: 'Critical equipment maintained throughout', targetOutcome: 'YES' },
      { id: 'power-eval-003', criterion: 'Patient safety maintained', targetOutcome: 'YES' },
      { id: 'power-eval-004', criterion: 'Communication effective', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'Were generator start times acceptable?',
      'Was load shedding prioritisation correct?',
      'Were staff aware of their roles?',
      'What equipment failures occurred?',
      'What maintenance actions are needed?'
    ]
  },
  {
    exercise: {
      id: 'ex-staff-001',
      name: 'Mass Staff Sickness',
      type: 'desktop',
      scenarioId: 'workforce-crisis',
      scenarioName: 'Workforce Shortage Crisis',
      scenarioCategory: 'workforce',
      duration: '2 hours',
      participants: [
        'HR Director',
        'Chief Nursing Officer',
        'Medical Director',
        'Divisional Directors',
        'Staff-side Representatives'
      ],
      objectives: [
        'Test workforce contingency plans',
        'Assess redeployment capabilities',
        'Evaluate agency/bank staff access',
        'Test service prioritisation decisions'
      ],
      facilitator: 'HR Director',
      status: 'template',
      materialsRequired: [
        'Workforce contingency plan',
        'Staff skills database',
        'Agency supplier contacts',
        'Service criticality framework'
      ]
    },
    injects: [
      {
        id: 'staff-inject-001',
        timeMarker: 'T+0 (Monday 06:00)',
        description: 'Norovirus outbreak in staff canteen over weekend. 30% of nursing staff and 20% of clinical support staff call in sick.',
        facilitatorPrompts: [
          'What immediate staffing actions do you take?',
          'Which services do you prioritise?',
          'How do you communicate with remaining staff?'
        ]
      },
      {
        id: 'staff-inject-002',
        timeMarker: 'T+12 hours (Monday 18:00)',
        description: 'Night shift critically short. Two wards at unsafe staffing levels. Agency staff unavailable. Union raising concerns.',
        facilitatorPrompts: [
          'Do you close services?',
          'What mutual aid options exist?',
          'How do you engage with union?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'staff-eval-001', criterion: 'Workforce plan activated promptly', targetOutcome: 'YES' },
      { id: 'staff-eval-002', criterion: 'Service prioritisation framework applied', targetOutcome: 'YES' },
      { id: 'staff-eval-003', criterion: 'Safe staffing maintained on critical wards', targetOutcome: 'YES' },
      { id: 'staff-eval-004', criterion: 'Staff welfare considered', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'Was the workforce plan realistic?',
      'Were redeployment skills accurate?',
      'Was communication effective?',
      'What gaps were identified?',
      'What training needs emerged?'
    ]
  },
  {
    exercise: {
      id: 'ex-mci-001',
      name: 'Mass Casualty Incident',
      type: 'simulation',
      scenarioId: 'major-incident',
      scenarioName: 'Multi-Vehicle Collision',
      scenarioCategory: 'clinical',
      duration: '4 hours',
      participants: [
        'Emergency Department Team',
        'Trauma Team',
        'Surgical Team',
        'Executive On-Call',
        'Communications Team'
      ],
      objectives: [
        'Test major incident plan activation',
        'Assess surge capacity in A&E',
        'Evaluate triage and patient flow',
        'Test communication with emergency services'
      ],
      facilitator: 'Emergency Planning Officer',
      status: 'completed',
      lastRun: new Date('2025-01-15'),
      materialsRequired: [
        'Major incident plan',
        'Triage cards',
        'Casualty tracking system',
        'Media holding statements'
      ]
    },
    injects: [
      {
        id: 'mci-inject-001',
        timeMarker: 'T+0 (14:00)',
        description: 'Ambulance control advises: Major RTC on M1. Estimated 30+ casualties. First ambulances arriving in 15 minutes.',
        facilitatorPrompts: [
          'Do you declare a major incident?',
          'Who do you call?',
          'What immediate actions do you take?'
        ]
      },
      {
        id: 'mci-inject-002',
        timeMarker: 'T+20 minutes (14:20)',
        description: 'First wave of 12 casualties arriving. 3 P1 (immediate), 5 P2 (urgent), 4 P3 (delayed). A&E already 90% occupied.',
        facilitatorPrompts: [
          'How do you create capacity?',
          'What is your triage process?',
          'Do you call in off-duty staff?'
        ]
      },
      {
        id: 'mci-inject-003',
        timeMarker: 'T+45 minutes (14:45)',
        description: 'Second wave arriving: 15 more casualties including 2 paediatric. Media crews at hospital entrance. Relatives arriving.',
        facilitatorPrompts: [
          'How do you manage paediatric cases?',
          'What is your media strategy?',
          'How do you manage relatives?'
        ]
      }
    ],
    evaluationCriteria: [
      { id: 'mci-eval-001', criterion: 'Major incident declared within 5 minutes', targetOutcome: 'YES' },
      { id: 'mci-eval-002', criterion: 'Command structure established within 15 minutes', targetOutcome: 'YES' },
      { id: 'mci-eval-003', criterion: 'Triage completed effectively', targetOutcome: 'YES' },
      { id: 'mci-eval-004', criterion: 'All P1 patients treated within target', targetOutcome: 'YES' },
      { id: 'mci-eval-005', criterion: 'Media managed appropriately', targetOutcome: 'YES' }
    ],
    debriefQuestions: [
      'Was the major incident plan easy to follow?',
      'Was surge capacity adequate?',
      'How effective was inter-agency communication?',
      'Were triage decisions appropriate?',
      'What improvements are needed?'
    ]
  }
];

export const exerciseResults: ExerciseResult[] = [
  {
    id: 'result-heat-001',
    exerciseId: 'ex-heat-001',
    exerciseName: 'Prolonged Heatwave Response',
    date: new Date('2025-01-24'),
    participants: [
      'Board Members',
      'Executive Team',
      'Operational Leads'
    ],
    outcome: 'adequate',
    impactAnalysis: [
      { capitalName: 'Environmental', preScore: 45, postScore: 10, change: -35, recoveryTime: '14 days' },
      { capitalName: 'Operational', preScore: 72, postScore: 54, change: -18, recoveryTime: '7 days' },
      { capitalName: 'Human', preScore: 54, postScore: 42, change: -12, recoveryTime: '21 days' },
      { capitalName: 'Financial', preScore: 68, postScore: 60, change: -8, recoveryTime: '30 days' },
      { capitalName: 'Reputational', preScore: 81, postScore: 76, change: -5, recoveryTime: '60 days' }
    ],
    decisionsReviewed: [
      {
        id: 'dec-001',
        description: 'Day 1: Activate heatwave contingency plan',
        choiceMade: 'Yes (immediately)',
        outcome: 'positive',
        alternatives: ['Delay activation', 'Wait for Met Office red warning'],
        recommendation: 'Early activation was correct. Delay would have led to more severe outcomes.'
      },
      {
        id: 'dec-002',
        description: 'Day 2: Cancel elective surgery to free beds',
        choiceMade: 'Yes (50% reduction)',
        outcome: 'positive',
        alternatives: ['Continue all electives', 'Cancel 100% of electives'],
        recommendation: '50% reduction balanced capacity needs with patient care obligations.'
      },
      {
        id: 'dec-003',
        description: 'Day 3: Deploy emergency cooling units',
        choiceMade: 'Yes (£150K spend)',
        outcome: 'positive',
        alternatives: ['Delay deployment to assess further', 'Rely on existing HVAC only'],
        recommendation: 'Immediate deployment prevented patient harm. Cost justified by safety improvement.'
      }
    ],
    vulnerabilities: [
      {
        id: 'vuln-001',
        description: 'HVAC system inadequate for extreme heat',
        severity: 'critical',
        mitigation: 'Install backup cooling capacity before summer 2025',
        owner: 'Director of Estates',
        dueDate: new Date('2025-04-30'),
        status: 'planned'
      },
      {
        id: 'vuln-002',
        description: 'Insufficient heatwave contingency stocks',
        severity: 'high',
        mitigation: 'Procure additional cooling equipment and increase stock levels',
        owner: 'Procurement Manager',
        dueDate: new Date('2025-02-28'),
        status: 'in-progress'
      },
      {
        id: 'vuln-003',
        description: 'No formal mutual aid agreement for environmental events',
        severity: 'high',
        mitigation: 'Negotiate formal mutual aid MOU with neighbouring trust',
        owner: 'Chief Operating Officer',
        dueDate: new Date('2025-03-31'),
        status: 'identified'
      },
      {
        id: 'vuln-004',
        description: 'Staff welfare provisions inadequate',
        severity: 'medium',
        mitigation: 'Procure portable rest areas with cooling for staff',
        owner: 'HR Director',
        dueDate: new Date('2025-05-31'),
        status: 'identified'
      }
    ],
    actions: [
      {
        id: 'action-001',
        description: 'Business case for permanent backup cooling system (£3.5M)',
        owner: 'Director of Estates',
        dueDate: new Date('2025-02-15'),
        status: 'completed',
        completionDate: new Date('2025-02-10'),
        notes: 'Approved by Board'
      },
      {
        id: 'action-002',
        description: 'Procure temporary cooling units for summer 2025 (£800K)',
        owner: 'Procurement Manager',
        dueDate: new Date('2025-03-31'),
        status: 'in-progress',
        notes: 'RFP issued, responses due 15 March'
      },
      {
        id: 'action-003',
        description: 'Update heatwave contingency plan with lessons learned',
        owner: 'Resilience Manager',
        dueDate: new Date('2025-02-28'),
        status: 'in-progress'
      },
      {
        id: 'action-004',
        description: 'Schedule follow-up desktop exercise',
        owner: 'Resilience Manager',
        dueDate: new Date('2025-03-15'),
        status: 'not-started',
        notes: 'Planned for March 2025'
      }
    ],
    comparisonWithPrevious: {
      previousDate: new Date('2024-06-15'),
      previousOutcome: 'poor',
      improvements: [
        'Faster plan activation (2 hours vs 6 hours)',
        'Better staff communication protocols',
        'Pre-positioned cooling equipment'
      ],
      deteriorations: [
        'HVAC system now older and less reliable'
      ],
      capitalComparison: [
        { capitalName: 'Environmental', previousChange: -50, currentChange: -35 },
        { capitalName: 'Operational', previousChange: -25, currentChange: -18 },
        { capitalName: 'Human', previousChange: -20, currentChange: -12 },
        { capitalName: 'Financial', previousChange: -15, currentChange: -8 },
        { capitalName: 'Reputational', previousChange: -12, currentChange: -5 }
      ]
    }
  },
  {
    id: 'result-mci-001',
    exerciseId: 'ex-mci-001',
    exerciseName: 'Mass Casualty Incident',
    date: new Date('2025-01-15'),
    participants: [
      'Emergency Department Team',
      'Trauma Team',
      'Surgical Team',
      'Executive On-Call'
    ],
    outcome: 'well-managed',
    impactAnalysis: [
      { capitalName: 'Operational', preScore: 72, postScore: 55, change: -17, recoveryTime: '48 hours' },
      { capitalName: 'Human', preScore: 54, postScore: 48, change: -6, recoveryTime: '7 days' },
      { capitalName: 'Financial', preScore: 68, postScore: 62, change: -6, recoveryTime: '14 days' },
      { capitalName: 'Reputational', preScore: 81, postScore: 85, change: +4, recoveryTime: 'Immediate' },
      { capitalName: 'Environmental', preScore: 45, postScore: 43, change: -2, recoveryTime: '24 hours' }
    ],
    decisionsReviewed: [
      {
        id: 'mci-dec-001',
        description: 'Immediate declaration of major incident',
        choiceMade: 'Yes (within 3 minutes)',
        outcome: 'positive',
        alternatives: ['Wait for more information', 'Escalate internally first'],
        recommendation: 'Rapid declaration was textbook response. Enabled full mobilisation.'
      },
      {
        id: 'mci-dec-002',
        description: 'Call in off-duty trauma team',
        choiceMade: 'Yes (immediately)',
        outcome: 'positive',
        alternatives: ['Use on-site staff only', 'Wait to assess numbers'],
        recommendation: 'Early call-in meant team arrived before second wave.'
      }
    ],
    vulnerabilities: [
      {
        id: 'mci-vuln-001',
        description: 'Triage area capacity limited',
        severity: 'medium',
        mitigation: 'Identify additional triage space in outpatients',
        owner: 'Emergency Planning Officer',
        dueDate: new Date('2025-03-01'),
        status: 'in-progress'
      },
      {
        id: 'mci-vuln-002',
        description: 'Radio communication patchy in some areas',
        severity: 'high',
        mitigation: 'Install radio repeaters in dead zones',
        owner: 'Director of Estates',
        dueDate: new Date('2025-02-28'),
        status: 'planned'
      }
    ],
    actions: [
      {
        id: 'mci-action-001',
        description: 'Update major incident plan with lessons learned',
        owner: 'Emergency Planning Officer',
        dueDate: new Date('2025-02-28'),
        status: 'completed',
        completionDate: new Date('2025-02-05')
      },
      {
        id: 'mci-action-002',
        description: 'Procure additional triage equipment',
        owner: 'Procurement Manager',
        dueDate: new Date('2025-03-15'),
        status: 'in-progress'
      }
    ]
  }
];

export const getExercisePackageById = (id: string): ExercisePackage | undefined => {
  return exercisePackages.find(pkg => pkg.exercise.id === id);
};

export const getExerciseResultById = (id: string): ExerciseResult | undefined => {
  return exerciseResults.find(result => result.id === id);
};

export const getExerciseResultByExerciseId = (exerciseId: string): ExerciseResult | undefined => {
  return exerciseResults.find(result => result.exerciseId === exerciseId);
};

export const getCompletedExercises = (): ExercisePackage[] => {
  return exercisePackages.filter(pkg => pkg.exercise.status === 'completed');
};

export const getUniqueScenarioCategories = (): string[] => {
  const categories = exercisePackages.map(pkg => pkg.exercise.scenarioCategory);
  return [...new Set(categories)];
};

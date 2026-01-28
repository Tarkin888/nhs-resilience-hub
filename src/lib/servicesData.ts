import { DetailedEssentialService } from '@/types/services';

// Helper to generate 12 months of trend data
const generateTrendData = (baseValue: number, variance: number = 5): Array<{ date: string; value: number }> => {
  const data = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const fluctuation = (Math.random() - 0.5) * variance * 2;
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round((baseValue + fluctuation) * 10) / 10
    });
  }
  return data;
};

export const detailedServices: DetailedEssentialService[] = [
  {
    id: 'emergency-care',
    name: 'Emergency Care',
    status: 'operational',
    statusReason: 'All pathways functioning within tolerance thresholds',
    lastUpdated: new Date('2025-01-27T08:30:00'),
    executiveOwner: 'Chief Operating Officer',
    lastTested: new Date('2025-01-15'),
    
    description: 'Emergency care services provide urgent and emergency medical treatment to patients presenting at A&E or via ambulance. This includes resuscitation, emergency assessment, diagnostics, treatment, and admission or discharge decision-making.\n\nThe service operates 24/7 and is the primary point of entry for acute medical and surgical emergencies. It serves approximately 150,000 patients annually and is a critical component of the regional trauma network.',
    
    criticalPathways: [
      'Resuscitation',
      'Emergency Assessment Unit',
      'Ambulatory Emergency Care',
      'Emergency Diagnostics'
    ],
    
    regulatoryRequirements: [
      'NHS England 4-hour standard (95%)',
      'CQC Safe and Responsive',
      'NHS Act 2006 statutory duties',
      'Major Incident Response protocols'
    ],
    
    communityImpact: 'Emergency care is the safety net for our community. When residents experience sudden illness or injury, they depend on rapid, expert care. Any disruption directly affects the most vulnerable – elderly patients, those with chronic conditions, and trauma victims who have no alternative care pathway.',
    
    impactTolerances: {
      fullService: {
        definition: 'All resus bays, majors and minors areas fully operational with complete diagnostic support and specialist availability',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Positive community confidence'
      },
      degradedService: {
        definition: 'Reduced capacity in majors/minors, some diagnostic delays, limited specialist availability',
        clinicalHarm: 'Minor delays to treatment, potential for increased pain/discomfort',
        regulatoryBreach: 'Risk of 4-hour breach notifications',
        reputationalImpact: 'Local media interest, patient complaints'
      },
      minimumViable: {
        definition: 'Resuscitation and critical care maintained, significant delays in assessment and treatment',
        clinicalHarm: 'Moderate harm possible from delayed diagnosis/treatment',
        regulatoryBreach: 'Likely to breach standards, regulatory notification required',
        reputationalImpact: 'National media coverage, MP involvement'
      },
      serviceFailure: {
        definition: 'Unable to safely receive emergency patients, divert status required',
        clinicalHarm: 'Serious harm or death possible from lack of emergency access',
        regulatoryBreach: 'Major enforcement action, potential special measures',
        reputationalImpact: 'CQC intervention, parliamentary questions'
      }
    },
    
    metrics: [
      {
        name: '4-Hour Standard',
        currentValue: '92%',
        target: '95%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(92, 3),
        dataSource: 'Emergency Care Data Set (ECDS)'
      },
      {
        name: 'Ambulance Handover',
        currentValue: '38 mins',
        target: '<30 mins',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(38, 8),
        dataSource: 'Ambulance Service Trust Data'
      },
      {
        name: 'Re-attendance Rate (7 days)',
        currentValue: '6.2%',
        target: '<8%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(6.2, 1),
        dataSource: 'ECDS Analysis'
      },
      {
        name: 'Left Without Being Seen',
        currentValue: '2.1%',
        target: '<2%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(2.1, 0.5),
        dataSource: 'ECDS Analysis'
      },
      {
        name: 'Time to Triage',
        currentValue: '12 mins',
        target: '<15 mins',
        trend: 'improving',
        status: 'green',
        history: generateTrendData(12, 3),
        dataSource: 'Symphony PAS'
      },
      {
        name: 'Resus Door-to-Doctor',
        currentValue: '3 mins',
        target: '<5 mins',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(3, 1),
        dataSource: 'Symphony PAS'
      }
    ],
    
    internalDependencies: [
      { name: 'Critical Care Beds', type: 'facility', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Ward Capacity', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Diagnostics (CT/X-ray)', type: 'equipment', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Pharmacy Services', type: 'staff', criticality: 'high', singlePointOfFailure: false },
      { name: 'EPR System', type: 'it', criticality: 'critical', singlePointOfFailure: true },
      { name: '24/7 Medical Staff', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Blood Bank', type: 'facility', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Ambulance Service', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'NHS 111', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Mental Health Crisis Team', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Social Care', type: 'partner', criticality: 'medium', singlePointOfFailure: false },
      { name: 'Electricity Supply', type: 'utility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Medical Gases Supplier', type: 'supplier', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-15'),
        type: 'desktop',
        outcome: 'adequate',
        vulnerabilities: [
          'Limited surge capacity beyond 120% occupancy',
          'Slow communication channels outside A&E footprint',
          'Single EPR system with no failover'
        ],
        mitigations: [
          { action: 'Develop surge capacity protocol with temporary zones', status: 'in-progress' },
          { action: 'Implement cascade communication system', status: 'completed' },
          { action: 'EPR downtime procedures refreshed', status: 'completed' }
        ]
      },
      nextTest: {
        date: new Date('2025-03-15'),
        type: 'Tabletop Exercise',
        scenario: 'Cyber-attack affecting EPR system during peak hours'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'When capacity reaches 95%, the following actions are triggered:\n\n1. **Immediate Actions**\n   - Activate flow coordinator role\n   - Expedite discharge decisions on wards\n   - Open escalation areas\n\n2. **4-Hour Actions**\n   - Senior management presence required\n   - Consider ambulance diverts\n   - Activate mutual aid agreements\n\n3. **Communication**\n   - Hourly SITREP to CCG\n   - Patient flow meetings every 2 hours',
      
      alternativeDelivery: 'Emergency care can be partially delivered through:\n\n- **Ambulatory Emergency Care Unit**: For suitable patients, bypassing traditional A&E\n- **Same Day Emergency Care**: Specialist pathways for specific conditions\n- **Hot Clinics**: Rapid access specialty clinics\n- **GP Streaming**: Redirection of primary care presentations\n\nThese alternatives can handle approximately 30% of current A&E demand.',
      
      mutualAid: 'Mutual aid agreements are in place with:\n\n- **City General Hospital**: 15-minute transfer, capacity for 20 patients/day\n- **Regional Trauma Centre**: Major trauma bypass\n- **Private Hospital**: Elective surgical overflow\n\nActivation requires Chief Operating Officer approval and 2-hour notice.',
      
      recoveryPrioritisation: 'Recovery priority order:\n\n1. **Immediate** (0-4 hours): Resuscitation capability, critical care access\n2. **Urgent** (4-12 hours): Full majors capacity, diagnostic access\n3. **Important** (12-24 hours): Minors and ambulatory care\n4. **Routine** (24-48 hours): Full staffing, complete IT systems'
    }
  },
  {
    id: 'elective-surgery',
    name: 'Elective Surgery',
    status: 'degraded',
    statusReason: 'Reduced capacity due to bed availability constraints',
    lastUpdated: new Date('2025-01-27T07:45:00'),
    executiveOwner: 'Mr. James Anderson',
    lastTested: new Date('2025-01-20'),
    
    description: 'Planned surgical procedures for patients on waiting lists, covering general surgery, orthopaedics, gynaecology, urology, and other specialties. This service is critical for meeting 18-week referral-to-treatment standards and reducing the elective backlog.\n\nThe Trust operates 12 theatres across two sites, performing approximately 25,000 procedures annually. The service directly impacts quality of life for patients waiting for joint replacements, hernia repairs, and other planned interventions.',
    
    criticalPathways: [
      'Pre-operative Assessment',
      'Theatre Suite Operations',
      'Post-Anaesthetic Recovery',
      'Surgical Ward Care'
    ],
    
    regulatoryRequirements: [
      'NHS England 18-week RTT (92%)',
      'CQC Safe and Effective',
      'WHO Surgical Safety Checklist compliance',
      'National Safety Standards for Invasive Procedures'
    ],
    
    communityImpact: 'Delays to elective surgery significantly impact quality of life. Patients waiting for hip replacements remain in pain and lose mobility. Those awaiting cancer surgery face anxiety and potential disease progression. The community expects timely access to planned care that the NHS has committed to provide.',
    
    impactTolerances: {
      fullService: {
        definition: 'All 12 theatres operational, full pre-op and recovery capacity, no cancellations due to bed availability',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Patient confidence maintained'
      },
      degradedService: {
        definition: '8-10 theatres operational, some cancellations, prioritisation of cancer and urgent cases',
        clinicalHarm: 'Extended waiting times, increased pain/disability for routine cases',
        regulatoryBreach: 'Risk of RTT breaches, NHS England scrutiny',
        reputationalImpact: 'Patient complaints, local media interest'
      },
      minimumViable: {
        definition: '4-6 theatres only, cancer surgery only, all routine work suspended',
        clinicalHarm: 'Significant harm from delayed treatment, disease progression',
        regulatoryBreach: 'Regulatory intervention likely, formal improvement notices',
        reputationalImpact: 'National coverage, political attention'
      },
      serviceFailure: {
        definition: 'All elective surgery suspended',
        clinicalHarm: 'Serious harm from untreated conditions, potential deaths',
        regulatoryBreach: 'Major enforcement action',
        reputationalImpact: 'Public inquiry risk, fundamental loss of confidence'
      }
    },
    
    metrics: [
      {
        name: '18-Week RTT',
        currentValue: '88%',
        target: '92%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(88, 4),
        dataSource: 'RTT National Dataset'
      },
      {
        name: 'Theatre Utilisation',
        currentValue: '82%',
        target: '>85%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(82, 5),
        dataSource: 'Theatre Management System'
      },
      {
        name: 'Same-Day Cancellation Rate',
        currentValue: '12%',
        target: '<8%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(12, 3),
        dataSource: 'Theatre Management System'
      },
      {
        name: 'Patient Satisfaction',
        currentValue: '91%',
        target: '>90%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(91, 3),
        dataSource: 'Friends and Family Test'
      }
    ],
    
    internalDependencies: [
      { name: 'Theatre Availability', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Anaesthetic Cover', type: 'staff', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Ward Capacity', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Diagnostic Services', type: 'equipment', criticality: 'high', singlePointOfFailure: false },
      { name: 'Theatre Booking System', type: 'it', criticality: 'high', singlePointOfFailure: true }
    ],
    
    externalDependencies: [
      { name: 'Medical Device Suppliers', type: 'supplier', criticality: 'high', singlePointOfFailure: false },
      { name: 'Sterilisation Services', type: 'supplier', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Private Hospital Capacity', type: 'partner', criticality: 'medium', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-20'),
        type: 'simulation',
        outcome: 'poor',
        vulnerabilities: [
          'Bed availability blocking theatre lists',
          'No alternative theatre capacity',
          'Dependent on single sterilisation provider'
        ],
        mitigations: [
          { action: 'Ring-fence surgical beds during peak periods', status: 'planned' },
          { action: 'Explore mobile theatre options', status: 'in-progress' },
          { action: 'Second sterilisation contract negotiation', status: 'in-progress' }
        ]
      },
      nextTest: {
        date: new Date('2025-04-10'),
        type: 'Tabletop Exercise',
        scenario: 'Surgical equipment failure affecting multiple theatres'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Escalation framework for reduced capacity:\n\n1. **Amber Status** (2+ cancellations/day)\n   - Prioritise P1/P2 cancer cases\n   - Review all lists for consolidation\n   - Daily capacity meeting\n\n2. **Red Status** (>4 cancellations/day)\n   - Suspend non-urgent cases\n   - Activate insourcing arrangements\n   - Consider private sector capacity',
      
      alternativeDelivery: 'Alternative delivery options include:\n\n- **Day Surgery Unit**: Increased day case rates\n- **Private Hospital Contract**: 50 cases/month capacity\n- **Insourcing Teams**: Weekend additional lists\n- **Regional Surgical Hub**: Complex cases transfer',
      
      mutualAid: 'Surgical mutual aid network:\n\n- **Regional Orthopaedic Centre**: Joint replacements\n- **Cancer Alliance**: Prioritised cancer pathway\n- **Independent Sector**: Framework agreement in place',
      
      recoveryPrioritisation: 'Surgery restoration priority:\n\n1. **Cancer surgery** - within 72 hours\n2. **Time-critical urgent** - within 1 week\n3. **Routine urgent** - within 2 weeks\n4. **Routine planned** - within 4 weeks'
    }
  },
  {
    id: 'mental-health',
    name: 'Mental Health Crisis',
    status: 'at-risk',
    statusReason: 'Section 136 suite at capacity, police custody being used',
    lastUpdated: new Date('2025-01-27T09:00:00'),
    executiveOwner: 'Dr. Emily Roberts',
    lastTested: new Date('2025-01-22'),
    
    description: 'Mental health crisis response for individuals in acute psychological distress, including Section 136 assessments, liaison psychiatry in A&E, crisis team home interventions, and Psychiatric Intensive Care Unit (PICU) admissions.\n\nThe service provides the safety net for people experiencing mental health emergencies, preventing harm to self or others and ensuring appropriate care pathways are accessed.',
    
    criticalPathways: [
      'Crisis Team Response',
      'Psychiatric Intensive Care (PICU)',
      'Liaison Psychiatry',
      'Section 136 Suite'
    ],
    
    regulatoryRequirements: [
      'Mental Health Act 1983 compliance',
      'CQC Safe domain requirements',
      'NHS England crisis response targets',
      '4-hour assessment standard (90%)'
    ],
    
    communityImpact: 'Mental health crises affect individuals, families, and communities. When crisis services fail, people in distress end up in police custody, A&E departments, or worse. The ripple effect includes family trauma, workplace disruption, and reduced community confidence in mental health support.',
    
    impactTolerances: {
      fullService: {
        definition: 'Section 136 suite available, crisis team fully staffed, PICU beds accessible, liaison psychiatry operational',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Positive partner relationships'
      },
      degradedService: {
        definition: 'Section 136 suite limited, extended crisis team response times, PICU near capacity',
        clinicalHarm: 'Delays in assessment, increased distress, risk of self-harm',
        regulatoryBreach: 'Risk of Mental Health Act breaches',
        reputationalImpact: 'Police and partner complaints, local media'
      },
      minimumViable: {
        definition: 'Emergency assessments only, Section 136 diverted to other locations, crisis home visits suspended',
        clinicalHarm: 'Significant harm from delayed intervention, potential serious incidents',
        regulatoryBreach: 'Mental Health Act breaches, CQC notification required',
        reputationalImpact: 'National media, coroner inquests'
      },
      serviceFailure: {
        definition: 'Unable to provide safe assessment or care for people in mental health crisis',
        clinicalHarm: 'Deaths likely from suicide or neglect',
        regulatoryBreach: 'Special measures, potential prosecution',
        reputationalImpact: 'Public inquiry, fundamental trust breakdown'
      }
    },
    
    metrics: [
      {
        name: 'Assessment <4 hours',
        currentValue: '78%',
        target: '90%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(78, 8),
        dataSource: 'RiO Clinical System'
      },
      {
        name: 'S136 Suite Capacity',
        currentValue: '100%',
        target: '<85%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(95, 5),
        dataSource: 'Suite Management System'
      },
      {
        name: 'Crisis Team Response <4hrs',
        currentValue: '85%',
        target: '95%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(85, 5),
        dataSource: 'RiO Clinical System'
      },
      {
        name: '30-Day Readmission Rate',
        currentValue: '18%',
        target: '<15%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(18, 3),
        dataSource: 'RiO Clinical System'
      }
    ],
    
    internalDependencies: [
      { name: 'PICU Beds', type: 'facility', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Crisis Team Out-of-Hours Cover', type: 'staff', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Liaison Psychiatry', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Approved Mental Health Professionals', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Section 12 Doctors', type: 'staff', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Police (Section 136)', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Social Care AMHPs', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Community Mental Health Teams', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Voluntary Sector Crisis Support', type: 'partner', criticality: 'medium', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-22'),
        type: 'simulation',
        outcome: 'adequate',
        vulnerabilities: [
          'Section 136 capacity insufficient for demand',
          'Over-reliance on police for transport and custody',
          'Crisis team out-of-hours cover stretched'
        ],
        mitigations: [
          { action: 'Additional S136 suite at partner site', status: 'in-progress' },
          { action: 'Street triage pilot with police', status: 'completed' },
          { action: 'Bank staff recruitment for crisis team', status: 'in-progress' }
        ]
      },
      nextTest: {
        date: new Date('2025-05-05'),
        type: 'Tabletop Exercise',
        scenario: 'Crisis team capacity stress test during bank holiday'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Crisis service escalation:\n\n1. **S136 at capacity**\n   - Notify police control room\n   - Fast-track assessments in progress\n   - Consider A&E overflow (last resort)\n\n2. **Crisis team overwhelmed**\n   - Prioritise by acuity\n   - Telephone support for lower-risk\n   - Activate on-call consultant',
      
      alternativeDelivery: 'Alternative crisis support:\n\n- **Crisis Café**: Voluntary sector partner\n- **Crisis Text Line**: 24/7 text support\n- **Samaritans Partnership**: Warm handover protocol\n- **Police Street Triage**: Pre-detention intervention',
      
      mutualAid: 'Mental health mutual aid:\n\n- **Neighbouring Mental Health Trust**: S136 overflow\n- **Regional PICU Network**: Bed sharing\n- **Private Hospital**: Acute admission capacity',
      
      recoveryPrioritisation: 'Service restoration priority:\n\n1. **S136 suite** - immediate\n2. **PICU capacity** - within 24 hours\n3. **Crisis team full cover** - within 48 hours\n4. **Community follow-up** - within 72 hours'
    }
  },
  {
    id: 'maternity',
    name: 'Maternity Services',
    status: 'operational',
    statusReason: 'All pathways functioning, staffing levels adequate',
    lastUpdated: new Date('2025-01-27T06:00:00'),
    executiveOwner: 'Ms. Helen Carter',
    lastTested: new Date('2025-01-18'),
    
    description: 'Comprehensive maternity care from antenatal booking through labour, delivery, and postnatal care up to 28 days. This includes community midwifery, antenatal clinics, the labour ward, alongside midwifery-led birth centre, and neonatal services.\n\nThe service supports approximately 4,500 births annually and is a key community service with significant emotional importance to families.',
    
    criticalPathways: [
      'Antenatal Clinic',
      'Labour Ward',
      'Birth Centre',
      'Neonatal Unit'
    ],
    
    regulatoryRequirements: [
      'One-to-one care in labour (95%)',
      'CQC Safe and Caring domains',
      'Ockenden Report recommendations',
      'CNST Maternity Incentive Scheme'
    ],
    
    communityImpact: 'Maternity care is deeply personal. Families remember their birth experiences for a lifetime. Safe, compassionate maternity care builds community trust and supports the next generation. Failures in maternity care devastate families and communities, as national inquiries have shown.',
    
    impactTolerances: {
      fullService: {
        definition: 'All delivery suites available, 1:1 care maintained, neonatal cots available, full consultant presence',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Positive family feedback'
      },
      degradedService: {
        definition: 'Birth centre closed, some 1:1 care challenges, limited neonatal capacity',
        clinicalHarm: 'Increased intervention rates, delayed neonatal care',
        regulatoryBreach: 'CNST compliance at risk',
        reputationalImpact: 'Family complaints, local scrutiny'
      },
      minimumViable: {
        definition: 'Labour ward only, diverting some women to other units, consultant-led care only',
        clinicalHarm: 'Significant harm risk from delayed or diverted care',
        regulatoryBreach: 'CQC notification required, Ockenden concerns',
        reputationalImpact: 'National media, NHSE intervention'
      },
      serviceFailure: {
        definition: 'Unable to safely deliver maternity care, unit closure',
        clinicalHarm: 'Deaths of mothers and babies',
        regulatoryBreach: 'Special measures, potential prosecution',
        reputationalImpact: 'Public inquiry, fundamental trust breakdown'
      }
    },
    
    metrics: [
      {
        name: 'One-to-One Care in Labour',
        currentValue: '97%',
        target: '95%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(97, 2),
        dataSource: 'BadgerNet Maternity System'
      },
      {
        name: 'Stillbirth Rate (per 1000)',
        currentValue: '3.8',
        target: '<4.1',
        trend: 'improving',
        status: 'green',
        history: generateTrendData(3.8, 0.5),
        dataSource: 'MBRRACE-UK'
      },
      {
        name: 'C-Section Rate',
        currentValue: '28%',
        target: '<30%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(28, 3),
        dataSource: 'BadgerNet Maternity System'
      },
      {
        name: 'Midwifery Vacancy Rate',
        currentValue: '8%',
        target: '<10%',
        trend: 'improving',
        status: 'green',
        history: generateTrendData(8, 2),
        dataSource: 'ESR Workforce Data'
      }
    ],
    
    internalDependencies: [
      { name: 'Obstetric Staff', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Neonatal Cots', type: 'facility', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Theatre Access', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Blood Bank', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Anaesthetic Cover', type: 'staff', criticality: 'critical', singlePointOfFailure: true }
    ],
    
    externalDependencies: [
      { name: 'Tertiary Neonatal Centre', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Pathology Services', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Ambulance Service', type: 'partner', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-18'),
        type: 'live',
        outcome: 'well-managed',
        vulnerabilities: [
          'Consultant cover gaps at night',
          'Neonatal cot pressure in winter'
        ],
        mitigations: [
          { action: 'Resident consultant rota implemented', status: 'completed' },
          { action: 'Neonatal network escalation pathway agreed', status: 'completed' }
        ]
      },
      nextTest: {
        date: new Date('2025-06-22'),
        type: 'Simulation',
        scenario: 'Major obstetric haemorrhage with concurrent neonatal emergency'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Maternity escalation framework:\n\n1. **Staffing pressure**\n   - Close birth centre\n   - Focus on labour ward\n   - Bank/agency call-out\n\n2. **Capacity pressure**\n   - Early discharge pathway\n   - Transfer to partner units',
      
      alternativeDelivery: 'Alternative maternity pathways:\n\n- **Home Birth Team**: Low-risk women\n- **Partner Unit**: 20-minute transfer\n- **Early Discharge**: Community midwifery support',
      
      mutualAid: 'Maternity network agreements:\n\n- **Regional Maternity Network**: Bed sharing protocol\n- **Tertiary Centre**: High-risk transfers\n- **Neonatal Network**: Cot capacity sharing',
      
      recoveryPrioritisation: 'Maternity restoration priority:\n\n1. **Labour ward** - immediate\n2. **Neonatal capacity** - within 12 hours\n3. **Birth centre** - within 48 hours\n4. **Full antenatal services** - within 1 week'
    }
  },
  {
    id: 'diagnostics',
    name: 'Diagnostics',
    status: 'degraded',
    statusReason: 'CT scanner downtime, patients referred to neighbouring trust',
    lastUpdated: new Date('2025-01-27T08:15:00'),
    executiveOwner: 'Dr. Michael Chen',
    lastTested: new Date('2025-01-24'),
    
    description: 'Diagnostic imaging (X-ray, CT, MRI, ultrasound), pathology laboratory services, and endoscopy supporting all clinical pathways across the Trust. Diagnostics are foundational to clinical decision-making and patient safety.\n\nThe department processes over 500,000 tests annually and is the gateway to treatment for most clinical conditions.',
    
    criticalPathways: [
      'Radiology (X-ray, CT, MRI, Ultrasound)',
      'Pathology Laboratory',
      'Endoscopy Suite',
      'Point of Care Testing'
    ],
    
    regulatoryRequirements: [
      '6-week diagnostic standard (99%)',
      'CQC Effective domain',
      'UKAS Laboratory Accreditation',
      'IR(ME)R Regulations'
    ],
    
    communityImpact: 'Delayed diagnostics means delayed diagnosis. For cancer patients, this can be the difference between curative treatment and palliative care. The community expects rapid answers when they are worried about their health.',
    
    impactTolerances: {
      fullService: {
        definition: 'All imaging modalities operational, pathology turnaround on target, endoscopy capacity adequate',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Clinical confidence maintained'
      },
      degradedService: {
        definition: 'One modality reduced, extended turnaround times, prioritisation of urgent cases',
        clinicalHarm: 'Delayed diagnosis, extended patient anxiety',
        regulatoryBreach: 'Risk of 6-week breaches, UKAS observations',
        reputationalImpact: 'Clinical complaints, referrer concerns'
      },
      minimumViable: {
        definition: 'Emergency diagnostics only, significant outsourcing, extended reporting delays',
        clinicalHarm: 'Significant harm from delayed diagnosis',
        regulatoryBreach: 'Accreditation at risk, regulatory notification',
        reputationalImpact: 'National media, clinical quality concerns'
      },
      serviceFailure: {
        definition: 'Unable to provide diagnostic services, complete clinical dependency on external provision',
        clinicalHarm: 'Serious harm and deaths from undiagnosed conditions',
        regulatoryBreach: 'Loss of accreditation, enforcement action',
        reputationalImpact: 'Fundamental trust in clinical services lost'
      }
    },
    
    metrics: [
      {
        name: '6-Week Diagnostic Standard',
        currentValue: '94%',
        target: '99%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(94, 3),
        dataSource: 'DM01 National Return'
      },
      {
        name: 'CT Availability',
        currentValue: '75%',
        target: '>95%',
        trend: 'declining',
        status: 'red',
        history: generateTrendData(85, 10),
        dataSource: 'CRIS Radiology System'
      },
      {
        name: 'Reporting Turnaround',
        currentValue: '4.2 days',
        target: '<3 days',
        trend: 'declining',
        status: 'amber',
        history: generateTrendData(4.2, 1),
        dataSource: 'CRIS Radiology System'
      },
      {
        name: 'Pathology TAT (<24hrs)',
        currentValue: '92%',
        target: '95%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(92, 3),
        dataSource: 'LIMS Laboratory System'
      }
    ],
    
    internalDependencies: [
      { name: 'Radiologists', type: 'staff', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Reporting Systems (CRIS)', type: 'it', criticality: 'critical', singlePointOfFailure: true },
      { name: 'CT Scanner 2', type: 'equipment', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Equipment Maintenance', type: 'facility', criticality: 'high', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Equipment Suppliers', type: 'supplier', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Contrast Media Supply', type: 'supplier', criticality: 'high', singlePointOfFailure: false },
      { name: 'Pathology Transport', type: 'partner', criticality: 'medium', singlePointOfFailure: false },
      { name: 'Outsourced Reporting', type: 'partner', criticality: 'high', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-24'),
        type: 'desktop',
        outcome: 'poor',
        vulnerabilities: [
          'No CT redundancy when Scanner 2 fails',
          'Over-reliance on outsourcing for reporting backlog',
          'Single LIMS system with no failover'
        ],
        mitigations: [
          { action: 'Mobile CT contract negotiation', status: 'in-progress' },
          { action: 'Second outsourcing partner onboarding', status: 'in-progress' },
          { action: 'LIMS disaster recovery plan update', status: 'planned' }
        ]
      },
      nextTest: {
        date: new Date('2025-02-08'),
        type: 'Tabletop Exercise',
        scenario: 'Pathology system failure affecting all laboratory services'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Diagnostic service escalation:\n\n1. **Equipment failure**\n   - Prioritise emergency and cancer\n   - Activate outsourcing contracts\n   - Redirect to partner trusts\n\n2. **Staffing shortage**\n   - Extend reporting via outsourcing\n   - Reduce routine capacity',
      
      alternativeDelivery: 'Alternative diagnostic pathways:\n\n- **Mobile CT Unit**: On standby contract\n- **Outsourced Reporting**: 500 studies/week capacity\n- **Partner Trust Access**: Emergency CT slots\n- **Community Diagnostics**: Routine imaging redirect',
      
      mutualAid: 'Diagnostic network support:\n\n- **Regional Imaging Network**: Capacity sharing\n- **Pathology Network**: Sample transfer protocol\n- **Private Provider**: Emergency MRI access',
      
      recoveryPrioritisation: 'Diagnostic restoration priority:\n\n1. **Emergency CT/X-ray** - immediate\n2. **Inpatient diagnostics** - within 24 hours\n3. **Cancer pathway** - within 48 hours\n4. **Routine outpatient** - within 1 week'
    }
  },
  {
    id: 'critical-care',
    name: 'Critical Care',
    status: 'operational',
    statusReason: 'Bed availability maintained, staffing adequate',
    lastUpdated: new Date('2025-01-27T07:00:00'),
    executiveOwner: 'Dr. Richard Thompson',
    lastTested: new Date('2025-01-23'),
    
    description: 'Intensive care for critically ill patients requiring ventilation, multi-organ support, and intensive nursing care. This includes the Intensive Care Unit (ICU), High Dependency Unit (HDU), and step-down care pathways.\n\nThe unit has 24 beds (16 ICU, 8 HDU) and provides the highest acuity care in the Trust, supporting surgical, medical, and trauma patients.',
    
    criticalPathways: [
      'Intensive Care Unit (ICU)',
      'High Dependency Unit (HDU)',
      'Step-down Care',
      'Outreach Team'
    ],
    
    regulatoryRequirements: [
      'Critical Care Network standards',
      'CQC Safe domain',
      'Consultant-led care 24/7',
      'GPICS v2 Guidelines'
    ],
    
    communityImpact: 'Critical care is the final safety net for the sickest patients. Families trust that when their loved ones are critically ill, the best possible care is available. Failure in critical care is catastrophic and highly visible.',
    
    impactTolerances: {
      fullService: {
        definition: 'All 24 beds operational, 1:1 nursing for ICU maintained, full consultant presence',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Clinical excellence maintained'
      },
      degradedService: {
        definition: '18-20 beds, some nurse:patient ratio flexibility, limited step-down capacity',
        clinicalHarm: 'Delayed admissions, suboptimal monitoring',
        regulatoryBreach: 'Network notification required',
        reputationalImpact: 'Internal escalation, staff concern'
      },
      minimumViable: {
        definition: '12 beds, HDU closed, emergency admissions only',
        clinicalHarm: 'Significant harm from delayed critical care access',
        regulatoryBreach: 'CQC notification, network mutual aid required',
        reputationalImpact: 'Regional media, surgical case cancellations'
      },
      serviceFailure: {
        definition: 'Unable to admit critically ill patients, full divert required',
        clinicalHarm: 'Deaths from lack of critical care access',
        regulatoryBreach: 'Major enforcement, potential prosecution',
        reputationalImpact: 'National media, parliamentary attention'
      }
    },
    
    metrics: [
      {
        name: 'Bed Occupancy',
        currentValue: '82%',
        target: '80-85%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(82, 5),
        dataSource: 'ICNARC Database'
      },
      {
        name: 'Cancelled Ops (No ICU Bed)',
        currentValue: '3%',
        target: '<5%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(3, 2),
        dataSource: 'Theatre Management System'
      },
      {
        name: 'Delayed Discharges',
        currentValue: '8%',
        target: '<10%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(8, 3),
        dataSource: 'ICNARC Database'
      },
      {
        name: 'Nurse:Patient Ratio (ICU)',
        currentValue: '1:1',
        target: '1:1',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(1, 0.1),
        dataSource: 'SafeCare Staffing'
      }
    ],
    
    internalDependencies: [
      { name: 'Specialist Nurses', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Intensivist Consultants', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Ventilators', type: 'equipment', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Pharmacy Support', type: 'staff', criticality: 'high', singlePointOfFailure: false },
      { name: 'Step-down Ward Capacity', type: 'facility', criticality: 'high', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Tertiary Centres', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Equipment Suppliers', type: 'supplier', criticality: 'high', singlePointOfFailure: false },
      { name: 'Medical Gases', type: 'supplier', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-23'),
        type: 'live',
        outcome: 'well-managed',
        vulnerabilities: [
          'Winter surge could breach capacity',
          'Equipment aging (ventilators >5 years)',
          'Senior nurse cover at weekends'
        ],
        mitigations: [
          { action: 'Surge capacity plan with flexible beds', status: 'completed' },
          { action: 'Ventilator replacement programme', status: 'in-progress' },
          { action: 'Weekend senior nurse incentives', status: 'completed' }
        ]
      },
      nextTest: {
        date: new Date('2025-04-14'),
        type: 'Simulation',
        scenario: 'Pandemic surge requiring 150% capacity'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Critical care escalation:\n\n1. **Capacity pressure (>85%)**\n   - Review all patients for step-down\n   - Pre-alert surgical teams\n   - Network capacity check\n\n2. **Staffing pressure**\n   - Senior staff supernumerary release\n   - Bank/agency escalation',
      
      alternativeDelivery: 'Surge capacity options:\n\n- **Theatre Recovery**: 4 additional ventilated beds\n- **HDU Upgrade**: 4 HDU beds to ICU level\n- **Outreach Model**: Support on wards for borderline patients',
      
      mutualAid: 'Critical care network:\n\n- **Regional Critical Care Network**: Bed sharing protocol\n- **Tertiary Centre**: Complex case transfer\n- **Private Hospital**: HDU-level support',
      
      recoveryPrioritisation: 'Critical care restoration:\n\n1. **ICU capacity** - immediate\n2. **HDU beds** - within 12 hours\n3. **Outreach service** - within 24 hours\n4. **Step-down flow** - within 48 hours'
    }
  },
  {
    id: 'stroke',
    name: 'Stroke Services',
    status: 'operational',
    statusReason: 'Thrombolysis delivery within target times',
    lastUpdated: new Date('2025-01-27T06:30:00'),
    executiveOwner: 'Dr. Patricia Wong',
    lastTested: new Date('2025-01-19'),
    
    description: 'Hyperacute stroke unit providing rapid assessment, thrombolysis, thrombectomy pathway coordination, and specialist stroke rehabilitation. Time-critical service where "time is brain" – every minute of delay results in neuronal loss.\n\nThe service treats approximately 800 stroke patients annually and is part of the regional stroke network.',
    
    criticalPathways: [
      'Hyperacute Stroke Unit (HASU)',
      'Stroke Unit',
      'Early Supported Discharge',
      'Thrombectomy Pathway'
    ],
    
    regulatoryRequirements: [
      'Thrombolysis <60 mins (80%)',
      'CQC Safe and Effective',
      'SSNAP (Sentinel Stroke National Audit Programme)',
      'Regional Stroke Network standards'
    ],
    
    communityImpact: 'Stroke is a leading cause of disability. Rapid treatment can mean the difference between independence and permanent disability. Families rely on us to act fast when stroke strikes.',
    
    impactTolerances: {
      fullService: {
        definition: 'HASU fully operational, thrombolysis available 24/7, CT priority access, thrombectomy pathway active',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'SSNAP A-rating maintained'
      },
      degradedService: {
        definition: 'Reduced HASU capacity, some thrombolysis delays, limited thrombectomy referral',
        clinicalHarm: 'Increased disability from delayed treatment',
        regulatoryBreach: 'SSNAP rating at risk',
        reputationalImpact: 'Network concerns, patient complaints'
      },
      minimumViable: {
        definition: 'Thrombolysis available but delayed, HASU at capacity, thrombectomy pathway compromised',
        clinicalHarm: 'Significant disability from delayed intervention',
        regulatoryBreach: 'Regulatory notification required',
        reputationalImpact: 'National audit concerns, media interest'
      },
      serviceFailure: {
        definition: 'Unable to deliver hyperacute stroke care, divert to other HASU required',
        clinicalHarm: 'Deaths and severe disability from lack of treatment',
        regulatoryBreach: 'Loss of HASU status, enforcement action',
        reputationalImpact: 'Network reconfiguration, public outcry'
      }
    },
    
    metrics: [
      {
        name: 'Thrombolysis <60 mins',
        currentValue: '85%',
        target: '80%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(85, 5),
        dataSource: 'SSNAP'
      },
      {
        name: 'Stroke Unit Admission <4hrs',
        currentValue: '92%',
        target: '90%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(92, 4),
        dataSource: 'SSNAP'
      },
      {
        name: 'CT Scan <1 hour',
        currentValue: '88%',
        target: '85%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(88, 4),
        dataSource: 'SSNAP'
      },
      {
        name: '6-Month Independence',
        currentValue: '64%',
        target: '>60%',
        trend: 'improving',
        status: 'green',
        history: generateTrendData(64, 5),
        dataSource: 'SSNAP'
      }
    ],
    
    internalDependencies: [
      { name: 'Stroke Team', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'CT Scanner Access', type: 'equipment', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Stroke Unit Beds', type: 'facility', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Pharmacy (Thrombolysis)', type: 'staff', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Regional Stroke Network', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Ambulance Service', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Neuroradiology (Thrombectomy)', type: 'partner', criticality: 'high', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-19'),
        type: 'simulation',
        outcome: 'well-managed',
        vulnerabilities: [
          'Reliance on single CT for hyperacute decision-making',
          'Thrombectomy pathway dependent on external centre'
        ],
        mitigations: [
          { action: 'CT priority protocol for stroke', status: 'completed' },
          { action: 'Second thrombectomy centre agreement', status: 'completed' }
        ]
      },
      nextTest: {
        date: new Date('2025-03-03'),
        type: 'Tabletop Exercise',
        scenario: 'CT failure during hyperacute stroke presentation'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: 'Stroke service escalation:\n\n1. **CT unavailable**\n   - Clinical decision for thrombolysis\n   - Immediate network divert consideration\n\n2. **HASU full**\n   - Rapid discharge review\n   - Network bed request',
      
      alternativeDelivery: 'Alternative stroke pathways:\n\n- **Mobile Stroke Unit**: Regional service\n- **Partner HASU**: 30-minute transfer\n- **Telemedicine**: Remote specialist support',
      
      mutualAid: 'Stroke network agreements:\n\n- **Regional HASU Network**: Capacity sharing\n- **Thrombectomy Centre**: 24/7 access\n- **Rehabilitation Network**: Transfer for specialist rehab',
      
      recoveryPrioritisation: 'Stroke service restoration:\n\n1. **Thrombolysis capability** - immediate\n2. **HASU capacity** - within 4 hours\n3. **Full stroke unit** - within 24 hours\n4. **ESD service** - within 48 hours'
    }
  },
  {
    id: 'children',
    name: "Children's Services",
    status: 'operational',
    statusReason: 'Safeguarding response times maintained',
    lastUpdated: new Date('2025-01-27T07:30:00'),
    executiveOwner: 'Dr. Amanda Foster',
    lastTested: new Date('2025-01-21'),
    
    description: "Paediatric inpatient care, emergency assessment, outpatient services, and safeguarding for children from birth to 18 years. This includes the children's ward, paediatric A&E assessment, neonatal services, and the safeguarding team.\n\nThe service treats approximately 15,000 children annually and plays a crucial role in child protection within the community.",
    
    criticalPathways: [
      'Paediatric A&E',
      "Children's Ward",
      'Neonatal Unit',
      'Safeguarding Team'
    ],
    
    regulatoryRequirements: [
      'Safeguarding response <24hrs (98%)',
      'CQC Safe and Caring',
      'RCPCH Standards for Children in Emergency Care',
      'Working Together to Safeguard Children'
    ],
    
    communityImpact: 'Children are the most vulnerable members of our community. Parents trust us with their most precious family members. Our safeguarding role protects children from abuse and neglect. Failure in children\'s services has profound and lasting impact.',
    
    impactTolerances: {
      fullService: {
        definition: 'Full paediatric capacity, safeguarding team fully staffed, neonatal cots available, 24/7 consultant presence',
        clinicalHarm: 'None expected',
        regulatoryBreach: 'None',
        reputationalImpact: 'Family confidence maintained'
      },
      degradedService: {
        definition: 'Reduced ward capacity, safeguarding response stretched, limited neonatal capacity',
        clinicalHarm: 'Delayed assessments, increased anxiety for families',
        regulatoryBreach: 'Risk of safeguarding timeline breaches',
        reputationalImpact: 'Partner agency concerns, family complaints'
      },
      minimumViable: {
        definition: 'Emergency paediatrics only, safeguarding prioritised, some children transferred',
        clinicalHarm: 'Significant harm risk from delayed or diverted care',
        regulatoryBreach: 'Safeguarding breaches, CQC notification',
        reputationalImpact: 'National media, Ofsted involvement'
      },
      serviceFailure: {
        definition: 'Unable to provide safe paediatric care, unit closure',
        clinicalHarm: 'Deaths or serious harm to children',
        regulatoryBreach: 'Special measures, prosecution risk',
        reputationalImpact: 'Public inquiry, criminal investigation'
      }
    },
    
    metrics: [
      {
        name: 'Safeguarding Response <24hrs',
        currentValue: '98%',
        target: '98%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(98, 1),
        dataSource: 'Safeguarding System'
      },
      {
        name: 'Paediatric Nurse Vacancy',
        currentValue: '12%',
        target: '<10%',
        trend: 'stable',
        status: 'amber',
        history: generateTrendData(12, 2),
        dataSource: 'ESR Workforce Data'
      },
      {
        name: 'Length of Stay',
        currentValue: '2.1 days',
        target: '<2.5 days',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(2.1, 0.3),
        dataSource: 'PAS System'
      },
      {
        name: 'Parent Satisfaction',
        currentValue: '94%',
        target: '>90%',
        trend: 'stable',
        status: 'green',
        history: generateTrendData(94, 3),
        dataSource: 'Friends and Family Test'
      }
    ],
    
    internalDependencies: [
      { name: 'Paediatric Consultants', type: 'staff', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Safeguarding Team', type: 'staff', criticality: 'critical', singlePointOfFailure: true },
      { name: 'Play Services', type: 'staff', criticality: 'medium', singlePointOfFailure: false },
      { name: "Children's Ward Capacity", type: 'facility', criticality: 'critical', singlePointOfFailure: false }
    ],
    
    externalDependencies: [
      { name: 'Social Care', type: 'partner', criticality: 'critical', singlePointOfFailure: false },
      { name: 'Police', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'Community Paediatrics', type: 'partner', criticality: 'high', singlePointOfFailure: false },
      { name: 'CAMHS', type: 'partner', criticality: 'high', singlePointOfFailure: false }
    ],
    
    resilienceTesting: {
      lastTest: {
        date: new Date('2025-01-21'),
        type: 'desktop',
        outcome: 'adequate',
        vulnerabilities: [
          'Nurse vacancies affecting ratios',
          'Social care delays impacting discharge',
          'Named doctor cover gaps'
        ],
        mitigations: [
          { action: 'International nurse recruitment', status: 'in-progress' },
          { action: 'Integrated discharge planning with social care', status: 'completed' },
          { action: 'Locum named doctor arrangement', status: 'completed' }
        ]
      },
      nextTest: {
        date: new Date('2025-05-16'),
        type: 'Simulation',
        scenario: 'Multi-agency safeguarding surge exercise'
      }
    },
    
    contingencyPlans: {
      degradationProtocols: "Children's services escalation:\n\n1. **Staffing pressure**\n   - Senior nurse supervisory status\n   - Reduce elective admissions\n   - Agency nurse call-out\n\n2. **Safeguarding surge**\n   - Prioritise by risk\n   - Additional consultant support",
      
      alternativeDelivery: 'Alternative paediatric pathways:\n\n- **Hospital at Home**: Suitable conditions\n- **Partner Trust**: Tertiary centre transfer\n- **Community Paediatrics**: Outpatient redirection',
      
      mutualAid: "Children's network agreements:\n\n- **Regional Paediatric Network**: Capacity sharing\n- **Tertiary Centre**: Complex case transfer\n- **CAMHS Network**: Mental health crisis support",
      
      recoveryPrioritisation: "Children's service restoration:\n\n1. **Safeguarding** - immediate\n2. **Emergency paediatrics** - within 4 hours\n3. **Inpatient capacity** - within 24 hours\n4. **Outpatient services** - within 1 week"
    }
  }
];

export const getServiceById = (id: string): DetailedEssentialService | undefined => {
  return detailedServices.find(service => service.id === id);
};

export const getServicesByStatus = (status: 'operational' | 'degraded' | 'at-risk'): DetailedEssentialService[] => {
  return detailedServices.filter(service => service.status === status);
};

export const getUniqueExecutives = (): string[] => {
  return [...new Set(detailedServices.map(s => s.executiveOwner))];
};

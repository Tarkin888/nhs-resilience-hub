import { EnhancedCapitalDetail } from '@/types/capitalDetails';

export const enhancedCapitalDetails: Record<string, EnhancedCapitalDetail> = {
  human: {
    capitalId: 'human',
    capitalName: 'Human Capital',
    score: 54,
    status: 'red',
    trend: 'declining',
    scoreExplanation: 'Human resilience is currently red and declining, driven by critical staff vacancies, rising sickness absence, and deteriorating wellbeing scores. Nursing and allied health vacancies are particularly severe, forcing unsustainable reliance on agency staff. Urgent workforce planning and wellbeing intervention required.',
    kris: [
      {
        id: 'human-kri-1',
        name: 'Staff Vacancies',
        value: '156 FTE',
        numericValue: 156,
        target: '<80 FTE',
        numericTarget: 80,
        trend: 'worsening',
        status: 'red',
        commentary: 'Critical gaps in nursing (78 FTE) and allied health professions (42 FTE). Highest level on record.',
        dataSource: {
          name: 'Representative of large acute trust vacancy levels (NHS England Workforce Stats)',
          sourceType: 'public',
          nationalAverage: '9.2% vacancy rate',
          trustValue: '14.2% vacancy rate',
          lastUpdated: new Date('2025-01-24'),
          url: 'https://digital.nhs.uk/data-and-information/publications/statistical/nhs-workforce-statistics'
        },
        showProgressBar: true
      },
      {
        id: 'human-kri-2',
        name: 'Sickness Absence Rate',
        value: '5.2%',
        numericValue: 5.2,
        target: '<4.8%',
        numericTarget: 4.8,
        trend: 'worsening',
        status: 'red',
        commentary: 'Above NHS England average of 4.8%. Winter pressures contributing to increased absence.',
        dataSource: {
          name: 'NHS England Sickness Absence Statistics',
          sourceType: 'public',
          nationalAverage: '4.8%',
          trustValue: '5.2%',
          lastUpdated: new Date('2025-01-24'),
          url: 'https://digital.nhs.uk/data-and-information/publications/statistical/nhs-sickness-absence-rates'
        },
        showProgressBar: true
      },
      {
        id: 'human-kri-3',
        name: 'Mandatory Training Compliance',
        value: '78%',
        numericValue: 78,
        target: '>90%',
        numericTarget: 90,
        trend: 'stable',
        status: 'amber',
        commentary: 'Adequate but below regulatory target. Improvement plan in progress for Q2.',
        dataSource: {
          name: 'Illustrative training compliance data',
          sourceType: 'demo',
          nationalAverage: '85% (typical NHS trust)',
          trustValue: '78%',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: true
      },
      {
        id: 'human-kri-4',
        name: 'Staff Wellbeing Score',
        value: '6.1/10',
        numericValue: 6.1,
        target: '>7.5/10',
        numericTarget: 7.5,
        trend: 'worsening',
        status: 'red',
        commentary: 'Decreased from 6.8 last quarter. Staff survey shows concerns about workload and support.',
        dataSource: {
          name: 'Illustrative staff survey results',
          sourceType: 'demo',
          nationalAverage: '7.2/10 (NHS average)',
          trustValue: '6.1/10',
          lastUpdated: new Date('2025-01-15')
        },
        showProgressBar: true
      },
      {
        id: 'human-kri-5',
        name: 'Staff Turnover Rate',
        value: '14.2%',
        numericValue: 14.2,
        target: '<12%',
        numericTarget: 12,
        trend: 'worsening',
        status: 'amber',
        commentary: 'Particularly high in critical care (18%) and emergency department (16%).',
        dataSource: {
          name: 'Illustrative HR data',
          sourceType: 'demo',
          nationalAverage: '11.8% (NHS average)',
          trustValue: '14.2%',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: true
      },
      {
        id: 'human-kri-6',
        name: 'Succession Planning Coverage',
        value: '62%',
        numericValue: 62,
        target: '>80%',
        numericTarget: 80,
        trend: 'worsening',
        status: 'amber',
        commentary: 'Key person risk in several senior clinical and operational roles.',
        dataSource: {
          name: 'Illustrative succession planning audit',
          sourceType: 'assessment',
          nationalAverage: '75% (typical coverage)',
          trustValue: '62%',
          lastUpdated: new Date('2025-01-10')
        },
        showProgressBar: true
      }
    ],
    recommendedActions: [
      {
        id: 'human-action-1',
        number: 1,
        title: 'Launch urgent international nursing recruitment campaign',
        priority: 'high',
        owner: 'Director of Workforce',
        clickable: true
      },
      {
        id: 'human-action-2',
        number: 2,
        title: 'Implement enhanced wellbeing support programme',
        priority: 'high',
        owner: 'Chief Nurse',
        clickable: true
      },
      {
        id: 'human-action-3',
        number: 3,
        title: 'Review workforce planning and rostering efficiency',
        priority: 'medium',
        owner: 'Chief Operating Officer',
        clickable: true
      },
      {
        id: 'human-action-4',
        number: 4,
        title: 'Establish retention working group with staff representatives',
        priority: 'medium',
        owner: 'HR Manager',
        clickable: true
      }
    ],
    priorityAssessment: {
      level: 'critical',
      title: 'Immediate Action Required',
      description: 'This capital is at critical risk and requires immediate executive attention and intervention. Workforce crisis threatens patient safety and service sustainability.',
      show: true
    }
  },
  financial: {
    capitalId: 'financial',
    capitalName: 'Financial Capital',
    score: 68,
    status: 'amber',
    trend: 'stable',
    scoreExplanation: 'Financial resilience is currently amber, with cash reserves below optimal levels and agency spend significantly over budget. Whilst income remains secure and cost improvement programmes are on track, the combination of workforce shortages driving agency costs and depleted reserves poses a medium-term risk to financial sustainability.',
    kris: [
      {
        id: 'financial-kri-1',
        name: 'Cash Reserves',
        value: '£12.3M',
        numericValue: 12.3,
        target: '>£15M',
        numericTarget: 15,
        trend: 'worsening',
        status: 'amber',
        commentary: 'Below optimal reserve target. Limited buffer for unexpected financial pressures.',
        dataSource: {
          name: 'Illustrative trust financial data representative of large acute trust',
          sourceType: 'demo',
          nationalAverage: '£15M+ (typical target)',
          trustValue: '£12.3M (82% of target)',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Based on typical NHS Trust reserve requirements and Winter pressure planning guidance'
        },
        showProgressBar: true
      },
      {
        id: 'financial-kri-2',
        name: 'Agency Spend Variance',
        value: '+23%',
        numericValue: 23,
        target: '<5%',
        numericTarget: 5,
        trend: 'worsening',
        status: 'red',
        commentary: 'Significantly over budget due to workforce gaps. Unsustainable cost pressure.',
        dataSource: {
          name: 'NHS England Workforce Statistics (National average 18%) + illustrative trust adjustment',
          sourceType: 'demo',
          nationalAverage: '+18% (sector average)',
          trustValue: '+23%',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Calculated from vacancy rates and typical agency cost premiums (35-45% above substantive)',
          url: 'https://digital.nhs.uk/data-and-information/publications/statistical/nhs-workforce-statistics'
        },
        showProgressBar: true
      },
      {
        id: 'financial-kri-3',
        name: 'Income Security',
        value: 'Stable',
        trend: 'stable',
        status: 'green',
        commentary: 'Contracts secured for next 12 months. Commissioning relationships strong.',
        dataSource: {
          name: 'Illustrative contractual position',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: false
      },
      {
        id: 'financial-kri-4',
        name: 'Cost Improvement Delivery',
        value: '89%',
        numericValue: 89,
        target: '100%',
        numericTarget: 100,
        trend: 'improving',
        status: 'green',
        commentary: 'On track to meet year-end CIP target. Strong programme governance.',
        dataSource: {
          name: 'Illustrative CIP delivery data',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Tracked against monthly milestones and savings realisation schedule'
        },
        showProgressBar: true
      },
      {
        id: 'financial-kri-5',
        name: 'Capital Expenditure Headroom',
        value: '£2.1M',
        numericValue: 2.1,
        target: '>£5M',
        numericTarget: 5,
        trend: 'worsening',
        status: 'amber',
        commentary: 'Limited capacity for infrastructure investment. Capital allocation 87% committed.',
        dataSource: {
          name: 'Illustrative capital programme position',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: true
      },
      {
        id: 'financial-kri-6',
        name: 'Debt Service Coverage',
        value: '1.8x',
        numericValue: 1.8,
        target: '>2.0x',
        numericTarget: 2.0,
        trend: 'stable',
        status: 'amber',
        commentary: 'Adequate but not comfortable. Financing costs manageable.',
        dataSource: {
          name: 'Illustrative debt position',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Operating income to debt service ratio'
        },
        showProgressBar: true
      }
    ],
    recommendedActions: [
      {
        id: 'financial-action-1',
        number: 1,
        title: 'Accelerate workforce recruitment to reduce agency dependency',
        priority: 'high',
        owner: 'Director of Workforce',
        clickable: true
      },
      {
        id: 'financial-action-2',
        number: 2,
        title: 'Review and tighten agency usage policies',
        priority: 'high',
        owner: 'Finance Director',
        clickable: true
      },
      {
        id: 'financial-action-3',
        number: 3,
        title: 'Explore reserve rebuilding options',
        priority: 'medium',
        owner: 'Finance Director',
        clickable: true
      },
      {
        id: 'financial-action-4',
        number: 4,
        title: 'Maintain CIP delivery momentum',
        priority: 'low',
        owner: 'Chief Operating Officer',
        clickable: true
      }
    ],
    priorityAssessment: {
      level: 'high',
      title: 'Escalated Monitoring Required',
      description: 'This capital requires close monitoring and prompt corrective action to prevent further deterioration.',
      show: true
    }
  },
  operational: {
    capitalId: 'operational',
    capitalName: 'Operational Capital',
    score: 72,
    status: 'green',
    trend: 'stable',
    scoreExplanation: 'Operational resilience is currently green, with bed capacity, equipment, and supply chain operating within acceptable parameters. However, aging HVAC systems pose a future risk, particularly during extreme weather events. Recent supplier diversification has improved supply chain resilience.',
    kris: [
      {
        id: 'operational-kri-1',
        name: 'Bed Occupancy',
        value: '87%',
        numericValue: 87,
        target: '85-92%',
        numericTarget: 88.5,
        trend: 'stable',
        status: 'green',
        commentary: 'Within normal operational range. Winter capacity managed effectively.',
        dataSource: {
          name: 'NHS England Monthly Statistics (National Winter Average)',
          sourceType: 'public',
          nationalAverage: '87%',
          trustValue: '87%',
          lastUpdated: new Date('2025-01-24'),
          url: 'https://www.england.nhs.uk/statistics/'
        },
        showProgressBar: true
      },
      {
        id: 'operational-kri-2',
        name: 'Equipment Availability',
        value: '94%',
        numericValue: 94,
        target: '>95%',
        numericTarget: 95,
        trend: 'stable',
        status: 'amber',
        commentary: 'Critical equipment operational. Minor planned maintenance scheduled Q2.',
        dataSource: {
          name: 'Illustrative medical equipment status',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: true
      },
      {
        id: 'operational-kri-3',
        name: 'Supply Chain Status',
        value: 'Secure',
        trend: 'improving',
        status: 'green',
        commentary: 'Recent diversification of key suppliers reducing single points of failure.',
        dataSource: {
          name: 'Illustrative supply chain assessment',
          sourceType: 'assessment',
          lastUpdated: new Date('2025-01-20')
        },
        showProgressBar: false
      },
      {
        id: 'operational-kri-4',
        name: 'Facilities Condition',
        value: 'Adequate',
        trend: 'worsening',
        status: 'amber',
        commentary: 'HVAC systems aging, scheduled replacement in Q3. Risk during extreme weather.',
        dataSource: {
          name: 'Illustrative estates condition survey',
          sourceType: 'assessment',
          lastUpdated: new Date('2025-01-15')
        },
        showProgressBar: false
      }
    ],
    recommendedActions: [
      {
        id: 'operational-action-1',
        number: 1,
        title: 'Accelerate HVAC replacement programme',
        priority: 'high',
        owner: 'Director of Estates',
        clickable: true
      },
      {
        id: 'operational-action-2',
        number: 2,
        title: 'Complete planned equipment maintenance',
        priority: 'medium',
        owner: 'Facilities Manager',
        clickable: true
      },
      {
        id: 'operational-action-3',
        number: 3,
        title: 'Continue supply chain diversification',
        priority: 'low',
        owner: 'Procurement Director',
        clickable: true
      }
    ],
    priorityAssessment: {
      level: 'medium',
      title: 'Routine Monitoring',
      description: 'This capital is performing adequately but requires ongoing attention to specific risk areas.',
      show: true
    }
  },
  reputational: {
    capitalId: 'reputational',
    capitalName: 'Reputational Capital',
    score: 81,
    status: 'green',
    trend: 'improving',
    scoreExplanation: 'Reputational resilience is currently green and improving, with patient satisfaction rising, CQC rating maintained at "Good", and positive media coverage. Regulatory standing is compliant with no enforcement actions. Recent maternity services improvements have been well-received by the local community.',
    kris: [
      {
        id: 'reputational-kri-1',
        name: 'CQC Overall Rating',
        value: 'Good',
        trend: 'stable',
        status: 'green',
        commentary: 'Last inspection 18 months ago. Re-inspection expected Q3 2025.',
        dataSource: {
          name: 'CQC Inspection Ratings (Public Record)',
          sourceType: 'cqc',
          lastUpdated: new Date('2023-07-24'),
          url: 'https://www.cqc.org.uk/'
        },
        showProgressBar: false
      },
      {
        id: 'reputational-kri-2',
        name: 'Patient Satisfaction (FFT)',
        value: '82%',
        numericValue: 82,
        target: '>85%',
        numericTarget: 85,
        trend: 'improving',
        status: 'green',
        commentary: 'Improved from 78% last year. Maternity services particularly strong.',
        dataSource: {
          name: 'NHS Friends & Family Test National Average',
          sourceType: 'public',
          nationalAverage: '80%',
          trustValue: '82%',
          lastUpdated: new Date('2025-01-24'),
          url: 'https://www.england.nhs.uk/fft/'
        },
        showProgressBar: true
      },
      {
        id: 'reputational-kri-3',
        name: 'Media Sentiment',
        value: 'Positive',
        trend: 'stable',
        status: 'green',
        commentary: 'Recent local coverage highlighting maternity services improvements.',
        dataSource: {
          name: 'Illustrative media monitoring',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-22')
        },
        showProgressBar: false
      },
      {
        id: 'reputational-kri-4',
        name: 'Regulatory Standing',
        value: 'Compliant',
        trend: 'stable',
        status: 'green',
        commentary: 'No enforcement actions or improvement notices. Strong regulatory relationships.',
        dataSource: {
          name: 'CQC Regulatory Status (Public Record)',
          sourceType: 'cqc',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: false
      }
    ],
    recommendedActions: [
      {
        id: 'reputational-action-1',
        number: 1,
        title: 'Prepare for upcoming CQC re-inspection',
        priority: 'high',
        owner: 'Chief Nurse',
        clickable: true
      },
      {
        id: 'reputational-action-2',
        number: 2,
        title: 'Continue patient satisfaction improvement programme',
        priority: 'medium',
        owner: 'Patient Experience Lead',
        clickable: true
      },
      {
        id: 'reputational-action-3',
        number: 3,
        title: 'Maintain proactive media engagement',
        priority: 'low',
        owner: 'Communications Director',
        clickable: true
      }
    ],
    priorityAssessment: {
      level: 'good',
      title: 'Performing Well',
      description: 'This capital is performing strongly. Continue current approach and maintain momentum.',
      show: false
    }
  },
  environmental: {
    capitalId: 'environmental',
    capitalName: 'Environmental Capital',
    score: 45,
    status: 'red',
    trend: 'declining',
    scoreExplanation: 'Environmental resilience is currently red and declining, driven by aging building infrastructure vulnerable to extreme weather events. HVAC system failure poses significant risk during heatwaves. Whilst carbon reduction programmes are on track, physical infrastructure resilience requires urgent investment.',
    kris: [
      {
        id: 'environmental-kri-1',
        name: 'Building Condition (HVAC)',
        value: 'Poor',
        trend: 'worsening',
        status: 'red',
        commentary: 'High failure risk during heatwave. Replacement scheduled Q3 2025 but funding not yet secured.',
        dataSource: {
          name: 'Based on typical NHS estate age profile (NHS Property Services data)',
          sourceType: 'standard',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Assessment based on ERIC returns and NHS Property Services benchmarks'
        },
        showProgressBar: false
      },
      {
        id: 'environmental-kri-2',
        name: 'Utilities Resilience',
        value: 'Vulnerable',
        trend: 'stable',
        status: 'red',
        commentary: 'Limited backup power capacity (4 hours). No backup cooling systems.',
        dataSource: {
          name: 'Illustrative estates resilience assessment',
          sourceType: 'assessment',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: false
      },
      {
        id: 'environmental-kri-3',
        name: 'Carbon Reduction Progress',
        value: 'On track',
        trend: 'improving',
        status: 'green',
        commentary: 'Net zero pathway progressing. Solar panels operational, fleet electrification underway.',
        dataSource: {
          name: 'NHS Net Zero Target (2040) - Illustrative progress',
          sourceType: 'standard',
          lastUpdated: new Date('2025-01-24'),
          methodology: 'Measured against NHS Delivering a Net Zero NHS roadmap targets'
        },
        showProgressBar: false
      },
      {
        id: 'environmental-kri-4',
        name: 'Water Systems Integrity',
        value: 'Adequate',
        trend: 'stable',
        status: 'green',
        commentary: 'Legionella controls effective. Testing compliant with HSE guidance.',
        dataSource: {
          name: 'Illustrative water safety compliance',
          sourceType: 'demo',
          lastUpdated: new Date('2025-01-24')
        },
        showProgressBar: false
      }
    ],
    recommendedActions: [
      {
        id: 'environmental-action-1',
        number: 1,
        title: 'Secure funding and accelerate HVAC replacement',
        priority: 'high',
        owner: 'Director of Estates',
        clickable: true
      },
      {
        id: 'environmental-action-2',
        number: 2,
        title: 'Install temporary cooling capacity before summer 2025',
        priority: 'high',
        owner: 'Facilities Manager',
        clickable: true
      },
      {
        id: 'environmental-action-3',
        number: 3,
        title: 'Business case for backup power upgrade',
        priority: 'medium',
        owner: 'Director of Estates',
        clickable: true
      },
      {
        id: 'environmental-action-4',
        number: 4,
        title: 'Continue net zero programme delivery',
        priority: 'low',
        owner: 'Sustainability Lead',
        clickable: true
      }
    ],
    priorityAssessment: {
      level: 'critical',
      title: 'Urgent Executive Intervention Required',
      description: 'This capital is at critical risk with potential for serious patient safety incidents. Infrastructure failure could result in service closure and regulatory enforcement.',
      show: true
    }
  }
};

export interface CapitalHistoryPoint {
  date: Date;
  score: number;
  assessmentPeriod: string;
}

export interface CapitalHistory {
  capitalId: string;
  capitalName: 'Financial' | 'Operational' | 'Human' | 'Reputational' | 'Environmental';
  history: CapitalHistoryPoint[];
}

export const capitalHistories: CapitalHistory[] = [
  {
    capitalId: 'financial',
    capitalName: 'Financial',
    history: [
      { date: new Date('2024-10-01'), score: 72, assessmentPeriod: 'Q4 2024' },
      { date: new Date('2024-11-01'), score: 68, assessmentPeriod: 'Nov 2024' },
      { date: new Date('2024-12-01'), score: 65, assessmentPeriod: 'Dec 2024' },
      { date: new Date('2025-01-01'), score: 68, assessmentPeriod: 'Jan 2025' }
    ]
  },
  {
    capitalId: 'operational',
    capitalName: 'Operational',
    history: [
      { date: new Date('2024-10-01'), score: 70, assessmentPeriod: 'Q4 2024' },
      { date: new Date('2024-11-01'), score: 71, assessmentPeriod: 'Nov 2024' },
      { date: new Date('2024-12-01'), score: 72, assessmentPeriod: 'Dec 2024' },
      { date: new Date('2025-01-01'), score: 72, assessmentPeriod: 'Jan 2025' }
    ]
  },
  {
    capitalId: 'human',
    capitalName: 'Human',
    history: [
      { date: new Date('2024-10-01'), score: 62, assessmentPeriod: 'Q4 2024' },
      { date: new Date('2024-11-01'), score: 58, assessmentPeriod: 'Nov 2024' },
      { date: new Date('2024-12-01'), score: 56, assessmentPeriod: 'Dec 2024' },
      { date: new Date('2025-01-01'), score: 54, assessmentPeriod: 'Jan 2025' }
    ]
  },
  {
    capitalId: 'reputational',
    capitalName: 'Reputational',
    history: [
      { date: new Date('2024-10-01'), score: 78, assessmentPeriod: 'Q4 2024' },
      { date: new Date('2024-11-01'), score: 79, assessmentPeriod: 'Nov 2024' },
      { date: new Date('2024-12-01'), score: 80, assessmentPeriod: 'Dec 2024' },
      { date: new Date('2025-01-01'), score: 81, assessmentPeriod: 'Jan 2025' }
    ]
  },
  {
    capitalId: 'environmental',
    capitalName: 'Environmental',
    history: [
      { date: new Date('2024-10-01'), score: 48, assessmentPeriod: 'Q4 2024' },
      { date: new Date('2024-11-01'), score: 46, assessmentPeriod: 'Nov 2024' },
      { date: new Date('2024-12-01'), score: 45, assessmentPeriod: 'Dec 2024' },
      { date: new Date('2025-01-01'), score: 45, assessmentPeriod: 'Jan 2025' }
    ]
  }
];

export const getCapitalHistory = (capitalId: string): CapitalHistoryPoint[] => {
  const history = capitalHistories.find(h => h.capitalId === capitalId);
  return history?.history || [];
};

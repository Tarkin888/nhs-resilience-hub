import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface AuditEntry {
  id: string;
  timestamp: Date;
  source: string;
  metric: string;
  oldValue?: string | number;
  newValue: string | number;
  category: 'vital-sign' | 'alert' | 'service' | 'capital' | 'fetch' | 'system';
}

interface AuditTrailContextValue {
  entries: AuditEntry[];
  logEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  clearEntries: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const AuditTrailContext = createContext<AuditTrailContextValue | null>(null);

export const useAuditTrail = () => {
  const ctx = useContext(AuditTrailContext);
  if (!ctx) throw new Error('useAuditTrail must be used within AuditTrailProvider');
  return ctx;
};

let entryCounter = 0;

export const AuditTrailProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const logEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    entryCounter++;
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${entryCounter}-${Date.now()}`,
      timestamp: new Date(),
    };
    setEntries(prev => [newEntry, ...prev].slice(0, 500)); // Keep last 500
  }, []);

  const clearEntries = useCallback(() => setEntries([]), []);

  return (
    <AuditTrailContext.Provider value={{ entries, logEntry, clearEntries, isModalOpen, setIsModalOpen }}>
      {children}
    </AuditTrailContext.Provider>
  );
};

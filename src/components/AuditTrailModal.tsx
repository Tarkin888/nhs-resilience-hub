import { memo, useState, useMemo } from 'react';
import { X, ScrollText, Trash2, Activity, AlertTriangle, Server, Brain, Download, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuditTrail, AuditEntry } from '@/contexts/AuditTrailContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

const categoryConfig: Record<AuditEntry['category'], { label: string; icon: React.ElementType; className: string }> = {
  'vital-sign': { label: 'Vital Sign', icon: Activity, className: 'bg-primary/20 text-primary border-primary/30' },
  'alert': { label: 'Alert', icon: AlertTriangle, className: 'bg-warning/20 text-warning border-warning/30' },
  'service': { label: 'Service', icon: Server, className: 'bg-success/20 text-success border-success/30' },
  'capital': { label: 'Capital', icon: Brain, className: 'bg-accent/20 text-accent-foreground border-accent/30' },
  'fetch': { label: 'Data Fetch', icon: Download, className: 'bg-secondary/20 text-secondary-foreground border-secondary/30' },
  'system': { label: 'System', icon: ScrollText, className: 'bg-muted text-muted-foreground border-border' },
};

const AuditEntryRow = memo(({ entry }: { entry: AuditEntry }) => {
  const config = categoryConfig[entry.category];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors font-mono text-xs">
      {/* Timestamp */}
      <span className="text-muted-foreground whitespace-nowrap shrink-0 pt-0.5">
        {format(entry.timestamp, 'HH:mm:ss.SSS')}
      </span>

      {/* Category badge */}
      <Badge variant="outline" className={cn('shrink-0 text-[10px] px-1.5 py-0 h-5 gap-1', config.className)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <span className="text-foreground font-medium">{entry.metric}</span>
        <span className="text-muted-foreground ml-2">
          {entry.oldValue !== undefined && (
            <>
              <span className="text-destructive/70 line-through">{entry.oldValue}</span>
              <span className="mx-1">→</span>
            </>
          )}
          <span className="text-success">{entry.newValue}</span>
        </span>
      </div>

      {/* Source */}
      <span className="text-muted-foreground shrink-0 hidden sm:block">{entry.source}</span>
    </div>
  );
});
AuditEntryRow.displayName = 'AuditEntryRow';

const AuditTrailModal = () => {
  const { entries, clearEntries, isModalOpen, setIsModalOpen } = useAuditTrail();
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AuditEntry['category'] | 'all'>('all');

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (filter && !e.metric.toLowerCase().includes(filter.toLowerCase()) && !e.source.toLowerCase().includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [entries, filter, categoryFilter]);

  const categories: (AuditEntry['category'] | 'all')[] = ['all', 'vital-sign', 'alert', 'service', 'capital', 'fetch', 'system'];

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-w-[850px] w-[calc(100vw-32px)] p-0 gap-0 bg-[hsl(222_47%_11%)] border-[hsl(217_33%_25%)] shadow-[0_25px_50px_rgba(0,0,0,0.5)] max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-[hsl(217_33%_25%)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <ScrollText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-[hsl(210_40%_98%)]">
                  📋 Data Audit Trail
                </DialogTitle>
                <DialogDescription className="text-xs text-[hsl(215_20%_65%)] mt-0.5">
                  Real-time log of all data changes this session · {entries.length} entries
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 px-2 py-1 bg-success/10 border border-success/20 rounded-full">
                <div className="relative w-2 h-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping opacity-75" />
                </div>
                <span className="text-[10px] font-medium text-success">RECORDING</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[hsl(215_20%_65%)] hover:text-destructive hover:bg-destructive/10" onClick={clearEntries}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter entries..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="h-8 pl-8 text-xs bg-[hsl(222_47%_15%)] border-[hsl(217_33%_25%)] text-[hsl(210_40%_98%)] placeholder:text-[hsl(215_20%_50%)]"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={cn(
                    'px-2 py-1 text-[10px] font-medium rounded-md whitespace-nowrap transition-colors border',
                    categoryFilter === cat
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'text-[hsl(215_20%_65%)] border-transparent hover:bg-[hsl(222_47%_18%)]'
                  )}
                >
                  {cat === 'all' ? 'All' : categoryConfig[cat].label}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Entries list */}
        <ScrollArea className="flex-1 min-h-0">
          {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[hsl(215_20%_50%)]">
              <ScrollText className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">
                {entries.length === 0 ? 'No audit entries yet' : 'No entries match filters'}
              </p>
              <p className="text-xs mt-1 opacity-70">
                {entries.length === 0 ? 'Data changes will appear here in real-time' : 'Try adjusting your filters'}
              </p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <AuditEntryRow key={entry.id} entry={entry} />
            ))
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[hsl(217_33%_25%)] flex items-center justify-between text-[10px] text-[hsl(215_20%_50%)] shrink-0">
          <span>Showing {filteredEntries.length} of {entries.length} entries</span>
          <span>Max retention: 500 entries per session</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(AuditTrailModal);

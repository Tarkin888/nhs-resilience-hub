import { memo } from 'react';
import { ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuditTrail } from '@/contexts/AuditTrailContext';
import { cn } from '@/lib/utils';

const AuditTrailButton = memo(() => {
  const { entries, setIsModalOpen } = useAuditTrail();
  const count = entries.length;

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-8 sm:h-9 px-2.5 sm:px-3 gap-1.5 text-muted-foreground hover:text-foreground relative"
      onClick={() => setIsModalOpen(true)}
      aria-label={`Open data audit trail, ${count} entries logged`}
    >
      {/* Pulse dot when entries exist */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
        </span>
      )}

      <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
      <span className="hidden lg:inline text-xs">📋 Data Audit Trail</span>
      <span className="hidden sm:inline lg:hidden text-xs">Audit</span>

      {/* Entry count badge */}
      {count > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Button>
  );
});

AuditTrailButton.displayName = 'AuditTrailButton';

export default AuditTrailButton;

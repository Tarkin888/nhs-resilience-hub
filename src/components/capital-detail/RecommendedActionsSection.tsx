import { memo } from 'react';
import { Target } from 'lucide-react';
import { RecommendedAction, ActionPriority } from '@/types/capitalDetails';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface RecommendedActionsSectionProps {
  actions: RecommendedAction[];
}

const getPriorityConfig = (priority: ActionPriority) => {
  switch (priority) {
    case 'high':
      return {
        color: 'text-[hsl(var(--status-red))]',
        label: 'High priority'
      };
    case 'medium':
      return {
        color: 'text-[hsl(var(--status-amber))]',
        label: 'Medium priority'
      };
    case 'low':
      return {
        color: 'text-[hsl(var(--status-green))]',
        label: 'Low priority'
      };
    default:
      return {
        color: 'text-muted-foreground',
        label: 'Priority'
      };
  }
};

const getNumberEmoji = (num: number) => {
  const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
  return emojis[num - 1] || '➡️';
};

const RecommendedActionsSection = memo(({ actions }: RecommendedActionsSectionProps) => {
  const handleActionClick = (action: RecommendedAction) => {
    if (action.clickable) {
      toast.info('Action planning feature coming soon', {
        description: `"${action.title}" will be available in a future update.`,
        duration: 3000
      });
    }
  };

  return (
    <section className="bg-primary/5 border border-primary/20 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Recommended Actions</h3>
      </div>

      <div className="space-y-4">
        {actions.map((action) => {
          const priorityConfig = getPriorityConfig(action.priority);
          
          return (
            <div
              key={action.id}
              className={cn(
                'group',
                action.clickable && 'cursor-pointer'
              )}
              onClick={() => handleActionClick(action)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none shrink-0 mt-0.5">
                  {getNumberEmoji(action.number)}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'font-medium text-foreground leading-snug',
                      action.clickable && 'group-hover:text-primary group-hover:underline transition-colors'
                    )}
                  >
                    {action.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="mr-1">→</span>
                    <span className={cn('font-medium', priorityConfig.color)}>
                      {priorityConfig.label}
                    </span>
                    <span className="mx-1.5">|</span>
                    <span>Owner: {action.owner}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
});

RecommendedActionsSection.displayName = 'RecommendedActionsSection';

export default RecommendedActionsSection;

import { memo } from 'react';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { RecommendedAction, ActionPriority } from '@/types/capitalDetails';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface RecommendedActionsSectionProps {
  actions: RecommendedAction[];
}

const getPriorityConfig = (priority: ActionPriority) => {
  switch (priority) {
    case 'high':
      return {
        color: 'bg-[hsl(var(--status-red))] text-white',
        label: 'High'
      };
    case 'medium':
      return {
        color: 'bg-[hsl(var(--status-amber))] text-white',
        label: 'Medium'
      };
    case 'low':
      return {
        color: 'bg-[hsl(var(--status-green))] text-white',
        label: 'Low'
      };
    default:
      return {
        color: 'bg-muted text-muted-foreground',
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
    <motion.section 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-primary/5 border border-primary/20 rounded-lg p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg text-foreground">Recommended Actions</h3>
      </div>

      <div className="divide-y divide-border/50">
        {actions.map((action, index) => {
          const priorityConfig = getPriorityConfig(action.priority);
          
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
              className={cn(
                'group py-3 first:pt-0 last:pb-0',
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
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge 
                      variant="secondary" 
                      className={cn('text-xs px-2 py-0.5', priorityConfig.color)}
                    >
                      {priorityConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Owner: <span className="font-medium">{action.owner}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
});

RecommendedActionsSection.displayName = 'RecommendedActionsSection';

export default RecommendedActionsSection;

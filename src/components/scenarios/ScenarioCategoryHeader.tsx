import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown,
  Building2,
  Activity,
  Cloud,
  ShieldAlert,
  Users,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon mapping for categories
const categoryIconMap: Record<string, LucideIcon> = {
  Building2,
  Activity,
  Cloud,
  ShieldAlert,
  Shield: ShieldAlert,
  Users,
};

interface ScenarioCategoryHeaderProps {
  icon: string;
  name: string;
  description: string;
  scenarioCount: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const ScenarioCategoryHeader = memo(function ScenarioCategoryHeader({
  icon,
  name,
  description,
  scenarioCount,
  isExpanded,
  onToggle,
}: ScenarioCategoryHeaderProps) {
  const Icon = categoryIconMap[icon] || Building2;
  
  return (
    <button
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={cn(
        "w-full text-left bg-muted/50 rounded-lg border border-border p-4 cursor-pointer",
        "hover:bg-muted/70 transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      )}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={`category-content-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {scenarioCount} scenario{scenarioCount !== 1 ? 's' : ''}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
    </button>
  );
});

import { cn } from '@/lib/utils';
import { LucideIcon, Check } from 'lucide-react';

interface ChoiceCardProps {
  icon?: LucideIcon;
  emoji?: string;
  label: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ChoiceCard({ 
  icon: Icon,
  emoji,
  label, 
  description,
  selected = false,
  onClick,
  className 
}: ChoiceCardProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        'choice-card w-full text-right',
        selected && 'choice-card-selected',
        className
      )}
    >
      {(Icon || emoji) && (
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          'bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-200/50',
          'dark:from-amber-900/40 dark:to-amber-800/30 dark:border-amber-700/40',
          selected && 'from-accent/20 to-accent/10 border-accent/50 dark:from-accent/30 dark:to-accent/20'
        )}>
          {emoji ? (
            <span className="text-xl">{emoji}</span>
          ) : Icon ? (
            <Icon className={cn(
              'h-5 w-5',
              selected ? 'text-accent' : 'text-amber-700 dark:text-amber-400'
            )} />
          ) : null}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <span className={cn(
          'font-medium block',
          selected && 'text-accent'
        )}>{label}</span>
        {description && (
          <span className="text-sm text-muted-foreground block">{description}</span>
        )}
      </div>

      {selected && (
        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}
    </button>
  );
}
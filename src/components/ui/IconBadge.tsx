import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'circle';
  className?: string;
}

export function IconBadge({ 
  icon: Icon, 
  size = 'md', 
  variant = 'default',
  className 
}: IconBadgeProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  const iconSizes = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  return (
    <div 
      className={cn(
        'flex items-center justify-center flex-shrink-0',
        'bg-gradient-to-b from-amber-100 to-amber-50 border border-amber-200/60',
        'dark:from-amber-900/50 dark:to-amber-800/30 dark:border-amber-700/50',
        'shadow-sm transition-transform group-hover:scale-105',
        sizeClasses[size],
        variant === 'circle' && 'rounded-full',
        className
      )}
    >
      <Icon className={cn('text-amber-700 dark:text-amber-400', iconSizes[size])} />
    </div>
  );
}
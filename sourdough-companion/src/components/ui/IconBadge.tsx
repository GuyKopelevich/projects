import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'circle';
  glow?: boolean;
  className?: string;
}

export function IconBadge({ 
  icon: Icon, 
  size = 'md', 
  variant = 'default',
  glow = false,
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
        'icon-badge',
        sizeClasses[size],
        variant === 'circle' && 'rounded-full',
        glow && 'icon-badge-glow',
        className
      )}
    >
      <Icon className={cn('text-primary', iconSizes[size])} />
    </div>
  );
}
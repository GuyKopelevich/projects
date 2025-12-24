import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'primary' | 'accent';
  className?: string;
}

export function StatCard({ value, label, icon, variant = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bread-card-flat flex flex-col items-center justify-center gap-1 min-h-[90px]",
        variant === 'primary' && "bg-primary/5 border-primary/20",
        variant === 'accent' && "bg-accent/10 border-accent/30",
        className
      )}
    >
      {icon && <div className="mb-1 text-muted-foreground">{icon}</div>}
      <div className={cn(
        "stat-value",
        variant === 'primary' && "text-primary",
        variant === 'accent' && "text-accent"
      )}>
        {value}
      </div>
      <div className="stat-label text-center">{label}</div>
    </div>
  );
}

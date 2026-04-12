import { cn } from '@/lib/utils';
import { ReactNode, CSSProperties } from 'react';

interface SectionCardProps {
  children: ReactNode;
  variant?: 'default' | 'compact' | 'flat';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function SectionCard({ 
  children, 
  variant = 'default',
  className,
  style,
  onClick
}: SectionCardProps) {
  const variantClasses = {
    default: 'section-card',
    compact: 'section-card-compact',
    flat: 'section-card-flat',
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component 
      className={cn(
        variantClasses[variant],
        onClick && 'text-right w-full cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}
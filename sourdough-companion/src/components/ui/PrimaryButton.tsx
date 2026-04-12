import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export function PrimaryButton({ 
  children, 
  onClick, 
  icon: Icon,
  disabled = false,
  type = 'button',
  className 
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'btn-primary flex items-center justify-center gap-3',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </button>
  );
}
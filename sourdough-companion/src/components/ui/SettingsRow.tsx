import { cn } from '@/lib/utils';
import { LucideIcon, ChevronLeft } from 'lucide-react';
import { Switch } from './switch';

interface SettingsRowProps {
  icon?: LucideIcon;
  label: string;
  description?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onClick?: () => void;
  showChevron?: boolean;
  children?: React.ReactNode;
}

export function SettingsRow({ 
  icon: Icon,
  label, 
  description,
  value,
  onValueChange,
  onClick,
  showChevron = false,
  children
}: SettingsRowProps) {
  const hasSwitch = typeof value === 'boolean' && onValueChange;
  const isClickable = onClick || showChevron;
  
  const Component = isClickable ? 'button' : 'div';

  return (
    <Component 
      className={cn(
        'settings-row w-full',
        isClickable && 'cursor-pointer hover:bg-muted/30 -mx-4 px-4 rounded-xl transition-colors'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {Icon && (
          <div className="settings-row-icon">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div className="min-w-0 text-right flex-1">
          <span className="text-base font-medium text-foreground block">{label}</span>
          {description && (
            <span className="text-sm text-muted-foreground block">{description}</span>
          )}
        </div>
      </div>

      {hasSwitch && (
        <Switch
          checked={value}
          onCheckedChange={onValueChange}
          className="toggle-success flex-shrink-0"
        />
      )}

      {children}

      {showChevron && (
        <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      )}
    </Component>
  );
}
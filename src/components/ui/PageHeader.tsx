import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  showBack?: boolean;
  backPath?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title,
  subtitle,
  icon,
  showBack = true, 
  backPath,
  action,
  className 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('flex items-center justify-between gap-3 mb-6 animate-fade-in', className)}>
      <div className="flex items-center gap-3">
        {showBack && (
          <button 
            onClick={handleBack}
            className="back-button"
            aria-label="חזרה"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
        {icon && (
          <div className="p-2 rounded-xl bg-primary/15 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h1 className="page-title flex items-center gap-2">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  backPath?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
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
    <div className={cn('flex items-center justify-between gap-3 mb-6', className)}>
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
        <h1 className="page-title">{title}</h1>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TimerProps {
  initialMinutes?: number;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

export function Timer({ initialMinutes = 30, title, onComplete, className }: TimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTotal] = useState(initialMinutes * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && totalSeconds > 0) {
      interval = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, totalSeconds, onComplete]);

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const progress = ((initialTotal - totalSeconds) / initialTotal) * 100;
  const isComplete = totalSeconds === 0;
  const isAlmostDone = totalSeconds <= 60 && totalSeconds > 0;

  const reset = () => {
    setTotalSeconds(initialTotal);
    setIsRunning(false);
  };

  return (
    <div className={cn("bread-card text-center", className)}>
      {title && (
        <h3 className="text-lg font-semibold mb-3 text-foreground">{title}</h3>
      )}
      
      {/* Progress Ring */}
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={isComplete ? "hsl(var(--starter))" : isAlmostDone ? "hsl(var(--honey))" : "hsl(var(--primary))"}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 70}`}
            strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn(
            "timer-display",
            isComplete && "text-starter",
            isAlmostDone && "text-honey animate-pulse"
          )}>
            {formatTime(totalSeconds)}
          </span>
          {isComplete && (
            <div className="flex items-center gap-1 text-starter mt-1">
              <Bell className="h-4 w-4" />
              <span className="text-sm font-medium">הושלם!</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={reset}
          className="rounded-full"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          size="lg"
          onClick={() => setIsRunning(!isRunning)}
          disabled={isComplete}
          className="rounded-full w-14 h-14 gradient-crust text-primary-foreground hover:opacity-90"
        >
          {isRunning ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 mr-[-2px]" />
          )}
        </Button>

        <div className="w-10" /> {/* Spacer for balance */}
      </div>
    </div>
  );
}

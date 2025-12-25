import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Check,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface BakeStep {
  id: string;
  type: string;
  title: string;
  duration: number;
  sort: number;
  completed: boolean;
  start_time?: string;
  end_time?: string;
}

interface Bake {
  id: string;
  name: string;
  recipe_name?: string;
  status: string;
}

export default function ActiveBake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bake, setBake] = useState<Bake | null>(null);
  const [steps, setSteps] = useState<BakeStep[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load bake
    const storedBakes = localStorage.getItem('bakes');
    if (storedBakes) {
      const bakes = JSON.parse(storedBakes);
      const foundBake = bakes.find((b: Bake) => b.id === id);
      if (foundBake) {
        setBake(foundBake);
      }
    }

    // Load steps
    const storedSteps = localStorage.getItem(`bakeSteps-${id}`);
    if (storedSteps) {
      setSteps(JSON.parse(storedSteps));
    }
  }, [id]);

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length || 1;
  const progress = (completedSteps / totalSteps) * 100;

  const saveSteps = (updatedSteps: BakeStep[]) => {
    setSteps(updatedSteps);
    localStorage.setItem(`bakeSteps-${id}`, JSON.stringify(updatedSteps));
  };

  const toggleStepComplete = (stepId: string) => {
    const updatedSteps = steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          completed: !step.completed,
          end_time: !step.completed ? new Date().toISOString() : undefined,
        };
      }
      return step;
    });
    saveSteps(updatedSteps);
    
    const step = steps.find(s => s.id === stepId);
    if (step && !step.completed) {
      toast.success('שלב הושלם! ✓');
    }
  };

  const startStep = (stepId: string) => {
    setActiveStep(stepId);
    const updatedSteps = steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          start_time: new Date().toISOString(),
        };
      }
      return step;
    });
    saveSteps(updatedSteps);
  };

  const toggleExpanded = (stepId: string) => {
    setExpandedSteps(prev => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const completeBake = () => {
    const storedBakes = localStorage.getItem('bakes');
    if (storedBakes) {
      const bakes = JSON.parse(storedBakes);
      const updatedBakes = bakes.map((b: Bake) => {
        if (b.id === id) {
          return { ...b, status: 'completed' };
        }
        return b;
      });
      localStorage.setItem('bakes', JSON.stringify(updatedBakes));
    }

    toast.success('האפייה הושלמה בהצלחה! 🎉');
    navigate('/log');
  };

  if (!bake) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">האפייה לא נמצאה</p>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => !s.completed);
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-rubik">{bake.name}</h1>
          <p className="text-sm text-muted-foreground">
            {bake.recipe_name || 'מתכון מותאם אישית'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bread-card-flat">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">התקדמות</span>
          <span className="text-sm text-muted-foreground">
            {completedSteps}/{totalSteps} שלבים
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Step Timer */}
      {currentStep && activeStep === currentStep.id && (
        <Timer 
          initialMinutes={currentStep.duration || 30}
          title={currentStep.title}
          onComplete={() => {
            toast('הזמן נגמר!', { icon: '⏰' });
          }}
        />
      )}

      {/* Steps List */}
      <div className="space-y-2">
        <h2 className="section-title">שלבי האפייה</h2>
        
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isExpanded = expandedSteps.has(step.id);
          
          return (
            <div
              key={step.id}
              className={cn(
                "bread-card-flat transition-all",
                isCurrent && "ring-2 ring-accent",
                step.completed && "opacity-60"
              )}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => toggleExpanded(step.id)}
              >
                {/* Step indicator */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepComplete(step.id);
                  }}
                  className={cn(
                    "step-indicator flex-shrink-0",
                    step.completed 
                      ? "step-indicator-completed"
                      : isCurrent 
                        ? "step-indicator-active" 
                        : "step-indicator-pending"
                  )}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </button>

                {/* Step info */}
                <div className="flex-1">
                  <h3 className={cn(
                    "font-medium",
                    step.completed && "line-through"
                  )}>
                    {step.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {step.duration >= 60 
                      ? `${Math.floor(step.duration / 60)}:${String(step.duration % 60).padStart(2, '0')} שעות`
                      : `${step.duration} דקות`
                    }
                  </div>
                </div>

                {/* Expand toggle */}
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              {/* Expanded content */}
              {isExpanded && !step.completed && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    onClick={() => startStep(step.id)}
                    variant={activeStep === step.id ? "secondary" : "default"}
                    className="w-full"
                  >
                    {activeStep === step.id ? 'טיימר פעיל' : 'התחל טיימר'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Complete Button */}
      {progress === 100 && (
        <Button
          onClick={completeBake}
          className="w-full h-12 gradient-crust text-primary-foreground"
        >
          <Check className="h-5 w-5 ml-2" />
          סיים אפייה
        </Button>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function ActiveBake() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const { data: bake, isLoading } = useQuery({
    queryKey: ['bake', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bakes')
        .select('*, recipes(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: steps } = useQuery({
    queryKey: ['bakeSteps', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bake_steps')
        .select('*')
        .eq('bake_id', id)
        .order('sort_order');
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const completedSteps = steps?.filter(s => s.completed).length || 0;
  const totalSteps = steps?.length || 1;
  const progress = (completedSteps / totalSteps) * 100;

  const toggleStepComplete = async (stepId: string, completed: boolean) => {
    try {
      await supabase
        .from('bake_steps')
        .update({ 
          completed: !completed,
          end_time: !completed ? new Date().toISOString() : null
        })
        .eq('id', stepId);

      queryClient.invalidateQueries({ queryKey: ['bakeSteps', id] });
      
      if (!completed) {
        toast.success('שלב הושלם! ✓');
      }
    } catch (error) {
      toast.error('שגיאה בעדכון השלב');
    }
  };

  const startStep = async (stepId: string) => {
    setActiveStep(stepId);
    try {
      await supabase
        .from('bake_steps')
        .update({ start_time: new Date().toISOString() })
        .eq('id', stepId);
    } catch (error) {
      console.error(error);
    }
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

  const completeBake = async () => {
    try {
      await supabase
        .from('bakes')
        .update({ status: 'completed' })
        .eq('id', id);

      toast.success('האפייה הושלמה בהצלחה! 🎉');
      queryClient.invalidateQueries({ queryKey: ['bakes'] });
      queryClient.invalidateQueries({ queryKey: ['activeBake'] });
      navigate('/log');
    } catch (error) {
      toast.error('שגיאה בסיום האפייה');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!bake) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">האפייה לא נמצאה</p>
      </div>
    );
  }

  const currentStepIndex = steps?.findIndex(s => !s.completed) ?? -1;
  const currentStep = currentStepIndex >= 0 ? steps?.[currentStepIndex] : null;

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
            {bake.recipes?.name || 'מתכון מותאם אישית'}
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
          initialMinutes={currentStep.duration_minutes || 30}
          title={currentStep.title}
          onComplete={() => {
            toast('הזמן נגמר!', { icon: '⏰' });
          }}
        />
      )}

      {/* Steps List */}
      <div className="space-y-2">
        <h2 className="section-title">שלבי האפייה</h2>
        
        {steps?.map((step, index) => {
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
                    toggleStepComplete(step.id, step.completed);
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
                    {step.duration_minutes >= 60 
                      ? `${Math.floor(step.duration_minutes / 60)}:${String(step.duration_minutes % 60).padStart(2, '0')} שעות`
                      : `${step.duration_minutes} דקות`
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

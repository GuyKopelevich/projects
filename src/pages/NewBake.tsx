import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Play, 
  Loader2,
  Thermometer,
  Clock,
  Wheat
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const STEP_TYPES = [
  { type: 'autolyse', title: 'אוטוליזה', duration: 30 },
  { type: 'mix', title: 'ערבוב', duration: 10 },
  { type: 'fold', title: 'קיפול', duration: 5 },
  { type: 'bulk_ferment', title: 'התפחה ראשונית', duration: 240 },
  { type: 'shape', title: 'עיצוב', duration: 15 },
  { type: 'proof', title: 'התפחה שנייה', duration: 60 },
  { type: 'cold_retard', title: 'קירור לילה', duration: 720 },
  { type: 'bake_covered', title: 'אפייה עם מכסה', duration: 25 },
  { type: 'bake_uncovered', title: 'אפייה ללא מכסה', duration: 20 },
  { type: 'cool', title: 'קירור', duration: 60 },
];

export default function NewBake() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [roomTemp, setRoomTemp] = useState(24);
  const [starterStrength, setStarterStrength] = useState<'weak' | 'medium' | 'strong'>('medium');
  const [foldsCount, setFoldsCount] = useState(4);
  const [bulkHours, setBulkHours] = useState(4);
  const [coldRetardHours, setColdRetardHours] = useState(12);
  const [useAutolyse, setUseAutolyse] = useState(true);
  const [saving, setSaving] = useState(false);

  const { data: recipes } = useQuery({
    queryKey: ['recipes', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .or(`user_id.eq.${user!.id},is_sample.eq.true`)
        .order('name');
      return data || [];
    },
    enabled: !!user,
  });

  const generateSchedule = () => {
    const steps: Array<{ type: string; title: string; duration: number; sort: number }> = [];
    let sortOrder = 0;

    // Autolyse
    if (useAutolyse) {
      steps.push({ type: 'autolyse', title: 'אוטוליזה', duration: 30, sort: sortOrder++ });
    }

    // Mix
    steps.push({ type: 'mix', title: 'ערבוב והוספת מלח', duration: 10, sort: sortOrder++ });

    // Folds
    const foldInterval = Math.floor((bulkHours * 60) / (foldsCount + 1));
    for (let i = 1; i <= foldsCount; i++) {
      steps.push({ 
        type: 'fold', 
        title: `קיפול ${i}`, 
        duration: foldInterval,
        sort: sortOrder++ 
      });
    }

    // Bulk ferment remainder
    steps.push({ 
      type: 'bulk_ferment', 
      title: 'המשך התפחה ראשונית', 
      duration: foldInterval,
      sort: sortOrder++ 
    });

    // Shape
    steps.push({ type: 'shape', title: 'עיצוב', duration: 15, sort: sortOrder++ });

    // Cold retard
    if (coldRetardHours > 0) {
      steps.push({ 
        type: 'cold_retard', 
        title: 'קירור במקרר', 
        duration: coldRetardHours * 60,
        sort: sortOrder++ 
      });
    } else {
      steps.push({ type: 'proof', title: 'התפחה שנייה', duration: 60, sort: sortOrder++ });
    }

    // Bake
    steps.push({ type: 'bake_covered', title: 'אפייה עם מכסה', duration: 25, sort: sortOrder++ });
    steps.push({ type: 'bake_uncovered', title: 'אפייה ללא מכסה', duration: 20, sort: sortOrder++ });

    // Cool
    steps.push({ type: 'cool', title: 'קירור לפני חיתוך', duration: 60, sort: sortOrder++ });

    return steps;
  };

  const handleStart = async () => {
    if (!name.trim()) {
      toast.error('נא להזין שם לאפייה');
      return;
    }

    setSaving(true);
    try {
      // Create bake
      const { data: bake, error: bakeError } = await supabase
        .from('bakes')
        .insert({
          user_id: user!.id,
          recipe_id: selectedRecipe || null,
          name: name.trim(),
          room_temp_c: roomTemp,
          starter_strength: starterStrength,
          folds_count: foldsCount,
          bulk_target_hours: bulkHours,
          cold_retard_hours: coldRetardHours,
          status: 'in_progress',
        })
        .select()
        .single();

      if (bakeError) throw bakeError;

      // Create steps
      const steps = generateSchedule();
      const { error: stepsError } = await supabase
        .from('bake_steps')
        .insert(
          steps.map(step => ({
            bake_id: bake.id,
            step_type: step.type,
            title: step.title,
            duration_minutes: step.duration,
            sort_order: step.sort,
          }))
        );

      if (stepsError) throw stepsError;

      toast.success('האפייה התחילה! 🍞');
      queryClient.invalidateQueries({ queryKey: ['bakes'] });
      queryClient.invalidateQueries({ queryKey: ['activeBake'] });
      navigate(`/bake/${bake.id}`);
    } catch (error) {
      toast.error('שגיאה ביצירת האפייה');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="page-header mb-0">אפייה חדשה</h1>
      </div>

      {/* Bake Name */}
      <div>
        <Label className="input-label">שם האפייה</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="לחם שבת, צ'אלה..."
        />
      </div>

      {/* Recipe Selection */}
      <div>
        <Label className="input-label">בחר מתכון (אופציונלי)</Label>
        <Select value={selectedRecipe} onValueChange={setSelectedRecipe}>
          <SelectTrigger>
            <SelectValue placeholder="בחר מתכון..." />
          </SelectTrigger>
          <SelectContent>
            {recipes?.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                {recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Parameters */}
      <div className="space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          פרמטרים
        </h3>

        {/* Room Temp */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">טמפרטורת חדר</Label>
            <span className="text-lg font-semibold font-rubik">{roomTemp}°C</span>
          </div>
          <Slider
            value={[roomTemp]}
            onValueChange={([v]) => setRoomTemp(v)}
            min={18}
            max={32}
            step={1}
          />
        </div>

        {/* Starter Strength */}
        <div>
          <Label className="input-label flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            חוזק מחמצת
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'weak', label: 'חלשה' },
              { value: 'medium', label: 'בינונית' },
              { value: 'strong', label: 'חזקה' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStarterStrength(value as any)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  starterStrength === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Folds Count */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">מספר קיפולים</Label>
            <span className="text-lg font-semibold font-rubik">{foldsCount}</span>
          </div>
          <Slider
            value={[foldsCount]}
            onValueChange={([v]) => setFoldsCount(v)}
            min={2}
            max={6}
            step={1}
          />
        </div>

        {/* Bulk Hours */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              התפחה ראשונית
            </Label>
            <span className="text-lg font-semibold font-rubik">{bulkHours} שעות</span>
          </div>
          <Slider
            value={[bulkHours]}
            onValueChange={([v]) => setBulkHours(v)}
            min={2}
            max={8}
            step={0.5}
          />
        </div>

        {/* Cold Retard */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">קירור במקרר</Label>
            <span className="text-lg font-semibold font-rubik">{coldRetardHours} שעות</span>
          </div>
          <Slider
            value={[coldRetardHours]}
            onValueChange={([v]) => setColdRetardHours(v)}
            min={0}
            max={24}
            step={1}
          />
        </div>
      </div>

      {/* Start Button */}
      <Button
        onClick={handleStart}
        disabled={saving}
        className="w-full h-14 gradient-golden text-accent-foreground font-semibold text-lg shadow-glow hover:opacity-90"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Play className="h-5 w-5 ml-2" />
            התחל אפייה
          </>
        )}
      </Button>
    </div>
  );
}

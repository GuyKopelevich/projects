import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Save, 
  Droplets, 
  Scale, 
  Wheat,
  Loader2 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface FlourBreakdown {
  white: number;
  whole: number;
  semolina: number;
  rye: number;
  other: number;
}

export default function RecipeBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState('');
  const [flourTotal, setFlourTotal] = useState(500);
  const [water, setWater] = useState(350);
  const [starter, setStarter] = useState(100);
  const [salt, setSalt] = useState(10);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [flourBreakdown, setFlourBreakdown] = useState<FlourBreakdown>({
    white: 100,
    whole: 0,
    semolina: 0,
    rye: 0,
    other: 0,
  });

  // Calculate baker's percentages
  const calculations = useMemo(() => {
    const hydration = ((water / flourTotal) * 100).toFixed(1);
    const saltPercent = ((salt / flourTotal) * 100).toFixed(1);
    const starterPercent = ((starter / flourTotal) * 100).toFixed(1);
    const totalDough = flourTotal + water + starter + salt;
    
    // Assuming starter is 100% hydration (50% flour, 50% water)
    const starterFlour = starter / 2;
    const starterWater = starter / 2;
    const totalFlour = flourTotal + starterFlour;
    const totalWater = water + starterWater;
    const trueHydration = ((totalWater / totalFlour) * 100).toFixed(1);

    return {
      hydration,
      trueHydration,
      saltPercent,
      starterPercent,
      totalDough,
    };
  }, [flourTotal, water, starter, salt]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('נא להזין שם למתכון');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('recipes').insert([{
        user_id: user!.id,
        name: name.trim(),
        flour_total_g: flourTotal,
        water_g: water,
        starter_g: starter,
        salt_g: salt,
        flour_breakdown: flourBreakdown as any,
        notes: notes.trim() || null,
      }]);

      if (error) throw error;

      toast.success('המתכון נשמר בהצלחה! 🍞');
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
      navigate('/recipes');
    } catch (error) {
      toast.error('שגיאה בשמירת המתכון');
    } finally {
      setSaving(false);
    }
  };

  const updateFlourType = (type: keyof FlourBreakdown, value: number) => {
    const total = Object.entries(flourBreakdown)
      .filter(([key]) => key !== type)
      .reduce((sum, [, v]) => sum + v, 0);
    
    if (total + value > 100) {
      // Adjust white flour to compensate
      const excess = total + value - 100;
      if (type !== 'white') {
        setFlourBreakdown(prev => ({
          ...prev,
          [type]: value,
          white: Math.max(0, prev.white - excess),
        }));
      }
    } else {
      setFlourBreakdown(prev => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="page-header mb-0">בונה מתכון</h1>
      </div>

      {/* Recipe Name */}
      <div>
        <Label className="input-label">שם המתכון</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="לחם מחמצת בסיסי"
          className="text-lg"
        />
      </div>

      {/* Live Calculations Card */}
      <div className="bread-card bg-gradient-to-br from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4" />
          אחוזי אופה
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold font-rubik text-timer">
              {calculations.hydration}%
            </div>
            <div className="text-sm text-muted-foreground">הידרציה</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold font-rubik text-primary">
              {calculations.trueHydration}%
            </div>
            <div className="text-sm text-muted-foreground">הידרציה אמיתית</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-rubik text-starter">
              {calculations.starterPercent}%
            </div>
            <div className="text-sm text-muted-foreground">מחמצת</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold font-rubik text-crust">
              {calculations.saltPercent}%
            </div>
            <div className="text-sm text-muted-foreground">מלח</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border text-center">
          <div className="text-lg font-semibold text-foreground">
            {calculations.totalDough}g
          </div>
          <div className="text-sm text-muted-foreground">משקל בצק סופי</div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h3 className="section-title flex items-center gap-2">
          <Wheat className="h-4 w-4" />
          מרכיבים
        </h3>

        {/* Flour Total */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">קמח כולל</Label>
            <span className="text-lg font-semibold font-rubik">{flourTotal}g</span>
          </div>
          <Slider
            value={[flourTotal]}
            onValueChange={([v]) => setFlourTotal(v)}
            min={200}
            max={2000}
            step={10}
            className="mt-2"
          />
        </div>

        {/* Water */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-timer" />
              מים
            </Label>
            <span className="text-lg font-semibold font-rubik">{water}g</span>
          </div>
          <Slider
            value={[water]}
            onValueChange={([v]) => setWater(v)}
            min={100}
            max={1500}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Starter */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium flex items-center gap-2">
              <Wheat className="h-4 w-4 text-starter" />
              מחמצת
            </Label>
            <span className="text-lg font-semibold font-rubik">{starter}g</span>
          </div>
          <Slider
            value={[starter]}
            onValueChange={([v]) => setStarter(v)}
            min={20}
            max={500}
            step={5}
            className="mt-2"
          />
        </div>

        {/* Salt */}
        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">מלח</Label>
            <span className="text-lg font-semibold font-rubik">{salt}g</span>
          </div>
          <Slider
            value={[salt]}
            onValueChange={([v]) => setSalt(v)}
            min={0}
            max={50}
            step={0.5}
            className="mt-2"
          />
        </div>
      </div>

      {/* Flour Breakdown */}
      <div className="space-y-4">
        <h3 className="section-title">פירוט קמחים (%)</h3>
        
        {[
          { key: 'white', label: 'קמח לבן', color: 'text-wheat' },
          { key: 'whole', label: 'קמח מלא', color: 'text-crust' },
          { key: 'semolina', label: 'סמולינה', color: 'text-honey' },
          { key: 'rye', label: 'שיפון', color: 'text-muted-foreground' },
        ].map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-4">
            <Label className={`w-20 text-sm ${color}`}>{label}</Label>
            <Slider
              value={[flourBreakdown[key as keyof FlourBreakdown]]}
              onValueChange={([v]) => updateFlourType(key as keyof FlourBreakdown, v)}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="w-12 text-left font-rubik">
              {flourBreakdown[key as keyof FlourBreakdown]}%
            </span>
          </div>
        ))}
      </div>

      {/* Notes */}
      <div>
        <Label className="input-label">הערות</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="טיפים, שינויים, מה לזכור..."
          rows={3}
        />
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full h-12 gradient-crust text-primary-foreground hover:opacity-90"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Save className="h-5 w-5 ml-2" />
            שמור מתכון
          </>
        )}
      </Button>
    </div>
  );
}

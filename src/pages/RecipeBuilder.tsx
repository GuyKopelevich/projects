import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Save, 
  Droplets, 
  Scale, 
  Wheat,
  Info
} from 'lucide-react';
import { stybelFlours, StybelFlour, glutenLevelLabels } from '@/data/stybel-flours';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FlourMix {
  flourId: string;
  percentage: number;
}

export default function RecipeBuilder() {
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [flourTotal, setFlourTotal] = useState(500);
  const [water, setWater] = useState(350);
  const [starter, setStarter] = useState(100);
  const [salt, setSalt] = useState(10);
  const [notes, setNotes] = useState('');
  
  const [flourMix, setFlourMix] = useState<FlourMix[]>([
    { flourId: 'stybel-2', percentage: 100 }
  ]);

  const selectedFlours = flourMix.map(mix => ({
    ...mix,
    flour: stybelFlours.find(f => f.id === mix.flourId)!
  })).filter(m => m.flour);

  // Calculate baker's percentages
  const calculations = useMemo(() => {
    const hydration = ((water / flourTotal) * 100).toFixed(1);
    const saltPercent = ((salt / flourTotal) * 100).toFixed(1);
    const starterPercent = ((starter / flourTotal) * 100).toFixed(1);
    const totalDough = flourTotal + water + starter + salt;
    
    const starterFlour = starter / 2;
    const starterWater = starter / 2;
    const totalFlour = flourTotal + starterFlour;
    const totalWater = water + starterWater;
    const trueHydration = ((totalWater / totalFlour) * 100).toFixed(1);

    // Calculate weighted protein
    const avgProtein = selectedFlours.reduce((sum, m) => 
      sum + (m.flour.proteinPercent * m.percentage / 100), 0
    ).toFixed(1);

    // Calculate hydration adjustment
    const hydrationAdjust = selectedFlours.reduce((sum, m) => 
      sum + (m.flour.hydrationAdjustment * m.percentage / 100), 0
    ).toFixed(0);

    return {
      hydration,
      trueHydration,
      saltPercent,
      starterPercent,
      totalDough,
      avgProtein,
      hydrationAdjust: Number(hydrationAdjust),
    };
  }, [flourTotal, water, starter, salt, selectedFlours]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('נא להזין שם למתכון');
      return;
    }

    const recipe = {
      id: Date.now().toString(),
      name: name.trim(),
      flour_total_g: flourTotal,
      water_g: water,
      starter_g: starter,
      salt_g: salt,
      flour_mix: flourMix,
      notes: notes.trim(),
      created_at: new Date().toISOString(),
    };

    const saved = localStorage.getItem('sourdough_recipes');
    const recipes = saved ? JSON.parse(saved) : [];
    recipes.unshift(recipe);
    localStorage.setItem('sourdough_recipes', JSON.stringify(recipes));

    toast.success('המתכון נשמר בהצלחה! 🍞');
    navigate('/recipes');
  };

  const updateFlourMix = (index: number, flourId: string) => {
    const newMix = [...flourMix];
    newMix[index].flourId = flourId;
    setFlourMix(newMix);
  };

  const addFlour = () => {
    if (flourMix.length >= 3) return;
    const remaining = 100 - flourMix.reduce((s, m) => s + m.percentage, 0);
    setFlourMix([...flourMix, { flourId: 'stybel-650', percentage: Math.max(0, remaining) }]);
  };

  const removeFlour = (index: number) => {
    if (flourMix.length <= 1) return;
    const newMix = flourMix.filter((_, i) => i !== index);
    // Redistribute to first flour
    const total = newMix.reduce((s, m) => s + m.percentage, 0);
    if (total < 100) newMix[0].percentage += (100 - total);
    setFlourMix(newMix);
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
        
        {/* Flour info */}
        <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
          <div className="text-center flex-1">
            <div className="text-lg font-semibold">{calculations.totalDough}g</div>
            <div className="text-xs text-muted-foreground">משקל בצק</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-lg font-semibold text-wheat">{calculations.avgProtein}%</div>
            <div className="text-xs text-muted-foreground">חלבון ממוצע</div>
          </div>
          {calculations.hydrationAdjust !== 0 && (
            <div className="text-center flex-1">
              <div className="text-lg font-semibold text-timer">
                {calculations.hydrationAdjust > 0 ? '+' : ''}{calculations.hydrationAdjust}%
              </div>
              <div className="text-xs text-muted-foreground">התאמת הידרציה</div>
            </div>
          )}
        </div>
      </div>

      {/* Flour Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title flex items-center gap-2">
            <Wheat className="h-4 w-4" />
            בחירת קמחים
          </h3>
          {flourMix.length < 3 && (
            <Button variant="outline" size="sm" onClick={addFlour}>
              + הוסף קמח
            </Button>
          )}
        </div>

        {flourMix.map((mix, index) => {
          const flour = stybelFlours.find(f => f.id === mix.flourId);
          return (
            <div key={index} className="bread-card-flat space-y-3">
              <div className="flex items-center gap-2">
                <Select value={mix.flourId} onValueChange={(v) => updateFlourMix(index, v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stybelFlours.filter(f => f.category !== 'specialty').map(f => (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex items-center gap-2">
                          <span>{f.hebrewName}</span>
                          <Badge variant="outline" className="text-xs">{f.proteinPercent}%</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {flourMix.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeFlour(index)}>✕</Button>
                )}
              </div>
              
              {flour && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  גלוטן {glutenLevelLabels[flour.glutenLevel]} • {flour.bestFor.slice(0, 2).join(', ')}
                </div>
              )}

              <div className="flex items-center gap-4">
                <Slider
                  value={[mix.percentage]}
                  onValueChange={([v]) => {
                    const newMix = [...flourMix];
                    newMix[index].percentage = v;
                    setFlourMix(newMix);
                  }}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="w-12 text-left font-rubik font-semibold">{mix.percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h3 className="section-title">כמויות</h3>

        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">קמח כולל</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={flourTotal}
                onChange={(e) => setFlourTotal(Math.max(200, Math.min(2000, Number(e.target.value) || 200)))}
                className="w-20 h-8 text-left font-semibold font-rubik text-base p-1"
              />
              <span className="text-sm text-muted-foreground">g</span>
            </div>
          </div>
          <Slider value={[flourTotal]} onValueChange={([v]) => setFlourTotal(v)} min={200} max={2000} step={10} />
        </div>

        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4 text-timer" /> מים
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={water}
                onChange={(e) => setWater(Math.max(100, Math.min(1500, Number(e.target.value) || 100)))}
                className="w-20 h-8 text-left font-semibold font-rubik text-base p-1"
              />
              <span className="text-sm text-muted-foreground">g</span>
            </div>
          </div>
          <Slider value={[water]} onValueChange={([v]) => setWater(v)} min={100} max={1500} step={5} />
        </div>

        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">מחמצת</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={starter}
                onChange={(e) => setStarter(Math.max(20, Math.min(500, Number(e.target.value) || 20)))}
                className="w-20 h-8 text-left font-semibold font-rubik text-base p-1"
              />
              <span className="text-sm text-muted-foreground">g</span>
            </div>
          </div>
          <Slider value={[starter]} onValueChange={([v]) => setStarter(v)} min={20} max={500} step={5} />
        </div>

        <div className="bread-card-flat">
          <div className="flex items-center justify-between mb-2">
            <Label className="font-medium">מלח</Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={salt}
                onChange={(e) => setSalt(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
                className="w-20 h-8 text-left font-semibold font-rubik text-base p-1"
                step="0.5"
              />
              <span className="text-sm text-muted-foreground">g</span>
            </div>
          </div>
          <Slider value={[salt]} onValueChange={([v]) => setSalt(v)} min={0} max={50} step={0.5} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <Label className="input-label">הערות</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="טיפים, שינויים..." rows={3} />
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full h-12 gradient-crust text-primary-foreground">
        <Save className="h-5 w-5 ml-2" />
        שמור מתכון
      </Button>
    </div>
  );
}

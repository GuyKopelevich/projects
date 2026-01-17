import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  ArrowRight, 
  Play, 
  Thermometer,
  Clock,
  Wheat,
  Flame,
  BookOpen,
  Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { bakingVessels } from '@/data/bread-extras';

interface Recipe {
  id: string;
  name: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  { id: 'sample-1', name: 'לחם לבן קלאסי' },
  { id: 'sample-2', name: 'לחם סמולינה' },
];

export default function NewBake() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [name, setName] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [roomTemp, setRoomTemp] = useState(24);
  const [starterStrength, setStarterStrength] = useState<'weak' | 'medium' | 'strong'>('medium');
  const [foldsCount, setFoldsCount] = useState(4);
  const [bulkHours, setBulkHours] = useState(4);
  const [coldRetardHours, setColdRetardHours] = useState(12);
  
  // New baking settings
  const [selectedVessel, setSelectedVessel] = useState<string>('dutch_oven');
  const [ovenTempCovered, setOvenTempCovered] = useState(230);
  const [ovenTempUncovered, setOvenTempUncovered] = useState(220);
  const [bakeCoveredMinutes, setBakeCoveredMinutes] = useState(25);
  const [bakeUncoveredMinutes, setBakeUncoveredMinutes] = useState(20);

  useEffect(() => {
    const stored = localStorage.getItem('recipes');
    const userRecipes = stored ? JSON.parse(stored) : [];
    setRecipes([...SAMPLE_RECIPES, ...userRecipes]);
  }, []);

  // Update temps based on vessel selection
  useEffect(() => {
    const vessel = bakingVessels.find(v => v.id === selectedVessel);
    if (vessel) {
      setOvenTempCovered(vessel.tempRange.min);
      setOvenTempUncovered(vessel.tempRange.min - 10);
    }
  }, [selectedVessel]);

  const generateSchedule = () => {
    const steps: Array<{ id: string; type: string; title: string; duration: number; sort: number; completed: boolean; notes?: string }> = [];
    let sortOrder = 0;

    // Autolyse
    steps.push({ id: `step-${sortOrder}`, type: 'autolyse', title: 'אוטוליזה', duration: 30, sort: sortOrder++, completed: false });

    // Mix
    steps.push({ id: `step-${sortOrder}`, type: 'mix', title: 'ערבוב והוספת מלח', duration: 10, sort: sortOrder++, completed: false });

    // Folds
    const foldInterval = Math.floor((bulkHours * 60) / (foldsCount + 1));
    for (let i = 1; i <= foldsCount; i++) {
      steps.push({ 
        id: `step-${sortOrder}`,
        type: 'fold', 
        title: `קיפול ${i}`, 
        duration: foldInterval,
        sort: sortOrder++,
        completed: false
      });
    }

    // Bulk ferment remainder
    steps.push({ 
      id: `step-${sortOrder}`,
      type: 'bulk_ferment', 
      title: 'המשך התפחה ראשונית', 
      duration: foldInterval,
      sort: sortOrder++,
      completed: false
    });

    // Shape
    steps.push({ id: `step-${sortOrder}`, type: 'shape', title: 'עיצוב', duration: 15, sort: sortOrder++, completed: false });

    // Cold retard
    if (coldRetardHours > 0) {
      steps.push({ 
        id: `step-${sortOrder}`,
        type: 'cold_retard', 
        title: 'קירור במקרר', 
        duration: coldRetardHours * 60,
        sort: sortOrder++,
        completed: false
      });
    } else {
      steps.push({ id: `step-${sortOrder}`, type: 'proof', title: 'התפחה שנייה', duration: 60, sort: sortOrder++, completed: false });
    }

    // Get vessel name
    const vesselName = bakingVessels.find(v => v.id === selectedVessel)?.name || 'סיר יצוק';

    // Bake
    steps.push({ 
      id: `step-${sortOrder}`, 
      type: 'bake_covered', 
      title: `אפייה עם מכסה (${ovenTempCovered}°C)`, 
      duration: bakeCoveredMinutes, 
      sort: sortOrder++, 
      completed: false,
      notes: `${vesselName} - עם מכסה`
    });
    steps.push({ 
      id: `step-${sortOrder}`, 
      type: 'bake_uncovered', 
      title: `אפייה ללא מכסה (${ovenTempUncovered}°C)`, 
      duration: bakeUncoveredMinutes, 
      sort: sortOrder++, 
      completed: false,
      notes: `${vesselName} - ללא מכסה`
    });

    // Cool
    steps.push({ id: `step-${sortOrder}`, type: 'cool', title: 'קירור לפני חיתוך', duration: 60, sort: sortOrder++, completed: false });

    return steps;
  };

  const handleStart = () => {
    if (!name.trim()) {
      toast.error('נא להזין שם לאפייה');
      return;
    }

    const bakeId = Date.now().toString();
    const selectedRecipeName = recipes.find(r => r.id === selectedRecipe)?.name;
    const vesselName = bakingVessels.find(v => v.id === selectedVessel)?.name;
    
    const newBake = {
      id: bakeId,
      name: name.trim(),
      recipe_id: selectedRecipe || null,
      recipe_name: selectedRecipeName,
      room_temp_c: roomTemp,
      starter_strength: starterStrength,
      folds_count: foldsCount,
      bulk_target_hours: bulkHours,
      cold_retard_hours: coldRetardHours,
      oven_temp_c: ovenTempCovered,
      covered_minutes: bakeCoveredMinutes,
      uncovered_minutes: bakeUncoveredMinutes,
      vessel: vesselName,
      status: 'in_progress',
      created_at: new Date().toISOString(),
    };

    const steps = generateSchedule();

    // Save bake
    const storedBakes = localStorage.getItem('bakes');
    const bakes = storedBakes ? JSON.parse(storedBakes) : [];
    localStorage.setItem('bakes', JSON.stringify([newBake, ...bakes]));

    // Save steps
    localStorage.setItem(`bakeSteps-${bakeId}`, JSON.stringify(steps));

    toast.success('האפייה התחילה! 🍞');
    navigate(`/bake/${bakeId}`);
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
            {recipes.map((recipe) => (
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
                onClick={() => setStarterStrength(value as 'weak' | 'medium' | 'strong')}
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

      {/* Baking Settings */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="baking">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-crust" />
              הגדרות אפייה
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            {/* Vessel Selection */}
            <div>
              <Label className="input-label">כלי אפייה</Label>
              <Select value={selectedVessel} onValueChange={setSelectedVessel}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר כלי אפייה..." />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {bakingVessels.map((vessel) => (
                    <SelectItem key={vessel.id} value={vessel.id}>
                      <div className="flex items-center gap-2">
                        <span>{vessel.icon}</span>
                        <span>{vessel.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {bakingVessels.find(v => v.id === selectedVessel)?.steamMethod}
              </p>
            </div>

            {/* Covered Baking */}
            <div className="bread-card-flat">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">אפייה עם מכסה</Label>
                <span className="text-lg font-semibold font-rubik">{bakeCoveredMinutes} דקות</span>
              </div>
              <Slider
                value={[bakeCoveredMinutes]}
                onValueChange={([v]) => setBakeCoveredMinutes(v)}
                min={15}
                max={40}
                step={5}
              />
              <div className="flex items-center justify-between mt-3">
                <Label className="text-sm text-muted-foreground">טמפרטורה</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={ovenTempCovered}
                    onChange={(e) => setOvenTempCovered(Number(e.target.value))}
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-sm">°C</span>
                </div>
              </div>
            </div>

            {/* Uncovered Baking */}
            <div className="bread-card-flat">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-medium">אפייה ללא מכסה</Label>
                <span className="text-lg font-semibold font-rubik">{bakeUncoveredMinutes} דקות</span>
              </div>
              <Slider
                value={[bakeUncoveredMinutes]}
                onValueChange={([v]) => setBakeUncoveredMinutes(v)}
                min={10}
                max={35}
                step={5}
              />
              <div className="flex items-center justify-between mt-3">
                <Label className="text-sm text-muted-foreground">טמפרטורה</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={ovenTempUncovered}
                    onChange={(e) => setOvenTempUncovered(Number(e.target.value))}
                    className="w-20 h-8 text-center"
                  />
                  <span className="text-sm">°C</span>
                </div>
              </div>
            </div>

            {/* Bread Guide Link */}
            <Link 
              to="/bread-guide" 
              className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">מדריך לחם</div>
                <div className="text-sm text-muted-foreground">עיצוב, חיתוך, תוספות וכלי אפייה</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-180" />
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Start Button */}
      <Button
        onClick={handleStart}
        className="w-full h-14 gradient-golden text-accent-foreground font-semibold text-lg shadow-glow hover:opacity-90"
      >
        <Play className="h-5 w-5 ml-2" />
        התחל אפייה
      </Button>
    </div>
  );
}

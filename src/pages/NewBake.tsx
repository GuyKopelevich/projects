import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Wheat
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  useEffect(() => {
    const stored = localStorage.getItem('recipes');
    const userRecipes = stored ? JSON.parse(stored) : [];
    setRecipes([...SAMPLE_RECIPES, ...userRecipes]);
  }, []);

  const generateSchedule = () => {
    const steps: Array<{ id: string; type: string; title: string; duration: number; sort: number; completed: boolean }> = [];
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

    // Bake
    steps.push({ id: `step-${sortOrder}`, type: 'bake_covered', title: 'אפייה עם מכסה', duration: 25, sort: sortOrder++, completed: false });
    steps.push({ id: `step-${sortOrder}`, type: 'bake_uncovered', title: 'אפייה ללא מכסה', duration: 20, sort: sortOrder++, completed: false });

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

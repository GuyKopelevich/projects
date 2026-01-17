import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Sparkles, Check, AlertCircle, FileText, Thermometer, Clock, ChefHat, Scissors, ListChecks } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Recipe {
  id: string;
  name: string;
  flour_total_g: number;
  water_g: number;
  starter_g: number;
  salt_g: number;
  flour_breakdown?: Record<string, number>;
  notes?: string;
  is_sample?: boolean;
  created_at: string;
}

interface ParsedStep {
  type: 'autolyse' | 'mix' | 'bulk' | 'fold' | 'shape' | 'proof' | 'bake' | 'cool' | 'other';
  title: string;
  description: string;
  duration_minutes?: number;
  temperature_c?: number;
}

interface ParsedBakingInfo {
  oven_temp_c?: number;
  covered_minutes?: number;
  uncovered_minutes?: number;
  vessel?: string;
  steam?: boolean;
}

interface ParsedFermentation {
  bulk_hours?: number;
  proof_hours?: number;
  cold_retard_hours?: number;
  room_temp_c?: number;
}

interface ParsedRecipe {
  name: string;
  flour_total_g: number;
  water_g: number;
  starter_g: number;
  salt_g: number;
  flour_breakdown: Record<string, number>;
  notes: string;
  extras: Record<string, number>;
  steps: ParsedStep[];
  baking: ParsedBakingInfo;
  fermentation: ParsedFermentation;
  shaping?: string;
  scoring?: string;
}

interface RecipeImportProps {
  onImport: (recipes: Recipe[]) => void;
}

export default function RecipeImport({ onImport }: RecipeImportProps) {
  const [open, setOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ParsedRecipe | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  // Parse temperature from text
  const parseTemperature = (text: string): number | undefined => {
    const tempMatch = text.match(/(\d{2,3})\s*(?:°|מעלות|C|צלזיוס)/i);
    if (tempMatch) {
      const temp = parseInt(tempMatch[1]);
      if (temp >= 150 && temp <= 300) return temp;
    }
    return undefined;
  };

  // Parse duration from text
  const parseDuration = (text: string): { minutes?: number; hours?: number } => {
    const result: { minutes?: number; hours?: number } = {};
    
    // Hours
    const hoursMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:שעות|שעה|שע'|hours?|h)/i);
    if (hoursMatch) {
      result.hours = parseFloat(hoursMatch[1].replace(',', '.'));
    }
    
    // Minutes
    const minutesMatch = text.match(/(\d+)\s*(?:דקות|דק'|minutes?|min|m\b)/i);
    if (minutesMatch) {
      result.minutes = parseInt(minutesMatch[1]);
    }
    
    return result;
  };

  // Detect step type from text
  const detectStepType = (text: string): ParsedStep['type'] => {
    const lower = text.toLowerCase();
    if (lower.includes('אוטוליזה') || lower.includes('autolyse')) return 'autolyse';
    if (lower.includes('לישה') || lower.includes('מערבבים') || lower.includes('mix')) return 'mix';
    if (lower.includes('תסיסה') || lower.includes('bulk') || lower.includes('התפחה ראשונה')) return 'bulk';
    if (lower.includes('קיפול') || lower.includes('fold') || lower.includes('stretch')) return 'fold';
    if (lower.includes('עיצוב') || lower.includes('shape') || lower.includes('צורה')) return 'shape';
    if (lower.includes('התפחה') || lower.includes('proof') || lower.includes('תפיחה')) return 'proof';
    if (lower.includes('אפייה') || lower.includes('bake') || lower.includes('תנור') || lower.includes('אופים')) return 'bake';
    if (lower.includes('צינון') || lower.includes('cool') || lower.includes('מצנן')) return 'cool';
    return 'other';
  };

  // Parse Hebrew text to extract recipe data
  const parseRecipeText = (text: string): ParsedRecipe | null => {
    try {
      const lines = text.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) return null;

      // Extract recipe name (usually first line, might have emoji)
      let name = lines[0].replace(/^[🥖🥯🍮🍫🍅🍞🥐🥪🧁🎂🍰🌾⚪🥖🪢🫓]+\s*/, '').trim();
      name = name.replace(/\(\d+%.*?\)/, '').trim();

      let starter_g = 0;
      let water_g = 0;
      let salt_g = 0;
      const flour_breakdown: Record<string, number> = {};
      const extras: Record<string, number> = {};
      const steps: ParsedStep[] = [];
      const baking: ParsedBakingInfo = {};
      const fermentation: ParsedFermentation = {};
      let shaping: string | undefined;
      let scoring: string | undefined;
      
      let inPreparation = false;
      let currentStepLines: string[] = [];

      const processStepLines = () => {
        if (currentStepLines.length === 0) return;
        
        const fullText = currentStepLines.join(' ');
        const stepType = detectStepType(fullText);
        const duration = parseDuration(fullText);
        const temp = parseTemperature(fullText);
        
        let title = '';
        switch (stepType) {
          case 'autolyse': title = 'אוטוליזה'; break;
          case 'mix': title = 'לישה וערבוב'; break;
          case 'bulk': title = 'תסיסה ראשונה'; break;
          case 'fold': title = 'קיפולים'; break;
          case 'shape': title = 'עיצוב'; break;
          case 'proof': title = 'התפחה'; break;
          case 'bake': title = 'אפייה'; break;
          case 'cool': title = 'צינון'; break;
          default: title = 'שלב';
        }
        
        steps.push({
          type: stepType,
          title,
          description: currentStepLines[0].replace(/^\d+[\.\)]\s*/, ''),
          duration_minutes: duration.minutes || (duration.hours ? duration.hours * 60 : undefined),
          temperature_c: temp,
        });
        
        currentStepLines = [];
      };

      for (let i = 0; i < lines.length; i++) {
        const cleanLine = lines[i].trim();
        
        // Check if we're entering preparation section
        if (cleanLine.includes('אופן ההכנה') || cleanLine.includes('הכנה:') || cleanLine.includes('שלבים:')) {
          inPreparation = true;
          continue;
        }

        // Parse preparation steps
        if (inPreparation) {
          // New numbered step
          if (/^\d+[\.\)]/.test(cleanLine)) {
            processStepLines();
            currentStepLines.push(cleanLine);
          } else if (currentStepLines.length > 0 && cleanLine.length > 3) {
            currentStepLines.push(cleanLine);
          }
          
          // Extract baking info from any line
          const tempMatch = parseTemperature(cleanLine);
          if (tempMatch && cleanLine.includes('תנור')) {
            baking.oven_temp_c = tempMatch;
          }
          
          // Extract timing info
          if (cleanLine.includes('מכסה') || cleanLine.includes('מכוסה') || cleanLine.includes('covered')) {
            const dur = parseDuration(cleanLine);
            if (dur.minutes) baking.covered_minutes = dur.minutes;
          }
          if (cleanLine.includes('ללא מכסה') || cleanLine.includes('גלוי') || cleanLine.includes('uncovered')) {
            const dur = parseDuration(cleanLine);
            if (dur.minutes) baking.uncovered_minutes = dur.minutes;
          }
          
          // Detect vessel
          if (cleanLine.includes('סיר ברזל') || cleanLine.includes('dutch oven')) {
            baking.vessel = 'סיר ברזל';
          } else if (cleanLine.includes('אבן אפייה') || cleanLine.includes('baking stone')) {
            baking.vessel = 'אבן אפייה';
          } else if (cleanLine.includes('קלוש') || cleanLine.includes('cloche')) {
            baking.vessel = 'קלוש';
          }
          
          // Steam detection
          if (cleanLine.includes('אדים') || cleanLine.includes('steam') || cleanLine.includes('מים בתנור')) {
            baking.steam = true;
          }
          
          // Fermentation detection
          if (cleanLine.includes('תסיסה') || cleanLine.includes('bulk')) {
            const dur = parseDuration(cleanLine);
            if (dur.hours) fermentation.bulk_hours = dur.hours;
          }
          if (cleanLine.includes('מקרר') || cleanLine.includes('retard') || cleanLine.includes('לילה')) {
            const dur = parseDuration(cleanLine);
            fermentation.cold_retard_hours = dur.hours || 8;
          }
          
          // Room temp detection
          const roomTempMatch = cleanLine.match(/טמפרטורת\s*(?:חדר|סביבה)[:\s]*(\d+)/);
          if (roomTempMatch) {
            fermentation.room_temp_c = parseInt(roomTempMatch[1]);
          }
          
          // Shaping detection
          if (cleanLine.includes('בול') || cleanLine.includes('boule') || cleanLine.includes('עגול')) {
            shaping = 'בול (עגול)';
          } else if (cleanLine.includes('באטאר') || cleanLine.includes('batard') || cleanLine.includes('אובלי')) {
            shaping = 'באטאר (אובלי)';
          } else if (cleanLine.includes('באגט') || cleanLine.includes('baguette')) {
            shaping = 'באגט';
          }
          
          // Scoring detection
          if (cleanLine.includes('חריצה') || cleanLine.includes('חיתוך') || cleanLine.includes('score')) {
            if (cleanLine.includes('צלב') || cleanLine.includes('cross')) {
              scoring = 'צלב';
            } else if (cleanLine.includes('עלה') || cleanLine.includes('leaf')) {
              scoring = 'עלה';
            } else if (cleanLine.includes('שיבולת') || cleanLine.includes('wheat')) {
              scoring = 'שיבולת';
            } else {
              scoring = 'חיתוך בודד';
            }
          }
          
          continue;
        }

        // Parse ingredients
        const gramMatch = cleanLine.match(/(\d+)\s*(?:גרם|גר'|ג'|g)/gi);
        
        if (gramMatch) {
          const amounts = [...cleanLine.matchAll(/(\d+)\s*(?:גרם|גר'|ג'|g)/gi)].map(m => parseInt(m[1]));
          
          // Starter/Sourdough
          if (cleanLine.includes('מחמצת') || cleanLine.includes('סטארטר') || cleanLine.includes('שאור')) {
            starter_g = amounts[0] || 0;
          }
          // Water
          else if (cleanLine.includes('מים') && !cleanLine.includes('סיר')) {
            water_g = amounts[0] || 0;
          }
          // Salt
          else if (cleanLine.includes('מלח') && !cleanLine.includes('אטלנטי') && !cleanLine.includes('תוספ')) {
            salt_g = amounts[0] || 0;
          }
          // Flour types
          else if (cleanLine.includes('קמח')) {
            const flourTypes = [
              { pattern: /קמח\s+לחם/i, name: 'קמח לחם' },
              { pattern: /קמח\s+מניטובה/i, name: 'מניטובה' },
              { pattern: /קמח\s+פסטה/i, name: 'קמח פסטה' },
              { pattern: /קמח\s+מלא/i, name: 'קמח מלא' },
              { pattern: /קמח\s+לבן/i, name: 'קמח לבן' },
              { pattern: /קמח\s+70/i, name: 'לבן 70' },
              { pattern: /קמח\s+80/i, name: 'לבן 80' },
              { pattern: /קמח$/i, name: 'קמח לבן' },
            ];

            const flourParts = cleanLine.split(',');
            
            if (flourParts.length > 1) {
              for (const part of flourParts) {
                const partAmounts = [...part.matchAll(/(\d+)\s*(?:גרם|גר'|ג'|g)/gi)].map(m => parseInt(m[1]));
                if (partAmounts.length > 0) {
                  let flourName = 'קמח לבן';
                  for (const ft of flourTypes) {
                    if (ft.pattern.test(part)) {
                      flourName = ft.name;
                      break;
                    }
                  }
                  flour_breakdown[flourName] = (flour_breakdown[flourName] || 0) + partAmounts[0];
                }
              }
            } else {
              let flourName = 'קמח לבן';
              for (const ft of flourTypes) {
                if (ft.pattern.test(cleanLine)) {
                  flourName = ft.name;
                  break;
                }
              }
              flour_breakdown[flourName] = (flour_breakdown[flourName] || 0) + amounts[0];
            }
          }
          // Other ingredients
          else if (cleanLine.includes('סוכר')) {
            extras['סוכר'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('שמן זית')) {
            extras['שמן זית'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('חמאה')) {
            extras['חמאה'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('ביצ')) {
            extras['ביצים'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('חלב')) {
            extras['חלב'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('שמנת')) {
            extras['שמנת'] = amounts[0] || 0;
          }
          else if (cleanLine.includes('דבש')) {
            extras['דבש'] = amounts[0] || 0;
          }
        }
        
        // Also check for temperature in ingredient section (for final oven temp)
        if (cleanLine.includes('תנור')) {
          const temp = parseTemperature(cleanLine);
          if (temp) baking.oven_temp_c = temp;
        }
      }
      
      // Process remaining step lines
      processStepLines();

      const flour_total_g = Object.values(flour_breakdown).reduce((a, b) => a + b, 0);

      if (flour_total_g === 0 && starter_g === 0) {
        return null;
      }

      return {
        name: name || 'מתכון מיובא',
        flour_total_g,
        water_g,
        starter_g,
        salt_g,
        flour_breakdown,
        notes: '',
        extras,
        steps,
        baking,
        fermentation,
        shaping,
        scoring,
      };
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  };

  const handleTextChange = (value: string) => {
    setTextInput(value);
    setParseError(null);
    
    if (value.trim()) {
      const parsed = parseRecipeText(value);
      if (parsed) {
        setParsedPreview(parsed);
        setParseError(null);
      } else {
        setParsedPreview(null);
        setParseError('לא הצלחתי לזהות מתכון. וודא שיש כמויות בגרמים.');
      }
    } else {
      setParsedPreview(null);
    }
  };

  const handleImport = () => {
    if (!parsedPreview) {
      toast.error('אין מתכון לייבוא');
      return;
    }

    setImporting(true);
    try {
      // Build comprehensive notes
      const notesParts: string[] = [];
      
      if (parsedPreview.steps.length > 0) {
        notesParts.push('📋 שלבים:');
        parsedPreview.steps.forEach((step, i) => {
          let stepLine = `${i + 1}. ${step.description}`;
          if (step.duration_minutes) stepLine += ` (${step.duration_minutes} דק')`;
          if (step.temperature_c) stepLine += ` @ ${step.temperature_c}°C`;
          notesParts.push(stepLine);
        });
      }
      
      if (parsedPreview.baking.oven_temp_c) {
        notesParts.push(`\n🌡️ טמפרטורת תנור: ${parsedPreview.baking.oven_temp_c}°C`);
      }
      if (parsedPreview.baking.covered_minutes || parsedPreview.baking.uncovered_minutes) {
        notesParts.push(`⏱️ זמני אפייה: ${parsedPreview.baking.covered_minutes || 0} דק' מכוסה, ${parsedPreview.baking.uncovered_minutes || 0} דק' גלוי`);
      }
      if (parsedPreview.baking.vessel) {
        notesParts.push(`🍳 כלי אפייה: ${parsedPreview.baking.vessel}`);
      }
      if (parsedPreview.fermentation.bulk_hours) {
        notesParts.push(`\n⏳ תסיסה ראשונה: ${parsedPreview.fermentation.bulk_hours} שעות`);
      }
      if (parsedPreview.fermentation.cold_retard_hours) {
        notesParts.push(`❄️ מקרר: ${parsedPreview.fermentation.cold_retard_hours} שעות`);
      }
      if (parsedPreview.shaping) {
        notesParts.push(`\n✂️ עיצוב: ${parsedPreview.shaping}`);
      }
      if (parsedPreview.scoring) {
        notesParts.push(`🔪 חריצה: ${parsedPreview.scoring}`);
      }
      if (Object.keys(parsedPreview.extras).length > 0) {
        notesParts.push('\n🧈 תוספות: ' + Object.entries(parsedPreview.extras).map(([k, v]) => `${k} ${v}g`).join(', '));
      }

      const newRecipe: Recipe = {
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: parsedPreview.name,
        flour_total_g: parsedPreview.flour_total_g,
        water_g: parsedPreview.water_g,
        starter_g: parsedPreview.starter_g,
        salt_g: parsedPreview.salt_g,
        flour_breakdown: parsedPreview.flour_breakdown,
        notes: notesParts.join('\n'),
        is_sample: false,
        created_at: new Date().toISOString(),
      };

      const stored = localStorage.getItem('recipes');
      const existingRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
      const updatedRecipes = [...existingRecipes, newRecipe];
      localStorage.setItem('recipes', JSON.stringify(updatedRecipes));

      onImport([newRecipe]);
      toast.success(`המתכון "${parsedPreview.name}" יובא בהצלחה!`);
      setOpen(false);
      setTextInput('');
      setParsedPreview(null);
    } catch (error) {
      toast.error('שגיאה בשמירת המתכון');
    } finally {
      setImporting(false);
    }
  };

  const calculateHydration = (water: number, flour: number) => {
    if (flour === 0) return 0;
    return ((water / flour) * 100).toFixed(0);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 ml-1" />
          ייבוא
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            ייבוא מתכון חכם
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            הדבק את טקסט המתכון והמערכת תזהה אוטומטית: מרכיבים, שלבים, טמפרטורות, זמנים וכלי אפייה
          </div>
          
          <Textarea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`דוגמה:
🥖 לחם מחמצת קלאסי

מרכיבים:
100 גרם מחמצת
350 גרם מים
500 גרם קמח לחם
10 גרם מלח

אופן ההכנה:
1. מערבבים את הקמח והמים, אוטוליזה 30 דקות
2. מוסיפים מחמצת ומלח, לשים 5 דקות
3. תסיסה ראשונה 4 שעות בטמפרטורת חדר
4. 3 קיפולים כל 45 דקות
5. עיצוב לבול עגול
6. התפחה במקרר 8-12 שעות
7. אפייה בסיר ברזל 250°C, 25 דקות עם מכסה, 20 דקות ללא
8. צינון שעה לפני חיתוך`}
            className="min-h-[200px] text-sm"
          />

          {parseError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {parseError}
            </div>
          )}

          {parsedPreview && (
            <div className="p-4 rounded-xl space-y-4 border border-primary/30 bg-primary/5">
              {/* Recipe Name */}
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-semibold text-lg">{parsedPreview.name}</span>
              </div>
              
              {/* Basic Ingredients */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background/50 p-2 rounded-lg border border-border/50">
                  <span className="text-muted-foreground">קמח:</span>
                  <span className="font-medium mr-1">{parsedPreview.flour_total_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded-lg border border-border/50">
                  <span className="text-muted-foreground">מים:</span>
                  <span className="font-medium mr-1">{parsedPreview.water_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded-lg border border-border/50">
                  <span className="text-muted-foreground">מחמצת:</span>
                  <span className="font-medium mr-1">{parsedPreview.starter_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded-lg border border-border/50">
                  <span className="text-muted-foreground">מלח:</span>
                  <span className="font-medium mr-1">{parsedPreview.salt_g}g</span>
                </div>
              </div>

              {/* Hydration Badge */}
              {parsedPreview.flour_total_g > 0 && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {calculateHydration(parsedPreview.water_g, parsedPreview.flour_total_g)}% הידרציה
                </Badge>
              )}

              {/* Detected Features */}
              <div className="flex flex-wrap gap-2">
                {parsedPreview.baking.oven_temp_c && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    {parsedPreview.baking.oven_temp_c}°C
                  </Badge>
                )}
                {(parsedPreview.baking.covered_minutes || parsedPreview.baking.uncovered_minutes) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {(parsedPreview.baking.covered_minutes || 0) + (parsedPreview.baking.uncovered_minutes || 0)} דק' אפייה
                  </Badge>
                )}
                {parsedPreview.baking.vessel && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ChefHat className="h-3 w-3" />
                    {parsedPreview.baking.vessel}
                  </Badge>
                )}
                {parsedPreview.fermentation.bulk_hours && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {parsedPreview.fermentation.bulk_hours}ש' תסיסה
                  </Badge>
                )}
                {parsedPreview.fermentation.cold_retard_hours && (
                  <Badge variant="outline" className="flex items-center gap-1 text-blue-500 border-blue-500/50">
                    ❄️ {parsedPreview.fermentation.cold_retard_hours}ש' מקרר
                  </Badge>
                )}
                {parsedPreview.shaping && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Scissors className="h-3 w-3" />
                    {parsedPreview.shaping}
                  </Badge>
                )}
                {parsedPreview.scoring && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    ✂️ {parsedPreview.scoring}
                  </Badge>
                )}
              </div>

              {/* Steps detected */}
              {parsedPreview.steps.length > 0 && (
                <div className="text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground mb-2">
                    <ListChecks className="h-4 w-4" />
                    <span className="font-medium">{parsedPreview.steps.length} שלבים זוהו</span>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {parsedPreview.steps.slice(0, 5).map((step, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs bg-background/30 p-2 rounded">
                        <span className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium",
                          step.type === 'bake' ? 'bg-orange-500/20 text-orange-500' :
                          step.type === 'bulk' ? 'bg-amber-500/20 text-amber-500' :
                          step.type === 'fold' ? 'bg-blue-500/20 text-blue-500' :
                          step.type === 'shape' ? 'bg-purple-500/20 text-purple-500' :
                          'bg-muted text-muted-foreground'
                        )}>
                          {step.title}
                        </span>
                        <span className="flex-1 line-clamp-1">{step.description}</span>
                      </div>
                    ))}
                    {parsedPreview.steps.length > 5 && (
                      <p className="text-xs text-muted-foreground">+ עוד {parsedPreview.steps.length - 5} שלבים...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Flour breakdown */}
              {Object.keys(parsedPreview.flour_breakdown).length > 1 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">סוגי קמח: </span>
                  {Object.entries(parsedPreview.flour_breakdown).map(([name, amount]) => (
                    <span key={name} className="mr-2">{name} ({amount}g)</span>
                  ))}
                </div>
              )}

              {/* Extras */}
              {Object.keys(parsedPreview.extras).length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">תוספות: </span>
                  {Object.entries(parsedPreview.extras).map(([name, amount]) => (
                    <span key={name} className="mr-2">{name} ({amount}g)</span>
                  ))}
                </div>
              )}
            </div>
          )}

          <Button 
            onClick={handleImport} 
            disabled={importing || !parsedPreview}
            className="w-full gradient-crust"
          >
            <Check className="h-4 w-4 ml-1" />
            ייבא מתכון
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

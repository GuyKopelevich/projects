import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Sparkles, Check, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

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

interface ParsedRecipe {
  name: string;
  flour_total_g: number;
  water_g: number;
  starter_g: number;
  salt_g: number;
  flour_breakdown: Record<string, number>;
  notes: string;
  extras: Record<string, number>;
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

  // Parse Hebrew text to extract recipe data
  const parseRecipeText = (text: string): ParsedRecipe | null => {
    try {
      const lines = text.trim().split('\n').filter(l => l.trim());
      if (lines.length === 0) return null;

      // Extract recipe name (usually first line, might have emoji)
      let name = lines[0].replace(/^[🥖🥯🍮🍫🍅🍞🥐🥪🧁🎂🍰]+\s*/, '').trim();
      // Remove percentage info from name
      name = name.replace(/\(\d+%.*?\)/, '').trim();

      let starter_g = 0;
      let water_g = 0;
      let salt_g = 0;
      const flour_breakdown: Record<string, number> = {};
      const extras: Record<string, number> = {};
      const noteLines: string[] = [];
      let inPreparation = false;

      for (const line of lines) {
        const cleanLine = line.trim();
        
        // Check if we're in the preparation section
        if (cleanLine.includes('אופן ההכנה') || cleanLine.includes('הכנה:')) {
          inPreparation = true;
          continue;
        }

        // Collect preparation notes
        if (inPreparation) {
          if (cleanLine.length > 5) {
            noteLines.push(cleanLine);
          }
          continue;
        }

        // Parse ingredients
        // Match patterns like "60 גרם מחמצת" or "מחמצת 60 גרם"
        const gramMatch = cleanLine.match(/(\d+)\s*(?:גרם|גר'|ג'|g)/gi);
        
        if (gramMatch) {
          // Extract all gram amounts from the line
          const amounts = [...cleanLine.matchAll(/(\d+)\s*(?:גרם|גר'|ג'|g)/gi)].map(m => parseInt(m[1]));
          
          // Check what ingredient this line is about
          const lowerLine = cleanLine.toLowerCase();
          
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
            // Try to extract flour type
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

            // Check for multiple flour types in one line (e.g., "250 גרם קמח מניטובה, 100 גרם קמח פסטה")
            const flourParts = cleanLine.split(',');
            
            if (flourParts.length > 1) {
              // Multiple flours in one line
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
              // Single flour
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
          // Other ingredients (sugar, oil, butter, eggs, etc.)
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
        }
      }

      // Calculate total flour
      const flour_total_g = Object.values(flour_breakdown).reduce((a, b) => a + b, 0);

      // Validate we have at least some basic ingredients
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
        notes: noteLines.slice(0, 5).join('\n'),
        extras,
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
      const newRecipe: Recipe = {
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: parsedPreview.name,
        flour_total_g: parsedPreview.flour_total_g,
        water_g: parsedPreview.water_g,
        starter_g: parsedPreview.starter_g,
        salt_g: parsedPreview.salt_g,
        flour_breakdown: parsedPreview.flour_breakdown,
        notes: parsedPreview.notes + (Object.keys(parsedPreview.extras).length > 0 
          ? '\n\nתוספות: ' + Object.entries(parsedPreview.extras).map(([k, v]) => `${k} ${v}g`).join(', ')
          : ''),
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
            <Sparkles className="h-5 w-5 text-amber-500" />
            ייבוא מתכון חכם
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            הדבק את טקסט המתכון והמערכת תנתח אותו אוטומטית
          </div>
          
          <Textarea
            value={textInput}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={`דוגמה:
🥖 לחם מחמצת

מרכיבים:
100 גרם מחמצת
350 גרם מים
500 גרם קמח לחם
10 גרם מלח

אופן ההכנה:
מערבבים הכל...`}
            className="min-h-[180px] text-sm"
          />

          {parseError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {parseError}
            </div>
          )}

          {parsedPreview && (
            <div className="p-4 bg-accent/30 rounded-lg space-y-3 border border-accent">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-semibold">{parsedPreview.name}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background/50 p-2 rounded">
                  <span className="text-muted-foreground">קמח:</span>
                  <span className="font-medium mr-1">{parsedPreview.flour_total_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <span className="text-muted-foreground">מים:</span>
                  <span className="font-medium mr-1">{parsedPreview.water_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <span className="text-muted-foreground">מחמצת:</span>
                  <span className="font-medium mr-1">{parsedPreview.starter_g}g</span>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <span className="text-muted-foreground">מלח:</span>
                  <span className="font-medium mr-1">{parsedPreview.salt_g}g</span>
                </div>
              </div>

              {parsedPreview.flour_total_g > 0 && (
                <div className="text-sm">
                  <span className="text-amber-600 font-medium">
                    {calculateHydration(parsedPreview.water_g, parsedPreview.flour_total_g)}% הידרציה
                  </span>
                </div>
              )}

              {Object.keys(parsedPreview.flour_breakdown).length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">סוגי קמח: </span>
                  {Object.entries(parsedPreview.flour_breakdown).map(([name, amount]) => (
                    <span key={name} className="mr-2">{name} ({amount}g)</span>
                  ))}
                </div>
              )}

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
            className="w-full gradient-golden"
          >
            <Check className="h-4 w-4 ml-1" />
            ייבא מתכון
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

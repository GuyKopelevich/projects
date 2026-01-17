import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Clipboard, Check, AlertCircle } from 'lucide-react';
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

interface RecipeImportProps {
  onImport: (recipes: Recipe[]) => void;
}

export default function RecipeImport({ onImport }: RecipeImportProps) {
  const [open, setOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRecipe = (recipe: any): recipe is Omit<Recipe, 'id' | 'created_at'> => {
    return (
      typeof recipe === 'object' &&
      recipe !== null &&
      typeof recipe.name === 'string' &&
      recipe.name.trim().length > 0 &&
      typeof recipe.flour_total_g === 'number' &&
      recipe.flour_total_g > 0 &&
      typeof recipe.water_g === 'number' &&
      recipe.water_g > 0 &&
      typeof recipe.starter_g === 'number' &&
      recipe.starter_g >= 0 &&
      typeof recipe.salt_g === 'number' &&
      recipe.salt_g >= 0
    );
  };

  const processRecipes = (data: any): Recipe[] => {
    const recipes: Recipe[] = [];
    const items = Array.isArray(data) ? data : [data];

    for (const item of items) {
      if (validateRecipe(item)) {
        recipes.push({
          ...item,
          id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString(),
          is_sample: false,
        });
      }
    }

    return recipes;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const recipes = processRecipes(data);

      if (recipes.length === 0) {
        toast.error('לא נמצאו מתכונים תקינים בקובץ');
        return;
      }

      saveRecipes(recipes);
    } catch (error) {
      toast.error('שגיאה בקריאת הקובץ. וודא שזהו קובץ JSON תקין');
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleTextImport = () => {
    if (!textInput.trim()) {
      toast.error('הכנס טקסט לייבוא');
      return;
    }

    setImporting(true);
    try {
      const data = JSON.parse(textInput);
      const recipes = processRecipes(data);

      if (recipes.length === 0) {
        toast.error('לא נמצאו מתכונים תקינים בטקסט');
        return;
      }

      saveRecipes(recipes);
    } catch (error) {
      toast.error('שגיאה בפענוח הטקסט. וודא שזהו JSON תקין');
    } finally {
      setImporting(false);
    }
  };

  const handleClipboardImport = async () => {
    setImporting(true);
    try {
      const text = await navigator.clipboard.readText();
      const data = JSON.parse(text);
      const recipes = processRecipes(data);

      if (recipes.length === 0) {
        toast.error('לא נמצאו מתכונים תקינים בלוח');
        return;
      }

      saveRecipes(recipes);
    } catch (error) {
      toast.error('שגיאה בקריאה מהלוח. וודא שהתוכן הוא JSON תקין');
    } finally {
      setImporting(false);
    }
  };

  const saveRecipes = (newRecipes: Recipe[]) => {
    const stored = localStorage.getItem('recipes');
    const existingRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
    const updatedRecipes = [...existingRecipes, ...newRecipes];
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    
    onImport(newRecipes);
    toast.success(`יובאו ${newRecipes.length} מתכונים בהצלחה!`);
    setOpen(false);
    setTextInput('');
  };

  const exampleJson = JSON.stringify({
    name: "לחם מחמצת",
    flour_total_g: 500,
    water_g: 350,
    starter_g: 100,
    salt_g: 10,
    flour_breakdown: { "לבן 70": 80, "מלא": 20 },
    notes: "הערות..."
  }, null, 2);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4 ml-1" />
          ייבוא
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ייבוא מתכונים</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file" className="text-xs">
              <FileText className="h-3 w-3 ml-1" />
              קובץ
            </TabsTrigger>
            <TabsTrigger value="text" className="text-xs">
              <FileText className="h-3 w-3 ml-1" />
              טקסט
            </TabsTrigger>
            <TabsTrigger value="clipboard" className="text-xs">
              <Clipboard className="h-3 w-3 ml-1" />
              לוח
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              העלה קובץ JSON עם מתכון אחד או יותר
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              disabled={importing}
              className="cursor-pointer"
            />
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              הדבק את ה-JSON של המתכון כאן
            </div>
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={exampleJson}
              className="min-h-[150px] font-mono text-xs"
              dir="ltr"
            />
            <Button 
              onClick={handleTextImport} 
              disabled={importing || !textInput.trim()}
              className="w-full"
            >
              <Check className="h-4 w-4 ml-1" />
              ייבא מתכון
            </Button>
          </TabsContent>

          <TabsContent value="clipboard" className="space-y-4">
            <div className="text-sm text-muted-foreground">
              הדבק JSON מהלוח ישירות
            </div>
            <Button 
              onClick={handleClipboardImport} 
              disabled={importing}
              className="w-full"
              variant="outline"
            >
              <Clipboard className="h-4 w-4 ml-1" />
              הדבק מהלוח
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong>פורמט נדרש:</strong>
              <pre className="mt-2 text-[10px] overflow-x-auto" dir="ltr">
{`{
  "name": "שם המתכון",
  "flour_total_g": 500,
  "water_g": 350,
  "starter_g": 100,
  "salt_g": 10
}`}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

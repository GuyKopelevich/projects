import { 
  Moon, 
  Sun, 
  Clock, 
  Palette, 
  Info, 
  Sparkles,
  Bell,
  BellOff,
  Thermometer,
  Droplets,
  Wheat,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  FileJson,
  Check
} from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type TimeFormat = '24h' | '12h';
type TempUnit = 'celsius' | 'fahrenheit';
type FeedingFrequency = 'daily' | 'every_other' | 'weekly';

interface AppSettings {
  darkMode: boolean;
  timeFormat: TimeFormat;
  // Notifications
  notificationsEnabled: boolean;
  feedingFrequency: FeedingFrequency;
  defaultReminderHour: number;
  // Display preferences
  tempUnit: TempUnit;
  defaultHydration: number;
  defaultFlourType: string;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  timeFormat: '24h',
  notificationsEnabled: true,
  feedingFrequency: 'daily',
  defaultReminderHour: 8,
  tempUnit: 'celsius',
  defaultHydration: 70,
  defaultFlourType: 'bread',
};

const flourTypes = [
  { value: 'bread', label: 'קמח לחם' },
  { value: 'white70', label: 'לבן 70' },
  { value: 'white80', label: 'לבן 80' },
  { value: 'whole', label: 'קמח מלא' },
  { value: 'spelt', label: 'כוסמין' },
  { value: 'rye', label: 'שיפון' },
];

const feedingOptions = [
  { value: 'daily', label: 'יומית', description: 'כל יום' },
  { value: 'every_other', label: 'יום כן יום לא', description: 'כל יומיים' },
  { value: 'weekly', label: 'שבועית', description: 'פעם בשבוע' },
];

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    
    // Apply dark mode
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Export data functions
  const exportRecipesJSON = () => {
    const recipes = localStorage.getItem('recipes') || '[]';
    const starterFeeds = localStorage.getItem('starter_feeds') || '[]';
    const bakes = localStorage.getItem('bakes') || '[]';
    
    const exportData = {
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
      data: {
        recipes: JSON.parse(recipes),
        starterFeeds: JSON.parse(starterFeeds),
        bakes: JSON.parse(bakes),
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sourdough-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('הגיבוי הורד בהצלחה!');
  };

  const exportRecipesCSV = () => {
    const recipes = JSON.parse(localStorage.getItem('recipes') || '[]');
    
    if (recipes.length === 0) {
      toast.error('אין מתכונים לייצוא');
      return;
    }
    
    const headers = ['שם', 'קמח (ג)', 'מים (ג)', 'מחמצת (ג)', 'מלח (ג)', 'הידרציה %', 'הערות'];
    const rows = recipes.map((r: any) => [
      r.name,
      r.flour_total_g,
      r.water_g,
      r.starter_g,
      r.salt_g,
      ((r.water_g / r.flour_total_g) * 100).toFixed(1),
      (r.notes || '').replace(/\n/g, ' ').replace(/,/g, ';')
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('המתכונים יוצאו בהצלחה!');
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.data?.recipes) {
          const existing = JSON.parse(localStorage.getItem('recipes') || '[]');
          const merged = [...existing, ...data.data.recipes];
          localStorage.setItem('recipes', JSON.stringify(merged));
        }
        
        if (data.data?.starterFeeds) {
          const existing = JSON.parse(localStorage.getItem('starter_feeds') || '[]');
          const merged = [...existing, ...data.data.starterFeeds];
          localStorage.setItem('starter_feeds', JSON.stringify(merged));
        }
        
        toast.success('הגיבוי שוחזר בהצלחה!');
      } catch (error) {
        toast.error('שגיאה בקריאת קובץ הגיבוי');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetAllData = () => {
    localStorage.removeItem('recipes');
    localStorage.removeItem('starter_feeds');
    localStorage.removeItem('bakes');
    localStorage.removeItem('sourdough_recipes');
    toast.success('כל הנתונים נמחקו בהצלחה');
    window.location.reload();
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader title="הגדרות" showBack backPath="/" />

      {/* Notifications */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '50ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/15">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">התראות</h2>
        </div>
        
        <div className="space-y-4">
          <SettingsRow
            icon={settings.notificationsEnabled ? Bell : BellOff}
            label="הפעל התראות"
            description={settings.notificationsEnabled ? 'התראות פעילות' : 'התראות כבויות'}
            value={settings.notificationsEnabled}
            onValueChange={(checked) => updateSetting('notificationsEnabled', checked)}
          />
          
          {settings.notificationsEnabled && (
            <>
              <div className="pt-2 border-t border-border/30">
                <Label className="text-sm text-muted-foreground mb-2 block">תדירות האכלה</Label>
                <Select 
                  value={settings.feedingFrequency} 
                  onValueChange={(v) => updateSetting('feedingFrequency', v as FeedingFrequency)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {feedingOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <span>{opt.label}</span>
                          <span className="text-xs text-muted-foreground">({opt.description})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm text-muted-foreground">שעת תזכורת</Label>
                  <span className="text-sm font-medium font-rubik">{settings.defaultReminderHour}:00</span>
                </div>
                <Slider
                  value={[settings.defaultReminderHour]}
                  onValueChange={([v]) => updateSetting('defaultReminderHour', v)}
                  min={5}
                  max={22}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>05:00</span>
                  <span>22:00</span>
                </div>
              </div>
            </>
          )}
        </div>
      </SectionCard>

      {/* Display Preferences */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/15">
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">העדפות תצוגה</h2>
        </div>
        
        <div className="space-y-4">
          {/* Dark Mode */}
          <SettingsRow
            icon={settings.darkMode ? Moon : Sun}
            label="מצב כהה"
            description={settings.darkMode ? 'מופעל' : 'כבוי'}
            value={settings.darkMode}
            onValueChange={(checked) => updateSetting('darkMode', checked)}
          />
          
          {/* Temperature Unit */}
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">יחידות טמפרטורה</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSetting('tempUnit', 'celsius')}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  settings.tempUnit === 'celsius' 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-lg font-bold">°C</span>
                <p className="text-xs text-muted-foreground">צלזיוס</p>
              </button>
              <button
                onClick={() => updateSetting('tempUnit', 'fahrenheit')}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  settings.tempUnit === 'fahrenheit' 
                    ? "border-primary bg-primary/10 text-primary" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-lg font-bold">°F</span>
                <p className="text-xs text-muted-foreground">פרנהייט</p>
              </button>
            </div>
          </div>
          
          {/* Default Hydration */}
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm">הידרציה ברירת מחדל</Label>
              </div>
              <span className="text-sm font-medium font-rubik text-primary">{settings.defaultHydration}%</span>
            </div>
            <Slider
              value={[settings.defaultHydration]}
              onValueChange={([v]) => updateSetting('defaultHydration', v)}
              min={50}
              max={100}
              step={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Default Flour Type */}
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Wheat className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm">סוג קמח ברירת מחדל</Label>
            </div>
            <Select 
              value={settings.defaultFlourType} 
              onValueChange={(v) => updateSetting('defaultFlourType', v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {flourTypes.map(ft => (
                  <SelectItem key={ft.value} value={ft.value}>
                    {ft.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      {/* Time Format */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/15">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">פורמט שעה</h2>
        </div>
        
        <RadioGroup
          value={settings.timeFormat}
          onValueChange={(value) => updateSetting('timeFormat', value as TimeFormat)}
          className="space-y-3"
        >
          <div className={cn(
            "choice-card",
            settings.timeFormat === '24h' && "choice-card-selected"
          )}>
            <RadioGroupItem value="24h" id="24h" className="border-primary data-[state=checked]:bg-primary" />
            <Label htmlFor="24h" className="flex-1 cursor-pointer">
              <div className="font-medium text-foreground">24 שעות</div>
              <div className="text-sm text-muted-foreground">לדוגמה: 14:30</div>
            </Label>
          </div>
          
          <div className={cn(
            "choice-card",
            settings.timeFormat === '12h' && "choice-card-selected"
          )}>
            <RadioGroupItem value="12h" id="12h" className="border-primary data-[state=checked]:bg-primary" />
            <Label htmlFor="12h" className="flex-1 cursor-pointer">
              <div className="font-medium text-foreground">12 שעות (AM/PM)</div>
              <div className="text-sm text-muted-foreground">לדוגמה: 2:30 PM</div>
            </Label>
          </div>
        </RadioGroup>
      </SectionCard>

      {/* Data & Backup */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/15">
            <FileJson className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">נתונים וגיבוי</h2>
        </div>
        
        <div className="space-y-3">
          {/* Export JSON */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-3"
            onClick={exportRecipesJSON}
          >
            <div className="p-2 rounded-lg bg-primary/10 ml-3">
              <Download className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right">
              <div className="font-medium">ייצוא גיבוי מלא</div>
              <div className="text-xs text-muted-foreground">כל הנתונים בקובץ JSON</div>
            </div>
          </Button>
          
          {/* Export CSV */}
          <Button
            variant="outline"
            className="w-full justify-start h-auto py-3"
            onClick={exportRecipesCSV}
          >
            <div className="p-2 rounded-lg bg-accent/10 ml-3">
              <Download className="h-4 w-4 text-accent-foreground" />
            </div>
            <div className="text-right">
              <div className="font-medium">ייצוא מתכונים</div>
              <div className="text-xs text-muted-foreground">קובץ CSV לאקסל</div>
            </div>
          </Button>
          
          {/* Import Backup */}
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <div className="w-full flex items-center justify-start h-auto py-3 px-4 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-lg bg-muted ml-3">
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-right">
                <div className="font-medium">ייבוא גיבוי</div>
                <div className="text-xs text-muted-foreground">שחזר נתונים מקובץ JSON</div>
              </div>
            </div>
          </label>
          
          {/* Reset Data */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start h-auto py-3 border-destructive/30 hover:bg-destructive/10"
              >
                <div className="p-2 rounded-lg bg-destructive/10 ml-3">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-right">
                  <div className="font-medium text-destructive">איפוס נתונים</div>
                  <div className="text-xs text-muted-foreground">מחיקת כל המתכונים והנתונים</div>
                </div>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>איפוס כל הנתונים</AlertDialogTitle>
                <AlertDialogDescription>
                  האם אתה בטוח שברצונך למחוק את כל הנתונים? פעולה זו תמחק את כל המתכונים, האפיות ונתוני המחמצת.
                  <br /><br />
                  <strong>פעולה זו לא ניתנת לביטול!</strong>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row-reverse gap-2">
                <AlertDialogCancel>ביטול</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={resetAllData}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  מחק הכל
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SectionCard>

      {/* About */}
      <SectionCard variant="flat" className="animate-fade-in" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted">
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-foreground">אודות</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">גרסה</span>
            <span className="font-medium text-foreground">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">פיתוח</span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-primary">מחמצת—סיידקיק</span>
            </div>
          </div>
          <div className="pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground leading-relaxed">
              אפליקציה לניהול אפיית לחם מחמצת, כולל מתכונים, מעקב מחמצת, ומחשבונים שימושיים.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
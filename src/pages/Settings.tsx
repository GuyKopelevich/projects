import { Moon, Sun, Clock, Palette, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionCard } from "@/components/ui/SectionCard";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type TimeFormat = '24h' | '12h';

interface AppSettings {
  darkMode: boolean;
  timeFormat: TimeFormat;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  timeFormat: '24h',
};

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
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

  return (
    <div className="space-y-6">
      <PageHeader title="הגדרות" showBack backPath="/" />

      {/* Appearance */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' } as React.CSSProperties}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Palette className="h-4 w-4 text-accent" />
          </div>
          <h2 className="font-semibold text-primary">מראה</h2>
        </div>
        
        <SettingsRow
          icon={settings.darkMode ? Moon : Sun}
          label="מצב כהה"
          description={settings.darkMode ? 'מופעל' : 'כבוי'}
          value={settings.darkMode}
          onValueChange={(checked) => updateSetting('darkMode', checked)}
        />
      </SectionCard>

      {/* Time Format */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' } as React.CSSProperties}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-accent" />
          </div>
          <h2 className="font-semibold text-primary">פורמט שעה</h2>
        </div>
        
        <RadioGroup
          value={settings.timeFormat}
          onValueChange={(value) => updateSetting('timeFormat', value as TimeFormat)}
          className="space-y-2"
        >
          <div className={cn(
            "choice-card",
            settings.timeFormat === '24h' && "choice-card-selected"
          )}>
            <RadioGroupItem value="24h" id="24h" />
            <Label htmlFor="24h" className="flex-1 cursor-pointer">
              <div className="font-medium">24 שעות</div>
              <div className="text-sm text-muted-foreground">לדוגמה: 14:30</div>
            </Label>
          </div>
          
          <div className={cn(
            "choice-card",
            settings.timeFormat === '12h' && "choice-card-selected"
          )}>
            <RadioGroupItem value="12h" id="12h" />
            <Label htmlFor="12h" className="flex-1 cursor-pointer">
              <div className="font-medium">12 שעות (AM/PM)</div>
              <div className="text-sm text-muted-foreground">לדוגמה: 2:30 PM</div>
            </Label>
          </div>
        </RadioGroup>
      </SectionCard>

      {/* About */}
      <SectionCard variant="flat" className="animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' } as React.CSSProperties}>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-primary">אודות</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">גרסה</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">פיתוח</span>
            <span className="font-medium">מחמצת—סיידקיק</span>
          </div>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            אפליקציה לניהול אפיית לחם מחמצת, כולל מתכונים, מעקב מחמצת, ומחשבונים שימושיים.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
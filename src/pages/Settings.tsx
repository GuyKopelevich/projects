import { Moon, Sun, Clock, Palette, Info, Sparkles } from "lucide-react";
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
      <SectionCard className="animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'hsl(42 85% 55% / 0.15)',
              boxShadow: '0 0 12px hsl(42 85% 55% / 0.1)'
            }}
          >
            <Palette className="h-4 w-4 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">מראה</h2>
        </div>
        
        <SettingsRow
          icon={settings.darkMode ? Moon : Sun}
          label="מצב בהיר"
          description={settings.darkMode ? 'מופעל' : 'כבוי'}
          value={settings.darkMode}
          onValueChange={(checked) => updateSetting('darkMode', checked)}
        />
      </SectionCard>

      {/* Time Format */}
      <SectionCard className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'hsl(42 85% 55% / 0.15)',
              boxShadow: '0 0 12px hsl(42 85% 55% / 0.1)'
            }}
          >
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

      {/* About */}
      <SectionCard variant="flat" className="animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(25 20% 18%)' }}
          >
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
              <span className="font-medium text-gold">מחמצת—סיידקיק</span>
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
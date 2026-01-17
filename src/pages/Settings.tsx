import { ArrowRight, Moon, Sun, Clock, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useState } from "react";

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
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">הגדרות</h1>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            מראה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {settings.darkMode ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="min-w-0">
                <Label htmlFor="dark-mode" className="text-base font-medium block">
                  מצב כהה
                </Label>
                <p className="text-sm text-muted-foreground">
                  {settings.darkMode ? 'מופעל' : 'כבוי'}
                </p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              className="flex-shrink-0"
            />
          </div>
        </CardContent>
      </Card>

      {/* Time Format */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            פורמט שעה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.timeFormat}
            onValueChange={(value) => updateSetting('timeFormat', value as TimeFormat)}
            className="space-y-3"
          >
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="flex-1 cursor-pointer">
                  <div className="font-medium">24 שעות</div>
                  <div className="text-sm text-muted-foreground">לדוגמה: 14:30</div>
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h" className="flex-1 cursor-pointer">
                  <div className="font-medium">12 שעות (AM/PM)</div>
                  <div className="text-sm text-muted-foreground">לדוגמה: 2:30 PM</div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">אודות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">גרסה</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">פיתוח</span>
            <span>מחמצת—סיידקיק</span>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            אפליקציה לניהול אפיית לחם מחמצת, כולל מתכונים, מעקב מחמצת, ומחשבונים שימושיים.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const hydrationLevels = [
  { min: 50, max: 60, label: 'נמוכה', description: 'בצק יבש, קל לעיבוד. מתאים לבייגלים ופיתות.', color: 'from-amber-200 to-amber-300' },
  { min: 60, max: 70, label: 'בינונית', description: 'בצק סטנדרטי, קל לעיצוב. מתאים לחלות ולחם רגיל.', color: 'from-amber-300 to-amber-400' },
  { min: 70, max: 80, label: 'גבוהה', description: 'בצק רך, מרקם אוורירי. מתאים ללחם מחמצת קלאסי.', color: 'from-amber-400 to-amber-500' },
  { min: 80, max: 90, label: 'גבוהה מאוד', description: 'בצק רופף, דורש ניסיון. מתאים לצ\'יאבטה ופוקצ\'ה.', color: 'from-amber-500 to-amber-600' },
  { min: 90, max: 100, label: 'קיצונית', description: 'בצק נוזלי כמעט. למומחים בלבד!', color: 'from-amber-600 to-amber-700' },
];

export function HydrationVisualizer() {
  const [hydration, setHydration] = useState([75]);
  
  const currentLevel = hydrationLevels.find(
    level => hydration[0] >= level.min && hydration[0] < level.max
  ) || hydrationLevels[2];

  const getWaterDrops = (hydration: number) => {
    const drops = Math.floor((hydration - 50) / 10) + 1;
    return Array(drops).fill('💧');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">ויזואליזציית הידרציה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Visual representation */}
        <div className={`h-32 rounded-xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <div 
              className="bg-blue-400/30 w-full transition-all duration-500"
              style={{ height: `${hydration[0] - 20}%` }}
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {hydration[0]}%
            </div>
            <div className="text-white/90 text-sm font-medium">
              {currentLevel.label}
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="px-2">
          <Slider
            value={hydration}
            onValueChange={setHydration}
            min={50}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{getWaterDrops(hydration[0]).join('')}</span>
            <span className="font-medium">{currentLevel.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentLevel.description}
          </p>
        </div>

        {/* Quick tips */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>💡 הידרציה גבוהה = יותר חורים גדולים</p>
          <p>💡 התחל עם 70-75% ועלה בהדרגה</p>
        </div>
      </CardContent>
    </Card>
  );
}

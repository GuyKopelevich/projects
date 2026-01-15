import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Thermometer, Clock, AlertTriangle } from 'lucide-react';

export function FermentationCalculator() {
  const [temperature, setTemperature] = useState([24]);
  const [starterStrength, setStarterStrength] = useState([100]); // percentage of normal strength

  const calculations = useMemo(() => {
    const temp = temperature[0];
    const strength = starterStrength[0] / 100;
    
    // Base fermentation time at 24°C with 100% starter strength is about 4 hours
    const baseTime = 4;
    
    // Temperature adjustment: every 5°C change roughly doubles/halves the time
    const tempFactor = Math.pow(2, (24 - temp) / 5);
    
    // Starter strength adjustment
    const strengthFactor = 1 / strength;
    
    const bulkFermentTime = baseTime * tempFactor * strengthFactor;
    const foldInterval = Math.max(20, Math.min(45, 30 * tempFactor));
    const proofTime = bulkFermentTime * 0.4;
    
    return {
      bulkFermentTime: Math.round(bulkFermentTime * 60), // in minutes
      foldInterval: Math.round(foldInterval),
      proofTime: Math.round(proofTime * 60),
      riskLevel: temp > 28 ? 'high' : temp > 25 ? 'medium' : 'low',
    };
  }, [temperature, starterStrength]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} שעות ו-${mins} דקות` : `${hours} שעות`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-amber-500';
      default: return 'text-green-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          מחשבון תסיסה
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Temperature Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">טמפרטורת חדר</span>
            </div>
            <span className="text-lg font-bold">{temperature[0]}°C</span>
          </div>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            min={18}
            max={32}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>קר (18°C)</span>
            <span>חם (32°C)</span>
          </div>
        </div>

        {/* Starter Strength Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">עוצמת מחמצת</span>
            <span className="text-lg font-bold">{starterStrength[0]}%</span>
          </div>
          <Slider
            value={starterStrength}
            onValueChange={setStarterStrength}
            min={50}
            max={150}
            step={10}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>חלשה (50%)</span>
            <span>חזקה (150%)</span>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3 pt-2">
          <div className="bg-primary/10 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">תפיחה ראשונה (Bulk)</span>
              <span className="font-bold text-lg">{formatDuration(calculations.bulkFermentTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">מרווח בין קיפולים</span>
              <span className="font-bold">{calculations.foldInterval} דקות</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">תפיחה סופית (Proof)</span>
              <span className="font-bold">{formatDuration(calculations.proofTime)}</span>
            </div>
          </div>

          {/* Risk Warning */}
          {calculations.riskLevel !== 'low' && (
            <div className={`flex items-start gap-2 text-sm ${getRiskColor(calculations.riskLevel)}`}>
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>
                {calculations.riskLevel === 'high' 
                  ? 'טמפרטורה גבוהה! סיכון לתסיסת יתר. עקוב מקרוב!'
                  : 'טמפרטורה גבוהה מהרגיל. בדוק את הבצק לעיתים קרובות.'}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          * הערכות מבוססות על נוסחאות כלליות. התאם לפי התנהגות הבצק בפועל.
        </p>
      </CardContent>
    </Card>
  );
}

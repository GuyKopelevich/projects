import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FlaskConical, Droplets, Wheat, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const commonRatios = [
  { label: '1:1:1', starter: 1, flour: 1, water: 1, description: 'מהיר, לתסיסה חמה' },
  { label: '1:2:2', starter: 1, flour: 2, water: 2, description: 'יומיומי, מאוזן' },
  { label: '1:3:3', starter: 1, flour: 3, water: 3, description: 'איטי יותר, טעם עמוק' },
  { label: '1:4:4', starter: 1, flour: 4, water: 4, description: 'לילה, תסיסה ארוכה' },
  { label: '1:5:5', starter: 1, flour: 5, water: 5, description: 'מאוד איטי, למקרר' },
];

export function StarterFeedingCalculator() {
  const [starterAmount, setStarterAmount] = useState(20);
  const [selectedRatio, setSelectedRatio] = useState(commonRatios[1]);
  const [customRatio, setCustomRatio] = useState({ starter: 1, flour: 3, water: 3 });
  const [isCustom, setIsCustom] = useState(false);

  const activeRatio = isCustom ? customRatio : selectedRatio;

  const result = useMemo(() => {
    const flourAmount = (starterAmount / activeRatio.starter) * activeRatio.flour;
    const waterAmount = (starterAmount / activeRatio.starter) * activeRatio.water;
    const totalAmount = starterAmount + flourAmount + waterAmount;
    
    return {
      flour: Math.round(flourAmount),
      water: Math.round(waterAmount),
      total: Math.round(totalAmount)
    };
  }, [starterAmount, activeRatio]);

  return (
    <div className="space-y-6">
      {/* Starter Amount */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            כמות מחמצת להאכלה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              value={starterAmount}
              onChange={(e) => setStarterAmount(Number(e.target.value))}
              className="text-center text-xl font-bold"
            />
            <span className="text-muted-foreground font-medium">גרם</span>
          </div>
          
          <div className="flex gap-2 mt-3 flex-wrap">
            {[10, 20, 30, 50].map((amount) => (
              <Button
                key={amount}
                variant={starterAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => setStarterAmount(amount)}
              >
                {amount}g
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ratio Selection */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">יחס האכלה (מחמצת:קמח:מים)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {commonRatios.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => {
                  setSelectedRatio(ratio);
                  setIsCustom(false);
                }}
                className={cn(
                  "p-3 rounded-xl border-2 text-right transition-all",
                  !isCustom && selectedRatio.label === ratio.label
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="font-bold text-lg">{ratio.label}</div>
                <div className="text-xs text-muted-foreground">{ratio.description}</div>
              </button>
            ))}
          </div>

          {/* Custom Ratio */}
          <button
            onClick={() => setIsCustom(true)}
            className={cn(
              "w-full p-3 rounded-xl border-2 text-right transition-all",
              isCustom
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="font-bold">יחס מותאם אישית</div>
            {isCustom && (
              <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex-1">
                  <Label className="text-xs">מחמצת</Label>
                  <Input
                    type="number"
                    value={customRatio.starter}
                    onChange={(e) => setCustomRatio({ ...customRatio, starter: Number(e.target.value) })}
                    className="text-center"
                    min={1}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">קמח</Label>
                  <Input
                    type="number"
                    value={customRatio.flour}
                    onChange={(e) => setCustomRatio({ ...customRatio, flour: Number(e.target.value) })}
                    className="text-center"
                    min={1}
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">מים</Label>
                  <Input
                    type="number"
                    value={customRatio.water}
                    onChange={(e) => setCustomRatio({ ...customRatio, water: Number(e.target.value) })}
                    className="text-center"
                    min={1}
                  />
                </div>
              </div>
            )}
          </button>
        </CardContent>
      </Card>

      {/* Result */}
      <Card className="border-green-500/30 bg-green-50 dark:bg-green-900/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-green-700 dark:text-green-400 flex items-center gap-2">
            <Scale className="h-4 w-4" />
            כמויות להאכלה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-card rounded-xl p-4 text-center">
              <FlaskConical className="h-5 w-5 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-foreground">{starterAmount}g</div>
              <div className="text-xs text-muted-foreground">מחמצת</div>
            </div>
            <div className="bg-white dark:bg-card rounded-xl p-4 text-center">
              <Wheat className="h-5 w-5 mx-auto mb-2 text-amber-700" />
              <div className="text-2xl font-bold text-foreground">{result.flour}g</div>
              <div className="text-xs text-muted-foreground">קמח</div>
            </div>
            <div className="bg-white dark:bg-card rounded-xl p-4 text-center">
              <Droplets className="h-5 w-5 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-foreground">{result.water}g</div>
              <div className="text-xs text-muted-foreground">מים</div>
            </div>
          </div>
          
          <div className="mt-4 bg-white dark:bg-card rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{result.total}g</div>
            <div className="text-sm text-muted-foreground">סה״כ מחמצת לאחר האכלה</div>
          </div>
          
          <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              💡 <strong>טיפ:</strong> יחס {isCustom ? `${customRatio.starter}:${customRatio.flour}:${customRatio.water}` : selectedRatio.label} 
              {!isCustom && ` - ${selectedRatio.description}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

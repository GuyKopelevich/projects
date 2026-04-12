import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Scale, ArrowLeftRight } from 'lucide-react';

export function RecipeScalingCalculator() {
  const [originalFlour, setOriginalFlour] = useState(500);
  const [originalWater, setOriginalWater] = useState(350);
  const [originalStarter, setOriginalStarter] = useState(100);
  const [originalSalt, setOriginalSalt] = useState(10);
  const [originalLoaves, setOriginalLoaves] = useState(1);
  const [targetLoaves, setTargetLoaves] = useState(2);

  const scaledRecipe = useMemo(() => {
    const scaleFactor = targetLoaves / originalLoaves;
    return {
      flour: Math.round(originalFlour * scaleFactor),
      water: Math.round(originalWater * scaleFactor),
      starter: Math.round(originalStarter * scaleFactor),
      salt: Math.round(originalSalt * scaleFactor * 10) / 10,
      totalDough: Math.round((originalFlour + originalWater + originalStarter + originalSalt) * scaleFactor)
    };
  }, [originalFlour, originalWater, originalStarter, originalSalt, originalLoaves, targetLoaves]);

  return (
    <div className="space-y-6">
      {/* Original Recipe */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            המתכון המקורי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">קמח (גרם)</Label>
              <Input
                type="number"
                value={originalFlour}
                onChange={(e) => setOriginalFlour(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">מים (גרם)</Label>
              <Input
                type="number"
                value={originalWater}
                onChange={(e) => setOriginalWater(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">מחמצת (גרם)</Label>
              <Input
                type="number"
                value={originalStarter}
                onChange={(e) => setOriginalStarter(Number(e.target.value))}
                className="text-center"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">מלח (גרם)</Label>
              <Input
                type="number"
                value={originalSalt}
                onChange={(e) => setOriginalSalt(Number(e.target.value))}
                className="text-center"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">מספר כיכרות במקור</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[originalLoaves]}
                onValueChange={([v]) => setOriginalLoaves(v)}
                min={1}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="w-8 text-center font-semibold">{originalLoaves}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scale Arrow */}
      <div className="flex justify-center">
        <div className="bg-primary/10 rounded-full p-3">
          <ArrowLeftRight className="h-6 w-6 text-primary" />
        </div>
      </div>

      {/* Target Loaves */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">כמה כיכרות רוצים?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Slider
              value={[targetLoaves]}
              onValueChange={([v]) => setTargetLoaves(v)}
              min={1}
              max={20}
              step={1}
              className="flex-1"
            />
            <div className="bg-primary text-primary-foreground rounded-xl px-4 py-2 font-bold text-xl min-w-[60px] text-center">
              {targetLoaves}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scaled Result */}
      <Card className="border-green-500/30 bg-green-50 dark:bg-green-900/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-green-700 dark:text-green-400">
            המתכון המותאם ({targetLoaves} כיכרות)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{scaledRecipe.flour}g</div>
              <div className="text-xs text-muted-foreground">קמח</div>
            </div>
            <div className="bg-white dark:bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{scaledRecipe.water}g</div>
              <div className="text-xs text-muted-foreground">מים</div>
            </div>
            <div className="bg-white dark:bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{scaledRecipe.starter}g</div>
              <div className="text-xs text-muted-foreground">מחמצת</div>
            </div>
            <div className="bg-white dark:bg-card rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-foreground">{scaledRecipe.salt}g</div>
              <div className="text-xs text-muted-foreground">מלח</div>
            </div>
          </div>
          
          <div className="mt-4 bg-white dark:bg-card rounded-lg p-3 text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{scaledRecipe.totalDough}g</div>
            <div className="text-sm text-muted-foreground">סה״כ משקל בצק</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

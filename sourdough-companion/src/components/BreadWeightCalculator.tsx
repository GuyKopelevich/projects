import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scale, ArrowDown } from 'lucide-react';

export function BreadWeightCalculator() {
  const [flour, setFlour] = useState(500);
  const [hydration, setHydration] = useState(75);
  const [starter, setStarter] = useState(20);
  const [salt, setSalt] = useState(2);

  const calculations = useMemo(() => {
    const water = flour * (hydration / 100);
    const starterAmount = flour * (starter / 100);
    const saltAmount = flour * (salt / 100);
    
    const totalDoughWeight = flour + water + starterAmount + saltAmount;
    
    // Typical weight loss during baking is 10-15%
    const weightLossPercent = 12;
    const finalBreadWeight = totalDoughWeight * (1 - weightLossPercent / 100);
    
    // For two loaves
    const perLoaf = finalBreadWeight / 2;
    
    return {
      water: Math.round(water),
      starterAmount: Math.round(starterAmount),
      saltAmount: Math.round(saltAmount),
      totalDoughWeight: Math.round(totalDoughWeight),
      finalBreadWeight: Math.round(finalBreadWeight),
      perLoaf: Math.round(perLoaf),
    };
  }, [flour, hydration, starter, salt]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scale className="h-5 w-5" />
          מחשבון משקל לחם
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">קמח (גרם)</Label>
            <Input
              type="number"
              value={flour}
              onChange={(e) => setFlour(Number(e.target.value))}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">הידרציה (%)</Label>
            <Input
              type="number"
              value={hydration}
              onChange={(e) => setHydration(Number(e.target.value))}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">מחמצת (%)</Label>
            <Input
              type="number"
              value={starter}
              onChange={(e) => setStarter(Number(e.target.value))}
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">מלח (%)</Label>
            <Input
              type="number"
              value={salt}
              onChange={(e) => setSalt(Number(e.target.value))}
              className="h-9"
            />
          </div>
        </div>

        <div className="flex items-center justify-center py-2">
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">מים:</span>
              <span className="font-medium">{calculations.water} גרם</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">מחמצת:</span>
              <span className="font-medium">{calculations.starterAmount} גרם</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">מלח:</span>
              <span className="font-medium">{calculations.saltAmount} גרם</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">סה"כ בצק:</span>
              <span className="font-medium">{calculations.totalDoughWeight} גרם</span>
            </div>
          </div>
          
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">משקל לחם סופי (משוער):</span>
              <span className="text-xl font-bold text-primary">
                {calculations.finalBreadWeight} גרם
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>לחלוקה ל-2 כיכרות:</span>
              <span>{calculations.perLoaf} גרם לכל אחד</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          * ההערכה מבוססת על איבוד משקל של כ-12% באפייה
        </p>
      </CardContent>
    </Card>
  );
}

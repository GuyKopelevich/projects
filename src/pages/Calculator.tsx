import { useState } from 'react';
import { ArrowRight, Droplets, Scale, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Calculator() {
  const navigate = useNavigate();
  
  // Hydration calculator
  const [hydFlour, setHydFlour] = useState(500);
  const [hydWater, setHydWater] = useState(350);
  const [hydStarter, setHydStarter] = useState(100);
  const [hydSalt, setHydSalt] = useState(10);

  // Scale calculator
  const [scaleOrigFlour, setScaleOrigFlour] = useState(500);
  const [scaleNewFlour, setScaleNewFlour] = useState(750);
  const [scaleWater, setScaleWater] = useState(350);
  const [scaleStarter, setScaleStarter] = useState(100);
  const [scaleSalt, setScaleSalt] = useState(10);

  // Hydration calculations
  const starterFlour = hydStarter / 2;
  const starterWater = hydStarter / 2;
  const totalFlour = hydFlour + starterFlour;
  const totalWater = hydWater + starterWater;
  const hydration = ((hydWater / hydFlour) * 100).toFixed(1);
  const trueHydration = ((totalWater / totalFlour) * 100).toFixed(1);
  const saltPercent = ((hydSalt / hydFlour) * 100).toFixed(1);
  const starterPercent = ((hydStarter / hydFlour) * 100).toFixed(1);
  const totalDough = hydFlour + hydWater + hydStarter + hydSalt;

  // Scale calculations
  const scaleFactor = scaleNewFlour / scaleOrigFlour;
  const scaledWater = Math.round(scaleWater * scaleFactor);
  const scaledStarter = Math.round(scaleStarter * scaleFactor);
  const scaledSalt = Math.round(scaleSalt * scaleFactor * 10) / 10;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="page-header mb-0">מחשבונים</h1>
      </div>

      <Tabs defaultValue="hydration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hydration" className="gap-2">
            <Droplets className="h-4 w-4" />
            הידרציה
          </TabsTrigger>
          <TabsTrigger value="scale" className="gap-2">
            <Scale className="h-4 w-4" />
            שינוי כמות
          </TabsTrigger>
        </TabsList>

        {/* Hydration Tab */}
        <TabsContent value="hydration" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">קמח (גרם)</Label>
              <Input
                type="number"
                value={hydFlour}
                onChange={(e) => setHydFlour(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-sm">מים (גרם)</Label>
              <Input
                type="number"
                value={hydWater}
                onChange={(e) => setHydWater(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-sm">מחמצת (גרם)</Label>
              <Input
                type="number"
                value={hydStarter}
                onChange={(e) => setHydStarter(Number(e.target.value))}
              />
            </div>
            <div>
              <Label className="text-sm">מלח (גרם)</Label>
              <Input
                type="number"
                value={hydSalt}
                onChange={(e) => setHydSalt(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="bread-card bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Percent className="h-4 w-4" />
              אחוזי אופה
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-rubik text-timer">{hydration}%</div>
                <div className="text-sm text-muted-foreground">הידרציה</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-rubik text-primary">{trueHydration}%</div>
                <div className="text-sm text-muted-foreground">הידרציה אמיתית</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold font-rubik text-starter">{starterPercent}%</div>
                <div className="text-sm text-muted-foreground">מחמצת</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold font-rubik text-crust">{saltPercent}%</div>
                <div className="text-sm text-muted-foreground">מלח</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border text-center">
              <div className="text-lg font-semibold">{totalDough}g</div>
              <div className="text-sm text-muted-foreground">משקל בצק סופי</div>
            </div>
          </div>
        </TabsContent>

        {/* Scale Tab */}
        <TabsContent value="scale" className="space-y-4 mt-4">
          <div className="bread-card-flat">
            <h4 className="font-medium mb-3">מתכון מקורי</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">קמח</Label>
                <Input
                  type="number"
                  value={scaleOrigFlour}
                  onChange={(e) => setScaleOrigFlour(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-sm">מים</Label>
                <Input
                  type="number"
                  value={scaleWater}
                  onChange={(e) => setScaleWater(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-sm">מחמצת</Label>
                <Input
                  type="number"
                  value={scaleStarter}
                  onChange={(e) => setScaleStarter(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-sm">מלח</Label>
                <Input
                  type="number"
                  value={scaleSalt}
                  onChange={(e) => setScaleSalt(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div>
            <Label className="input-label">כמות קמח חדשה (גרם)</Label>
            <Input
              type="number"
              value={scaleNewFlour}
              onChange={(e) => setScaleNewFlour(Number(e.target.value))}
              className="text-lg"
            />
          </div>

          <div className="bread-card bg-gradient-to-br from-accent/10 to-honey/10">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Scale className="h-4 w-4" />
              כמויות מחושבות
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold font-rubik">{scaleNewFlour}g</div>
                <div className="text-sm text-muted-foreground">קמח</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold font-rubik text-timer">{scaledWater}g</div>
                <div className="text-sm text-muted-foreground">מים</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold font-rubik text-starter">{scaledStarter}g</div>
                <div className="text-sm text-muted-foreground">מחמצת</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold font-rubik text-crust">{scaledSalt}g</div>
                <div className="text-sm text-muted-foreground">מלח</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border text-center text-sm text-muted-foreground">
              פקטור: ×{scaleFactor.toFixed(2)}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

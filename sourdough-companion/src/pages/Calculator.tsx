import { useState } from 'react';
import { ArrowRight, Droplets, Scale, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

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

  // Temperature calculator (DDT - Desired Dough Temperature)
  const [desiredDoughTemp, setDesiredDoughTemp] = useState(26);
  const [roomTemp, setRoomTemp] = useState(24);
  const [flourTemp, setFlourTemp] = useState(22);
  const [starterTemp, setStarterTemp] = useState(24);
  const [frictionFactor, setFrictionFactor] = useState(8);

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

  // DDT calculation
  // Formula: Water Temp = (DDT × 4) - Room Temp - Flour Temp - Starter Temp - Friction
  const waterTemp = (desiredDoughTemp * 4) - roomTemp - flourTemp - starterTemp - frictionFactor;

  const getWaterTempColor = () => {
    if (waterTemp < 5) return 'text-blue-500';
    if (waterTemp > 40) return 'text-red-500';
    return 'text-timer';
  };

  const getWaterTempMessage = () => {
    if (waterTemp < 0) return '❄️ מים קרים מאוד - השתמש בקרח';
    if (waterTemp < 5) return '❄️ מים קרים מאוד מהמקרר';
    if (waterTemp < 15) return '💧 מים קרים';
    if (waterTemp <= 25) return '💧 מים בטמפרטורת חדר';
    if (waterTemp <= 35) return '🌡️ מים פושרים';
    if (waterTemp <= 40) return '♨️ מים חמים';
    return '⚠️ מים רותחים - זה יהרוג את המחמצת!';
  };

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hydration" className="gap-1 text-xs sm:text-sm">
            <Droplets className="h-4 w-4" />
            <span className="hidden sm:inline">הידרציה</span>
          </TabsTrigger>
          <TabsTrigger value="scale" className="gap-1 text-xs sm:text-sm">
            <Scale className="h-4 w-4" />
            <span className="hidden sm:inline">כמות</span>
          </TabsTrigger>
          <TabsTrigger value="temperature" className="gap-1 text-xs sm:text-sm">
            <Thermometer className="h-4 w-4" />
            <span className="hidden sm:inline">טמפ׳</span>
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

        {/* Temperature Tab */}
        <TabsContent value="temperature" className="space-y-4 mt-4">
          <div className="bread-card-flat">
            <h4 className="font-medium mb-3">מחשבון טמפרטורת מים (DDT)</h4>
            <p className="text-sm text-muted-foreground mb-4">
              חישוב טמפרטורת המים הנדרשת להשגת טמפרטורת בצק רצויה
            </p>
            
            <div className="space-y-4">
              {/* Desired Dough Temp */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">טמפרטורת בצק רצויה</Label>
                  <span className="text-lg font-semibold font-rubik text-primary">{desiredDoughTemp}°C</span>
                </div>
                <Slider
                  value={[desiredDoughTemp]}
                  onValueChange={([v]) => setDesiredDoughTemp(v)}
                  min={22}
                  max={30}
                  step={1}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  מומלץ: 24-27°C לתסיסה אופטימלית
                </p>
              </div>

              {/* Room Temp */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>טמפרטורת חדר</Label>
                  <span className="font-rubik">{roomTemp}°C</span>
                </div>
                <Slider
                  value={[roomTemp]}
                  onValueChange={([v]) => setRoomTemp(v)}
                  min={15}
                  max={35}
                  step={1}
                />
              </div>

              {/* Flour Temp */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>טמפרטורת קמח</Label>
                  <span className="font-rubik">{flourTemp}°C</span>
                </div>
                <Slider
                  value={[flourTemp]}
                  onValueChange={([v]) => setFlourTemp(v)}
                  min={10}
                  max={30}
                  step={1}
                />
              </div>

              {/* Starter Temp */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>טמפרטורת מחמצת</Label>
                  <span className="font-rubik">{starterTemp}°C</span>
                </div>
                <Slider
                  value={[starterTemp]}
                  onValueChange={([v]) => setStarterTemp(v)}
                  min={4}
                  max={30}
                  step={1}
                />
              </div>

              {/* Friction Factor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>פקטור חיכוך (מיקסר)</Label>
                  <span className="font-rubik">{frictionFactor}°C</span>
                </div>
                <Slider
                  value={[frictionFactor]}
                  onValueChange={([v]) => setFrictionFactor(v)}
                  min={0}
                  max={15}
                  step={1}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  לישה ידנית: 0-3 | מיקסר ביתי: 5-8 | מיקסר מקצועי: 10-15
                </p>
              </div>
            </div>
          </div>

          {/* Result */}
          <div className="bread-card bg-gradient-to-br from-timer/10 to-accent/10">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              טמפרטורת מים נדרשת
            </h3>
            <div className="text-center py-4">
              <div className={`text-5xl font-bold font-rubik ${getWaterTempColor()}`}>
                {waterTemp.toFixed(0)}°C
              </div>
              <p className="text-muted-foreground mt-2">
                {getWaterTempMessage()}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                נוסחה: (טמפ׳ רצויה × 4) - חדר - קמח - מחמצת - חיכוך
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="bread-card-flat">
            <h4 className="font-medium mb-2">טיפים:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• בקיץ - השתמש במים קרים מהמקרר או אפילו קוביות קרח</li>
              <li>• בחורף - מים פושרים יעזרו לתסיסה</li>
              <li>• אם הקמח במקרר - חשב טמפרטורה נמוכה יותר</li>
              <li>• מחמצת מהמקרר = ~4°C</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

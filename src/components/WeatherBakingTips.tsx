import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Snowflake, Thermometer, Droplets } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface WeatherCondition {
  temp: number;
  humidity: number;
}

export function WeatherBakingTips() {
  const [weather, setWeather] = useState<WeatherCondition>({
    temp: 24,
    humidity: 60,
  });

  const getTips = () => {
    const tips: string[] = [];
    
    // Temperature tips
    if (weather.temp < 20) {
      tips.push('🥶 טמפרטורה נמוכה - הארך את זמני התפיחה ב-30-50%');
      tips.push('💡 השתמש במים חמימים יותר (30-32°C)');
      tips.push('💡 הנח את הבצק במקום חם יותר (ליד תנור, על מקרר)');
    } else if (weather.temp > 28) {
      tips.push('🥵 טמפרטורה גבוהה - קצר זמני תפיחה וצפה מקרוב');
      tips.push('💡 השתמש במים קרים (18-20°C)');
      tips.push('💡 שקול העברה למקרר לתפיחה איטית');
      tips.push('⚠️ סיכון גבוה לתסיסת יתר!');
    } else {
      tips.push('✅ טמפרטורה אידיאלית לאפייה');
    }
    
    // Humidity tips
    if (weather.humidity < 40) {
      tips.push('🏜️ אוויר יבש - כסה את הבצק היטב למניעת התייבשות');
      tips.push('💡 רסס מים על הבצק לפני חריצה');
    } else if (weather.humidity > 70) {
      tips.push('💧 לחות גבוהה - הפחת מעט את כמות המים במתכון');
      tips.push('💡 הקמח עלול לספוג לחות מהאוויר');
    }
    
    return tips;
  };

  const getWeatherIcon = () => {
    if (weather.temp < 15) return <Snowflake className="h-8 w-8 text-blue-400" />;
    if (weather.temp > 28) return <Sun className="h-8 w-8 text-amber-500" />;
    if (weather.humidity > 70) return <CloudRain className="h-8 w-8 text-blue-500" />;
    return <Cloud className="h-8 w-8 text-gray-400" />;
  };

  const getConditionLabel = () => {
    if (weather.temp < 20) return 'קר';
    if (weather.temp > 28) return 'חם';
    if (weather.humidity > 70) return 'לח';
    if (weather.humidity < 40) return 'יבש';
    return 'נוח';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          טיפים לפי מזג אוויר
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Weather display */}
        <div className="flex items-center justify-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-amber-50 dark:from-blue-950/30 dark:to-amber-950/30 rounded-xl">
          {getWeatherIcon()}
          <div className="text-center">
            <div className="text-3xl font-bold">{weather.temp}°C</div>
            <div className="text-sm text-muted-foreground">{weather.humidity}% לחות</div>
            <div className="text-xs font-medium text-primary mt-1">{getConditionLabel()}</div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">טמפרטורה</span>
              </div>
              <span className="font-medium">{weather.temp}°C</span>
            </div>
            <Slider
              value={[weather.temp]}
              onValueChange={([temp]) => setWeather(prev => ({ ...prev, temp }))}
              min={10}
              max={35}
              step={1}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">לחות</span>
              </div>
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <Slider
              value={[weather.humidity]}
              onValueChange={([humidity]) => setWeather(prev => ({ ...prev, humidity }))}
              min={20}
              max={90}
              step={5}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">המלצות:</h4>
          <ul className="space-y-2">
            {getTips().map((tip, idx) => (
              <li key={idx} className="text-sm bg-muted/50 rounded-lg p-2">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

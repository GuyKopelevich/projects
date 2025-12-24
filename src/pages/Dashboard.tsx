import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Plus, 
  ChevronLeft, 
  Wheat, 
  ChefHat,
  Droplets,
  Scale,
  BookOpen,
  Thermometer
} from 'lucide-react';
import { stybelFlours, getRecommendedFloursForSourdough } from '@/data/stybel-flours';

export default function Dashboard() {
  const navigate = useNavigate();
  const [savedRecipes] = useState(() => {
    const saved = localStorage.getItem('sourdough_recipes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [starterFeeds] = useState(() => {
    const saved = localStorage.getItem('starter_feeds');
    return saved ? JSON.parse(saved) : [];
  });

  const getTimeSinceLastFeed = () => {
    if (starterFeeds.length === 0) return null;
    const lastFeed = starterFeeds[0];
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `${days} ימים`;
  };

  const recommendedFlours = getRecommendedFloursForSourdough().slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-rubik">מחמצת—סיידקיק 🍞</h1>
        <p className="text-muted-foreground text-sm">העוזר שלך לאפיית לחם מחמצת</p>
      </div>

      {/* Quick Actions */}
      <Button
        onClick={() => navigate('/recipes/new')}
        className="w-full h-14 gradient-golden text-accent-foreground font-semibold text-lg shadow-glow hover:opacity-90 transition-opacity"
      >
        <Plus className="h-5 w-5 ml-2" />
        בנה מתכון חדש
      </Button>

      {/* Featured: Flour Guide */}
      <div 
        className="bread-card bg-gradient-to-br from-wheat/10 to-honey/10 cursor-pointer hover:shadow-elevated transition-shadow"
        onClick={() => navigate('/flours')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-wheat/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-wheat" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">מדריך קמחי שטיבל</h3>
              <p className="text-sm text-muted-foreground">
                {stybelFlours.length} סוגי קמח עם מידע מפורט
              </p>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        </div>
        
        {/* Quick flour preview */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {recommendedFlours.map(flour => (
            <div key={flour.id} className="flex-shrink-0 px-3 py-2 bg-background/50 rounded-lg text-center">
              <div className="text-xs text-muted-foreground">{flour.code}</div>
              <div className="font-rubik text-sm font-semibold">{flour.proteinPercent}%</div>
              <div className="text-xs text-muted-foreground">חלבון</div>
            </div>
          ))}
        </div>
      </div>

      {/* Starter Status */}
      <div 
        className="bread-card flex items-center justify-between cursor-pointer hover:shadow-elevated transition-shadow"
        onClick={() => navigate('/starter')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-starter/20 flex items-center justify-center">
            <Wheat className="h-5 w-5 text-starter" />
          </div>
          <div>
            <h3 className="font-medium">מצב המחמצת</h3>
            <p className="text-sm text-muted-foreground">
              {starterFeeds.length > 0 ? `הוזנה לפני ${getTimeSinceLastFeed()}` : 'לחץ לרישום הזנה ראשונה'}
            </p>
          </div>
        </div>
        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          value={savedRecipes.length}
          label="מתכונים שמורים"
          variant="primary"
        />
        <StatCard
          value={stybelFlours.length}
          label="סוגי קמח"
          variant="accent"
        />
      </div>

      {/* Quick Calculators */}
      <div className="space-y-3">
        <h2 className="section-title">מחשבונים וכלים</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/calculator/hydration')}
            className="bread-card-flat flex flex-col items-center gap-2 py-4 hover:shadow-card transition-shadow"
          >
            <Droplets className="h-6 w-6 text-timer" />
            <span className="text-xs font-medium">הידרציה</span>
          </button>
          <button
            onClick={() => navigate('/calculator/scale')}
            className="bread-card-flat flex flex-col items-center gap-2 py-4 hover:shadow-card transition-shadow"
          >
            <Scale className="h-6 w-6 text-honey" />
            <span className="text-xs font-medium">שינוי כמות</span>
          </button>
          <button
            onClick={() => navigate('/calculator/temperature')}
            className="bread-card-flat flex flex-col items-center gap-2 py-4 hover:shadow-card transition-shadow"
          >
            <Thermometer className="h-6 w-6 text-crust" />
            <span className="text-xs font-medium">טמפרטורה</span>
          </button>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bread-card-flat">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <ChefHat className="h-4 w-4 text-primary" />
          טיפ היום
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          קמח לחם (שטיבל 2) עם 11% חלבון הוא הבחירה המומלצת ללחם מחמצת. 
          לתוצאות טובות יותר, הוסיפו 10-20% קמח מלא או שיפון לטעם עמוק יותר.
        </p>
      </div>
    </div>
  );
}

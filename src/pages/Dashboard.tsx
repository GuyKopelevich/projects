import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronLeft, 
  Wheat, 
  ChefHat,
  Droplets,
  Scale,
  BookOpen,
  AlertCircle,
  Clock,
  Flame,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { stybelFlours, getRecommendedFloursForSourdough } from '@/data/stybel-flours';
import { cn } from '@/lib/utils';

// Daily tips array
const dailyTips = [
  {
    title: 'קמח לחם',
    tip: 'קמח לחם (שטיבל 2) עם 11% חלבון הוא הבחירה המומלצת ללחם מחמצת.',
    icon: '🌾'
  },
  {
    title: 'הידרציה',
    tip: 'התחילו עם הידרציה של 70% ועלו בהדרגה ככל שמתמחים בעבודה עם בצקים רטובים.',
    icon: '💧'
  },
  {
    title: 'טמפרטורה',
    tip: 'טמפרטורת חדר אידיאלית לתפיחה היא 24-26°C. בחום גבוה - קצרו זמנים.',
    icon: '🌡️'
  },
  {
    title: 'מחמצת',
    tip: 'מחמצת בריאה מכפילה את עצמה תוך 4-6 שעות בטמפרטורת החדר.',
    icon: '🫧'
  },
  {
    title: 'אפייה',
    tip: 'חממו את הסיר הברזל 30-45 דקות לפני האפייה לתוצאות מיטביות.',
    icon: '🔥'
  }
];

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

  const [dailyTip] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyTips[dayOfYear % dailyTips.length];
  });

  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('בוקר טוב');
    else if (hour < 17) setGreeting('צהריים טובים');
    else if (hour < 21) setGreeting('ערב טוב');
    else setGreeting('לילה טוב');
  }, []);

  const getTimeSinceLastFeed = () => {
    if (starterFeeds.length === 0) return null;
    const lastFeed = starterFeeds[0];
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `${days} ימים`;
  };

  const getStarterStatus = () => {
    if (starterFeeds.length === 0) return { status: 'new', color: 'text-muted-foreground', bg: 'bg-muted' };
    const lastFeed = starterFeeds[0];
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 12) return { status: 'fresh', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (hours < 24) return { status: 'ready', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' };
    return { status: 'hungry', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const starterStatus = getStarterStatus();
  const recommendedFlours = getRecommendedFloursForSourdough().slice(0, 3);

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary p-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-accent/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl" />
        
        <div className="relative">
          <p className="text-sm text-muted-foreground mb-1">{greeting} 👋</p>
          <h1 className="text-2xl font-bold font-rubik mb-2">מחמצת—סיידקיק</h1>
          <p className="text-sm text-muted-foreground">העוזר שלך לאפיית לחם מחמצת מושלם</p>
        </div>
      </div>

      {/* Primary CTA */}
      <Button
        onClick={() => navigate('/recipes/new')}
        className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
      >
        <Plus className="h-5 w-5 ml-2 group-hover:rotate-90 transition-transform duration-300" />
        בנה מתכון חדש
        <Sparkles className="h-4 w-4 mr-2 opacity-60" />
      </Button>

      {/* Quick Start Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/bake/new')}
          className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300 group text-right animate-fade-in"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity mr-auto" />
          </div>
          <h3 className="font-semibold text-foreground">התחל אפייה</h3>
          <p className="text-xs text-muted-foreground mt-0.5">תזמון ומעקב</p>
        </button>

        <button
          onClick={() => navigate('/recipes')}
          className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 group text-right animate-fade-in"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity mr-auto" />
          </div>
          <h3 className="font-semibold text-foreground">המתכונים שלי</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{savedRecipes.length} מתכונים</p>
        </button>
      </div>

      {/* Starter Status Card */}
      <div 
        onClick={() => navigate('/starter')}
        className="relative overflow-hidden p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in"
        style={{ animationDelay: '250ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105",
            starterStatus.bg
          )}>
            <Wheat className={cn("h-7 w-7", starterStatus.color)} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">המחמצת שלי</h3>
              {starterStatus.status === 'hungry' && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  רעבה! 🍽️
                </span>
              )}
              {starterStatus.status === 'ready' && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                  מוכנה ✨
                </span>
              )}
              {starterStatus.status === 'fresh' && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  טרייה 🌱
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {starterFeeds.length > 0 ? (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  הוזנה לפני {getTimeSinceLastFeed()}
                </span>
              ) : (
                'לחץ לרישום הזנה ראשונה'
              )}
            </p>
          </div>
          
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
        </div>
      </div>

      {/* Quick Tools Grid */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '300ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">כלים מהירים</h2>
          <button 
            onClick={() => navigate('/tools')}
            className="text-xs text-primary hover:underline"
          >
            הכל →
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Scale, label: 'כלים', path: '/tools', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
            { icon: BookOpen, label: 'מדריכים', path: '/guides', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
            { icon: Droplets, label: 'הידרציה', path: '/calculator/hydration', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
            { icon: AlertCircle, label: 'בעיות', path: '/troubleshooting', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
          ].map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${350 + index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flour Guide Preview */}
      <div 
        onClick={() => navigate('/flours')}
        className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in"
        style={{ animationDelay: '550ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Wheat className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold">מדריך קמחים</h3>
              <p className="text-xs text-muted-foreground">{stybelFlours.length} סוגי קמח</p>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 group-hover:-translate-x-1 transition-all" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {recommendedFlours.map(flour => (
            <div key={flour.id} className="flex-shrink-0 px-4 py-2 bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-lg text-center min-w-[80px]">
              <div className="text-xs text-muted-foreground font-medium">{flour.code}</div>
              <div className="font-rubik text-lg font-bold text-amber-700 dark:text-amber-400">{flour.proteinPercent}%</div>
              <div className="text-[10px] text-muted-foreground">חלבון</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Tip */}
      <div 
        className="relative overflow-hidden p-4 rounded-xl bg-card border border-border animate-fade-in"
        style={{ animationDelay: '600ms', animationFillMode: 'both' }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">{dailyTip.icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <ChefHat className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">טיפ היום</span>
              <span className="text-xs text-muted-foreground">• {dailyTip.title}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dailyTip.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

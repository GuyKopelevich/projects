import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  ChevronLeft, 
  Wheat, 
  Droplets,
  Scale,
  BookOpen,
  AlertCircle,
  Clock,
  Flame,
  Thermometer,
  Timer,
  Sparkles,
  ChefHat
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

// Hot topics data - inspired by reference design
const hotTopics = [
  {
    id: 'temperature',
    title: 'טמפרטורה והתפחה',
    subtitle: 'אידיאלי: 24°C-27°C',
    description: 'טמפרטורה השפעה על זמני התפיחה המומלצים.',
    icon: Thermometer,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    path: '/guides'
  },
  {
    id: 'flours',
    title: 'קמחים מומלצים',
    subtitle: 'שטיבל לחם (2)',
    description: 'קמח חזק ומתאים למחמצת.',
    icon: Wheat,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    path: '/flours'
  },
  {
    id: 'hydration',
    title: 'הידרציה (יחס מים-קמח)',
    subtitle: '65% → 75%',
    description: 'השפעה על מרקם ואווריריות.',
    icon: Droplets,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    path: '/calculator/hydration'
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
    if (starterFeeds.length === 0) return { status: 'new', label: 'חדשה', color: 'text-muted-foreground', bg: 'bg-muted', emoji: '🫙' };
    const lastFeed = starterFeeds[0];
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 12) return { status: 'fresh', label: 'טרייה', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', emoji: '🌱' };
    if (hours < 24) return { status: 'ready', label: 'מוכנה', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', emoji: '✨' };
    return { status: 'hungry', label: 'רעבה', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', emoji: '🍽️' };
  };

  const starterStatus = getStarterStatus();

  return (
    <div className="space-y-6 pb-6">
      {/* Hero Section - Inspired by reference with warm tones */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50/50 to-amber-100/30 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-900/20 p-6 animate-fade-in"
        style={{ animationDelay: '0ms', animationFillMode: 'both' }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-200/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-200/40 rounded-full translate-x-1/3 translate-y-1/3 blur-2xl" />
        
        <div className="relative text-center">
          {/* Starter jar illustration placeholder - using emoji for now */}
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center text-4xl shadow-lg border-2 border-amber-200/50 dark:border-amber-700/50">
            🫙
          </div>
          
          <p className="text-sm text-muted-foreground mb-1">{greeting} 👋</p>
          <h1 className="text-2xl font-bold font-rubik mb-1">מחמצת שלי</h1>
          <p className="text-sm text-muted-foreground">הדרך הפשוטה לבצק המושלם</p>
        </div>
      </div>

      {/* Quick Feature Icons - Inspired by reference */}
      <div 
        className="grid grid-cols-3 gap-3 animate-fade-in"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
      >
        {[
          { icon: BookOpen, label: 'מתכונים', path: '/recipes', count: savedRecipes.length },
          { icon: Scale, label: 'הזנה קלה', path: '/starter' },
          { icon: Timer, label: 'לוח זמנים', path: '/bakes' },
        ].map((item, index) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/30 flex items-center justify-center border border-amber-200/50 dark:border-amber-700/50">
              <item.icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <span className="text-xs font-medium text-foreground">{item.label}</span>
            {item.count !== undefined && (
              <span className="text-[10px] text-muted-foreground">({item.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Primary CTA Button */}
      <Button
        onClick={() => navigate('/bake/new')}
        className="w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in border-0"
        style={{ animationDelay: '150ms', animationFillMode: 'both' }}
      >
        <Flame className="h-5 w-5 ml-2 group-hover:scale-110 transition-transform" />
        התחל לאפות
      </Button>

      {/* Starter Status Card - Cute illustration style */}
      <div 
        onClick={() => navigate('/starter')}
        className="relative overflow-hidden p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in"
        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-4">
          {/* Starter jar icon */}
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-105 border-2",
            starterStatus.bg,
            starterStatus.status === 'hungry' ? 'border-red-200 dark:border-red-800' : 
            starterStatus.status === 'ready' ? 'border-amber-200 dark:border-amber-800' :
            starterStatus.status === 'fresh' ? 'border-green-200 dark:border-green-800' :
            'border-border'
          )}>
            {starterStatus.emoji}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">המחמצת שלי</h3>
              <span className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-full",
                starterStatus.bg,
                starterStatus.color
              )}>
                {starterStatus.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {starterFeeds.length > 0 ? (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  הוזנה לפני {getTimeSinceLastFeed()}
                </span>
              ) : (
                'לחצו לרישום הזנה ראשונה'
              )}
            </p>
          </div>
          
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
        </div>
      </div>

      {/* Hot Topics Section - Inspired by reference design */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '250ms', animationFillMode: 'both' }}
      >
        <h2 className="font-semibold text-lg font-rubik text-center">נושאים חמים</h2>
        
        <div className="space-y-3">
          {hotTopics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => navigate(topic.path)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 text-right animate-fade-in"
              style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{topic.title}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{topic.subtitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
              </div>
              
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                topic.bgColor
              )}>
                <topic.icon className={cn("h-7 w-7", topic.color)} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tools Row */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '450ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-semibold font-rubik">כלים מהירים</h2>
          <button 
            onClick={() => navigate('/tools')}
            className="text-xs text-primary hover:underline font-medium"
          >
            הכל ←
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Scale, label: 'מחשבון', path: '/calculator', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
            { icon: BookOpen, label: 'מדריכים', path: '/guides', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
            { icon: Wheat, label: 'קמחים', path: '/flours', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
            { icon: AlertCircle, label: 'בעיות', path: '/troubleshooting', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/30' },
          ].map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", item.bg)}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tip Card - Refined style */}
      <div 
        className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/50 dark:border-amber-800/30 animate-fade-in"
        style={{ animationDelay: '500ms', animationFillMode: 'both' }}
      >
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xl flex-shrink-0 border border-amber-200/50 dark:border-amber-700/50">
            {dailyTip.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <ChefHat className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">טיפ היום</span>
              <span className="text-xs text-muted-foreground">• {dailyTip.title}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dailyTip.tip}
            </p>
          </div>
        </div>
      </div>

      {/* Build Recipe CTA - Secondary */}
      <button
        onClick={() => navigate('/recipes/new')}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-card border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group animate-fade-in"
        style={{ animationDelay: '550ms', animationFillMode: 'both' }}
      >
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Plus className="h-5 w-5 text-primary" />
        </div>
        <div className="text-right">
          <span className="font-semibold text-foreground">בנה מתכון חדש</span>
          <p className="text-xs text-muted-foreground">התאם מתכון לצרכים שלך</p>
        </div>
        <Sparkles className="h-4 w-4 text-primary/60 mr-auto" />
      </button>
    </div>
  );
}

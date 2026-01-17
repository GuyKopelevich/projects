import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ChevronLeft, 
  Wheat, 
  Droplets,
  BookOpen,
  AlertCircle,
  Clock,
  Thermometer,
  Timer,
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Hot topics data - exactly like reference
const hotTopics = [
  {
    id: 'temperature',
    title: 'טמפרטורה והתפחה',
    subtitle: 'אידיאלי: 24°C-27°C',
    description: 'טמפרטורה השפעה על זמני התפיחה המומלצים.',
    icon: Thermometer,
    path: '/guides'
  },
  {
    id: 'flours',
    title: 'קמחים מומלצים: שטיבל',
    subtitle: 'קמח לחם (שטיבל 2)',
    description: 'חזק ומתאים למחמצת.',
    icon: Wheat,
    path: '/flours'
  },
  {
    id: 'hydration',
    title: 'הידרציה (יחס מים-קמח)',
    subtitle: '65% → 75%',
    description: 'השפעה על מרקם ואווריריות.',
    icon: Droplets,
    path: '/calculator/hydration'
  }
];

// FAQ items like reference
const faqItems = [
  { question: 'למה הבצק שלי דביק מדי?', path: '/troubleshooting' },
  { question: 'איך יודעים שהמחמצת מוכנה?', path: '/guides' },
  { question: 'מה עושים אם הבצק לא תופח?', path: '/troubleshooting' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [starterFeeds] = useState(() => {
    const saved = localStorage.getItem('starter_feeds');
    return saved ? JSON.parse(saved) : [];
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
    if (starterFeeds.length === 0) return { status: 'new', label: 'חדשה', color: 'text-muted-foreground', emoji: '🫙' };
    const lastFeed = starterFeeds[0];
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 12) return { status: 'fresh', label: 'טרייה', color: 'text-green-600', emoji: '🌱' };
    if (hours < 24) return { status: 'ready', label: 'מוכנה', color: 'text-amber-600', emoji: '✨' };
    return { status: 'hungry', label: 'רעבה', color: 'text-red-600', emoji: '🍽️' };
  };

  const starterStatus = getStarterStatus();

  return (
    <div className="min-h-screen relative">
      {/* Organic background shapes - like reference */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/40 dark:bg-amber-900/20 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl" />
        <div className="absolute top-1/4 left-0 w-48 h-48 bg-orange-100/30 dark:bg-orange-900/15 rounded-full -translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-1/4 right-0 w-56 h-56 bg-amber-50/50 dark:bg-amber-950/20 rounded-full translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-orange-50/40 dark:bg-orange-950/15 rounded-full translate-y-1/2 blur-2xl" />
      </div>

      <div className="space-y-6 pb-6 relative">
        {/* Hero Section - Matching reference exactly */}
        <div 
          className="relative pt-8 pb-6 text-center animate-fade-in"
          style={{ animationDelay: '0ms', animationFillMode: 'both' }}
        >
          {/* Starter jar illustration - like reference */}
          <div className="relative w-28 h-28 mx-auto mb-5">
            {/* Jar background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200/60 to-orange-200/40 dark:from-amber-800/30 dark:to-orange-800/20 rounded-3xl blur-xl" />
            
            {/* Main jar container */}
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/30 border-2 border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center overflow-hidden shadow-lg">
              {/* Jar lid */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-700 dark:bg-amber-600 rounded-t-lg" />
              
              {/* Bubbles effect */}
              <div className="absolute top-6 left-4 w-2 h-2 bg-amber-300/60 rounded-full animate-bounce-subtle" />
              <div className="absolute top-8 right-5 w-1.5 h-1.5 bg-amber-200/50 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-10 left-6 w-1 h-1 bg-amber-300/40 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.6s' }} />
              
              {/* Wheat icon */}
              <Wheat className="w-10 h-10 text-amber-600 dark:text-amber-400 mt-2" />
            </div>
            
            {/* Decorative leaves - like reference */}
            <div className="absolute -bottom-1 -left-2 text-2xl transform -rotate-12">🌿</div>
            <div className="absolute -bottom-1 -right-2 text-2xl transform rotate-12 scale-x-[-1]">🌿</div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-1">{greeting} 👋</p>
          <h1 className="text-3xl font-bold font-rubik mb-2">מחמצת שלי</h1>
          <p className="text-base text-muted-foreground">הדרך הפשוטה לבצק המושלם.</p>
        </div>

        {/* Feature Icons Row - Exactly like reference */}
        <div 
          className="flex justify-center gap-8 py-4 animate-fade-in"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          {[
            { icon: Clock, label: 'לוח זמנים', path: '/bakes' },
            { icon: ChefHat, label: 'הזנה קלה', path: '/starter' },
            { icon: BookOpen, label: 'מתכונים', path: '/recipes' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/50 dark:to-amber-800/30 border border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <item.icon className="h-6 w-6 text-amber-700 dark:text-amber-400" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Primary CTA Button - Orange gradient like reference */}
        <div 
          className="px-4 animate-fade-in"
          style={{ animationDelay: '150ms', animationFillMode: 'both' }}
        >
          <button
            onClick={() => navigate('/bake/new')}
            className="w-full h-14 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-600 hover:via-orange-600 hover:to-amber-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
          >
            התחל לאפות
          </button>
        </div>

        {/* Starter Status Card */}
        <div 
          className="mx-4 animate-fade-in"
          style={{ animationDelay: '200ms', animationFillMode: 'both' }}
        >
          <button
            onClick={() => navigate('/starter')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-300 text-right group"
          >
            {/* Cute starter jar icon */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center text-2xl flex-shrink-0">
              {starterStatus.emoji}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">המחמצת שלי</h3>
                <span className={cn(
                  "text-xs font-medium",
                  starterStatus.color
                )}>
                  ({starterStatus.label})
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {starterFeeds.length > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    הוזנה לפני {getTimeSinceLastFeed()}
                  </span>
                ) : (
                  'לחצו להוספת הזנה ראשונה'
                )}
              </p>
            </div>
            
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-amber-600 group-hover:-translate-x-1 transition-all flex-shrink-0" />
          </button>
        </div>

        {/* Hot Topics Section - Like reference with icons on right */}
        <div 
          className="px-4 space-y-3 animate-fade-in"
          style={{ animationDelay: '250ms', animationFillMode: 'both' }}
        >
          <h2 className="font-semibold text-lg font-rubik text-center">נושאים חמים</h2>
          
          <div className="space-y-3">
            {hotTopics.map((topic, index) => (
              <button
                key={topic.id}
                onClick={() => navigate(topic.path)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-300 text-right animate-fade-in group"
                style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{topic.title}</h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">{topic.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                </div>
                
                {/* Icon on right side - like reference */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <topic.icon className="h-7 w-7 text-amber-700 dark:text-amber-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section - Like reference with chevrons */}
        <div 
          className="px-4 space-y-3 animate-fade-in"
          style={{ animationDelay: '450ms', animationFillMode: 'both' }}
        >
          <h2 className="font-semibold text-lg font-rubik text-center">שאלות נפוצות</h2>
          
          <div className="space-y-2">
            {faqItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-sm transition-all duration-300 text-right animate-fade-in"
                style={{ animationDelay: `${500 + index * 30}ms`, animationFillMode: 'both' }}
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{item.question}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Tools Row */}
        <div 
          className="px-4 space-y-3 animate-fade-in"
          style={{ animationDelay: '600ms', animationFillMode: 'both' }}
        >
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/tools')}
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              הכל ←
            </button>
            <h2 className="font-semibold font-rubik">כלים מהירים</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Thermometer, label: 'מחשבון', path: '/calculator' },
              { icon: BookOpen, label: 'מדריכים', path: '/guides' },
              { icon: Wheat, label: 'קמחים', path: '/flours' },
              { icon: AlertCircle, label: 'בעיות', path: '/troubleshooting' },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-200/50 dark:border-amber-700/40 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Build Recipe CTA */}
        <div 
          className="px-4 animate-fade-in"
          style={{ animationDelay: '650ms', animationFillMode: 'both' }}
        >
          <button
            onClick={() => navigate('/recipes/new')}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-card/60 backdrop-blur-sm border-2 border-dashed border-amber-300/50 dark:border-amber-700/50 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </div>
            <span className="font-semibold text-amber-700 dark:text-amber-400">בנה מתכון חדש</span>
          </button>
        </div>
      </div>
    </div>
  );
}

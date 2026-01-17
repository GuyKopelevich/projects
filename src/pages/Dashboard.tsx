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
  ChefHat
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconBadge } from '@/components/ui/IconBadge';
import { SectionCard } from '@/components/ui/SectionCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

// Hot topics data
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

// FAQ items
const faqItems = [
  { question: 'למה הבצק שלי דביק מדי?', path: '/troubleshooting' },
  { question: 'איך יודעים שהמחמצת מוכנה?', path: '/guides' },
  { question: 'מה עושים אם הבצק לא תופח?', path: '/troubleshooting' },
];

// Daily tips
const dailyTips = [
  'בעת לישה, המתן 20-30 דקות לפני הוספת המלח (אוטוליזה)',
  'טמפרטורת מים אידיאלית: 25-28°C בקיץ, 30-32°C בחורף',
  'המחמצת בשיא כוחה כשהיא מכפילה את עצמה תוך 4-6 שעות',
  'צורת הבצק חשובה - גלגלו בעדינות לכדור הדוק',
  'לחם מחמצת טעים יותר אחרי 24 שעות מהאפייה',
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [starterFeeds] = useState(() => {
    const saved = localStorage.getItem('starter_feeds');
    return saved ? JSON.parse(saved) : [];
  });

  const [greeting, setGreeting] = useState('');
  const [dailyTip] = useState(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return dailyTips[dayOfYear % dailyTips.length];
  });
  
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
    if (hours < 12) return { status: 'fresh', label: 'טרייה', color: 'text-success', emoji: '🌱' };
    if (hours < 24) return { status: 'ready', label: 'מוכנה', color: 'text-amber-600', emoji: '✨' };
    return { status: 'hungry', label: 'רעבה', color: 'text-destructive', emoji: '🍽️' };
  };

  const starterStatus = getStarterStatus();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative pt-4 pb-2 text-center animate-fade-in"
        style={{ animationDelay: '0ms', animationFillMode: 'both' }}
      >
        {/* Starter jar illustration */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-200/60 to-orange-200/40 dark:from-amber-800/30 dark:to-orange-800/20 rounded-3xl blur-xl" />
          
          {/* Main jar */}
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-900/40 dark:to-orange-900/30 border-2 border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center overflow-hidden shadow-lg">
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-amber-700 dark:bg-amber-600 rounded-t-lg" />
            
            {/* Bubbles */}
            <div className="absolute top-6 left-4 w-2 h-2 bg-amber-300/60 rounded-full animate-bounce-subtle" />
            <div className="absolute top-8 right-5 w-1.5 h-1.5 bg-amber-200/50 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.3s' }} />
            <div className="absolute top-10 left-6 w-1 h-1 bg-amber-300/40 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.6s' }} />
            
            <Wheat className="w-10 h-10 text-amber-600 dark:text-amber-400 mt-2" />
          </div>
          
          {/* Leaves decoration */}
          <div className="absolute -bottom-1 -left-2 text-2xl transform -rotate-12">🌿</div>
          <div className="absolute -bottom-1 -right-2 text-2xl transform rotate-12 scale-x-[-1]">🌿</div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-1">{greeting} 👋</p>
        <h1 className="text-3xl font-bold font-rubik text-primary mb-2">מחמצת שלי</h1>
        <p className="text-base text-muted-foreground">הדרך הפשוטה לבצק המושלם.</p>
      </div>

      {/* Feature Icons Row */}
      <div 
        className="flex justify-center gap-8 py-2 animate-fade-in"
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
            <IconBadge icon={item.icon} size="md" variant="circle" />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Primary CTA Button */}
      <div 
        className="animate-fade-in"
        style={{ animationDelay: '150ms', animationFillMode: 'both' }}
      >
        <PrimaryButton onClick={() => navigate('/bake/new')}>
          התחל לאפות
        </PrimaryButton>
      </div>

      {/* Starter Status Card */}
      <SectionCard 
        variant="flat"
        onClick={() => navigate('/starter')}
        className="animate-fade-in group"
        style={{ animationDelay: '200ms', animationFillMode: 'both' } as React.CSSProperties}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/30 border border-amber-200/60 dark:border-amber-700/40 flex items-center justify-center text-2xl flex-shrink-0">
            {starterStatus.emoji}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-primary">המחמצת שלי</h3>
              <span className={cn("text-xs font-medium", starterStatus.color)}>
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
          
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-accent group-hover:-translate-x-1 transition-all flex-shrink-0" />
        </div>
      </SectionCard>

      {/* Hot Topics Section */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '250ms', animationFillMode: 'both' }}
      >
        <h2 className="section-title text-center">נושאים חמים</h2>
        
        <div className="space-y-3">
          {hotTopics.map((topic, index) => (
            <SectionCard
              key={topic.id}
              variant="flat"
              onClick={() => navigate(topic.path)}
              className="animate-fade-in group"
              style={{ animationDelay: `${300 + index * 50}ms`, animationFillMode: 'both' } as React.CSSProperties}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{topic.title}</h3>
                  <p className="text-xs text-accent font-medium mt-0.5">{topic.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-1">{topic.description}</p>
                </div>
                
                <IconBadge icon={topic.icon} size="md" className="group-hover:scale-105 transition-transform" />
              </div>
            </SectionCard>
          ))}
        </div>
      </div>

      {/* Daily Tip Card */}
      <SectionCard 
        variant="compact"
        className="animate-fade-in"
        style={{ animationDelay: '450ms', animationFillMode: 'both' } as React.CSSProperties}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <ChefHat className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-primary text-sm mb-1">טיפ היום</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dailyTip}</p>
          </div>
        </div>
      </SectionCard>

      {/* FAQ Section */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '500ms', animationFillMode: 'both' }}
      >
        <h2 className="section-title text-center">שאלות נפוצות</h2>
        
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="faq-item w-full animate-fade-in"
              style={{ animationDelay: `${550 + index * 30}ms`, animationFillMode: 'both' }}
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-primary">{item.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tools Row */}
      <div 
        className="space-y-3 animate-fade-in"
        style={{ animationDelay: '650ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/tools')}
            className="text-xs text-accent hover:underline font-medium"
          >
            הכל ←
          </button>
          <h2 className="section-title mb-0">כלים מהירים</h2>
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
              className="flex flex-col items-center gap-2 p-3 rounded-2xl section-card-flat hover:shadow-md transition-all"
            >
              <IconBadge icon={item.icon} size="sm" variant="circle" />
              <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Build Recipe CTA */}
      <button
        onClick={() => navigate('/recipes/new')}
        className="btn-dashed w-full flex items-center justify-center gap-3 animate-fade-in group"
        style={{ animationDelay: '700ms', animationFillMode: 'both' }}
      >
        <IconBadge icon={Plus} size="sm" variant="circle" className="group-hover:scale-105" />
        <span className="font-semibold text-amber-700 dark:text-amber-400">בנה מתכון חדש</span>
      </button>
    </div>
  );
}
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
  ChefHat,
  Sparkles
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
    if (hours < 24) return { status: 'ready', label: 'מוכנה', color: 'text-primary', emoji: '✨' };
    return { status: 'hungry', label: 'רעבה', color: 'text-destructive', emoji: '🍽️' };
  };

  const starterStatus = getStarterStatus();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative pt-6 pb-4 text-center animate-fade-in"
        style={{ animationDelay: '0ms', animationFillMode: 'both' }}
      >
        {/* Glowing jar illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Outer glow */}
          <div className="absolute inset-0 rounded-3xl animate-glow" />
          
          {/* Main jar */}
          <div className="relative w-full h-full rounded-3xl flex items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, hsl(25 25% 18%) 0%, hsl(25 20% 12%) 100%)',
              border: '2px solid hsl(42 60% 45% / 0.3)',
              boxShadow: '0 0 40px hsl(42 85% 55% / 0.2), inset 0 2px 0 hsl(45 50% 60% / 0.1)'
            }}
          >
            {/* Jar lid */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 rounded-t-lg"
              style={{ background: 'linear-gradient(180deg, hsl(42 70% 45%) 0%, hsl(38 65% 35%) 100%)' }}
            />
            
            {/* Bubbles */}
            <div className="absolute top-8 left-5 w-2.5 h-2.5 bg-primary/40 rounded-full animate-bounce-subtle" />
            <div className="absolute top-10 right-6 w-2 h-2 bg-primary/30 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.4s' }} />
            <div className="absolute top-12 left-7 w-1.5 h-1.5 bg-primary/25 rounded-full animate-bounce-subtle" style={{ animationDelay: '0.8s' }} />
            
            <Wheat className="w-12 h-12 text-primary mt-3" />
          </div>
          
          {/* Sparkles */}
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse-slow" />
          <Sparkles className="absolute -bottom-1 -left-3 w-5 h-5 text-primary/60 animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">{greeting} 👋</p>
        <h1 className="text-3xl font-bold font-rubik text-gold mb-2">מחמצת שלי</h1>
        <p className="text-base text-muted-foreground">הדרך הפשוטה לבצק המושלם.</p>
      </div>

      {/* Feature Icons Row */}
      <div 
        className="flex justify-center gap-10 py-3 animate-fade-in"
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
            className="flex flex-col items-center gap-3 group"
          >
            <IconBadge icon={item.icon} size="md" variant="circle" glow />
            <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">{item.label}</span>
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
        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{
              background: 'linear-gradient(145deg, hsl(25 25% 18%) 0%, hsl(25 20% 14%) 100%)',
              border: '1px solid hsl(42 60% 45% / 0.2)'
            }}
          >
            {starterStatus.emoji}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">המחמצת שלי</h3>
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
          
          <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all flex-shrink-0" />
        </div>
      </SectionCard>

      {/* Hot Topics Section */}
      <div 
        className="space-y-4 animate-fade-in"
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
              style={{ animationDelay: `${300 + index * 60}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{topic.title}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">{topic.subtitle}</p>
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
        style={{ animationDelay: '500ms', animationFillMode: 'both' }}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'hsl(42 85% 55% / 0.15)',
              boxShadow: '0 0 15px hsl(42 85% 55% / 0.1)'
            }}
          >
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary text-sm mb-1">טיפ היום</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{dailyTip}</p>
          </div>
        </div>
      </SectionCard>

      {/* FAQ Section */}
      <div 
        className="space-y-4 animate-fade-in"
        style={{ animationDelay: '550ms', animationFillMode: 'both' }}
      >
        <h2 className="section-title text-center">שאלות נפוצות</h2>
        
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="faq-item w-full animate-fade-in"
              style={{ animationDelay: `${600 + index * 40}ms`, animationFillMode: 'both' }}
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{item.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tools Row */}
      <div 
        className="space-y-4 animate-fade-in"
        style={{ animationDelay: '700ms', animationFillMode: 'both' }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/tools')}
            className="text-xs text-primary hover:underline font-medium"
          >
            הכל ←
          </button>
          <h2 className="section-title mb-0">כלים מהירים</h2>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Thermometer, label: 'מחשבון', path: '/calculator' },
            { icon: BookOpen, label: 'מדריכים', path: '/guides' },
            { icon: Wheat, label: 'קמחים', path: '/flours' },
            { icon: AlertCircle, label: 'בעיות', path: '/troubleshooting' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl section-card-flat hover:shadow-glow transition-all"
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
        style={{ animationDelay: '750ms', animationFillMode: 'both' }}
      >
        <IconBadge icon={Plus} size="sm" variant="circle" className="group-hover:scale-105" />
        <span className="font-semibold text-primary">בנה מתכון חדש</span>
      </button>
    </div>
  );
}
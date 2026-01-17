import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  BookOpen, 
  Wheat,
  Scissors,
  AlertTriangle,
  Cookie,
  Utensils,
  ChevronLeft,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionCard } from '@/components/ui/SectionCard';
import { PageHeader } from '@/components/ui/PageHeader';

interface GuideCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

const guides: GuideCard[] = [
  {
    id: 'flours',
    title: 'מדריך קמחים',
    description: 'כל קמחי שטיבל עם אחוזי חלבון, הידרציה וטיפים',
    icon: <Wheat className="h-6 w-6" />,
    path: '/flours',
    badge: '14 סוגים'
  },
  {
    id: 'shaping',
    title: 'עיצוב וצורות',
    description: 'טכניקות עיצוב: בול, באטאר, באגט, חלה ופוקצ\'ה',
    icon: <Scissors className="h-6 w-6" />,
    path: '/guides/shaping'
  },
  {
    id: 'vessels',
    title: 'כלי אפייה',
    description: 'סיר ברזל, אבן אפייה, קלוש ותבניות',
    icon: <Utensils className="h-6 w-6" />,
    path: '/guides/vessels'
  },
  {
    id: 'scoring',
    title: 'חריצה וסקורינג',
    description: 'דפוסי חיתוך: צלב, עלה, שיבולת וספירלה',
    icon: <Sparkles className="h-6 w-6" />,
    path: '/guides/scoring'
  },
  {
    id: 'addins',
    title: 'תוספות ללחם',
    description: 'גרעינים, אגוזים, גבינות, עשבי תיבול ועוד',
    icon: <Cookie className="h-6 w-6" />,
    path: '/guides/addins',
    badge: '25+ תוספות'
  },
  {
    id: 'troubleshooting',
    title: 'פתרון בעיות',
    description: '10 בעיות נפוצות עם סימפטומים, גורמים ופתרונות',
    icon: <AlertTriangle className="h-6 w-6" />,
    path: '/troubleshooting'
  },
];

export default function KnowledgeHub() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        icon={<GraduationCap className="h-6 w-6" />}
        title="מרכז הידע"
        subtitle="כל המדריכים והטיפים במקום אחד"
        showBack
      />

      {/* Hero Card */}
      <div 
        className="relative overflow-hidden rounded-2xl p-6 animate-fade-in"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.1), hsl(var(--secondary) / 0.05))',
          border: '1px solid hsl(var(--primary) / 0.3)',
          boxShadow: '0 0 40px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(var(--primary) / 0.2)'
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">למד ותתמחה</span>
          </div>
          <h2 className="text-xl font-bold font-rubik mb-2 text-foreground">הכל על אפיית לחם מחמצת</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            מדריכים מקיפים לכל שלב בתהליך - מבחירת הקמח ועד חריצת הלחם
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-3">
        {guides.map((guide, index) => (
          <SectionCard
            key={guide.id}
            variant="compact"
            onClick={() => navigate(guide.path)}
            className={cn(
              "group cursor-pointer animate-fade-in",
              "hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-primary/15 text-primary group-hover:bg-primary/25 group-hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
                {guide.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{guide.title}</h3>
                  {guide.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                      {guide.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {guide.description}
                </p>
              </div>
              
              {/* Arrow */}
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all duration-300" />
            </div>
          </SectionCard>
        ))}
      </div>

      {/* Bottom tip */}
      <div 
        className="rounded-xl p-4 text-center animate-fade-in"
        style={{
          background: 'hsl(var(--muted) / 0.3)',
          border: '1px solid hsl(var(--border))',
          animationDelay: '300ms'
        }}
      >
        <p className="text-sm text-muted-foreground">
          💡 <span className="text-primary font-medium">טיפ:</span> התחל עם מדריך הקמחים ומדריך העיצוב לבסיס טוב
        </p>
      </div>
    </div>
  );
}

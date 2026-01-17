import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

interface GuideCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  bgColor: string;
  badge?: string;
}

const guides: GuideCard[] = [
  {
    id: 'flours',
    title: 'מדריך קמחים',
    description: 'כל קמחי שטיבל עם אחוזי חלבון, הידרציה וטיפים',
    icon: <Wheat className="h-6 w-6" />,
    path: '/flours',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    badge: '14 סוגים'
  },
  {
    id: 'shaping',
    title: 'עיצוב וצורות',
    description: 'טכניקות עיצוב: בול, באטאר, באגט, חלה ופוקצ\'ה',
    icon: <Scissors className="h-6 w-6" />,
    path: '/guides/shaping',
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30'
  },
  {
    id: 'vessels',
    title: 'כלי אפייה',
    description: 'סיר ברזל, אבן אפייה, קלוש ותבניות',
    icon: <Utensils className="h-6 w-6" />,
    path: '/guides/vessels',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  },
  {
    id: 'scoring',
    title: 'חריצה וסקורינג',
    description: 'דפוסי חיתוך: צלב, עלה, שיבולת וספירלה',
    icon: <Sparkles className="h-6 w-6" />,
    path: '/guides/scoring',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30'
  },
  {
    id: 'addins',
    title: 'תוספות ללחם',
    description: 'גרעינים, אגוזים, גבינות, עשבי תיבול ועוד',
    icon: <Cookie className="h-6 w-6" />,
    path: '/guides/addins',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    badge: '25+ תוספות'
  },
  {
    id: 'troubleshooting',
    title: 'פתרון בעיות',
    description: '10 בעיות נפוצות עם סימפטומים, גורמים ופתרונות',
    icon: <AlertTriangle className="h-6 w-6" />,
    path: '/troubleshooting',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  },
];

export default function KnowledgeHub() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-rubik flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            מרכז הידע
          </h1>
          <p className="text-sm text-muted-foreground">כל המדריכים והטיפים במקום אחד</p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-6 border border-primary/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">למד ותתמחה</span>
          </div>
          <h2 className="text-lg font-semibold mb-2">הכל על אפיית לחם מחמצת</h2>
          <p className="text-sm text-muted-foreground">
            מדריכים מקיפים לכל שלב בתהליך - מבחירת הקמח ועד חריצת הלחם
          </p>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="space-y-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => navigate(guide.path)}
            className="group relative flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
          >
            {/* Icon */}
            <div className={cn(
              "flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
              guide.bgColor,
              guide.color
            )}>
              {guide.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{guide.title}</h3>
                {guide.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                    {guide.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {guide.description}
              </p>
            </div>
            
            {/* Arrow */}
            <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
          </div>
        ))}
      </div>

      {/* Bottom tip */}
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 טיפ: התחל עם מדריך הקמחים ומדריך העיצוב לבסיס טוב
        </p>
      </div>
    </div>
  );
}

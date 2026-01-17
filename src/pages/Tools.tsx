import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Timer,
  Calculator,
  Thermometer,
  Droplets,
  Scale,
  Cloud,
  CheckSquare,
  ChevronDown
} from 'lucide-react';
import { BakingTimer } from '@/components/BakingTimer';
import { HydrationVisualizer } from '@/components/HydrationVisualizer';
import { FermentationCalculator } from '@/components/FermentationCalculator';
import { BreadWeightCalculator } from '@/components/BreadWeightCalculator';
import { BakingChecklist } from '@/components/BakingChecklist';
import { WeatherBakingTips } from '@/components/WeatherBakingTips';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface ToolSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  component: React.ReactNode;
}

const tools: ToolSection[] = [
  {
    id: 'timer',
    title: 'טיימר אפייה',
    description: 'טיימרים מוגדרים מראש לכל שלב',
    icon: <Timer className="h-5 w-5" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    component: <BakingTimer />
  },
  {
    id: 'fermentation',
    title: 'מחשבון תסיסה',
    description: 'חישוב זמני תפיחה לפי טמפרטורה',
    icon: <Thermometer className="h-5 w-5" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    component: <FermentationCalculator />
  },
  {
    id: 'hydration',
    title: 'ויזואליזציית הידרציה',
    description: 'הבנה ויזואלית של רמות הידרציה',
    icon: <Droplets className="h-5 w-5" />,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    component: <HydrationVisualizer />
  },
  {
    id: 'weight',
    title: 'מחשבון משקל לחם',
    description: 'חישוב משקל סופי וכמויות',
    icon: <Scale className="h-5 w-5" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    component: <BreadWeightCalculator />
  },
  {
    id: 'weather',
    title: 'טיפים לפי מזג אוויר',
    description: 'התאמות לטמפרטורה ולחות',
    icon: <Cloud className="h-5 w-5" />,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    component: <WeatherBakingTips />
  },
  {
    id: 'checklist',
    title: 'צ\'קליסט אפייה',
    description: 'רשימת משימות לתהליך האפייה',
    icon: <CheckSquare className="h-5 w-5" />,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    component: <BakingChecklist />
  },
];

export default function Tools() {
  const navigate = useNavigate();
  const [openTool, setOpenTool] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-rubik flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            כלים ומחשבונים
          </h1>
          <p className="text-sm text-muted-foreground">כלים שימושיים לתהליך האפייה</p>
        </div>
      </div>

      {/* Tools List */}
      <div className="space-y-3">
        {tools.map((tool) => (
          <Collapsible
            key={tool.id}
            open={openTool === tool.id}
            onOpenChange={(open) => setOpenTool(open ? tool.id : null)}
          >
            <CollapsibleTrigger asChild>
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                {/* Icon */}
                <div className={cn(
                  "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                  tool.bgColor,
                  tool.color
                )}>
                  {tool.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                
                {/* Arrow */}
                <ChevronDown className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform",
                  openTool === tool.id && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-3 animate-fade-in">
              <div className="rounded-xl border border-border bg-card/50 p-4">
                {tool.component}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Bottom tip */}
      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          💡 לחץ על כל כלי כדי לפתוח אותו
        </p>
      </div>
    </div>
  );
}

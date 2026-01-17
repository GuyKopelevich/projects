import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  ChevronLeft,
  Flame,
  Star,
  Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { 
  shapingStyles, 
  bakingVessels, 
  scoringPatterns,
  breadAddIns,
  addInCategories,
  type ShapingStyle,
  type BakingVessel,
} from '@/data/bread-extras';

// Shaping Guide Component
function ShapingGuide() {
  const [selectedShaping, setSelectedShaping] = useState<ShapingStyle | null>(null);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'מתקדם';
      default: return difficulty;
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
          <p className="text-sm text-violet-700 dark:text-violet-300">
            <strong>עיצוב הלחם</strong> הוא השלב שיוצר מתח בבצק ונותן לו את צורתו הסופית. כל סגנון מתאים לסוג אחר של לחם.
          </p>
        </div>

        <div className="space-y-3">
          {shapingStyles.map((style) => (
            <div
              key={style.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedShaping(style)}
            >
              <div className="text-4xl">{style.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{style.name}</h3>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", getDifficultyColor(style.difficulty))}>
                    {getDifficultyLabel(style.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{style.description}</p>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedShaping} onOpenChange={() => setSelectedShaping(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedShaping && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">{selectedShaping.icon}</span>
                  {selectedShaping.name}
                </DialogTitle>
                <DialogDescription>{selectedShaping.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-sm">📋</span>
                    שלבי העיצוב
                  </h4>
                  <ol className="space-y-2">
                    {selectedShaping.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <span className="w-6 h-6 rounded-full bg-violet-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm">💡</span>
                    טיפים
                  </h4>
                  <ul className="space-y-2">
                    {selectedShaping.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg">
                        <span className="text-amber-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="font-medium mb-1">🧺 כלי התפחה מומלץ</h4>
                  <p className="text-sm text-muted-foreground">{selectedShaping.proofingVessel}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Vessels Guide Component
function VesselsGuide() {
  const [selectedVessel, setSelectedVessel] = useState<BakingVessel | null>(null);

  return (
    <>
      <div className="space-y-4">
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-300">
            <strong>כלי האפייה</strong> משפיע על הקרום, הצורה והאדים. הבחירה הנכונה היא קריטית לתוצאה.
          </p>
        </div>

        <div className="space-y-3">
          {bakingVessels.map((vessel) => (
            <div
              key={vessel.id}
              className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-orange-300 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedVessel(vessel)}
            >
              <div className="text-4xl">{vessel.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{vessel.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <Flame className="h-3 w-3 text-orange-500" />
                  <span>{vessel.tempRange.min}-{vessel.tempRange.max}°C</span>
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedVessel} onOpenChange={() => setSelectedVessel(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedVessel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <span className="text-3xl">{selectedVessel.icon}</span>
                  {selectedVessel.name}
                </DialogTitle>
                <DialogDescription>{selectedVessel.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-5 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-center">
                    <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                    <div className="font-bold text-lg">
                      {selectedVessel.tempRange.min}-{selectedVessel.tempRange.max}°C
                    </div>
                    <div className="text-xs text-muted-foreground">טמפרטורה מומלצת</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                    <span className="text-2xl block mb-1">💨</span>
                    <div className="text-xs text-muted-foreground">
                      {selectedVessel.steamMethod}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">💡 טיפים</h4>
                  <ul className="space-y-2">
                    {selectedVessel.tips.map((tip, i) => (
                      <li key={i} className="text-sm flex gap-2 p-2 bg-muted/50 rounded-lg">
                        <span className="text-orange-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">🍞 מתאים במיוחד ל:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVessel.bestFor.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Scoring Guide Component
function ScoringGuide() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'קל';
      case 'medium': return 'בינוני';
      case 'hard': return 'מתקדם';
      default: return difficulty;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 border border-pink-200 dark:border-pink-800">
        <p className="text-sm text-pink-700 dark:text-pink-300">
          <strong>חריצה (סקורינג)</strong> מאפשרת ללחם להתרחב בצורה מבוקרת בתנור ויוצרת את ה"אוזן" המאפיינת.
        </p>
      </div>

      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <h4 className="font-semibold flex items-center gap-2">
          <Info className="h-4 w-4" />
          טיפים לחריצה מוצלחת
        </h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• השתמשו בלהב גילוח חד (lame)</li>
          <li>• חתכו בזווית של 30-45 מעלות</li>
          <li>• עומק החיתוך: 0.5-1 ס"מ</li>
          <li>• עבדו מהר - הבצק לא יבש</li>
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {scoringPatterns.map((pattern) => (
          <div key={pattern.id} className="p-4 rounded-xl bg-card border border-border text-center hover:border-pink-300 transition-colors">
            <div className="text-4xl mb-3">{pattern.icon}</div>
            <h4 className="font-semibold">{pattern.name}</h4>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full inline-block mt-2",
              getDifficultyColor(pattern.difficulty)
            )}>
              {getDifficultyLabel(pattern.difficulty)}
            </span>
            <p className="text-xs text-muted-foreground mt-2">
              {pattern.description}
            </p>
            <div className="mt-2 text-xs text-muted-foreground">
              מתאים ל: {pattern.forShape.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add-ins Guide Component
function AddInsGuide() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAddIns = selectedCategory === 'all' 
    ? breadAddIns 
    : breadAddIns.filter(a => a.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-700 dark:text-green-300">
          <strong>תוספות ללחם</strong> מעניקות טעם, מרקם וערך תזונתי. חשוב להוסיף בשלב הנכון ובכמות המתאימה.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors font-medium",
            selectedCategory === 'all'
              ? "bg-green-500 text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          הכל ({breadAddIns.length})
        </button>
        {Object.entries(addInCategories).map(([key, label]) => {
          const count = breadAddIns.filter(a => a.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                selectedCategory === key
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredAddIns.map((addIn) => (
          <div key={addIn.id} className="p-4 rounded-xl bg-card border border-border hover:border-green-300 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{addIn.icon}</span>
              <h4 className="font-semibold">{addIn.name}</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">כמות מומלצת:</span>
                <span className="font-medium">{addIn.percentOfFlour}%</span>
              </div>
              {addIn.hydrationAdjust !== 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">התאמת הידרציה:</span>
                  <span className={cn(
                    "font-medium",
                    addIn.hydrationAdjust > 0 ? "text-blue-500" : "text-orange-500"
                  )}>
                    {addIn.hydrationAdjust > 0 ? '+' : ''}{addIn.hydrationAdjust}%
                  </span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {addIn.tips}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Guide Detail Component
export default function GuideDetail() {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();

  const guideConfig: Record<string, { title: string; component: React.ReactNode }> = {
    shaping: { title: 'עיצוב וצורות', component: <ShapingGuide /> },
    vessels: { title: 'כלי אפייה', component: <VesselsGuide /> },
    scoring: { title: 'חריצה וסקורינג', component: <ScoringGuide /> },
    addins: { title: 'תוספות ללחם', component: <AddInsGuide /> },
  };

  const config = guideConfig[type || ''];

  if (!config) {
    navigate('/guides');
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/guides')}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold font-rubik">{config.title}</h1>
      </div>

      {config.component}
    </div>
  );
}

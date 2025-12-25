import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Utensils, 
  Scissors, 
  Cookie,
  ChevronLeft,
  Flame,
  Star
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
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
  type BreadAddIn
} from '@/data/bread-extras';

export default function BreadGuide() {
  const navigate = useNavigate();
  const [selectedShaping, setSelectedShaping] = useState<ShapingStyle | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<BakingVessel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredAddIns = selectedCategory === 'all' 
    ? breadAddIns 
    : breadAddIns.filter(a => a.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-starter/20 text-starter';
      case 'medium': return 'bg-honey/20 text-honey';
      case 'hard': return 'bg-crust/20 text-crust';
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <h1 className="page-header mb-0">מדריך לחם</h1>
      </div>

      <Tabs defaultValue="shaping" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shaping" className="text-xs px-2">
            <Scissors className="h-4 w-4 sm:ml-1" />
            <span className="hidden sm:inline">עיצוב</span>
          </TabsTrigger>
          <TabsTrigger value="vessels" className="text-xs px-2">
            <Utensils className="h-4 w-4 sm:ml-1" />
            <span className="hidden sm:inline">כלים</span>
          </TabsTrigger>
          <TabsTrigger value="addins" className="text-xs px-2">
            <Cookie className="h-4 w-4 sm:ml-1" />
            <span className="hidden sm:inline">תוספות</span>
          </TabsTrigger>
          <TabsTrigger value="scoring" className="text-xs px-2">
            <Star className="h-4 w-4 sm:ml-1" />
            <span className="hidden sm:inline">חיתוך</span>
          </TabsTrigger>
        </TabsList>

        {/* Shaping Styles */}
        <TabsContent value="shaping" className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            בחר סגנון עיצוב ללחם שלך
          </p>
          {shapingStyles.map((style) => (
            <div
              key={style.id}
              className="bread-card cursor-pointer"
              onClick={() => setSelectedShaping(style)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{style.icon}</div>
                  <div>
                    <h3 className="font-semibold">{style.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {style.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getDifficultyColor(style.difficulty)
                  )}>
                    {getDifficultyLabel(style.difficulty)}
                  </span>
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Baking Vessels */}
        <TabsContent value="vessels" className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            כלי האפייה המתאים משפיע על התוצאה הסופית
          </p>
          {bakingVessels.map((vessel) => (
            <div
              key={vessel.id}
              className="bread-card cursor-pointer"
              onClick={() => setSelectedVessel(vessel)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{vessel.icon}</div>
                  <div>
                    <h3 className="font-semibold">{vessel.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flame className="h-3 w-3" />
                      <span>{vessel.tempRange.min}-{vessel.tempRange.max}°C</span>
                    </div>
                  </div>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Add-ins */}
        <TabsContent value="addins" className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            תוספות שאפשר להוסיף ללחם
          </p>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors",
                selectedCategory === 'all'
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              הכל
            </button>
            {Object.entries(addInCategories).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors",
                  selectedCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredAddIns.map((addIn) => (
              <div key={addIn.id} className="bread-card-flat">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{addIn.icon}</span>
                  <h4 className="font-medium">{addIn.name}</h4>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>{addIn.percentOfFlour}% מהקמח</div>
                  {addIn.hydrationAdjust !== 0 && (
                    <div className="text-timer">
                      {addIn.hydrationAdjust > 0 ? '+' : ''}{addIn.hydrationAdjust}% הידרציה
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                  {addIn.tips}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Scoring Patterns */}
        <TabsContent value="scoring" className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            דפוסי חיתוך (סקורינג) לפני האפייה
          </p>
          <div className="grid grid-cols-2 gap-3">
            {scoringPatterns.map((pattern) => (
              <div key={pattern.id} className="bread-card-flat text-center">
                <div className="text-4xl mb-2">{pattern.icon}</div>
                <h4 className="font-medium">{pattern.name}</h4>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full inline-block mt-1",
                  getDifficultyColor(pattern.difficulty)
                )}>
                  {getDifficultyLabel(pattern.difficulty)}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {pattern.description}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Shaping Detail Dialog */}
      <Dialog open={!!selectedShaping} onOpenChange={() => setSelectedShaping(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedShaping && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedShaping.icon}</span>
                  {selectedShaping.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-muted-foreground">{selectedShaping.description}</p>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">שלבי העיצוב:</h4>
                  <ol className="space-y-2">
                    {selectedShaping.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {i + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">טיפים:</h4>
                  <ul className="space-y-1">
                    {selectedShaping.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bread-card-flat">
                  <h4 className="font-medium mb-1">כלי התפחה מומלץ:</h4>
                  <p className="text-sm text-muted-foreground">{selectedShaping.proofingVessel}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Vessel Detail Dialog */}
      <Dialog open={!!selectedVessel} onOpenChange={() => setSelectedVessel(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedVessel && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-3xl">{selectedVessel.icon}</span>
                  {selectedVessel.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-muted-foreground">{selectedVessel.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bread-card-flat text-center">
                    <Flame className="h-5 w-5 mx-auto mb-1 text-crust" />
                    <div className="font-semibold">
                      {selectedVessel.tempRange.min}-{selectedVessel.tempRange.max}°C
                    </div>
                    <div className="text-xs text-muted-foreground">טמפרטורה</div>
                  </div>
                  <div className="bread-card-flat text-center">
                    <span className="text-xl">💨</span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedVessel.steamMethod}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">טיפים:</h4>
                  <ul className="space-y-1">
                    {selectedVessel.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">מתאים במיוחד ל:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVessel.bestFor.map((item, i) => (
                      <span key={i} className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-sm">
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
    </div>
  );
}

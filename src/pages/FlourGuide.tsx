import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wheat, 
  Search, 
  Filter,
  ChevronLeft,
  Droplets,
  Info,
  Sparkles,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  stybelFlours, 
  StybelFlour,
  glutenLevelLabels,
  glutenLevelColors,
  categoryLabels
} from '@/data/stybel-flours';

export default function FlourGuide() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<StybelFlour['category'] | 'all'>('all');
  const [selectedFlour, setSelectedFlour] = useState<StybelFlour | null>(null);

  const categories: { value: StybelFlour['category'] | 'all'; label: string }[] = [
    { value: 'all', label: 'הכל' },
    { value: 'white', label: 'לבן' },
    { value: 'whole', label: 'מלא' },
    { value: 'rye', label: 'שיפון' },
    { value: 'spelt', label: 'כוסמין' },
    { value: 'semolina', label: 'סמולינה' },
  ];

  const filteredFlours = stybelFlours.filter(flour => {
    const matchesSearch = flour.hebrewName.includes(search) || 
                         flour.code.includes(search) ||
                         flour.description.includes(search);
    const matchesCategory = selectedCategory === 'all' || flour.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getGlutenBadgeVariant = (level: StybelFlour['glutenLevel']) => {
    switch(level) {
      case 'very-high': return 'default';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'destructive';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="page-header mb-0 flex items-center gap-2">
            <Wheat className="h-6 w-6 text-wheat" />
            מדריך קמחי שטיבל
          </h1>
          <p className="text-sm text-muted-foreground">מידע מפורט על כל סוגי הקמחים</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="חפש קמח..."
          className="pr-10"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.value)}
            className="whitespace-nowrap"
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Flour Cards */}
      <div className="space-y-3">
        {filteredFlours.map(flour => (
          <div
            key={flour.id}
            onClick={() => setSelectedFlour(flour)}
            className="bread-card cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{flour.hebrewName}</h3>
                  <Badge variant="outline" className="text-xs">
                    {flour.code}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {flour.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getGlutenBadgeVariant(flour.glutenLevel)}>
                    גלוטן {glutenLevelLabels[flour.glutenLevel]}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span className="font-rubik">{flour.proteinPercent}%</span>
                    חלבון
                  </Badge>
                  {flour.hydrationAdjustment !== 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Droplets className="h-3 w-3" />
                      {flour.hydrationAdjustment > 0 ? '+' : ''}{flour.hydrationAdjustment}%
                    </Badge>
                  )}
                </div>
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground mt-1" />
            </div>
          </div>
        ))}
      </div>

      {filteredFlours.length === 0 && (
        <div className="text-center py-12">
          <Wheat className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">לא נמצאו קמחים מתאימים</p>
        </div>
      )}

      {/* Flour Detail Dialog */}
      <Dialog open={!!selectedFlour} onOpenChange={() => setSelectedFlour(null)}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          {selectedFlour && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wheat className="h-5 w-5 text-wheat" />
                  {selectedFlour.hebrewName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Code & Category */}
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedFlour.code}</Badge>
                  <Badge variant="outline">{categoryLabels[selectedFlour.category]}</Badge>
                </div>

                {/* Description */}
                <p className="text-muted-foreground">{selectedFlour.description}</p>

                {/* Key Stats */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-rubik text-primary">
                      {selectedFlour.proteinPercent}%
                    </div>
                    <div className="text-xs text-muted-foreground">חלבון</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${glutenLevelColors[selectedFlour.glutenLevel]}`}>
                      {glutenLevelLabels[selectedFlour.glutenLevel]}
                    </div>
                    <div className="text-xs text-muted-foreground">גלוטן</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold font-rubik text-timer">
                      {selectedFlour.hydrationAdjustment > 0 ? '+' : ''}{selectedFlour.hydrationAdjustment}%
                    </div>
                    <div className="text-xs text-muted-foreground">הידרציה</div>
                  </div>
                </div>

                {/* Best For */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4 text-honey" />
                    מתאים במיוחד ל:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFlour.bestFor.map((use, i) => (
                      <Badge key={i} variant="outline">{use}</Badge>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-starter" />
                    טיפים:
                  </h4>
                  <ul className="space-y-2">
                    {selectedFlour.tips.map((tip, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    ערכים תזונתיים (ל-100 גרם):
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>אנרגיה</span>
                      <span className="font-rubik">{selectedFlour.nutritionPer100g.energy} קק"ל</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>חלבון</span>
                      <span className="font-rubik">{selectedFlour.nutritionPer100g.protein}g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>פחמימות</span>
                      <span className="font-rubik">{selectedFlour.nutritionPer100g.carbs}g</span>
                    </div>
                    <div className="flex justify-between p-2 bg-muted/30 rounded">
                      <span>שומן</span>
                      <span className="font-rubik">{selectedFlour.nutritionPer100g.fat}g</span>
                    </div>
                    {selectedFlour.nutritionPer100g.fiber && (
                      <div className="flex justify-between p-2 bg-muted/30 rounded col-span-2">
                        <span>סיבים תזונתיים</span>
                        <span className="font-rubik">{selectedFlour.nutritionPer100g.fiber}g</span>
                      </div>
                    )}
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

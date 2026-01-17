import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/PageHeader';
import { SectionCard } from '@/components/ui/SectionCard';
import { Badge } from '@/components/ui/badge';
import { 
  Droplets, 
  Scale, 
  Wheat, 
  Sparkles,
  Plus,
  Image as ImageIcon,
  X,
  CircleDot,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  flour_total_g: number;
  water_g: number;
  starter_g: number;
  salt_g: number;
  flour_breakdown?: Record<string, number>;
  notes?: string;
  cover_image_url?: string;
  vessel?: string;
  shaping?: string;
  scoring?: string;
  addIns?: string[];
  is_sample?: boolean;
  created_at: string;
}

interface RecipeImage {
  id: string;
  url: string;
  caption?: string;
}

const SAMPLE_RECIPES: Record<string, Recipe> = {
  'sample-1': {
    id: 'sample-1',
    name: 'לחם לבן קלאסי',
    description: 'לחם מחמצת בסיסי עם קרום פריך ופנים אוורירי',
    flour_total_g: 500,
    water_g: 350,
    starter_g: 100,
    salt_g: 10,
    flour_breakdown: { 'לבן 70': 100 },
    notes: 'מתכון בסיסי נהדר להתחלה',
    is_sample: true,
    created_at: new Date().toISOString(),
  },
  'sample-2': {
    id: 'sample-2',
    name: 'לחם סמולינה',
    description: 'לחם עם טקסטורה מיוחדת בזכות הסמולינה',
    flour_total_g: 500,
    water_g: 325,
    starter_g: 100,
    salt_g: 10,
    flour_breakdown: { 'לבן 70': 70, 'סמולינה': 30 },
    notes: 'הסמולינה נותנת טקסטורה מיוחדת',
    is_sample: true,
    created_at: new Date().toISOString(),
  },
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [images, setImages] = useState<RecipeImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    // Check sample recipes first
    if (SAMPLE_RECIPES[id]) {
      setRecipe(SAMPLE_RECIPES[id]);
      return;
    }

    // Check user recipes
    const stored = localStorage.getItem('recipes');
    const userRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
    const found = userRecipes.find(r => r.id === id);
    if (found) {
      setRecipe(found);
    }

    // Load images
    const storedImages = localStorage.getItem(`recipe_images_${id}`);
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, [id]);

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">המתכון לא נמצא</p>
        <Button onClick={() => navigate('/recipes')} className="mt-4">
          חזרה למתכונים
        </Button>
      </div>
    );
  }

  const hydration = ((recipe.water_g / recipe.flour_total_g) * 100).toFixed(1);
  const starterPercent = ((recipe.starter_g / recipe.flour_total_g) * 100).toFixed(1);
  const saltPercent = ((recipe.salt_g / recipe.flour_total_g) * 100).toFixed(1);
  const totalDough = recipe.flour_total_g + recipe.water_g + recipe.starter_g + recipe.salt_g;

  const allImages = recipe.cover_image_url 
    ? [{ id: 'cover', url: recipe.cover_image_url }, ...images]
    : images;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <PageHeader title={recipe.name} showBack backPath="/recipes" />

      {/* Cover Image */}
      {recipe.cover_image_url && (
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <img 
            src={recipe.cover_image_url} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {recipe.is_sample && (
            <Badge className="absolute top-3 right-3 bg-primary/80">
              מתכון לדוגמה
            </Badge>
          )}
        </div>
      )}

      {/* Description */}
      {recipe.description && (
        <p className="text-muted-foreground">{recipe.description}</p>
      )}

      {/* Baker's Percentages */}
      <SectionCard className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          אחוזי אופה
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center gap-1 text-timer">
              <Droplets className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-rubik mt-1">{hydration}%</div>
            <div className="text-xs text-muted-foreground">הידרציה</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center gap-1 text-starter">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-rubik mt-1">{starterPercent}%</div>
            <div className="text-xs text-muted-foreground">מחמצת</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center gap-1 text-crust">
              <CircleDot className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-rubik mt-1">{saltPercent}%</div>
            <div className="text-xs text-muted-foreground">מלח</div>
          </div>
          
          <div className="text-center p-3 rounded-xl bg-background/50">
            <div className="flex items-center justify-center gap-1 text-wheat">
              <Wheat className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold font-rubik mt-1">{totalDough}g</div>
            <div className="text-xs text-muted-foreground">משקל בצק</div>
          </div>
        </div>
      </SectionCard>

      {/* Ingredients */}
      <SectionCard variant="compact">
        <h3 className="font-semibold mb-3">מרכיבים</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">קמח</span>
            <span className="font-medium">{recipe.flour_total_g}g</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">מים</span>
            <span className="font-medium">{recipe.water_g}g</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-muted-foreground">מחמצת</span>
            <span className="font-medium">{recipe.starter_g}g</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">מלח</span>
            <span className="font-medium">{recipe.salt_g}g</span>
          </div>
        </div>
      </SectionCard>

      {/* Flour Breakdown */}
      {recipe.flour_breakdown && Object.keys(recipe.flour_breakdown).length > 0 && (
        <SectionCard variant="compact">
          <h3 className="font-semibold mb-3">פירוט קמחים</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(recipe.flour_breakdown).map(([name, percent]) => (
              <Badge key={name} variant="outline" className="text-sm">
                {name}: {percent}%
              </Badge>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Baking Details */}
      {(recipe.vessel || recipe.shaping || recipe.scoring) && (
        <SectionCard variant="compact">
          <h3 className="font-semibold mb-3">פרטי אפייה</h3>
          <div className="space-y-2">
            {recipe.vessel && (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">כלי אפייה</span>
                <span className="font-medium">{recipe.vessel}</span>
              </div>
            )}
            {recipe.shaping && (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">עיצוב</span>
                <span className="font-medium">{recipe.shaping}</span>
              </div>
            )}
            {recipe.scoring && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">חריצה</span>
                <span className="font-medium">{recipe.scoring}</span>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Notes */}
      {recipe.notes && (
        <SectionCard variant="compact">
          <h3 className="font-semibold mb-3">הערות</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{recipe.notes}</p>
        </SectionCard>
      )}

      {/* Gallery */}
      <SectionCard variant="compact">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">גלריה</h3>
          {!recipe.is_sample && (
            <Button variant="outline" size="sm" disabled>
              <Plus className="h-4 w-4 ml-1" />
              הוסף תמונה
            </Button>
          )}
        </div>
        
        {allImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {allImages.map((img, index) => (
              <button
                key={img.id}
                onClick={() => openLightbox(index)}
                className="aspect-square rounded-xl overflow-hidden bg-muted hover:ring-2 ring-primary transition-all"
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">אין תמונות עדיין</p>
          </div>
        )}
      </SectionCard>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-lg p-0 bg-black/90">
          <div className="relative">
            <img 
              src={allImages[lightboxIndex]?.url} 
              alt="" 
              className="w-full max-h-[70vh] object-contain"
            />
            <button 
              onClick={() => setLightboxOpen(false)}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </button>
            
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex(i => (i + 1) % allImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Start Bake Button */}
      <Button 
        onClick={() => navigate('/bake/new', { state: { recipeId: recipe.id } })}
        className="w-full h-12 gradient-crust text-primary-foreground"
      >
        <Sparkles className="h-5 w-5 ml-2" />
        התחל אפייה עם מתכון זה
      </Button>
    </div>
  );
}
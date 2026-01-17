import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, MoreVertical, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import { PageHeader } from '@/components/ui/PageHeader';
import RecipeImport from '@/components/RecipeImport';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

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
  is_sample?: boolean;
  created_at: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-1',
    name: 'לחם לבן קלאסי',
    description: 'לחם מחמצת בסיסי עם קרום פריך ופנים אוורירי',
    flour_total_g: 500,
    water_g: 350,
    starter_g: 100,
    salt_g: 10,
    flour_breakdown: { 'לבן 70': 100 },
    is_sample: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    name: 'לחם סמולינה',
    description: 'לחם עם טקסטורה מיוחדת בזכות הסמולינה',
    flour_total_g: 500,
    water_g: 325,
    starter_g: 100,
    salt_g: 10,
    flour_breakdown: { 'לבן 70': 70, 'סמולינה': 30 },
    is_sample: true,
    created_at: new Date().toISOString(),
  },
];

export default function Recipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [deleteRecipe, setDeleteRecipe] = useState<Recipe | null>(null);

  const loadRecipes = () => {
    const stored = localStorage.getItem('recipes');
    const userRecipes = stored ? JSON.parse(stored) : [];
    setRecipes([...SAMPLE_RECIPES, ...userRecipes]);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleImport = () => {
    loadRecipes();
  };

  const handleDelete = () => {
    if (!deleteRecipe) return;
    
    const stored = localStorage.getItem('recipes');
    const userRecipes: Recipe[] = stored ? JSON.parse(stored) : [];
    const updated = userRecipes.filter(r => r.id !== deleteRecipe.id);
    localStorage.setItem('recipes', JSON.stringify(updated));
    
    toast.success(`המתכון "${deleteRecipe.name}" נמחק`);
    setDeleteRecipe(null);
    loadRecipes();
  };

  const handleEdit = (recipe: Recipe) => {
    navigate(`/recipes/edit/${recipe.id}`);
  };

  const calculateHydration = (water: number, flour: number) => {
    return ((water / flour) * 100).toFixed(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <PageHeader title="המתכונים שלי" showBack={false} />
        <div className="flex items-center gap-2">
          <RecipeImport onImport={handleImport} />
          <Button
            onClick={() => navigate('/recipes/new')}
            size="sm"
            className="gradient-crust text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-1" />
            חדש
          </Button>
        </div>
      </div>

      {recipes.length > 0 ? (
        <div className="space-y-3">
          {recipes.map((recipe, index) => (
            <SectionCard
              key={recipe.id}
              variant="compact"
              className={cn(
                "group animate-fade-in cursor-pointer hover:border-primary/30",
                "transition-all duration-200"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <div className="flex items-start gap-3">
                {/* Thumbnail */}
                <div className={cn(
                  "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden",
                  "bg-gradient-to-br from-primary/20 to-accent/20",
                  "flex items-center justify-center"
                )}>
                  {recipe.cover_image_url ? (
                    <img 
                      src={recipe.cover_image_url} 
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-primary/50" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{recipe.name}</h3>
                        {recipe.is_sample && (
                          <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                            דוגמה
                          </span>
                        )}
                      </div>
                      {recipe.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {recipe.description}
                        </p>
                      )}
                    </div>

                    {/* Actions Menu */}
                    {!recipe.is_sample && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(recipe); }}>
                            <Pencil className="h-4 w-4 ml-2" />
                            ערוך
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => { e.stopPropagation(); setDeleteRecipe(recipe); }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 ml-2" />
                            מחק
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{recipe.flour_total_g}g קמח</span>
                    <span className="text-primary font-medium">
                      {calculateHydration(recipe.water_g, recipe.flour_total_g)}% הידרציה
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      ) : (
        <SectionCard variant="flat" className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="font-medium text-foreground mb-2">עדיין אין מתכונים</h3>
          <p className="text-sm text-muted-foreground mb-4">
            צור את המתכון הראשון שלך!
          </p>
          <Button onClick={() => navigate('/recipes/new')} className="gradient-crust text-primary-foreground">
            <Plus className="h-4 w-4 ml-2" />
            צור מתכון
          </Button>
        </SectionCard>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRecipe} onOpenChange={() => setDeleteRecipe(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת מתכון</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק את המתכון "{deleteRecipe?.name}"?
              פעולה זו לא ניתנת לביטול.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
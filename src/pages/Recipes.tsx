import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, BookOpen } from 'lucide-react';

interface Recipe {
  id: string;
  name: string;
  flour_total_g: number;
  water_g: number;
  starter_g: number;
  salt_g: number;
  flour_breakdown?: Record<string, number>;
  notes?: string;
  is_sample?: boolean;
  created_at: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'sample-1',
    name: 'לחם לבן קלאסי',
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

  useEffect(() => {
    const stored = localStorage.getItem('recipes');
    const userRecipes = stored ? JSON.parse(stored) : [];
    setRecipes([...SAMPLE_RECIPES, ...userRecipes]);
  }, []);

  const calculateHydration = (water: number, flour: number) => {
    return ((water / flour) * 100).toFixed(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">המתכונים שלי</h1>
        <Button
          onClick={() => navigate('/recipes/new')}
          size="sm"
          className="gradient-golden text-accent-foreground"
        >
          <Plus className="h-4 w-4 ml-1" />
          חדש
        </Button>
      </div>

      {recipes.length > 0 ? (
        <div className="space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bread-card cursor-pointer"
              onClick={() => navigate(`/recipes/${recipe.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{recipe.name}</h3>
                    {recipe.is_sample && (
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-0.5 rounded-full">
                        דוגמה
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>{recipe.flour_total_g}g קמח</span>
                    <span className="text-timer font-medium">
                      {calculateHydration(recipe.water_g, recipe.flour_total_g)}% הידרציה
                    </span>
                  </div>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bread-card-flat text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">עדיין אין מתכונים</h3>
          <p className="text-sm text-muted-foreground mb-4">
            צור את המתכון הראשון שלך!
          </p>
          <Button onClick={() => navigate('/recipes/new')} className="gradient-crust text-primary-foreground">
            <Plus className="h-4 w-4 ml-2" />
            צור מתכון
          </Button>
        </div>
      )}
    </div>
  );
}

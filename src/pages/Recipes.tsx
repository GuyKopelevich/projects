import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, BookOpen, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Recipes() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .or(`user_id.eq.${user!.id},is_sample.eq.true`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const calculateHydration = (water: number, flour: number) => {
    return ((water / flour) * 100).toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {recipes && recipes.length > 0 ? (
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

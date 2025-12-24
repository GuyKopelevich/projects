import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Star, Loader2, Image as ImageIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function BakesLog() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: bakes, isLoading } = useQuery({
    queryKey: ['bakes', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bakes')
        .select('*, recipes(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-starter/20 text-starter';
      case 'in_progress': return 'bg-honey/20 text-honey';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'הושלמה';
      case 'in_progress': return 'בתהליך';
      case 'cancelled': return 'בוטלה';
      default: return 'מתוכננת';
    }
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
        <h1 className="page-header mb-0">יומן אפיות</h1>
        <Button
          onClick={() => navigate('/bake/new')}
          size="sm"
          className="gradient-golden text-accent-foreground"
        >
          <Plus className="h-4 w-4 ml-1" />
          חדשה
        </Button>
      </div>

      {bakes && bakes.length > 0 ? (
        <div className="space-y-3">
          {bakes.map((bake) => (
            <div
              key={bake.id}
              className="bread-card cursor-pointer"
              onClick={() => navigate(`/bake/${bake.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{bake.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {bake.recipes?.name || 'מתכון מותאם אישית'}
                  </p>
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full font-medium",
                  getStatusColor(bake.status)
                )}>
                  {getStatusLabel(bake.status)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">
                  {format(new Date(bake.created_at), 'd בMMMM yyyy', { locale: he })}
                </div>
                <div className="flex items-center gap-3">
                  {bake.rating && (
                    <div className="flex items-center gap-1 text-honey">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{bake.rating}</span>
                    </div>
                  )}
                  <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bread-card-flat text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-2">היומן ריק</h3>
          <p className="text-sm text-muted-foreground mb-4">
            התחל לתעד את האפיות שלך!
          </p>
          <Button onClick={() => navigate('/bake/new')} className="gradient-crust text-primary-foreground">
            <Plus className="h-4 w-4 ml-2" />
            אפייה ראשונה
          </Button>
        </div>
      )}
    </div>
  );
}

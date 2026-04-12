import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, Star, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface Bake {
  id: string;
  name: string;
  recipe_name?: string;
  status: string;
  rating?: number;
  created_at: string;
}

export default function BakesLog() {
  const navigate = useNavigate();
  const [bakes, setBakes] = useState<Bake[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('bakes');
    if (stored) {
      setBakes(JSON.parse(stored));
    }
  }, []);

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

      {bakes.length > 0 ? (
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
                    {bake.recipe_name || 'מתכון מותאם אישית'}
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

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/Timer';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Plus, 
  ChevronLeft, 
  Wheat, 
  Clock, 
  ChefHat,
  LogOut,
  Droplets,
  Scale
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Fetch current active bake
  const { data: activeBake } = useQuery({
    queryKey: ['activeBake', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('bakes')
        .select('*, recipes(*)')
        .eq('user_id', user!.id)
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch recent starter feed
  const { data: lastFeed } = useQuery({
    queryKey: ['lastFeed', user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('starter_feeds')
        .select('*')
        .eq('user_id', user!.id)
        .order('fed_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      const [bakesResult, recipesResult] = await Promise.all([
        supabase.from('bakes').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
        supabase.from('recipes').select('id', { count: 'exact', head: true }).eq('user_id', user!.id),
      ]);
      return {
        totalBakes: bakesResult.count || 0,
        totalRecipes: recipesResult.count || 0,
      };
    },
    enabled: !!user,
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getTimeSinceLastFeed = () => {
    if (!lastFeed?.fed_at) return null;
    const hours = Math.floor((Date.now() - new Date(lastFeed.fed_at).getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `${days} ימים`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-rubik">שלום! 👋</h1>
          <p className="text-muted-foreground text-sm">מה נאפה היום?</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <Button
        onClick={() => navigate('/recipes/new')}
        className="w-full h-14 gradient-golden text-accent-foreground font-semibold text-lg shadow-glow hover:opacity-90 transition-opacity"
      >
        <Plus className="h-5 w-5 ml-2" />
        התחל אפייה חדשה
      </Button>

      {/* Active Bake Card */}
      {activeBake ? (
        <div className="bread-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-crust flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{activeBake.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {activeBake.recipes?.name || 'מתכון מותאם אישית'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(`/bake/${activeBake.id}`)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Active Timer Preview */}
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">הצעד הבא</p>
            <p className="font-medium text-lg">קיפול ראשון</p>
            <div className="text-3xl font-rubik font-bold text-primary mt-2 tabular-nums">
              25:00
            </div>
          </div>
        </div>
      ) : (
        <div className="bread-card-flat text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-foreground mb-1">אין אפייה פעילה</h3>
          <p className="text-sm text-muted-foreground">
            בחר מתכון והתחל לאפות!
          </p>
        </div>
      )}

      {/* Starter Status */}
      <div 
        className="bread-card flex items-center justify-between cursor-pointer hover:shadow-elevated transition-shadow"
        onClick={() => navigate('/starter')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-starter/20 flex items-center justify-center">
            <Wheat className="h-5 w-5 text-starter" />
          </div>
          <div>
            <h3 className="font-medium">מצב המחמצת</h3>
            <p className="text-sm text-muted-foreground">
              {lastFeed ? `הוזנה לפני ${getTimeSinceLastFeed()}` : 'לא נרשמו הזנות'}
            </p>
          </div>
        </div>
        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          value={stats?.totalBakes || 0}
          label="אפיות"
          variant="primary"
        />
        <StatCard
          value={stats?.totalRecipes || 0}
          label="מתכונים"
          variant="accent"
        />
      </div>

      {/* Quick Calculators */}
      <div className="space-y-3">
        <h2 className="section-title">מחשבונים מהירים</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/calculator/hydration')}
            className="bread-card-flat flex flex-col items-center gap-2 py-4 hover:shadow-card transition-shadow"
          >
            <Droplets className="h-6 w-6 text-timer" />
            <span className="text-sm font-medium">הידרציה</span>
          </button>
          <button
            onClick={() => navigate('/calculator/scale')}
            className="bread-card-flat flex flex-col items-center gap-2 py-4 hover:shadow-card transition-shadow"
          >
            <Scale className="h-6 w-6 text-honey" />
            <span className="text-sm font-medium">שינוי כמות</span>
          </button>
        </div>
      </div>
    </div>
  );
}

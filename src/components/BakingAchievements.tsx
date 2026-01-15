import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Award, Target, Sparkles } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  condition: (stats: BakingStats) => boolean;
  color: string;
}

interface BakingStats {
  totalBakes: number;
  successfulBakes: number;
  recipesCreated: number;
  floursUsed: number;
  starterFeeds: number;
  consecutiveDays: number;
}

const achievements: Achievement[] = [
  {
    id: 'first-bake',
    name: 'אפייה ראשונה',
    description: 'השלמת את האפייה הראשונה שלך!',
    icon: <Star className="h-5 w-5" />,
    condition: (stats) => stats.totalBakes >= 1,
    color: 'bg-yellow-500',
  },
  {
    id: 'baker-5',
    name: 'אופה מתחיל',
    description: 'השלמת 5 אפיות',
    icon: <Trophy className="h-5 w-5" />,
    condition: (stats) => stats.totalBakes >= 5,
    color: 'bg-amber-500',
  },
  {
    id: 'baker-10',
    name: 'אופה מנוסה',
    description: 'השלמת 10 אפיות',
    icon: <Trophy className="h-5 w-5" />,
    condition: (stats) => stats.totalBakes >= 10,
    color: 'bg-orange-500',
  },
  {
    id: 'baker-25',
    name: 'אומן הלחם',
    description: 'השלמת 25 אפיות',
    icon: <Award className="h-5 w-5" />,
    condition: (stats) => stats.totalBakes >= 25,
    color: 'bg-red-500',
  },
  {
    id: 'recipe-creator',
    name: 'יוצר מתכונים',
    description: 'יצרת 3 מתכונים משלך',
    icon: <Sparkles className="h-5 w-5" />,
    condition: (stats) => stats.recipesCreated >= 3,
    color: 'bg-purple-500',
  },
  {
    id: 'flour-explorer',
    name: 'חוקר קמחים',
    description: 'ניסית 5 סוגי קמח שונים',
    icon: <Target className="h-5 w-5" />,
    condition: (stats) => stats.floursUsed >= 5,
    color: 'bg-green-500',
  },
  {
    id: 'starter-master',
    name: 'אדון המחמצת',
    description: 'האכלת את המחמצת 30 פעמים',
    icon: <Flame className="h-5 w-5" />,
    condition: (stats) => stats.starterFeeds >= 30,
    color: 'bg-pink-500',
  },
  {
    id: 'consistent',
    name: 'עקבי',
    description: 'אפית 7 ימים ברציפות',
    icon: <Flame className="h-5 w-5" />,
    condition: (stats) => stats.consecutiveDays >= 7,
    color: 'bg-blue-500',
  },
];

export function BakingAchievements() {
  const [stats, setStats] = useState<BakingStats>({
    totalBakes: 0,
    successfulBakes: 0,
    recipesCreated: 0,
    floursUsed: 0,
    starterFeeds: 0,
    consecutiveDays: 0,
  });

  useEffect(() => {
    // Load stats from localStorage
    const bakes = JSON.parse(localStorage.getItem('sourdough_bakes') || '[]');
    const recipes = JSON.parse(localStorage.getItem('sourdough_recipes') || '[]');
    const feeds = JSON.parse(localStorage.getItem('starter_feeds') || '[]');
    const unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    
    // Calculate unique flours used
    const floursUsed = new Set(
      recipes.flatMap((r: any) => r.flour_mix?.map((f: any) => f.flour_id) || [])
    ).size;

    setStats({
      totalBakes: bakes.length,
      successfulBakes: bakes.filter((b: any) => b.status === 'completed').length,
      recipesCreated: recipes.length,
      floursUsed,
      starterFeeds: feeds.length,
      consecutiveDays: calculateConsecutiveDays(bakes),
    });
  }, []);

  const calculateConsecutiveDays = (bakes: any[]) => {
    if (bakes.length === 0) return 0;
    
    const dates = bakes
      .map((b: any) => new Date(b.created_at).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    let consecutive = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = new Date(dates[i-1]).getTime() - new Date(dates[i]).getTime();
      if (diff === 86400000) { // 1 day in ms
        consecutive++;
      } else {
        break;
      }
    }
    return consecutive;
  };

  const unlockedAchievements = achievements.filter(a => a.condition(stats));
  const lockedAchievements = achievements.filter(a => !a.condition(stats));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          הישגים
          <Badge variant="secondary" className="mr-auto">
            {unlockedAchievements.length}/{achievements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Unlocked */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">הושגו</h4>
            <div className="grid grid-cols-2 gap-2">
              {unlockedAchievements.map(achievement => (
                <div
                  key={achievement.id}
                  className={`${achievement.color} text-white rounded-lg p-3 space-y-1`}
                >
                  <div className="flex items-center gap-2">
                    {achievement.icon}
                    <span className="font-medium text-sm">{achievement.name}</span>
                  </div>
                  <p className="text-xs opacity-90">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked */}
        {lockedAchievements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">נעולים</h4>
            <div className="grid grid-cols-2 gap-2">
              {lockedAchievements.slice(0, 4).map(achievement => (
                <div
                  key={achievement.id}
                  className="bg-muted/50 rounded-lg p-3 space-y-1 opacity-60"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {achievement.icon}
                    <span className="font-medium text-sm">???</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.totalBakes}</div>
            <div className="text-xs text-muted-foreground">אפיות</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.recipesCreated}</div>
            <div className="text-xs text-muted-foreground">מתכונים</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.starterFeeds}</div>
            <div className="text-xs text-muted-foreground">הזנות</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

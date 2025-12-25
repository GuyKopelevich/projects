import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Plus, 
  Wheat, 
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface StarterFeed {
  id: string;
  fed_at: string;
  flour_g: number;
  water_g: number;
  ratio: string;
  temp_c: number;
  height_before_cm?: number;
  height_peak_cm?: number;
  peak_after_hours?: number;
  notes?: string;
}

export default function StarterTracker() {
  const [feeds, setFeeds] = useState<StarterFeed[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [flour, setFlour] = useState(50);
  const [water, setWater] = useState(50);
  const [ratio, setRatio] = useState('1:1:1');
  const [temp, setTemp] = useState(24);
  const [heightBefore, setHeightBefore] = useState('');
  const [heightPeak, setHeightPeak] = useState('');
  const [peakHours, setPeakHours] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('starterFeeds');
    if (stored) {
      setFeeds(JSON.parse(stored));
    }
  }, []);

  const chartData = feeds
    .filter(f => f.peak_after_hours)
    .slice(0, 14)
    .reverse()
    .map(f => ({
      date: format(new Date(f.fed_at), 'd/M', { locale: he }),
      hours: Number(f.peak_after_hours),
    }));

  const handleSave = () => {
    const newFeed: StarterFeed = {
      id: Date.now().toString(),
      fed_at: new Date().toISOString(),
      flour_g: flour,
      water_g: water,
      ratio,
      temp_c: temp,
      height_before_cm: heightBefore ? parseFloat(heightBefore) : undefined,
      height_peak_cm: heightPeak ? parseFloat(heightPeak) : undefined,
      peak_after_hours: peakHours ? parseFloat(peakHours) : undefined,
      notes: notes.trim() || undefined,
    };

    const updatedFeeds = [newFeed, ...feeds];
    setFeeds(updatedFeeds);
    localStorage.setItem('starterFeeds', JSON.stringify(updatedFeeds));

    toast.success('הזנה נרשמה בהצלחה! 🌱');
    setDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFlour(50);
    setWater(50);
    setRatio('1:1:1');
    setTemp(24);
    setHeightBefore('');
    setHeightPeak('');
    setPeakHours('');
    setNotes('');
  };

  const getTimeSinceFeed = (fedAt: string) => {
    const hours = Math.floor((Date.now() - new Date(fedAt).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'עכשיו';
    if (hours < 24) return `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="page-header mb-0">מעקב מחמצת</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-starter bg-starter text-white hover:opacity-90">
              <Plus className="h-4 w-4 ml-1" />
              הזנה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>רישום הזנה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">קמח (גרם)</Label>
                  <Input
                    type="number"
                    value={flour}
                    onChange={(e) => setFlour(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label className="text-sm">מים (גרם)</Label>
                  <Input
                    type="number"
                    value={water}
                    onChange={(e) => setWater(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm">יחס הזנה</Label>
                  <Input
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value)}
                    placeholder="1:1:1"
                  />
                </div>
                <div>
                  <Label className="text-sm">טמפ' (°C)</Label>
                  <Input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm">גובה לפני</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={heightBefore}
                    onChange={(e) => setHeightBefore(e.target.value)}
                    placeholder="ס״מ"
                  />
                </div>
                <div>
                  <Label className="text-sm">גובה שיא</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={heightPeak}
                    onChange={(e) => setHeightPeak(e.target.value)}
                    placeholder="ס״מ"
                  />
                </div>
                <div>
                  <Label className="text-sm">שעות לשיא</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={peakHours}
                    onChange={(e) => setPeakHours(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm">הערות</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full gradient-crust text-primary-foreground"
              >
                שמור
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Peak Time Chart */}
      {chartData && chartData.length > 2 && (
        <div className="bread-card">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-starter" />
            זמן לשיא (שעות)
          </h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--starter))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--starter))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Feed History */}
      <div className="space-y-3">
        <h2 className="section-title">היסטוריית הזנות</h2>
        
        {feeds.length > 0 ? (
          feeds.map((feed) => (
            <div key={feed.id} className="bread-card-flat">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-starter/20 flex items-center justify-center">
                    <Wheat className="h-5 w-5 text-starter" />
                  </div>
                  <div>
                    <div className="font-medium">{feed.ratio}</div>
                    <div className="text-sm text-muted-foreground">
                      {feed.flour_g}g קמח • {feed.water_g}g מים
                    </div>
                  </div>
                </div>
                <div className="text-left text-sm text-muted-foreground">
                  <div>{getTimeSinceFeed(feed.fed_at)}</div>
                  {feed.peak_after_hours && (
                    <div className="flex items-center gap-1 text-starter">
                      <Clock className="h-3 w-3" />
                      {feed.peak_after_hours}h
                    </div>
                  )}
                </div>
              </div>
              {feed.notes && (
                <p className="mt-2 text-sm text-muted-foreground border-t border-border pt-2">
                  {feed.notes}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="bread-card-flat text-center py-8">
            <Wheat className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">עדיין לא נרשמו הזנות</p>
          </div>
        )}
      </div>
    </div>
  );
}

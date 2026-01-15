import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TimerPreset {
  id: string;
  name: string;
  duration: number; // in seconds
  color: string;
}

const presets: TimerPreset[] = [
  { id: 'autolyse', name: 'אוטוליזה', duration: 30 * 60, color: 'bg-blue-500' },
  { id: 'fold', name: 'קיפול', duration: 30 * 60, color: 'bg-green-500' },
  { id: 'bulk', name: 'תפיחה ראשונה', duration: 4 * 60 * 60, color: 'bg-amber-500' },
  { id: 'shape', name: 'עיצוב + מנוחה', duration: 20 * 60, color: 'bg-purple-500' },
  { id: 'preheat', name: 'חימום תנור', duration: 45 * 60, color: 'bg-red-500' },
  { id: 'bake-covered', name: 'אפייה מכוסה', duration: 20 * 60, color: 'bg-orange-500' },
  { id: 'bake-uncovered', name: 'אפייה פתוחה', duration: 25 * 60, color: 'bg-orange-600' },
  { id: 'cool', name: 'קירור', duration: 60 * 60, color: 'bg-cyan-500' },
];

export function BakingTimer() {
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            if (soundEnabled) {
              playAlarm();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, soundEnabled]);

  const playAlarm = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 500);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectPreset = (preset: TimerPreset) => {
    setSelectedPreset(preset);
    setTimeLeft(preset.duration);
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    if (selectedPreset) {
      setTimeLeft(selectedPreset.duration);
      setIsRunning(false);
    }
  };

  const progress = selectedPreset 
    ? ((selectedPreset.duration - timeLeft) / selectedPreset.duration) * 100 
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">טיימר אפייה</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        {selectedPreset && (
          <div className="text-center space-y-3">
            <div className="text-sm text-muted-foreground">{selectedPreset.name}</div>
            <div className="text-5xl font-mono font-bold">{formatTime(timeLeft)}</div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-center gap-2">
              <Button onClick={toggleTimer} variant="outline" size="lg">
                {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button onClick={resetTimer} variant="outline" size="lg">
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Presets Grid */}
        <div className="grid grid-cols-2 gap-2">
          {presets.map(preset => (
            <button
              key={preset.id}
              onClick={() => selectPreset(preset)}
              className={`p-3 rounded-lg text-right transition-all ${
                selectedPreset?.id === preset.id 
                  ? 'ring-2 ring-primary bg-primary/10' 
                  : 'bg-muted/50 hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${preset.color}`} />
                <span className="text-sm font-medium">{preset.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatTime(preset.duration)}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

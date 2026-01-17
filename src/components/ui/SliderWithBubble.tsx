import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from './slider';

interface SliderWithBubbleProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  className?: string;
}

export function SliderWithBubble({ 
  value, 
  onValueChange, 
  min = 0, 
  max = 100,
  step = 1,
  unit = '%',
  className 
}: SliderWithBubbleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate bubble position
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('relative pt-10 pb-2', className)}>
      {/* Bubble */}
      <div 
        className={cn(
          'slider-bubble transition-all duration-150',
          isDragging ? 'scale-110' : 'scale-100'
        )}
        style={{ left: `${percentage}%` }}
      >
        {value}{unit}
      </div>

      {/* Slider */}
      <div ref={sliderRef}>
        <Slider
          value={[value]}
          onValueChange={(values) => onValueChange(values[0])}
          min={min}
          max={max}
          step={step}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className="cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>{max}{unit}</span>
        <span>{min}{unit}</span>
      </div>
    </div>
  );
}
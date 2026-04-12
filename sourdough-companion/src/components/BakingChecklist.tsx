import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RotateCcw, CheckSquare } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  category: 'prep' | 'bulk' | 'shape' | 'bake';
}

const checklistItems: ChecklistItem[] = [
  { id: '1', text: 'המחמצת פעילה ומוכנה', category: 'prep' },
  { id: '2', text: 'כל המרכיבים במשקל', category: 'prep' },
  { id: '3', text: 'קערה גדולה ונקייה', category: 'prep' },
  { id: '4', text: 'אוטוליזה הושלמה', category: 'prep' },
  { id: '5', text: 'מלח ומחמצת נוספו', category: 'bulk' },
  { id: '6', text: 'סט קיפולים ראשון', category: 'bulk' },
  { id: '7', text: 'סט קיפולים שני', category: 'bulk' },
  { id: '8', text: 'סט קיפולים שלישי', category: 'bulk' },
  { id: '9', text: 'הבצק עלה 50% לפחות', category: 'bulk' },
  { id: '10', text: 'עיצוב מוקדם (Pre-shape)', category: 'shape' },
  { id: '11', text: 'מנוחת ספסל 20-30 דקות', category: 'shape' },
  { id: '12', text: 'עיצוב סופי', category: 'shape' },
  { id: '13', text: 'העברה לסל תפיחה', category: 'shape' },
  { id: '14', text: 'תנור מחומם ל-250°C', category: 'bake' },
  { id: '15', text: 'סיר ברזל יצוק חם', category: 'bake' },
  { id: '16', text: 'חריצה בוצעה', category: 'bake' },
  { id: '17', text: 'אפייה מכוסה 20 דקות', category: 'bake' },
  { id: '18', text: 'אפייה פתוחה עד לצבע', category: 'bake' },
  { id: '19', text: 'קירור על רשת שעה לפחות', category: 'bake' },
];

const categoryLabels = {
  prep: 'הכנה',
  bulk: 'תפיחה ראשונה',
  shape: 'עיצוב',
  bake: 'אפייה',
};

const categoryColors = {
  prep: 'text-blue-500',
  bulk: 'text-green-500',
  shape: 'text-purple-500',
  bake: 'text-orange-500',
};

export function BakingChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('baking_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('baking_checklist', JSON.stringify(checked));
  }, [checked]);

  const toggleItem = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resetChecklist = () => {
    setChecked({});
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = (completedCount / checklistItems.length) * 100;

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            צ'קליסט אפייה
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={resetChecklist}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-center mt-1">
          {completedCount} / {checklistItems.length} הושלמו
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-2">
            <h4 className={`text-sm font-medium ${categoryColors[category as keyof typeof categoryColors]}`}>
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h4>
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    checked[item.id] ? 'bg-muted/50' : 'hover:bg-muted/30'
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={checked[item.id] || false}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <label
                    htmlFor={item.id}
                    className={`text-sm cursor-pointer flex-1 ${
                      checked[item.id] ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {item.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

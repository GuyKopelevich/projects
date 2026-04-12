import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scissors } from 'lucide-react';

interface ScoringPattern {
  name: string;
  description: string;
  difficulty: 'קל' | 'בינוני' | 'מתקדם';
  tips: string[];
  visual: string; // ASCII art representation
}

const patterns: ScoringPattern[] = [
  {
    name: 'חיתוך פשוט',
    description: 'חתך אחד ארוך באמצע הלחם',
    difficulty: 'קל',
    tips: ['חתוך בזווית של 30-45 מעלות', 'עומק של 1-1.5 ס"מ'],
    visual: '━━━━━━━━━━',
  },
  {
    name: 'צלב',
    description: 'שני חתכים מצטלבים במרכז',
    difficulty: 'קל',
    tips: ['התחל מהמרכז', 'שמור על עומק אחיד'],
    visual: '    ┃\n━━━━╋━━━━\n    ┃',
  },
  {
    name: 'ריבוע',
    description: 'ארבעה חתכים יוצרים ריבוע',
    difficulty: 'בינוני',
    tips: ['שמור על מרחקים שווים', 'חתוך בתנועה אחת'],
    visual: '┏━━━━━━┓\n┃      ┃\n┗━━━━━━┛',
  },
  {
    name: 'שיבולת חיטה',
    description: 'חתכים אלכסוניים לסירוגין',
    difficulty: 'מתקדם',
    tips: ['התחל מלמעלה', 'שמור על זווית עקבית'],
    visual: ' ╲  ╱\n  ╲╱\n  ╱╲\n ╱  ╲',
  },
  {
    name: 'ספירלה',
    description: 'חתך מעגלי מסתובב',
    difficulty: 'מתקדם',
    tips: ['התחל מהמרכז', 'תנועה רציפה'],
    visual: '  ╭───╮\n  │ ○ │\n  ╰───╯',
  },
  {
    name: 'עלה',
    description: 'צורת עלה עם עורקים',
    difficulty: 'מתקדם',
    tips: ['צייר קו מרכזי קודם', 'הוסף קווים אלכסוניים'],
    visual: '  ╱│╲\n ╱ │ ╲\n╱  │  ╲',
  },
];

const getDifficultyColor = (difficulty: ScoringPattern['difficulty']) => {
  switch (difficulty) {
    case 'קל': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'בינוני': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
    case 'מתקדם': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  }
};

export function ScoringPatterns() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          דפוסי חריצה
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {patterns.map((pattern, idx) => (
            <div
              key={idx}
              className="bg-muted/50 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{pattern.name}</span>
                <Badge className={getDifficultyColor(pattern.difficulty)}>
                  {pattern.difficulty}
                </Badge>
              </div>
              
              <div className="flex gap-3">
                {/* Visual */}
                <div className="bg-card rounded p-2 font-mono text-xs whitespace-pre flex items-center justify-center min-w-[80px]">
                  {pattern.visual}
                </div>
                
                {/* Description */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  <ul className="text-xs space-y-0.5">
                    {pattern.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-1">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            💡 <strong>טיפ:</strong> השתמש בלהב גילוח חד, רסס את הבצק במים לפני החריצה, 
            ועבוד במהירות לפני שהבצק מתייבש.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

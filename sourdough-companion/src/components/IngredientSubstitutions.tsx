import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RefreshCw } from 'lucide-react';

interface Substitution {
  ingredient: string;
  substitutes: {
    name: string;
    ratio: string;
    notes: string;
  }[];
}

const substitutions: Substitution[] = [
  {
    ingredient: 'קמח לחם (חלבון גבוה)',
    substitutes: [
      { name: 'קמח רגיל + גלוטן חיוני', ratio: '1 כוס קמח + 1 כף גלוטן', notes: 'התוצאה הכי קרובה' },
      { name: 'קמח רגיל', ratio: '1:1', notes: 'הלחם יהיה פחות אוורירי' },
      { name: 'קמח מניטובה', ratio: '1:1', notes: 'חלבון גבוה במיוחד' },
    ],
  },
  {
    ingredient: 'קמח מלא',
    substitutes: [
      { name: 'קמח רגיל', ratio: '1:1', notes: 'הוסף 1 כף מים לכל כוס' },
      { name: 'קמח כוסמין', ratio: '1:1', notes: 'טעם דומה, יותר עדין' },
      { name: 'קמח שיפון בהיר', ratio: '1:1', notes: 'טעם שונה, עוצמתי יותר' },
    ],
  },
  {
    ingredient: 'קמח שיפון',
    substitutes: [
      { name: 'קמח מלא + קמח לבן', ratio: '50% + 50%', notes: 'לא אותו טעם אבל עובד' },
      { name: 'קמח כוסמין כהה', ratio: '1:1', notes: 'טעם שונה אבל מעניין' },
    ],
  },
  {
    ingredient: 'מחמצת',
    substitutes: [
      { name: 'שמרים יבשים', ratio: '1 גרם שמרים במקום 100 גרם מחמצת', notes: 'לא אותו טעם! רק לחירום' },
      { name: 'שמרים טריים', ratio: '3 גרם במקום 100 גרם מחמצת', notes: 'הפחת מים בהתאם' },
    ],
  },
  {
    ingredient: 'מלח ים',
    substitutes: [
      { name: 'מלח שולחני', ratio: '1:0.75', notes: 'מלח שולחני חזק יותר' },
      { name: 'מלח כשר', ratio: '1:1.25', notes: 'גבישים גדולים יותר' },
      { name: 'מלח הימלאיה', ratio: '1:1', notes: 'טעם דומה' },
    ],
  },
  {
    ingredient: 'דבש',
    substitutes: [
      { name: 'סילאן', ratio: '1:1', notes: 'מתאים מאוד!' },
      { name: 'מייפל', ratio: '1:1', notes: 'טעם שונה' },
      { name: 'סוכר', ratio: '1:0.75', notes: 'הוסף 2 כפות מים' },
    ],
  },
  {
    ingredient: 'שמן זית',
    substitutes: [
      { name: 'שמן קנולה', ratio: '1:1', notes: 'ניטרלי יותר' },
      { name: 'חמאה מומסת', ratio: '1:1', notes: 'טעם עשיר' },
      { name: 'שמן אבוקדו', ratio: '1:1', notes: 'בריא ועדין' },
    ],
  },
];

export function IngredientSubstitutions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          תחליפי מרכיבים
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="space-y-2">
          {substitutions.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border rounded-lg px-3">
              <AccordionTrigger className="hover:no-underline py-3">
                <span className="font-medium text-sm">{item.ingredient}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="space-y-3">
                  {item.substitutes.map((sub, subIdx) => (
                    <div key={subIdx} className="bg-muted/50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm">{sub.name}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {sub.ratio}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{sub.notes}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

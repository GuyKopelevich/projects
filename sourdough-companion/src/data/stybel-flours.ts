// Stybel Flours Database - מידע על קמחי שטיבל
// Based on real data from stybel.co.il

export interface StybelFlour {
  id: string;
  name: string;
  hebrewName: string;
  code: string; // e.g., "שטיבל 2"
  proteinPercent: number;
  description: string;
  bestFor: string[];
  glutenLevel: 'low' | 'medium' | 'high' | 'very-high';
  category: 'white' | 'whole' | 'rye' | 'spelt' | 'semolina' | 'specialty';
  hydrationAdjustment: number; // % to add/subtract from base hydration
  tips: string[];
  nutritionPer100g: {
    energy: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
  };
}

export const stybelFlours: StybelFlour[] = [
  // ===== קמחי חיטה לבנים =====
  {
    id: 'stybel-405',
    name: 'White Wheat Flour 405',
    hebrewName: 'קמח חיטה לבן בהיר',
    code: 'שטיבל 405',
    proteinPercent: 9.5,
    description: 'קמח לבן בהיר מאוד, מתאים לעוגות ומאפים עדינים',
    bestFor: ['עוגות', 'עוגיות', 'מאפים עדינים'],
    glutenLevel: 'medium',
    category: 'white',
    hydrationAdjustment: -3,
    tips: [
      'מתאים לבצקים שלא דורשים התפחה גבוהה',
      'ניתן לערבב עם קמח לחם לתוצאה מאוזנת'
    ],
    nutritionPer100g: { energy: 340, protein: 9.5, carbs: 75, fat: 1.0 }
  },
  {
    id: 'stybel-650',
    name: 'White Wheat Flour',
    hebrewName: 'קמח חיטה לבן',
    code: 'שטיבל 650',
    proteinPercent: 10.5,
    description: 'קמח רב תכליתי לשימוש יומיומי',
    bestFor: ['לחמים בסיסיים', 'פיצות', 'פוקצ\'ות', 'חלות'],
    glutenLevel: 'medium',
    category: 'white',
    hydrationAdjustment: 0,
    tips: [
      'קמח בסיסי טוב לרוב המתכונים',
      'מומלץ כבסיס ללחם מחמצת יומיומי'
    ],
    nutritionPer100g: { energy: 347, protein: 10.5, carbs: 73.5, fat: 1.0 }
  },
  {
    id: 'stybel-2',
    name: 'Bread Flour',
    hebrewName: 'קמח לחם',
    code: 'שטיבל 2',
    proteinPercent: 11.0,
    description: 'קמח בעל רמת גלוטן גבוהה המיועד להכנת לחמים ולחמניות. מאפשר קבלת מאפים בעלי נפח גבוה ועמידות גבוהה בתהליך ההתפחה.',
    bestFor: ['לחם מחמצת', 'לחמניות', 'באגט', 'צ\'בטה'],
    glutenLevel: 'high',
    category: 'white',
    hydrationAdjustment: 0,
    tips: [
      'יש ללוש באופן אינטנסיבי עד לפיתוח מלא של הגלוטן',
      'מומלץ במיוחד ללחם מחמצת',
      'הקמח המומלץ העיקרי ללחמי מחמצת'
    ],
    nutritionPer100g: { energy: 347, protein: 11.0, carbs: 73.5, fat: 1.0 }
  },
  {
    id: 'stybel-t63',
    name: 'T63 Flour',
    hebrewName: 'T63',
    code: 'T63',
    proteinPercent: 11.5,
    description: 'קמח צרפתי קלאסי לקרואסונים, בריוש וחלות',
    bestFor: ['קרואסונים', 'בריוש', 'חלות', 'מאפי שמרים'],
    glutenLevel: 'high',
    category: 'white',
    hydrationAdjustment: -2,
    tips: [
      'מעולה למאפים עשירים בחמאה',
      'נותן מרקם אוורירי ועדין'
    ],
    nutritionPer100g: { energy: 350, protein: 11.5, carbs: 72, fat: 1.2 }
  },
  {
    id: 'stybel-artisan',
    name: 'Artisan Flour',
    hebrewName: 'קמח ארטיזן',
    code: 'ארטיזן',
    proteinPercent: 12.0,
    description: 'קמח איכותי לאפייה ארטיזנית מקצועית',
    bestFor: ['לחם מחמצת ארטיזני', 'צ\'בטה', 'פוקצ\'ה', 'לחם כפרי'],
    glutenLevel: 'high',
    category: 'white',
    hydrationAdjustment: +2,
    tips: [
      'מתאים לבצקים עם הידרציה גבוהה',
      'מעולה ללחמים עם קראסט פריך'
    ],
    nutritionPer100g: { energy: 345, protein: 12.0, carbs: 71, fat: 1.1 }
  },
  {
    id: 'stybel-manitoba',
    name: 'Manitoba White',
    hebrewName: 'מניטובה לבן',
    code: 'מניטובה',
    proteinPercent: 14.0,
    description: 'קמח חזק מאוד מחיטת מניטובה הקנדית, גלוטן גבוה במיוחד',
    bestFor: ['פיצה נפוליטנית', 'פנטונה', 'באגטים', 'לחמים עם הידרציה גבוהה'],
    glutenLevel: 'very-high',
    category: 'white',
    hydrationAdjustment: +5,
    tips: [
      'ניתן לערבב עם קמחים אחרים לחיזוק הגלוטן',
      'מתאים לבצקים עם הידרציה של 75%+',
      'דורש לישה ממושכת לפיתוח מלא'
    ],
    nutritionPer100g: { energy: 355, protein: 14.0, carbs: 70, fat: 1.5 }
  },
  {
    id: 'stybel-18',
    name: 'Challah Flour',
    hebrewName: 'קמח חלה',
    code: 'שטיבל 18',
    proteinPercent: 11.5,
    description: 'קמח מותאם במיוחד להכנת חלות רכות ואווריריות',
    bestFor: ['חלות', 'לחמניות מתוקות', 'בייגלים'],
    glutenLevel: 'high',
    category: 'white',
    hydrationAdjustment: -2,
    tips: [
      'מעניק מרקם רך ואוורירי',
      'מתאים למאפים עם ביצים ושמן'
    ],
    nutritionPer100g: { energy: 350, protein: 11.5, carbs: 72, fat: 1.2 }
  },
  {
    id: 'stybel-1',
    name: 'All Purpose Flour',
    hebrewName: 'קמח רב תכליתי',
    code: 'שטיבל 1',
    proteinPercent: 10.0,
    description: 'קמח רב תכליתי לכל סוגי האפייה',
    bestFor: ['עוגות', 'עוגיות', 'לחמים', 'פיצות'],
    glutenLevel: 'medium',
    category: 'white',
    hydrationAdjustment: 0,
    tips: [
      'מתאים לכל מתכון',
      'בחירה טובה כשלא בטוחים איזה קמח לבחור'
    ],
    nutritionPer100g: { energy: 345, protein: 10.0, carbs: 74, fat: 1.0 }
  },

  // ===== קמחי חיטה מלאים =====
  {
    id: 'stybel-ruta',
    name: 'Ruta Flour',
    hebrewName: 'קמח רותה',
    code: 'רותה',
    proteinPercent: 12.5,
    description: 'קמח חיטה מלא מזן רותה ישראלי, עשיר בטעם ובסיבים',
    bestFor: ['לחם מחמצת מלא', 'לחם כפרי', 'פיתות'],
    glutenLevel: 'high',
    category: 'whole',
    hydrationAdjustment: +5,
    tips: [
      'קמח ישראלי מקומי עם טעם עשיר',
      'מומלץ לערבב עם קמח לבן (70/30)',
      'דורש הידרציה גבוהה יותר'
    ],
    nutritionPer100g: { energy: 340, protein: 12.5, carbs: 65, fat: 2.5, fiber: 11 }
  },

  // ===== קמחי כוסמין =====
  {
    id: 'stybel-14',
    name: 'Whole Spelt Flour',
    hebrewName: 'קמח כוסמין מלא 100%',
    code: 'שטיבל 14',
    proteinPercent: 13.0,
    description: 'קמח נטחן מגרעין הכוסמין המלא. בצק בעל יכולות פלסטיות גבוהות, טעם עדין ומתקתק.',
    bestFor: ['לחם כוסמין', 'לחמניות', 'עוגיות בריאות'],
    glutenLevel: 'medium',
    category: 'spelt',
    hydrationAdjustment: +3,
    tips: [
      'גלוטן רגיש - יש להיזהר מלישה מוגזמת',
      'ניתן לערבב עם קמח רגיל לתוצאה מאוזנת',
      'טעם אגוזי עדין'
    ],
    nutritionPer100g: { energy: 338, protein: 13.0, carbs: 63, fat: 2.4, fiber: 10 }
  },

  // ===== קמחי שיפון =====
  {
    id: 'stybel-7',
    name: 'Whole Rye Flour',
    hebrewName: 'קמח שיפון מלא',
    code: 'שטיבל 7',
    proteinPercent: 8.5,
    description: 'קמח נטחן מגרעין השיפון המלא. רמת גלוטן נמוכה יחסית וכמות גבוהה של סיבים תזונתיים. בסיס מעולה למחמצת.',
    bestFor: ['מחמצת שיפון', 'לחם שיפון', 'לחם פומפרניקל'],
    glutenLevel: 'low',
    category: 'rye',
    hydrationAdjustment: +8,
    tips: [
      'הקמח המומלץ להזנת מחמצת',
      'יש לערבב עם קמח חיטה (מקסימום 30% שיפון)',
      'מעניק טעם עמוק וחמצמץ',
      'דורש הידרציה גבוהה מאוד'
    ],
    nutritionPer100g: { energy: 365, protein: 8.5, carbs: 68, fat: 1.9, fiber: 15 }
  },

  // ===== סמולינה =====
  {
    id: 'stybel-semola',
    name: 'Yellow Semola',
    hebrewName: 'סמולה צהובה',
    code: 'סמולה',
    proteinPercent: 12.0,
    description: 'סמולינה צהובה איכותית מחיטת דורום',
    bestFor: ['פסטה טרייה', 'לחם עם סמולינה', 'פוקצ\'ה'],
    glutenLevel: 'high',
    category: 'semolina',
    hydrationAdjustment: -3,
    tips: [
      'מעניקה צבע צהוב יפה ומרקם פריך',
      'ניתן להוסיף 10-20% ללחם מחמצת',
      'מתאימה לציפוי תחתית לחמים'
    ],
    nutritionPer100g: { energy: 360, protein: 12.0, carbs: 72, fat: 1.0 }
  },
  {
    id: 'stybel-semolina',
    name: 'Wheat Semolina',
    hebrewName: 'סולת חיטה',
    code: 'סולת',
    proteinPercent: 10.5,
    description: 'סולת חיטה עדינה לקוסקוס ומאפים',
    bestFor: ['קוסקוס', 'קרמל', 'עוגות סולת'],
    glutenLevel: 'medium',
    category: 'semolina',
    hydrationAdjustment: -5,
    tips: [
      'לא מומלצת כבסיס ללחם',
      'ניתן להוסיף כמות קטנה למרקם מעניין'
    ],
    nutritionPer100g: { energy: 350, protein: 10.5, carbs: 74, fat: 1.0 }
  }
];

// Helper functions
export function getFlourById(id: string): StybelFlour | undefined {
  return stybelFlours.find(f => f.id === id);
}

export function getFloursByCategory(category: StybelFlour['category']): StybelFlour[] {
  return stybelFlours.filter(f => f.category === category);
}

export function getRecommendedFloursForSourdough(): StybelFlour[] {
  return stybelFlours.filter(f => 
    f.bestFor.some(use => 
      use.includes('מחמצת') || use.includes('לחם')
    ) && f.glutenLevel !== 'low'
  );
}

export function calculateAdjustedHydration(baseHydration: number, flourMix: { flourId: string; percentage: number }[]): number {
  const adjustment = flourMix.reduce((total, flour) => {
    const flourData = getFlourById(flour.flourId);
    if (flourData) {
      return total + (flourData.hydrationAdjustment * flour.percentage / 100);
    }
    return total;
  }, 0);
  
  return baseHydration + adjustment;
}

// Gluten level display helpers
export const glutenLevelLabels: Record<StybelFlour['glutenLevel'], string> = {
  'low': 'נמוך',
  'medium': 'בינוני',
  'high': 'גבוה',
  'very-high': 'גבוה מאוד'
};

export const glutenLevelColors: Record<StybelFlour['glutenLevel'], string> = {
  'low': 'text-orange-500',
  'medium': 'text-yellow-600',
  'high': 'text-green-600',
  'very-high': 'text-blue-600'
};

export const categoryLabels: Record<StybelFlour['category'], string> = {
  'white': 'לבן',
  'whole': 'מלא',
  'rye': 'שיפון',
  'spelt': 'כוסמין',
  'semolina': 'סמולינה',
  'specialty': 'מיוחד'
};

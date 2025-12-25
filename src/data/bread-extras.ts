// Bread Add-ins / Toppings
export interface BreadAddIn {
  id: string;
  name: string;
  category: 'seeds' | 'nuts' | 'dried_fruit' | 'cheese' | 'herbs' | 'vegetables' | 'other';
  hydrationAdjust: number; // percentage to reduce water
  percentOfFlour: number; // recommended percentage of flour weight
  tips: string;
  icon: string;
}

export const breadAddIns: BreadAddIn[] = [
  // Seeds
  { id: 'sesame', name: 'שומשום', category: 'seeds', hydrationAdjust: 0, percentOfFlour: 5, tips: 'אפשר לטעון בתנור לטעם עמוק יותר', icon: '🌾' },
  { id: 'sunflower', name: 'גרעיני חמניה', category: 'seeds', hydrationAdjust: -2, percentOfFlour: 10, tips: 'להשרות במים למשך שעה לפני הוספה', icon: '🌻' },
  { id: 'pumpkin', name: 'גרעיני דלעת', category: 'seeds', hydrationAdjust: -2, percentOfFlour: 10, tips: 'אפשר להוסיף גם על גבי הלחם לפני אפייה', icon: '🎃' },
  { id: 'flax', name: 'זרעי פשתן', category: 'seeds', hydrationAdjust: 5, percentOfFlour: 8, tips: 'זרעי פשתן סופגים הרבה מים - להגדיל הידרציה', icon: '🌱' },
  { id: 'chia', name: 'צ\'יה', category: 'seeds', hydrationAdjust: 10, percentOfFlour: 5, tips: 'להשרות במים לפני הוספה - יוצרים ג\'ל', icon: '🌿' },
  { id: 'poppy', name: 'פרג', category: 'seeds', hydrationAdjust: 0, percentOfFlour: 3, tips: 'מעולה על גבי חלות ולחמים', icon: '🖤' },
  
  // Nuts
  { id: 'walnuts', name: 'אגוזי מלך', category: 'nuts', hydrationAdjust: -2, percentOfFlour: 15, tips: 'לקלות קלות בתנור לפני הוספה', icon: '🥜' },
  { id: 'hazelnuts', name: 'אגוזי לוז', category: 'nuts', hydrationAdjust: -2, percentOfFlour: 12, tips: 'נהדר עם לחם שוקולד או פירות יבשים', icon: '🌰' },
  { id: 'almonds', name: 'שקדים', category: 'nuts', hydrationAdjust: -1, percentOfFlour: 10, tips: 'לחתוך לפרוסות או לרסק גס', icon: '🥜' },
  
  // Dried Fruit
  { id: 'raisins', name: 'צימוקים', category: 'dried_fruit', hydrationAdjust: 0, percentOfFlour: 15, tips: 'להשרות במים חמים 10 דקות לפני', icon: '🍇' },
  { id: 'cranberries', name: 'חמוציות', category: 'dried_fruit', hydrationAdjust: 0, percentOfFlour: 12, tips: 'נהדר עם אגוזים בלחם חגיגי', icon: '🔴' },
  { id: 'dates', name: 'תמרים', category: 'dried_fruit', hydrationAdjust: 0, percentOfFlour: 10, tips: 'לחתוך לקוביות קטנות', icon: '🌴' },
  { id: 'figs', name: 'תאנים', category: 'dried_fruit', hydrationAdjust: 0, percentOfFlour: 12, tips: 'מעולה עם אגוזי מלך וגבינות', icon: '🫐' },
  
  // Cheese
  { id: 'parmesan', name: 'פרמזן', category: 'cheese', hydrationAdjust: -3, percentOfFlour: 10, tips: 'לגרד דק ולהוסיף בסוף הלישה', icon: '🧀' },
  { id: 'cheddar', name: 'צ\'דר', category: 'cheese', hydrationAdjust: -3, percentOfFlour: 15, tips: 'לחתוך לקוביות קטנות', icon: '🧀' },
  { id: 'feta', name: 'פטה', category: 'cheese', hydrationAdjust: 0, percentOfFlour: 10, tips: 'להוסיף בקיפול האחרון בעדינות', icon: '🧀' },
  
  // Herbs
  { id: 'rosemary', name: 'רוזמרין', category: 'herbs', hydrationAdjust: 0, percentOfFlour: 2, tips: 'לקצוץ דק - טעם חזק!', icon: '🌿' },
  { id: 'thyme', name: 'טימין', category: 'herbs', hydrationAdjust: 0, percentOfFlour: 2, tips: 'להוריד עלים מהגבעולים', icon: '🌿' },
  { id: 'zaatar', name: 'זעתר', category: 'herbs', hydrationAdjust: 0, percentOfFlour: 3, tips: 'מעולה על פוקאצ\'ה', icon: '🌿' },
  { id: 'garlic', name: 'שום קלוי', category: 'herbs', hydrationAdjust: 2, percentOfFlour: 5, tips: 'לקלות בתנור עד רך לפני הוספה', icon: '🧄' },
  
  // Vegetables
  { id: 'olives', name: 'זיתים', category: 'vegetables', hydrationAdjust: 0, percentOfFlour: 15, tips: 'לחתוך ולנקז היטב', icon: '🫒' },
  { id: 'sundried_tomato', name: 'עגבניות מיובשות', category: 'vegetables', hydrationAdjust: 0, percentOfFlour: 10, tips: 'לחתוך לרצועות דקות', icon: '🍅' },
  { id: 'onion', name: 'בצל מקורמל', category: 'vegetables', hydrationAdjust: 3, percentOfFlour: 15, tips: 'לקרמל לאט עד חום כהה', icon: '🧅' },
  { id: 'jalapeno', name: 'חלפיניו', category: 'vegetables', hydrationAdjust: 0, percentOfFlour: 5, tips: 'להסיר זרעים לחריפות פחותה', icon: '🌶️' },
  
  // Other
  { id: 'chocolate', name: 'שוקולד', category: 'other', hydrationAdjust: -2, percentOfFlour: 15, tips: 'להשתמש בשוקולד איכותי 70%+', icon: '🍫' },
  { id: 'honey', name: 'דבש', category: 'other', hydrationAdjust: -3, percentOfFlour: 5, tips: 'להוסיף למים לפני ערבוב', icon: '🍯' },
  { id: 'cinnamon', name: 'קינמון', category: 'other', hydrationAdjust: 0, percentOfFlour: 2, tips: 'מעולה עם צימוקים בחלה', icon: '🤎' },
];

export const addInCategories = {
  seeds: 'גרעינים וזרעים',
  nuts: 'אגוזים',
  dried_fruit: 'פירות יבשים',
  cheese: 'גבינות',
  herbs: 'עשבי תיבול',
  vegetables: 'ירקות',
  other: 'אחר',
};

// Baking Vessels / Equipment
export interface BakingVessel {
  id: string;
  name: string;
  description: string;
  tempRange: { min: number; max: number };
  steamMethod: string;
  tips: string[];
  bestFor: string[];
  icon: string;
}

export const bakingVessels: BakingVessel[] = [
  {
    id: 'dutch_oven',
    name: 'סיר ברזל יצוק (Dutch Oven)',
    description: 'הכלי הפופולרי ביותר ללחם מחמצת - יוצר סביבה לחה מושלמת',
    tempRange: { min: 230, max: 250 },
    steamMethod: 'המכסה כולא את האדים מהבצק עצמו',
    tips: [
      'לחמם את הסיר 30-45 דקות לפני אפייה',
      '25 דקות עם מכסה, 20-25 דקות בלי',
      'להשתמש בנייר אפייה להכנסה קלה',
    ],
    bestFor: ['לחם עגול (boule)', 'לחם כפרי', 'לחם מחמצת קלאסי'],
    icon: '🥘',
  },
  {
    id: 'combo_cooker',
    name: 'קומבו קוקר (Lodge)',
    description: 'מחבת עם מכסה עמוק - קל להכניס את הבצק',
    tempRange: { min: 230, max: 250 },
    steamMethod: 'אותו עיקרון כמו סיר ברזל יצוק',
    tips: [
      'הבצק על המחבת השטוחה, המכסה למעלה',
      'קל יותר להכנסת הבצק בבטחה',
      'מתאים ללחם שטוח יותר',
    ],
    bestFor: ['לחם עגול', 'לחם בטיגון'],
    icon: '🍳',
  },
  {
    id: 'baking_steel',
    name: 'פלטת פלדה (Baking Steel)',
    description: 'מעביר חום מעולה - לקרום תחתון פריך',
    tempRange: { min: 250, max: 280 },
    steamMethod: 'להוסיף קערת מים או קוביות קרח לתנור',
    tips: [
      'לחמם לפחות 45 דקות',
      'להתיז מים על דפנות התנור',
      'להשתמש עם קערת קרח ללחות מקסימלית',
    ],
    bestFor: ['פיצה', 'פוקאצ\'ה', 'לחם איטלקי'],
    icon: '🔲',
  },
  {
    id: 'baking_stone',
    name: 'אבן אפייה',
    description: 'חלופה זולה יותר לפלטת פלדה',
    tempRange: { min: 230, max: 260 },
    steamMethod: 'קערת מים או מגבות רטובות',
    tips: [
      'לחמם לפחות שעה - אבן סופגת חום לאט',
      'לא לרטב את האבן ישירות',
      'להיזהר משינויי טמפרטורה חדים',
    ],
    bestFor: ['פיצה', 'פיתות', 'לחמים שטוחים'],
    icon: '🪨',
  },
  {
    id: 'loaf_pan',
    name: 'תבנית לחם (Pullman)',
    description: 'ללחם סנדוויץ\' קלאסי עם צורה אחידה',
    tempRange: { min: 200, max: 220 },
    steamMethod: 'לא נדרש - התבנית שומרת על לחות',
    tips: [
      'לשמן היטב או לרפד בנייר',
      'למלא עד 2/3 מהגובה',
      'טמפרטורה נמוכה יותר לאפייה שווה',
    ],
    bestFor: ['לחם סנדוויץ\'', 'לחם טוסט', 'בריוש'],
    icon: '🍞',
  },
  {
    id: 'cloche',
    name: 'קלוש (כיפת אפייה)',
    description: 'כיפת חרס מיוחדת ללחם',
    tempRange: { min: 220, max: 240 },
    steamMethod: 'הכיפה כולאת אדים כמו סיר ברזל',
    tips: [
      'להשרות במים לפני שימוש ראשון',
      'מתאים לצורות עגולות או אובליות',
      'נותן קרום מיוחד וטעים',
    ],
    bestFor: ['לחם כפרי', 'לחם מחמצת'],
    icon: '🔔',
  },
];

// Bread Shaping Styles
export interface ShapingStyle {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: string[];
  tips: string[];
  proofingVessel: string;
  icon: string;
}

export const shapingStyles: ShapingStyle[] = [
  {
    id: 'boule',
    name: 'בול (עגול)',
    description: 'הצורה הקלאסית והפופולרית ביותר ללחם מחמצת',
    difficulty: 'easy',
    steps: [
      'להפוך את הבצק על משטח מקומח קלות',
      'לקפל את הקצוות לאמצע',
      'להפוך שוב ולסובב על המשטח',
      'ליצור מתח בשכבה החיצונית',
    ],
    tips: [
      'המשטח צריך להיות רק קצת מקומח',
      'התנועה הסיבובית יוצרת את המתח',
      'אם הבצק נדבק - להוסיף מעט קמח',
    ],
    proofingVessel: 'סלסילת התפחה עגולה (banneton)',
    icon: '⚪',
  },
  {
    id: 'batard',
    name: 'באטאר (אובלי)',
    description: 'צורה אובלית קלאסית - מתאימה לסנדוויצ\'ים',
    difficulty: 'medium',
    steps: [
      'לשטח את הבצק למלבן',
      'לקפל שליש עליון למטה',
      'לקפל שליש תחתון למעלה',
      'לגלגל ולסגור את התפר',
      'לעצב לצורה אובלית',
    ],
    tips: [
      'לשמור על מתח אחיד לכל האורך',
      'התפר צריך להיות סגור היטב',
      'להניח עם התפר למעלה בסלסילה',
    ],
    proofingVessel: 'סלסילת התפחה אובלית',
    icon: '🥖',
  },
  {
    id: 'baguette',
    name: 'באגט',
    description: 'הלחם הצרפתי הקלאסי - דורש תרגול',
    difficulty: 'hard',
    steps: [
      'לשטח את הבצק למלבן',
      'לקפל שליש עליון ולהדק',
      'לקפל שוב ולסגור',
      'לגלגל בתנועות קצרות מהמרכז החוצה',
      'להאריך עד לאורך הרצוי',
    ],
    tips: [
      'לעבוד מהר - הבצק מתחמם',
      'לשמור על עובי אחיד',
      'להניח על בד פשתן מקומח',
    ],
    proofingVessel: 'קמטים בבד פשתן (couche)',
    icon: '🥖',
  },
  {
    id: 'challah',
    name: 'חלה (קלועה)',
    description: 'לחם קלוע מסורתי לשבת וחגים',
    difficulty: 'medium',
    steps: [
      'לחלק את הבצק ל-3, 4 או 6 חלקים',
      'לגלגל כל חלק לחבל ארוך',
      'לחבר בקצה אחד',
      'לקלוע בסדר קבוע',
      'לסגור ולתפוס בקצה השני',
    ],
    tips: [
      'קליעת 3 - הכי קלה למתחילים',
      'קליעת 6 - מרשימה יותר',
      'למרוח ביצה לברק לפני אפייה',
    ],
    proofingVessel: 'תבנית אפייה רגילה',
    icon: '🪢',
  },
  {
    id: 'focaccia',
    name: 'פוקאצ\'ה',
    description: 'לחם איטלקי שטוח ורך עם שמן זית',
    difficulty: 'easy',
    steps: [
      'לשמן תבנית בשמן זית בנדיבות',
      'למתוח את הבצק לתבנית',
      'ללחוץ גומות עם האצבעות',
      'לטפטף שמן זית ולפזר תוספות',
    ],
    tips: [
      'הרבה שמן זית = הרבה טעם',
      'הגומות מחזיקות את השמן והתיבול',
      'אפשר להוסיף עגבניות, זיתים, רוזמרין',
    ],
    proofingVessel: 'תבנית אפייה מרובעת או מלבנית',
    icon: '🫓',
  },
];

// Scoring Patterns
export interface ScoringPattern {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  forShape: string[];
  icon: string;
}

export const scoringPatterns: ScoringPattern[] = [
  { id: 'single', name: 'חיתוך בודד', description: 'חיתוך אלכסוני אחד לאורך הלחם', difficulty: 'easy', forShape: ['boule', 'batard'], icon: '/' },
  { id: 'cross', name: 'צלב', description: 'שני חיתוכים מצטלבים', difficulty: 'easy', forShape: ['boule'], icon: '+' },
  { id: 'square', name: 'ריבוע', description: 'ארבעה חיתוכים יוצרים ריבוע', difficulty: 'easy', forShape: ['boule'], icon: '◻️' },
  { id: 'leaf', name: 'עלה', description: 'חיתוכים בזווית יוצרים דפוס עלה', difficulty: 'medium', forShape: ['batard'], icon: '🌿' },
  { id: 'wheat', name: 'שיבולת', description: 'חיתוכים אלכסוניים לסירוגין', difficulty: 'hard', forShape: ['batard', 'baguette'], icon: '🌾' },
  { id: 'spiral', name: 'ספירלה', description: 'חיתוך מעגלי מהמרכז החוצה', difficulty: 'hard', forShape: ['boule'], icon: '🌀' },
];

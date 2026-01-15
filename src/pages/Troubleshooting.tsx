import { ArrowRight, AlertTriangle, CheckCircle, HelpCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Problem {
  id: string;
  title: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

const problems: Problem[] = [
  {
    id: "flat-bread",
    title: "הלחם יוצא שטוח",
    symptoms: [
      "הלחם מתפשט לצדדים במקום לעלות למעלה",
      "אין גובה משמעותי ללחם",
      "הלחם נראה כמו פיתה עבה"
    ],
    causes: [
      "מחמצת חלשה או לא בשיא הפעילות",
      "תסיסת יתר (over-proofing) - הגלוטן התפרק",
      "בצק רופף מדי (הידרציה גבוהה מדי ליכולת)",
      "עיצוב לא מספיק הדוק",
      "קמח עם אחוז חלבון נמוך"
    ],
    solutions: [
      "בדוק שהמחמצת מכפילה את עצמה תוך 4-6 שעות",
      "קצר את זמן התפיחה או הפחת את הטמפרטורה",
      "הפחת את כמות המים ב-5-10%",
      "תרגל טכניקות עיצוב ליצירת מתח בבצק",
      "השתמש בקמח עם לפחות 12% חלבון"
    ],
    prevention: [
      "תזמן את השימוש במחמצת כשהיא בשיא",
      "בצע מבחן אצבע לבדיקת מוכנות הבצק",
      "התאם הידרציה לניסיון שלך"
    ],
    severity: 'high'
  },
  {
    id: "not-rising",
    title: "הבצק לא עולה",
    symptoms: [
      "אין שינוי בנפח אחרי שעות",
      "הבצק נשאר צפוף וכבד",
      "אין בועות בבצק"
    ],
    causes: [
      "מחמצת לא פעילה או מתה",
      "טמפרטורת חדר נמוכה מדי",
      "יותר מדי מלח שהרג את השמרים",
      "קמח ישן או מקולקל",
      "לא מספיק זמן תפיחה"
    ],
    solutions: [
      "האכל את המחמצת 2-3 פעמים לפני האפייה",
      "העבר את הבצק למקום חם יותר (24-28°C)",
      "ודא שהמלח הוא 2% מהקמח בלבד",
      "החלף לקמח טרי",
      "הארך את זמן התפיחה"
    ],
    prevention: [
      "שמור על מחמצת פעילה ובריאה",
      "מדוד את טמפרטורת החדר",
      "שקול מרכיבים בדיוק"
    ],
    severity: 'high'
  },
  {
    id: "soft-crust",
    title: "הקרום רך ולא פריך",
    symptoms: [
      "הקרום נעשה רך אחרי זמן קצר",
      "אין צליל 'קראנצ'י' כשחותכים",
      "הקרום דביק למגע"
    ],
    causes: [
      "לא מספיק אדים בתחילת האפייה",
      "הלחם הוצא מהתנור מוקדם מדי",
      "אחסון לא נכון אחרי האפייה",
      "הידרציה גבוהה מדי בבצק"
    ],
    solutions: [
      "הוסף אדים ל-20 הדקות הראשונות",
      "אפה עד לצבע חום כהה (לא בהיר)",
      "צנן על רשת, לא על משטח סגור",
      "אחסן בשקית נייר, לא בפלסטיק"
    ],
    prevention: [
      "השתמש בסיר ברזל יצוק עם מכסה",
      "מדוד טמפרטורה פנימית (96°C)",
      "השאר את הלחם לקרור לחלוטין"
    ],
    severity: 'medium'
  },
  {
    id: "gummy-inside",
    title: "הפנים דביק/לח מדי",
    symptoms: [
      "הלחם גומי ודביק בפנים",
      "קשה לחתוך - נדבק לסכין",
      "מרקם לח מדי"
    ],
    causes: [
      "הלחם לא נאפה מספיק",
      "נחתך לפני שהתקרר",
      "הידרציה גבוהה מדי",
      "תסיסת חסר (under-proofing)"
    ],
    solutions: [
      "הארך את זמן האפייה ב-10-15 דקות",
      "המתן לפחות שעה לפני חיתוך",
      "הפחת מים בפעם הבאה",
      "וודא שהבצק עלה כראוי"
    ],
    prevention: [
      "בדוק טמפרטורה פנימית (96°C)",
      "הקפד על זמן קירור מלא",
      "התאם הידרציה לסוג הקמח"
    ],
    severity: 'medium'
  },
  {
    id: "large-holes",
    title: "חורים גדולים מדי או לא אחידים",
    symptoms: [
      "חורים ענקיים בחלק מהלחם",
      "חלקים צפופים וחלקים ריקים",
      "מבנה לא אחיד"
    ],
    causes: [
      "עיצוב לא נכון - בועות אוויר לא חולקו",
      "קיפולים לא מספיקים במהלך התפיחה",
      "בצק לא הומוגני"
    ],
    solutions: [
      "בצע יותר קיפולים במהלך התפיחה הראשונה",
      "עצב בעדינות אך ביסודיות",
      "ערבב את הבצק באופן אחיד"
    ],
    prevention: [
      "בצע 3-4 סטים של קיפולים",
      "עצב בטכניקת מתיחה עדינה",
      "וודא לישה/ערבוב אחידים"
    ],
    severity: 'low'
  },
  {
    id: "burnt-bottom",
    title: "תחתית שרופה",
    symptoms: [
      "התחתית שחורה או כהה מאוד",
      "טעם מר בתחתית",
      "הקרום העליון בסדר אבל התחתון שרוף"
    ],
    causes: [
      "תנור חם מדי מלמטה",
      "אבן אפייה חמה מדי",
      "מיקום נמוך מדי בתנור",
      "תבנית כהה שסופגת חום"
    ],
    solutions: [
      "הנמך את הטמפרטורה ב-10-15°C",
      "הנח את הלחם גבוה יותר בתנור",
      "השתמש בתבנית בהירה",
      "הנח רשת מתחת לסיר"
    ],
    prevention: [
      "הכר את התנור שלך ונקודות החום",
      "סובב את הלחם במהלך האפייה",
      "השתמש במדחום תנור"
    ],
    severity: 'medium'
  },
  {
    id: "no-ear",
    title: "אין 'אוזן' או פתיחה יפה",
    symptoms: [
      "החריץ לא נפתח",
      "אין אפקט האוזן המאפיין",
      "הלחם נפתח במקומות אקראיים"
    ],
    causes: [
      "סכין לא חדה מספיק",
      "זווית חיתוך לא נכונה",
      "בצק יבש מדי על פני השטח",
      "תסיסת יתר - אין כוח להתרחב"
    ],
    solutions: [
      "השתמש בלהב גילוח חד",
      "חתוך בזווית של 30-45 מעלות",
      "רסס מים לפני החריצה",
      "קצר את זמן ההתפחה הסופית"
    ],
    prevention: [
      "שמור על להבים חדים",
      "תרגל את הזווית והעומק",
      "שמור על לחות בבצק"
    ],
    severity: 'low'
  },
  {
    id: "sour-taste",
    title: "טעם חמוץ מדי",
    symptoms: [
      "הלחם חמוץ מאוד",
      "טעם חומצי חזק",
      "ריח חומץ"
    ],
    causes: [
      "תפיחה ארוכה מדי",
      "מחמצת חמוצה מדי",
      "טמפרטורה גבוהה במהלך התפיחה",
      "יחס מחמצת גבוה מדי"
    ],
    solutions: [
      "קצר את זמן התפיחה",
      "רענן את המחמצת יותר לעיתים",
      "תפיח בטמפרטורה נמוכה יותר",
      "הפחת את כמות המחמצת"
    ],
    prevention: [
      "שמור על מחמצת מאוזנת",
      "עקוב אחר זמני תפיחה",
      "התאם לפי הטעם האישי"
    ],
    severity: 'low'
  },
  {
    id: "dense-crumb",
    title: "מרקם צפוף וכבד",
    symptoms: [
      "הלחם כבד מאוד ביד",
      "מרקם צפוף ללא חורים",
      "קשה ללעוס"
    ],
    causes: [
      "לא מספיק פיתוח גלוטן",
      "מחמצת חלשה",
      "קמח מלא רב מדי ללא התאמה",
      "לא מספיק קיפולים"
    ],
    solutions: [
      "הארך את הלישה או האוטוליזה",
      "חזק את המחמצת",
      "הוסף קמח לבן לתערובת",
      "בצע יותר קיפולים"
    ],
    prevention: [
      "בדוק פיתוח גלוטן (מבחן החלון)",
      "שמור על מחמצת פעילה",
      "אזן בין סוגי קמחים"
    ],
    severity: 'medium'
  },
  {
    id: "cracked-crust",
    title: "קרום סדוק בצורה לא רצויה",
    symptoms: [
      "סדקים בכל מקום בקרום",
      "הלחם נפתח ממקומות לא צפויים",
      "פני השטח לא חלקים"
    ],
    causes: [
      "הבצק התייבש מדי",
      "לא מספיק אדים בתחילת האפייה",
      "חריצה לא מספיק עמוקה",
      "תנור חם מדי"
    ],
    solutions: [
      "כסה את הבצק במהלך התפיחה",
      "הוסף יותר אדים",
      "חרוץ עמוק יותר (1-1.5 ס\"מ)",
      "הנמך את הטמפרטורה ההתחלתית"
    ],
    prevention: [
      "שמור על לחות בבצק",
      "השתמש בסיר סגור ל-20 דקות",
      "תרגל טכניקות חריצה"
    ],
    severity: 'low'
  }
];

const getSeverityColor = (severity: Problem['severity']) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  }
};

const getSeverityLabel = (severity: Problem['severity']) => {
  switch (severity) {
    case 'high': return 'חומרה גבוהה';
    case 'medium': return 'חומרה בינונית';
    case 'low': return 'חומרה נמוכה';
  }
};

export default function Troubleshooting() {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">פתרון בעיות נפוצות</h1>
      </div>

      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">טיפ חשוב</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                רוב הבעיות באפיית לחם מחמצת נובעות משלושה גורמים עיקריים: מחמצת לא מספיק חזקה, 
                תזמון לא נכון של התפיחה, או טמפרטורה לא מתאימה. התחל תמיד לבדוק את אלה.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Accordion type="single" collapsible className="space-y-3">
          {problems.map((problem) => (
            <AccordionItem 
              key={problem.id} 
              value={problem.id}
              className="border rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-right w-full">
                  <HelpCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium flex-1 text-right">{problem.title}</span>
                  <Badge className={getSeverityColor(problem.severity)}>
                    {getSeverityLabel(problem.severity)}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4 pt-2">
                  {/* Symptoms */}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      סימפטומים
                    </h4>
                    <ul className="space-y-1">
                      {problem.symptoms.map((symptom, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Causes */}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">
                      גורמים אפשריים
                    </h4>
                    <ul className="space-y-1">
                      {problem.causes.map((cause, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-red-500">✗</span>
                          {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      פתרונות
                    </h4>
                    <ul className="space-y-1">
                      {problem.solutions.map((solution, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prevention */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      מניעה לעתיד
                    </h4>
                    <ul className="space-y-1">
                      {problem.prevention.map((tip, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-amber-500">💡</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">עדיין צריך עזרה?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            אם הבעיה שלך לא מופיעה כאן או שהפתרונות לא עוזרים, נסה:
          </p>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span>📸</span>
              <span>צלם את הלחם והבצק בשלבים שונים לניתוח</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📝</span>
              <span>רשום את כל הפרמטרים (זמנים, טמפרטורות, כמויות)</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <span>נסה לשנות פרמטר אחד בכל פעם</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

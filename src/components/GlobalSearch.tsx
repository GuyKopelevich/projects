import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Calculator, GraduationCap, X, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { stybelFlours } from '@/data/stybel-flours';
import { bakingVessels, shapingStyles, scoringPatterns, breadAddIns } from '@/data/bread-extras';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: 'recipe' | 'knowledge' | 'tool';
  path: string;
  icon: React.ReactNode;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Static knowledge content for searching
const knowledgeContent: SearchResult[] = [
  // Flour guide
  ...stybelFlours.map(flour => ({
    id: `flour-${flour.id}`,
    title: flour.hebrewName,
    description: `${flour.proteinPercent}% חלבון • ${flour.bestFor.slice(0, 2).join(', ')}`,
    category: 'knowledge' as const,
    path: '/flours',
    icon: <GraduationCap className="h-4 w-4" />
  })),
  // Shaping styles
  ...shapingStyles.map(style => ({
    id: `shaping-${style.id}`,
    title: style.name,
    description: style.description,
    category: 'knowledge' as const,
    path: '/guides/shaping',
    icon: <GraduationCap className="h-4 w-4" />
  })),
  // Vessels
  ...bakingVessels.map(vessel => ({
    id: `vessel-${vessel.id}`,
    title: vessel.name,
    description: vessel.description,
    category: 'knowledge' as const,
    path: '/guides/vessels',
    icon: <GraduationCap className="h-4 w-4" />
  })),
  // Scoring
  ...scoringPatterns.map(pattern => ({
    id: `scoring-${pattern.id}`,
    title: pattern.name,
    description: pattern.description,
    category: 'knowledge' as const,
    path: '/guides/scoring',
    icon: <GraduationCap className="h-4 w-4" />
  })),
  // Add-ins
  ...breadAddIns.slice(0, 10).map(addIn => ({
    id: `addin-${addIn.id}`,
    title: addIn.name,
    description: addIn.tips,
    category: 'knowledge' as const,
    path: '/guides/addins',
    icon: <GraduationCap className="h-4 w-4" />
  })),
  // Knowledge pages
  { id: 'kb-hydration', title: 'הידרציה', description: 'כל מה שצריך לדעת על הידרציה בלחם', category: 'knowledge', path: '/tools', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'kb-fermentation', title: 'תסיסה', description: 'זמני תפיחה ותסיסה לפי טמפרטורה', category: 'knowledge', path: '/tools', icon: <GraduationCap className="h-4 w-4" /> },
  { id: 'kb-troubleshoot', title: 'פתרון בעיות', description: 'בעיות נפוצות בלחם מחמצת', category: 'knowledge', path: '/troubleshooting', icon: <GraduationCap className="h-4 w-4" /> },
];

// Tools content
const toolsContent: SearchResult[] = [
  { id: 'tool-hydration', title: 'מחשבון הידרציה', description: 'חישוב אחוז הידרציה', category: 'tool', path: '/tools', icon: <Calculator className="h-4 w-4" /> },
  { id: 'tool-fermentation', title: 'מחשבון תסיסה', description: 'חישוב זמני תפיחה', category: 'tool', path: '/tools', icon: <Calculator className="h-4 w-4" /> },
  { id: 'tool-weight', title: 'מחשבון משקל', description: 'חישוב משקל לחם סופי', category: 'tool', path: '/tools', icon: <Calculator className="h-4 w-4" /> },
  { id: 'tool-timer', title: 'טיימר אפייה', description: 'טיימרים לכל שלב', category: 'tool', path: '/tools', icon: <Calculator className="h-4 w-4" /> },
  { id: 'tool-weather', title: 'טיפים לפי מזג אוויר', description: 'התאמות לטמפרטורה', category: 'tool', path: '/tools', icon: <Calculator className="h-4 w-4" /> },
];

export default function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<SearchResult[]>([]);

  // Load recipes from localStorage
  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('recipes');
      const localRecipes = stored ? JSON.parse(stored) : [];
      setRecipes(localRecipes.map((r: any) => ({
        id: r.id,
        title: r.name,
        description: `${r.flour_total_g}g קמח • ${((r.water_g / r.flour_total_g) * 100).toFixed(0)}% הידרציה`,
        category: 'recipe' as const,
        path: `/recipes/${r.id}`,
        icon: <BookOpen className="h-4 w-4" />
      })));
    }
  }, [open]);

  // Combined search results
  const allContent = useMemo(() => [
    ...recipes,
    ...knowledgeContent,
    ...toolsContent,
  ], [recipes]);

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    ).slice(0, 15);
  }, [query, allContent]);

  // Group by category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      recipe: [],
      knowledge: [],
      tool: [],
    };
    results.forEach(r => groups[r.category].push(r));
    return groups;
  }, [results]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onOpenChange(false);
    setQuery('');
  };

  const categoryLabels: Record<string, string> = {
    recipe: 'מתכונים',
    knowledge: 'מרכז הידע',
    tool: 'כלים',
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    recipe: <BookOpen className="h-4 w-4" />,
    knowledge: <GraduationCap className="h-4 w-4" />,
    tool: <Calculator className="h-4 w-4" />,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            חיפוש
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 pt-2">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש מתכונים, כלים, טיפים..."
              className="pr-10 pl-10"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[50vh] px-4 pb-4">
          {query.trim() === '' ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">התחל להקליד כדי לחפש</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">לא נמצאו תוצאות עבור "{query}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedResults).map(([category, items]) => {
                if (items.length === 0) return null;
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 px-1">
                      {categoryIcons[category]}
                      <span className="font-medium">{categoryLabels[category]}</span>
                      <span className="bg-muted px-1.5 py-0.5 rounded">{items.length}</span>
                    </div>
                    <div className="space-y-1">
                      {items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-xl text-right",
                            "bg-card border border-border hover:border-primary/30 hover:bg-primary/5",
                            "transition-all duration-200"
                          )}
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                          </div>
                          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
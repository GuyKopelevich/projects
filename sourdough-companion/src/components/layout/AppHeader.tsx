import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import GlobalSearch from '@/components/GlobalSearch';

export function AppHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold font-rubik text-lg text-foreground">מחמצת</span>
          </div>
          
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="חיפוש"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </header>
      
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
import { Home, BookOpen, Calculator, GraduationCap, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/recipes', icon: BookOpen, label: 'מתכונים' },
  { path: '/tools', icon: Calculator, label: 'כלים' },
  { path: '/', icon: Home, label: 'בית', isCenter: true },
  { path: '/guides', icon: GraduationCap, label: 'ידע' },
  { path: '/settings', icon: Settings, label: 'הגדרות' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 max-w-md mx-auto h-full relative">
        {navItems.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          
          if (item.isCenter) {
            // Floating center button for Home
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center relative -mt-7"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                  "shadow-[0_4px_20px_rgba(0,0,0,0.3),0_0_20px_hsl(var(--primary)/0.4)]",
                  isActive 
                    ? "bg-gradient-to-br from-primary via-primary to-amber-600 scale-110" 
                    : "bg-gradient-to-br from-primary/90 to-amber-600/90 hover:scale-105"
                )}>
                  <Icon className={cn(
                    "h-6 w-6 transition-all",
                    isActive ? "text-primary-foreground" : "text-primary-foreground/90"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>{item.label}</span>
              </NavLink>
            );
          }
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                isActive && "bg-primary/15"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[10px] font-medium mt-0.5 transition-colors"
              )}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
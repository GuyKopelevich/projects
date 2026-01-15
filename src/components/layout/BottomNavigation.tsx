import { Home, ChefHat, BookOpen, Wheat, Settings } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'בית' },
  { path: '/bake/new', icon: ChefHat, label: 'אפייה' },
  { path: '/recipes', icon: BookOpen, label: 'מתכונים' },
  { path: '/starter', icon: Wheat, label: 'מחמצת' },
  { path: '/settings', icon: Settings, label: 'הגדרות' },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border shadow-elevated safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item flex-1 max-w-[72px]",
                isActive ? "nav-item-active" : "nav-item-inactive"
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

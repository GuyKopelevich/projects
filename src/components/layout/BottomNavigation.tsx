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
    <nav className="bottom-nav">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
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
              <div className={cn(
                "nav-item-icon",
                isActive && "bg-accent/10"
              )}>
                <Icon className={cn(
                  "h-5 w-5 transition-all",
                  isActive && "scale-110"
                )} />
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
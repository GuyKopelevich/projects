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
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
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
              <div className={cn("nav-item-icon")}>
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />
              </div>
              <span className={cn(
                "text-[11px] font-medium transition-colors",
                isActive && "text-primary"
              )}>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
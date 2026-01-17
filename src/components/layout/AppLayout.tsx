import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      {/* Cream spot decorations */}
      <div className="cream-spots">
        <div className="cream-spot cream-spot-1" />
        <div className="cream-spot cream-spot-2" />
        <div className="cream-spot cream-spot-3" />
        <div className="cream-spot cream-spot-4" />
      </div>

      {/* Main content */}
      <main className="content-container py-6 pb-24 min-h-screen relative">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
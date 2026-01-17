import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="app-shell">
      {/* Ambient glow effects */}
      <div className="ambient-glow">
        <div className="glow-orb glow-orb-1" />
        <div className="glow-orb glow-orb-2" />
        <div className="glow-orb glow-orb-3" />
      </div>

      {/* Main content */}
      <main className="content-container py-6 pb-28 min-h-screen relative">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
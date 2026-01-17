import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { AppHeader } from './AppHeader';

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

      {/* Header with search */}
      <AppHeader />

      {/* Main content */}
      <main className="content-container py-4 pb-28 min-h-screen relative">
        {children}
      </main>

      <BottomNavigation />
    </div>
  );
}
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface LayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPath, onNavigate, children }) => {
  const isHome = currentPath === '/' || currentPath === '';

  return (
    <div className="flex min-h-screen flex-col bg-theme-bg text-theme-text font-sans selection:bg-theme-primary selection:text-black transition-colors duration-200">
      {/* Fixed Sticky Header */}
      <Header currentPath={currentPath} onNavigate={onNavigate} />

      {/* Main Content Area: pt-20 (80px) exactly matches header height */}
      <main className={`flex-1 w-full ${isHome ? '' : 'pt-20'}`}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      {/* Master Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

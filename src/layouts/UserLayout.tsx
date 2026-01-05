/**
 * User Layout - Clean, trust-driven booking experience
 * Minimal chrome, focus on content
 */

import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface UserLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export function UserLayout({ children, hideHeader = false, hideFooter = false }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

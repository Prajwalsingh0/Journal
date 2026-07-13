'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/store';
import LandingPage from '@/components/bloom/LandingPage';
import AuthModal from '@/components/bloom/AuthModal';
import ReportModal from '@/components/bloom/ReportModal';
import AppLayout from '@/components/bloom/AppLayout';

export default function BloomApp() {
  const { isAuthenticated, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen">
      {!isAuthenticated ? (
        <LandingPage />
      ) : (
        <AppLayout />
      )}
      <AuthModal />
      <ReportModal />
      {/* Crisis Resources Banner - mobile only, above bottom nav */}
      {isAuthenticated && (
        <div className="fixed bottom-[4.5rem] left-0 right-0 z-30 md:hidden">
          <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-center py-1 px-3 text-[10px]">
            Need support? You&apos;re not alone 💜{' '}
            <span className="underline font-medium cursor-pointer" onClick={() => useAppStore.getState().setCurrentView('crisis')}>
              Get help now
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
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
    </div>
  );
}
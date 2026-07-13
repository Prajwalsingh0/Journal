'use client';

import { useAppStore, type AppView } from '@/stores/store';
import { Home, PenSquare, LayoutDashboard, User, Compass, Heart, Settings, LogOut, Flower2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import FeedView from './FeedView';
import WriteView from './WriteView';
import DashboardView from './DashboardView';
import ProfileView from './ProfileView';
import ExploreView from './ExploreView';
import EntryDetailView from './EntryDetailView';
import SettingsView from './SettingsView';
import CrisisView from './CrisisView';

const NAV_ITEMS: { id: AppView; icon: typeof Home; label: string; show: 'all' | 'auth' }[] = [
  { id: 'feed', icon: Home, label: 'Home', show: 'auth' },
  { id: 'explore', icon: Compass, label: 'Explore', show: 'auth' },
  { id: 'write', icon: PenSquare, label: 'Write', show: 'auth' },
  { id: 'dashboard', icon: LayoutDashboard, label: 'My Space', show: 'auth' },
  { id: 'profile', icon: User, label: 'Profile', show: 'auth' },
];

export default function AppLayout() {
  const { currentView, setCurrentView, currentUser, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    toast.success('See you soon! 💜');
  };

  const renderView = () => {
    switch (currentView) {
      case 'feed': return <FeedView />;
      case 'write': return <WriteView />;
      case 'dashboard': return <DashboardView />;
      case 'profile': return <ProfileView />;
      case 'explore': return <ExploreView />;
      case 'entry': return <EntryDetailView />;
      case 'settings': return <SettingsView />;
      case 'crisis': return <CrisisView />;
      default: return <FeedView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm fixed h-full z-40">
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('feed')}>
            <span className="text-2xl">🌸</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">Bloom</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentView === item.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.id === 'write' && (
                <span className="ml-auto bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded-full">NEW</span>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop sidebar bottom */}
        <div className="p-3 border-t border-border space-y-1">
          <button onClick={() => setCurrentView('crisis')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
            <Heart className="w-5 h-5" />
            Crisis Resources
          </button>
          <button onClick={() => setCurrentView('settings')} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <div className="px-4 py-2">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80" onClick={() => setCurrentView('profile')}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm">
                {currentUser?.avatarUrl ? '📷' : <Flower2 className="w-4 h-4 text-primary" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{currentUser?.displayName || currentUser?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{currentUser?.pronouns}</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-destructive/70 hover:bg-destructive/10 hover:text-destructive transition-all">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-4">
        <motion.div key={currentView} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {renderView()}
        </motion.div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-6 left-3 right-3 z-50">
        <div className="bg-card/95 backdrop-blur-lg border border-border rounded-2xl shadow-lg px-2 py-1.5 flex items-center justify-around">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                currentView === item.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {currentView === item.id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary/10 rounded-xl" transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }} />
              )}
              <item.icon className="w-5 h-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
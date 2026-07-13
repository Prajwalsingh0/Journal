'use client';

import { useAppStore, type ThemeName } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, Palette, Shield, Bell, Info, LogOut, Trash2 } from 'lucide-react';

const THEMES: { id: ThemeName; label: string; desc: string; colors: string[]; preview: string }[] = [
  { id: 'pastel', label: 'Soft Pastels', desc: 'Lavender, mint & peach', colors: ['#C4B5FD', '#A7F3D0', '#FECDD3', '#BFDBFE'], preview: 'light' },
  { id: 'dreamy', label: 'Dreamy', desc: 'Sunset & rose', colors: ['#F9A8D4', '#FCA5A5', '#C4B5FD', '#FDE68A'], preview: 'light' },
  { id: 'earthy', label: 'Earthy Tones', desc: 'Sage, terracotta & cream', colors: ['#B7CFB7', '#D4A574', '#C98B6E', '#A8C4A0'], preview: 'light' },
  { id: 'dark', label: 'Dark Mode', desc: 'Deep purples & rose gold', colors: ['#2D1F45', '#3D2860', '#C4A1FF', '#1A1028'], preview: 'dark' },
];

export default function SettingsView() {
  const { theme, setTheme, currentUser, setCurrentView, logout } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setCurrentView('profile')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Theme Selection */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Theme</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => {
                setTheme(t.id);
                toast.success(`Theme changed to ${t.label}! 🎨`);
              }}
            >
              <div className="flex gap-1.5 mb-2">
                {t.colors.map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-black/5" style={{ background: c }} />
                ))}
              </div>
              <p className="text-sm font-medium">{t.label}</p>
              <p className="text-[10px] text-muted-foreground">{t.desc}</p>
              {theme === t.id && (
                <Badge className="mt-2 text-[10px] rounded-full" variant="secondary">Active</Badge>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Safety Settings */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Safety & Privacy</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <p className="text-sm font-medium">Content Warnings</p>
              <p className="text-xs text-muted-foreground">Always show CW banners</p>
            </div>
            <Badge variant="default" className="rounded-full text-[10px]">ON</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <p className="text-sm font-medium">Safe Search</p>
              <p className="text-xs text-muted-foreground">Filter sensitive content</p>
            </div>
            <Badge variant="default" className="rounded-full text-[10px]">ON</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
            <div>
              <p className="text-sm font-medium">Screen Time Reminders</p>
              <p className="text-xs text-muted-foreground">Gentle wellness nudges</p>
            </div>
            <Badge variant="default" className="rounded-full text-[10px]">ON</Badge>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Account</h2>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start rounded-xl gap-2 text-destructive/70 hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="w-4 h-4" /> Sign Out
          </Button>
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground pb-4">
        Bloom Journal v1.0 · Made with 💜 for you
      </p>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useAppStore, INTEREST_OPTIONS } from '@/stores/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const PRONOUN_OPTIONS = ['she/her', 'they/them', 'he/him', 'prefer not to say'];

const KINDNESS_REMINDERS = [
  "Every voice matters here 💜",
  "This is your space to be real ✨",
  "Welcome to your safe corner 🌸",
  "You belong here 🦋",
];

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, authModalMode, setAuthModalMode, login, setTheme } = useAppStore();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pronouns, setPronouns] = useState('she/her');
  const [customPronoun, setCustomPronoun] = useState('');
  const [isUnder18, setIsUnder18] = useState<boolean | null>(null);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string>('pastel');
  const [loading, setLoading] = useState(false);
  const [reminder] = useState(() => KINDNESS_REMINDERS[Math.floor(Math.random() * KINDNESS_REMINDERS.length)]);

  const handleClose = () => {
    setShowAuthModal(false);
    setStep(1);
    setEmail(''); setPassword(''); setName(''); setDisplayName('');
    setPronouns('she/her'); setCustomPronoun(''); setIsUnder18(null);
    setAgeConfirmed(false); setInterests([]); setSelectedTheme('pastel');
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!ageConfirmed) {
      toast.error('Please confirm you are 15 or older');
      return;
    }
    if (isUnder18 === null) {
      toast.error('Please select your age range');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, name, displayName: displayName || name,
          pronouns: pronouns === 'custom' ? customPronoun : pronouns,
          customPronoun: pronouns === 'custom' ? customPronoun : null,
          isUnder18,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Sign up failed');
      }
      const user = await res.json();
      setTheme(selectedTheme as any);
      login(user);
      toast.success(`Welcome to Bloom, ${user.displayName || user.name}! 🌸`);
      handleClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      const user = await res.json();
      setTheme((user.theme || 'pastel') as any);
      login(user);
      toast.success(`Welcome back, ${user.displayName || user.name}! 💜`);
      handleClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest].slice(0, 8));
  };

  const themes = [
    { id: 'pastel', label: 'Soft Pastels', colors: ['#C4B5FD', '#A7F3D0', '#FECDD3', '#BFDBFE'] },
    { id: 'dreamy', label: 'Dreamy', colors: ['#F9A8D4', '#FCA5A5', '#C4B5FD', '#FDE68A'] },
    { id: 'earthy', label: 'Earthy', colors: ['#B7CFB7', '#D4A574', '#C98B6E', '#A8C4A0'] },
    { id: 'dark', label: 'Dark Mode', colors: ['#2D1F45', '#3D2860', '#C4A1FF', '#1A1028'] },
  ];

  return (
    <Dialog open={showAuthModal} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">🌸</span>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">Bloom</span>
              </div>
              <p className="text-sm text-muted-foreground font-normal">{reminder}</p>
            </DialogTitle>
          </DialogHeader>

          {/* Tab switcher */}
          <div className="flex rounded-xl bg-muted p-1 mt-4">
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authModalMode === 'signup' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => { setAuthModalMode('signup'); setStep(1); }}
            >
              Create Account
            </button>
            <button
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${authModalMode === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
              onClick={() => { setAuthModalMode('login'); setStep(1); }}
            >
              Sign In
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {authModalMode === 'signup' ? (
            <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-6 pb-6">
              {step === 1 && (
                <div className="space-y-4 animate-bloom-in">
                  {/* Age Gate */}
                  <div className="bg-accent/50 rounded-xl p-4 text-center">
                    <p className="text-sm font-medium mb-3">How old are you?</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant={isUnder18 === true ? 'default' : 'outline'} size="sm" onClick={() => setIsUnder18(true)} className="rounded-full">
                        Under 18
                      </Button>
                      <Button variant={isUnder18 === false ? 'default' : 'outline'} size="sm" onClick={() => setIsUnder18(false)} className="rounded-full">
                        18 or older
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Display Name *</Label>
                      <Input id="name" placeholder="What should we call you?" value={name} onChange={e => setName(e.target.value)} className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="displayName">Username (optional)</Label>
                      <Input id="displayName" placeholder="@yourname" value={displayName} onChange={e => setDisplayName(e.target.value)} className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 rounded-xl" />
                    </div>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input id="password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 rounded-xl" />
                    </div>
                  </div>
                  <Button className="w-full bloom-btn rounded-xl" onClick={() => setStep(2)} disabled={!name || !email || !password || isUnder18 === null}>
                    Continue ✨
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-bloom-in">
                  <div>
                    <Label className="mb-2 block">Your Pronouns</Label>
                    <div className="flex flex-wrap gap-2">
                      {PRONOUN_OPTIONS.map(p => (
                        <Badge key={p} variant={pronouns === p ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5 text-sm rounded-full" onClick={() => setPronouns(p)}>
                          {p}
                        </Badge>
                      ))}
                      <Badge variant={pronouns === 'custom' ? 'default' : 'outline'} className="cursor-pointer px-3 py-1.5 text-sm rounded-full" onClick={() => setPronouns('custom')}>
                        Custom
                      </Badge>
                    </div>
                    {pronouns === 'custom' && (
                      <Input placeholder="Your pronouns" value={customPronoun} onChange={e => setCustomPronoun(e.target.value)} className="mt-2 rounded-xl" />
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 block">Pick your interests ({interests.length}/8)</Label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                      {INTEREST_OPTIONS.map(i => (
                        <Badge key={i} variant={interests.includes(i) ? 'default' : 'outline'} className="cursor-pointer px-2.5 py-1 text-xs rounded-full" onClick={() => toggleInterest(i)}>
                          {i}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block">Choose your theme</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {themes.map(t => (
                        <div key={t.id} className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedTheme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => setSelectedTheme(t.id)}>
                          <div className="flex gap-1 mb-1.5">
                            {t.colors.map((c, i) => <div key={i} className="w-5 h-5 rounded-full" style={{ background: c }} />)}
                          </div>
                          <p className="text-xs font-medium">{t.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-2.5 p-3 bg-accent/30 rounded-xl cursor-pointer">
                    <input type="checkbox" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} className="mt-0.5 rounded" />
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      I confirm I am <strong>15 years or older</strong>. I agree to Bloom&apos;s Community Guidelines and understand this is a supportive, safe space for everyone.
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep(1)}>Back</Button>
                    <Button className="flex-1 bloom-btn rounded-xl" onClick={handleSignup} disabled={!ageConfirmed || loading}>
                      {loading ? 'Creating...' : 'Join Bloom 🌸'}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-6 pb-6">
              <div className="space-y-4 animate-bloom-in">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 rounded-xl" />
                </div>
                <Button className="w-full bloom-btn rounded-xl" onClick={handleLogin} disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In 💜'}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo accounts: luna@example.com, maya@example.com, sky@example.com (password: demo)
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
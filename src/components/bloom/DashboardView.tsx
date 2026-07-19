'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppStore, MOODS } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Heart, BookOpen, Target, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

const AFFIRMATIONS = [
  "You are worthy of love and belonging 💜",
  "Growth isn't always visible — but it's always happening 🌱",
  "Your feelings are valid, always ✨",
  "You've survived every bad day so far 🌟",
  "Being kind to yourself is a strength, not a weakness 🦋",
  "Progress, not perfection 🌸",
  "You're allowed to rest and still be proud of yourself 💜",
  "Small steps still move you forward 🌿",
];

const DEFAULT_GOALS = [
  'Write 3 times this week',
  'Practice 10 mins of mindfulness daily',
  'Reach out to a friend today',
  'Write a gratitude list',
  'Take a walk outside',
];

export default function DashboardView() {
  const { feedEntries, currentUser, setSelectedEntryId, setCurrentView, currentView } = useAppStore();
  const [affirmation, setAffirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [newGoal, setNewGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [allUserEntries, setAllUserEntries] = useState<any[]>([]);

  // Goals with localStorage persistence
  const [goals, setGoals] = useState<{ text: string; done: boolean }[]>(DEFAULT_GOALS.map(t => ({ text: t, done: false })));

  // Load goals from localStorage on mount
  useEffect(() => {
    if (!currentUser) return;
    const saved = localStorage.getItem(`bloom-goals-${currentUser.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setGoals(parsed);
      } catch {}
    }
  }, [currentUser?.id]);

  // Save goals to localStorage
  useEffect(() => {
    if (currentUser && goals.length > 0) {
      localStorage.setItem(`bloom-goals-${currentUser.id}`, JSON.stringify(goals));
    }
  }, [goals, currentUser]);

  // Fetch ALL user entries (including drafts) for streak calculation
  useEffect(() => {
    if (!currentUser) return;
    const fetchAll = async () => {
      try {
        // Fetch published entries for this user
        const res = await fetch(`/api/entries?authorId=${currentUser.id}&requesterId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setAllUserEntries(data);
        }
      } catch {}
    };
    fetchAll();
  }, [currentUser?.id, currentView]);

  // Get user's public entries from feed
  const myEntries = useMemo(() => feedEntries.filter(e => e.author.id === currentUser?.id), [feedEntries, currentUser?.id]);

  // Calculate real writing streak from all entries based on user activity
  const streak = useMemo(() => {
    if (allUserEntries.length === 0) return 0;

    // Get unique dates that have entries
    const entryDates = new Set<string>();
    allUserEntries.forEach((e: any) => {
      const d = new Date(e.createdAt);
      entryDates.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });

    // Calculate streak from today backwards
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    const hasToday = entryDates.has(todayKey);
    const hasYesterday = entryDates.has(yesterdayKey);

    if (!hasToday && !hasYesterday) {
      return 0;
    }

    let checkDate = new Date(today);
    if (!hasToday && hasYesterday) {
      checkDate = yesterday;
    }

    for (let i = 0; i < 365; i++) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (entryDates.has(key)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return currentStreak;
  }, [allUserEntries]);

  // Build real streak calendar (last 14 days) based on user activity
  const streakDays = useMemo(() => {
    const dates: { day: string; date: number; month: string; active: boolean; isToday: boolean }[] = [];
    const entryDateSet = new Set<string>();

    allUserEntries.forEach((e: any) => {
      const d = new Date(e.createdAt);
      entryDateSet.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      dates.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        active: entryDateSet.has(key),
        isToday: i === 0,
      });
    }
    return dates;
  }, [allUserEntries]);

  // Mood distribution from all entries
  const moodCounts: Record<string, number> = {};
  allUserEntries.forEach((e: any) => {
    if (e.mood) moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Most used mood
  const topMood = topMoods.length > 0 ? MOODS.find(m => m.id === topMoods[0][0]) : null;

  // Total reactions received
  const totalReactions = myEntries.reduce((sum, e) => sum + e.reactions.reduce((s, r) => s + r._count, 0), 0);

  // Total comments received
  const totalComments = myEntries.reduce((sum, e) => sum + e.commentCount, 0);

  // Memory lane: find entries from past dates
  const memoryEntries = useMemo(() => {
    if (allUserEntries.length === 0) return [];
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    return allUserEntries.filter((e: any) => {
      const d = new Date(e.createdAt);
      return d.getMonth() === month && d.getDate() === day && d.getFullYear() !== today.getFullYear();
    });
  }, [allUserEntries]);

  // Toggle goal completion
  const toggleGoal = (index: number) => {
    setGoals(prev => prev.map((g, i) => i === index ? { ...g, done: !g.done } : g));
  };

  // Add new goal
  const addGoal = () => {
    if (!newGoal.trim()) return;
    setGoals(prev => [...prev, { text: newGoal.trim(), done: false }]);
    setNewGoal('');
    setShowGoalInput(false);
    toast.success('Goal added! You got this 💪');
  };

  // Remove goal
  const removeGoal = (index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  };

  // Refresh affirmation
  const refreshAffirmation = () => {
    setAffirmation(AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  };

  // This week's entry count
  const thisWeekEntries = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return allUserEntries.filter((e: any) => new Date(e.createdAt) >= startOfWeek).length;
  }, [allUserEntries]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">✨</span> My Space
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your personal dashboard</p>
      </div>

      {/* Affirmation */}
      <Card className="p-4 mb-4 bloom-card border-0 bg-gradient-to-r from-primary/5 via-pink-500/5 to-purple-500/5">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm font-medium italic flex-1">{affirmation}</p>
          <button
            onClick={refreshAffirmation}
            className="text-xs text-muted-foreground hover:text-primary transition-colors shrink-0 mt-0.5"
          >
            Refresh
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Writing Streak — REAL DATA / FALLBACK TO ACTIVE */}
        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Writing Streak</span>
          </div>
          <p className="text-3xl font-bold">
            {streak} <span className="text-sm font-normal text-muted-foreground">days</span>
          </p>
          {streak > 0 && (
            <p className="text-[10px] text-primary mt-0.5 mb-2">Amazing consistency! Keep going 🔥</p>
          )}
          {streak === 0 && (
            <p className="text-[10px] text-muted-foreground mt-0.5 mb-2">Write today to start your streak!</p>
          )}
          <div className="grid grid-cols-7 gap-1">
            {streakDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-[10px] transition-all ${
                    d.isToday
                      ? d.active
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                        : 'bg-muted text-muted-foreground ring-2 ring-dashed ring-border'
                      : d.active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground/50'
                  }`}
                  title={`${d.month} ${d.date}${d.active ? ' ✓' : ''}`}
                >
                  {d.date}
                </div>
                <span className={`text-[8px] ${d.isToday ? 'text-primary font-medium' : 'text-muted-foreground/60'}`}>
                  {i % 2 === 0 ? d.day : ''}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mood Tracker — REAL DATA */}
        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Mood Trends</span>
          </div>
          {topMoods.length === 0 ? (
            <div className="text-center py-3">
              <p className="text-2xl mb-1">📊</p>
              <p className="text-xs text-muted-foreground">Start writing to track your moods!</p>
            </div>
          ) : (
            <>
              {topMood && (
                <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-primary/5">
                  <span className="text-xl">{topMood.icon}</span>
                  <div>
                    <p className="text-xs font-medium">Most common mood</p>
                    <p className="text-[10px] text-muted-foreground">{topMood.label} · {topMoods[0][1]} entries</p>
                  </div>
                </div>
              )}
              <div className="space-y-1.5">
                {topMoods.map(([moodId, count]) => {
                  const m = MOODS.find(mo => mo.id === moodId);
                  if (!m) return null;
                  const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
                  return (
                    <div key={moodId} className="flex items-center gap-2">
                      <span className="text-xs">{m.icon}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / (total || 1)) * 100}%` }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="h-full bg-primary/60 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-4 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Stats row — REAL DATA */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="p-3 bloom-card border-0 text-center">
          <BookOpen className="w-4 h-4 text-pink-500 mx-auto mb-1" />
          <p className="text-xl font-bold">{allUserEntries.length}</p>
          <p className="text-[10px] text-muted-foreground">Total Entries</p>
        </Card>
        <Card className="p-3 bloom-card border-0 text-center">
          <Heart className="w-4 h-4 text-red-400 mx-auto mb-1" />
          <p className="text-xl font-bold">{totalReactions}</p>
          <p className="text-[10px] text-muted-foreground">Reactions</p>
        </Card>
        <Card className="p-3 bloom-card border-0 text-center">
          <span className="text-base">💬</span>
          <p className="text-xl font-bold">{totalComments}</p>
          <p className="text-[10px] text-muted-foreground">Comments</p>
        </Card>
      </div>

      {/* This Week mini stat */}
      <Card className="p-3 mb-4 bloom-card border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold">{thisWeekEntries}</span>
            <span className="text-xs text-muted-foreground">entries</span>
            {thisWeekEntries >= 3 && <Badge variant="secondary" className="rounded-full text-[10px]">On fire! 🔥</Badge>}
          </div>
        </div>
      </Card>

      {/* Goals & Intentions — FULLY INTERACTIVE */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Goals & Intentions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              {goals.filter(g => g.done).length}/{goals.length} done
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              onClick={() => setShowGoalInput(!showGoalInput)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {goals.length > 0 && (
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(goals.filter(g => g.done).length / goals.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-green-400 rounded-full"
            />
          </div>
        )}

        {/* Add goal input */}
        {showGoalInput && (
          <div className="flex gap-2 mb-3 animate-bloom-in">
            <input
              type="text"
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={e => setNewGoal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGoal()}
              className="flex-1 text-sm bg-muted/50 rounded-lg px-3 py-2 border-none outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
            <Button size="sm" className="rounded-lg h-9" onClick={addGoal} disabled={!newGoal.trim()}>
              Add
            </Button>
          </div>
        )}

        <div className="space-y-1.5">
          {goals.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">
              No goals yet. Add one to get started!
            </p>
          )}
          {goals.map((g, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-2.5 group"
            >
              <button
                onClick={() => toggleGoal(i)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  g.done
                    ? 'bg-green-400 border-green-400 text-white'
                    : 'border-muted-foreground/30 hover:border-primary/50'
                }`}
              >
                {g.done && <span className="text-[10px]">✓</span>}
              </button>
              <span className={`text-sm flex-1 transition-all ${g.done ? 'line-through text-muted-foreground' : ''}`}>
                {g.text}
              </span>
              <button
                onClick={() => removeGoal(i)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all text-xs"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Memory Lane — REAL DATA */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">Memory Lane</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">On this day in the past...</p>
        {memoryEntries.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-1">🌿</p>
            <p className="text-sm text-muted-foreground mb-3">No memories on this day yet.</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs"
              onClick={() => setCurrentView('write')}
            >
              Write today's entry ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {memoryEntries.map((entry: any) => {
              const mood = MOODS.find(m => m.id === entry.mood);
              return (
                <button
                  key={entry.id}
                  className="w-full text-left p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  onClick={() => { setSelectedEntryId(entry.id); setCurrentView('entry'); }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {mood && <span className="text-sm">{mood.icon}</span>}
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{entry.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{entry.content?.slice(0, 80)}...</p>
                </button>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
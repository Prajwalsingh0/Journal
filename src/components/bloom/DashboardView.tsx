'use client';

import { useState, useEffect } from 'react';
import { useAppStore, MOODS, type JournalEntryData } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Flame, Sparkles, TrendingUp, Heart, BookOpen, Target, Calendar } from 'lucide-react';

const AFFIRMATIONS = [
  "You are worthy of love and belonging 💜",
  "Growth isn't always visible — but it's always happening 🌱",
  "Your feelings are valid, always ✨",
  "You've survived every bad day so far 🌟",
  "Being kind to yourself is a strength, not a weakness 🦋",
  "Progress, not perfection 🌸",
];

const GOALS_PLACEHOLDER = [
  { text: 'Write 3 times this week', done: true },
  { text: 'Practice 10 mins of mindfulness daily', done: false },
  { text: 'Reach out to a friend today', done: true },
  { text: 'Write a gratitude list', done: false },
];

export default function DashboardView() {
  const { feedEntries, currentUser, setSelectedEntryId, setCurrentView } = useAppStore();
  const [affirmation] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);
  const [streak, setStreak] = useState(5);

  // Get user's entries
  const myEntries = feedEntries.filter(e => e.author.id === currentUser?.id);

  // Mood distribution
  const moodCounts: Record<string, number> = {};
  myEntries.forEach(e => { moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1; });
  const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Streak calendar (last 7 days)
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const hasEntry = Math.random() > 0.3; // Simulated
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate(), active: hasEntry };
  });

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
          <p className="text-sm font-medium italic">{affirmation}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Writing Streak */}
        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Writing Streak</span>
          </div>
          <p className="text-3xl font-bold">{streak} <span className="text-sm font-normal text-muted-foreground">days</span></p>
          <div className="flex gap-1.5 mt-3">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  d.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {d.date}
                </div>
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Mood Tracker */}
        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Mood Trends</span>
          </div>
          {topMoods.length === 0 ? (
            <p className="text-xs text-muted-foreground">Start writing to track your moods!</p>
          ) : (
            <div className="space-y-2">
              {topMoods.map(([moodId, count]) => {
                const m = MOODS.find(mo => mo.id === moodId);
                if (!m) return null;
                return (
                  <div key={moodId} className="flex items-center gap-2">
                    <span className="text-sm">{m.icon}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${(count / (myEntries.length || 1)) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-4 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Stats */}
        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium">Total Entries</span>
          </div>
          <p className="text-3xl font-bold">{myEntries.length}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Keep going! Every word matters.</p>
        </Card>

        <Card className="p-4 bloom-card border-0">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-sm font-medium">Reactions Received</span>
          </div>
          <p className="text-3xl font-bold">
            {myEntries.reduce((sum, e) => sum + e.reactions.reduce((s, r) => s + r._count, 0), 0)}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">Your words touch hearts 💜</p>
        </Card>
      </div>

      {/* Goals & Affirmations Board */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium">Goals & Intentions</span>
        </div>
        <div className="space-y-2">
          {GOALS_PLACEHOLDER.map((g, i) => (
            <label key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <input type="checkbox" defaultChecked={g.done} className="rounded" />
              <span className={`text-sm ${g.done ? 'line-through text-muted-foreground' : ''}`}>{g.text}</span>
            </label>
          ))}
        </div>
      </Card>

      {/* Memory Lane */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium">Memory Lane</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">On this day in the past...</p>
        <div className="text-center py-4">
          <p className="text-2xl mb-1">🌿</p>
          <p className="text-sm text-muted-foreground">Start journaling to see your memories here!</p>
        </div>
      </Card>
    </div>
  );
}
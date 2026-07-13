'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore, MOODS, type JournalEntryData, TOPICS, VIBE_TAGS } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, Sparkles, TrendingUp } from 'lucide-react';
import EntryCard from './EntryCard';

const DAILY_PROMPTS = [
  "What made you smile today?",
  "Write a letter to your future self.",
  "What are three things you're grateful for?",
  "Describe a moment that took your breath away.",
  "What's one thing you'd tell your younger self?",
  "What boundary do you need to set this week?",
  "What does self-love look like for you today?",
  "Write about a challenge that made you stronger.",
];

export default function FeedView() {
  const { feedEntries, setFeedEntries, feedFilter, setFeedFilter, setSelectedEntryId, setCurrentView, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState('');
  const [showTopics, setShowTopics] = useState(false);
  const [prompt] = useState(() => DAILY_PROMPTS[Math.floor(Math.random() * DAILY_PROMPTS.length)]);

  const fetchEntries = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (feedFilter === 'following' && currentUser) params.set('filter', 'following');
      params.set('authorId', currentUser?.id || '');
      if (activeTopic) params.set('topic', activeTopic);
      const res = await fetch(`/api/entries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setFeedEntries(data);
      }
    } catch {}
  }, [feedFilter, activeTopic, currentUser, setFeedEntries]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = feedEntries.filter(e => {
    if (!search) return true;
    const s = search.toLowerCase();
    return e.title.toLowerCase().includes(s) || e.content.toLowerCase().includes(s) || e.tags.some(t => t.toLowerCase().includes(s));
  });

  const openEntry = (id: string) => {
    setSelectedEntryId(id);
    setCurrentView('entry');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🌸</span> Discover
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Stories from the community</p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full gap-1.5" onClick={() => setShowTopics(!showTopics)}>
            <Filter className="w-3.5 h-3.5" />
            Topics
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entries, tags, moods..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-card border-border"
          />
        </div>
      </div>

      {/* Topic filter bar */}
      {showTopics && (
        <div className="mb-4 p-3 bg-card rounded-xl border border-border animate-bloom-in">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 mb-2">
            <Badge variant={activeTopic === '' ? 'default' : 'outline'} className="cursor-pointer whitespace-nowrap rounded-full" onClick={() => setActiveTopic('')}>
              All
            </Badge>
            {TOPICS.map(t => (
              <Badge key={t.id} variant={activeTopic === t.id ? 'default' : 'outline'} className="cursor-pointer whitespace-nowrap rounded-full" onClick={() => setActiveTopic(activeTopic === t.id ? '' : t.id)}>
                {t.icon} {t.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Trending tags */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 pb-1">
        {VIBE_TAGS.slice(0, 8).map(t => (
          <Badge key={t.id} variant="secondary" className="cursor-pointer whitespace-nowrap rounded-full text-xs hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => setSearch(t.label.replace('#', ''))}>
            {t.label}
          </Badge>
        ))}
      </div>

      {/* Daily prompt */}
      <Card className="p-4 mb-4 bloom-card border-0 bg-gradient-to-r from-primary/5 to-pink-500/5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-primary mb-1">Today&apos;s Writing Prompt</p>
            <p className="text-sm text-foreground">{prompt}</p>
            <Button size="sm" variant="ghost" className="mt-2 text-xs h-7 px-3 rounded-full" onClick={() => setCurrentView('write')}>
              Write about this →
            </Button>
          </div>
        </div>
      </Card>

      {/* Feed filter tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'following', 'trending'].map(f => (
          <Button
            key={f}
            variant={feedFilter === f ? 'default' : 'ghost'}
            size="sm"
            className={`rounded-full text-xs capitalize ${feedFilter === f ? '' : 'text-muted-foreground'}`}
            onClick={() => setFeedFilter(f)}
          >
            {f === 'trending' && <TrendingUp className="w-3 h-3 mr-1" />}
            {f}
          </Button>
        ))}
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="p-8 text-center bloom-card border-0">
            <p className="text-3xl mb-3">🌱</p>
            <p className="text-sm text-muted-foreground">No entries yet. Be the first to share!</p>
          </Card>
        ) : (
          filteredEntries.map((entry, i) => (
            <EntryCard key={entry.id} entry={entry} index={i} onClick={() => openEntry(entry.id)} />
          ))
        )}
      </div>
    </div>
  );
}
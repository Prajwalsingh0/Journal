'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppStore, MOODS, VIBE_TAGS, CONTENT_WARNINGS, REACTION_TYPES, type JournalEntryData } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ArrowLeft, ImagePlus, Music, Calendar, Eye, EyeOff, Users, Send, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export default function WriteView() {
  const {
    currentUser, setCurrentView, draftTitle, draftContent, draftMood, draftTags,
    draftWarnings, draftVisibility, draftIsAnonymous, draftFontStyle, draftMusicMood,
    setDraftField, resetDraft,
  } = useAppStore();
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-save indicator
  useEffect(() => {
    if (draftContent && draftTitle) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      const timer = setTimeout(() => {
        // In a real app, we'd save draft to server
      }, 3000);
      setAutoSaveTimer(timer);
    }
    return () => { if (autoSaveTimer) clearTimeout(autoSaveTimer); };
  }, [draftContent, draftTitle]);

  const toggleTag = (tag: string) => {
    const label = tag.replace('#', '');
    const current = draftTags;
    setDraftField('draftTags', current.includes(label) ? current.filter(t => t !== label) : [...current, label].slice(0, 8));
  };

  const toggleWarning = (w: string) => {
    const current = draftWarnings;
    setDraftField('draftWarnings', current.includes(w) ? current.filter(c => c !== w) : [...current, w]);
  };

  const handlePublish = async () => {
    if (!currentUser) return;
    if (!draftTitle.trim()) {
      toast.error('Give your entry a title');
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftTitle,
          content: draftContent,
          mood: draftMood,
          tags: draftTags,
          contentWarnings: draftWarnings,
          musicMood: draftMusicMood || null,
          fontStyle: draftFontStyle,
          visibility: draftVisibility,
          isAnonymous: draftIsAnonymous,
          isDraft: false,
          authorId: currentUser.id,
        }),
      });
      if (!res.ok) throw new Error('Failed to publish');
      toast.success('Your bloom is live! 🌸');
      resetDraft();
      setCurrentView('feed');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!currentUser || !draftTitle.trim()) return;
    try {
      await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftTitle, content: draftContent, mood: draftMood,
          tags: draftTags, contentWarnings: draftWarnings, musicMood: draftMusicMood,
          fontStyle: draftFontStyle, visibility: draftVisibility,
          isAnonymous: draftIsAnonymous, isDraft: true, authorId: currentUser.id,
        }),
      });
      toast.success('Draft saved 💜');
    } catch {}
  };

  const selectedMood = MOODS.find(m => m.id === draftMood);

  const fontOptions = [
    { id: 'sans-serif', label: 'Clean', sample: 'Sans-serif' },
    { id: 'serif', label: 'Classic', sample: 'Serif' },
    { id: 'handwriting', label: 'Personal', sample: 'Handwriting' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" className="rounded-full gap-1" onClick={() => setCurrentView('feed')}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button size="sm" className="bloom-btn rounded-full gap-1" onClick={handlePublish} disabled={publishing}>
            <Send className="w-3.5 h-3.5" />
            {publishing ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Mood Selector */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <button className="flex items-center justify-between w-full" onClick={() => setShowMoodPicker(!showMoodPicker)}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">How are you feeling?</span>
            {selectedMood && (
              <Badge variant="secondary" className={`rounded-full gap-1 ${selectedMood.colorClass}`}>
                {selectedMood.icon} {selectedMood.label}
              </Badge>
            )}
          </div>
          {showMoodPicker ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showMoodPicker && (
          <div className="mt-3 grid grid-cols-5 gap-2 animate-bloom-in">
            {MOODS.map(m => (
              <button
                key={m.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all hover:scale-105 ${
                  draftMood === m.id ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'
                }`}
                onClick={() => { setDraftField('draftMood', m.id); setShowMoodPicker(false); }}
              >
                <span className="text-xl">{m.icon}</span>
                <span className="text-[10px] text-muted-foreground leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Title & Content */}
      <Card className="p-4 md:p-6 mb-4 bloom-card border-0">
        <input
          type="text"
          placeholder="Give your entry a title..."
          value={draftTitle}
          onChange={e => setDraftField('draftTitle', e.target.value)}
          className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 mb-3"
        />
        <textarea
          ref={textareaRef}
          placeholder="What's on your mind? Write freely — this is your safe space..."
          value={draftContent}
          onChange={e => setDraftField('draftContent', e.target.value)}
          rows={10}
          className={`w-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 text-sm leading-relaxed ${
            draftFontStyle === 'handwriting' ? 'font-handwriting text-lg' : draftFontStyle === 'serif' ? 'font-journal-serif' : ''
          }`}
        />

        {/* Music mood */}
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
          <Music className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="What are you listening to? (optional)"
            value={draftMusicMood}
            onChange={e => setDraftField('draftMusicMood', e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-xs text-muted-foreground placeholder:text-muted-foreground/40"
          />
        </div>
      </Card>

      {/* Tags */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <button className="flex items-center justify-between w-full" onClick={() => setShowTags(!showTags)}>
          <span className="text-sm font-medium">Vibe Tags ({draftTags.length}/8)</span>
          {showTags ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showTags && (
          <div className="flex flex-wrap gap-1.5 mt-3 animate-bloom-in">
            {VIBE_TAGS.map(t => (
              <Badge
                key={t.id}
                variant={draftTags.includes(t.label.replace('#', '')) ? 'default' : 'outline'}
                className="cursor-pointer rounded-full text-xs"
                onClick={() => toggleTag(t.label)}
              >
                {t.label}
              </Badge>
            ))}
          </div>
        )}
        {draftTags.length > 0 && !showTags && (
          <div className="flex flex-wrap gap-1 mt-2">
            {draftTags.map(t => (
              <Badge key={t} variant="secondary" className="rounded-full text-xs">
                #{t}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Advanced Options */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <button className="flex items-center justify-between w-full" onClick={() => setShowAdvanced(!showAdvanced)}>
          <span className="text-sm font-medium">Options</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showAdvanced && (
          <div className="space-y-4 mt-4 animate-bloom-in">
            {/* Font style */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Font Style</Label>
              <div className="flex gap-2">
                {fontOptions.map(f => (
                  <button
                    key={f.id}
                    className={`px-4 py-2 rounded-xl border text-sm transition-all ${
                      draftFontStyle === f.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    } ${f.id === 'handwriting' ? 'font-handwriting text-lg' : f.id === 'serif' ? 'font-journal-serif' : ''}`}
                    onClick={() => setDraftField('draftFontStyle', f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Visibility */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Visibility</Label>
              <div className="flex gap-2">
                {[
                  { id: 'public' as const, icon: <Eye className="w-4 h-4" />, label: 'Public' },
                  { id: 'friends' as const, icon: <Users className="w-4 h-4" />, label: 'Friends' },
                  { id: 'private' as const, icon: <EyeOff className="w-4 h-4" />, label: 'Private' },
                ].map(v => (
                  <button
                    key={v.id}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all ${
                      draftVisibility === v.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setDraftField('draftVisibility', v.id)}
                  >
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Anonymous toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Post Anonymously</p>
                <p className="text-xs text-muted-foreground">Your name won&apos;t be shown</p>
              </div>
              <Switch checked={draftIsAnonymous} onCheckedChange={v => setDraftField('draftIsAnonymous', v)} />
            </div>
          </div>
        )}
      </Card>

      {/* Kindness Reminder before publish */}
      <div className="bg-primary/5 rounded-xl p-3 text-center">
        <p className="text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 inline text-primary mr-1" />
          Remember: this is a safe space. Your words have power — use them kindly 💜
        </p>
      </div>
    </div>
  );
}
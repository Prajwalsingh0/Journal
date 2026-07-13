'use client';

import { useState, useMemo } from 'react';
import { useAppStore, INTEREST_OPTIONS, type JournalEntryData } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Settings, User, Flower2, PenLine } from 'lucide-react';
import EntryCard from './EntryCard';

export default function ProfileView() {
  const {
    currentUser, updateProfile, setCurrentView, setSelectedEntryId, feedEntries,
  } = useAppStore();
  const [tab, setTab] = useState<'entries' | 'about'>('entries');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [interests, setInterests] = useState<string[]>(currentUser?.interests || []);

  const entries = useMemo(() => feedEntries.filter(e => e.author.id === currentUser?.id), [feedEntries, currentUser?.id]);

  const toggleInterest = (i: string) => {
    setInterests(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i].slice(0, 8));
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id, displayName, bio, interests }),
      });
      if (res.ok) {
        const data = await res.json();
        updateProfile(data);
        setEditing(false);
        toast.success('Profile updated! ✨');
      }
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const openEntry = (id: string) => {
    setSelectedEntryId(id);
    setCurrentView('entry');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      {/* Profile Header */}
      <Card className="bloom-card border-0 overflow-hidden mb-4">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-primary/20 via-pink-500/20 to-purple-500/20 relative">
          <div className="absolute -bottom-8 left-5">
            <div className="w-16 h-16 rounded-2xl bg-card border-2 border-card flex items-center justify-center text-2xl shadow-sm">
              {currentUser.avatarUrl ? '📷' : <Flower2 className="w-8 h-8 text-primary" />}
            </div>
          </div>
        </div>
        <div className="pt-10 px-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{currentUser.displayName || currentUser.name}</h2>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full">
                  {currentUser.pronouns}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{currentUser.email}</p>
            </div>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" className="rounded-full text-xs gap-1" onClick={() => setCurrentView('settings')}>
                <Settings className="w-3 h-3" /> Settings
              </Button>
              <Button size="sm" className="rounded-full text-xs" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </div>

          {editing ? (
            <div className="space-y-3 mt-4 animate-bloom-in">
              <div>
                <Label className="text-xs">Display Name</Label>
                <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs">Bio</Label>
                <Textarea value={bio} onChange={e => setBio(e.target.value)} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block">Interests ({interests.length}/8)</Label>
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_OPTIONS.map(i => (
                    <Badge key={i} variant={interests.includes(i) ? 'default' : 'outline'} className="cursor-pointer rounded-full text-xs" onClick={() => toggleInterest(i)}>
                      {i}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button size="sm" className="rounded-full" onClick={saveProfile}>Save Changes</Button>
            </div>
          ) : (
            <>
              {currentUser.bio && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{currentUser.bio}</p>}
              {interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {interests.map(i => (
                    <Badge key={i} variant="secondary" className="rounded-full text-xs">{i}</Badge>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-muted/50 p-1 rounded-xl">
        <button className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'entries' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`} onClick={() => setTab('entries')}>
          <PenLine className="w-4 h-4 inline mr-1" /> Entries
        </button>
        <button className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'about' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`} onClick={() => setTab('about')}>
          <User className="w-4 h-4 inline mr-1" /> About
        </button>
      </div>

      {tab === 'entries' ? (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-8 text-center bloom-card border-0">
              <p className="text-3xl mb-3">📝</p>
              <p className="text-sm text-muted-foreground mb-3">Your journal is waiting for its first entry</p>
              <Button size="sm" className="rounded-full" onClick={() => setCurrentView('write')}>Write your first entry ✨</Button>
            </Card>
          ) : (
            entries.map((entry, i) => (
              <EntryCard key={entry.id} entry={entry} index={i} onClick={() => openEntry(entry.id)} />
            ))
          )}
        </div>
      ) : (
        <Card className="p-5 bloom-card border-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Member since</span>
              <span className="text-sm font-medium">July 2025</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total entries</span>
              <span className="text-sm font-medium">{entries.length}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <Badge variant="secondary" className="rounded-full capitalize">{currentUser.theme}</Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Age group</span>
              <span className="text-sm font-medium">{currentUser.isUnder18 ? 'Under 18' : '18+'}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
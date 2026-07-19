'use client';

import { useState, useEffect } from 'react';
import { useAppStore, MOODS, type JournalEntryData } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Music, AlertTriangle, Send, Heart, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const KINDNESS_PROMPTS = [
  "What did this make you feel? 💭",
  "Share something kind and supportive 🌸",
  "Your words matter — be thoughtful 💜",
  "Send some love their way ✨",
];

export default function EntryDetailView() {
  const {
    selectedEntryId, setCurrentView, currentUser, feedEntries, setFeedEntries,
    showComments, setShowComments, setShowReportModal, setReportTargetEntryId,
  } = useAppStore();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [kindnessPrompt] = useState(() => KINDNESS_PROMPTS[Math.floor(Math.random() * KINDNESS_PROMPTS.length)]);
  const [showCWRevealed, setShowCWRevealed] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});
  const [postingComment, setPostingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [entry, setEntry] = useState<JournalEntryData | null>(null);
  const [loadingEntry, setLoadingEntry] = useState(true);

  useEffect(() => {
    if (!selectedEntryId) return;
    const fetchEntry = async () => {
      setLoadingEntry(true);
      const local = feedEntries.find(e => e.id === selectedEntryId);
      if (local) {
        setEntry(local);
        setLoadingEntry(false);
        return;
      }
      try {
        const res = await fetch(`/api/entries?id=${selectedEntryId}&requesterId=${currentUser?.id || ''}`);
        if (res.ok) {
          setEntry(await res.json());
        }
      } catch {}
      setLoadingEntry(false);
    };
    fetchEntry();
  }, [selectedEntryId, feedEntries, currentUser?.id]);

  useEffect(() => {
    if (selectedEntryId) fetchComments();
  }, [selectedEntryId]);

  const fetchComments = async () => {
    if (!selectedEntryId) return;
    try {
      const res = await fetch(`/api/comments?entryId=${selectedEntryId}`);
      if (res.ok) setComments(await res.json());
    } catch {}
  };

  if (loadingEntry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center animate-pulse">
        <p className="text-sm text-muted-foreground">Loading entry...</p>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-3xl mb-3">🌱</p>
        <p className="text-muted-foreground">Entry not found</p>
        <Button variant="outline" className="mt-4 rounded-full" onClick={() => setCurrentView('feed')}>Back to Feed</Button>
      </div>
    );
  }

  const mood = MOODS.find(m => m.id === entry.mood);
  const fontClass = entry.fontStyle === 'handwriting' ? 'font-handwriting text-lg' : entry.fontStyle === 'serif' ? 'font-journal-serif' : '';
  const isAuthor = currentUser && ((entry as any).authorId === currentUser.id || entry.author.id === currentUser.id);

  const handleReaction = async (type: string) => {
    if (!currentUser) return;
    setUserReactions(prev => ({ ...prev, [type]: !prev[type] }));
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: currentUser.id, entryId: entry.id, type }),
      });
      // Refresh entries
      const res = await fetch('/api/entries');
      if (res.ok) setFeedEntries(await res.json());
    } catch {}
  };

  const handleComment = async () => {
    if (!currentUser || !newComment.trim() || !selectedEntryId) return;
    setPostingComment(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: currentUser.id, entryId: selectedEntryId, content: newComment.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [...prev, comment]);
        setNewComment('');
        toast.success('Comment posted 💜');
      }
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleReport = () => {
    setReportTargetEntryId(entry.id);
    setShowReportModal(true);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/entries?id=${entry.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Entry deleted successfully 💜');
        setFeedEntries(feedEntries.filter(e => e.id !== entry.id));
        setCurrentView('feed');
      } else {
        toast.error('Failed to delete entry');
      }
    } catch {
      toast.error('Error deleting entry');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" className="rounded-full gap-1" onClick={() => setCurrentView('feed')}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        {isAuthor ? (
          <Button variant="ghost" size="sm" className="rounded-full text-destructive hover:bg-destructive/10 text-xs font-semibold gap-1" onClick={handleDelete} disabled={deleting}>
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="rounded-full text-destructive/70 text-xs" onClick={handleReport}>
            Report
          </Button>
        )}
      </div>

      {/* Content warning overlay */}
      {entry.contentWarnings.length > 0 && !showCWRevealed && (
        <Card className="p-6 mb-4 bloom-card border-0 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold mb-1">Content Warning</h3>
          <p className="text-sm text-muted-foreground mb-1">This entry discusses:</p>
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {entry.contentWarnings.map(w => (
              <Badge key={w} variant="destructive" className="rounded-full text-xs">{w}</Badge>
            ))}
          </div>
          <Button className="rounded-full" onClick={() => setShowCWRevealed(true)}>
            I understand, show entry
          </Button>
        </Card>
      )}

      {(showCWRevealed || entry.contentWarnings.length === 0) && (
        <Card className="bloom-card border-0 overflow-hidden animate-bloom-in">
          <div className="p-4 md:p-6">
            {/* Author */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {(entry.author.displayName || entry.author.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">{entry.author.displayName || entry.author.name}</span>
                  {entry.author.pronouns !== 'prefer not to say' && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-full">{entry.author.pronouns}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Mood & Music */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {mood && (
                <Badge variant="secondary" className={`rounded-full gap-1 ${mood.colorClass}`}>
                  {mood.icon} {mood.label}
                </Badge>
              )}
              {entry.musicMood && (() => {
                const parts = entry.musicMood.split('|');
                const displayTitle = parts[0];
                return (
                  <Badge variant="secondary" className="rounded-full gap-1">
                    <Music className="w-3 h-3" />
                    {displayTitle.includes('spotify.com') || displayTitle.includes('youtube.com') || displayTitle.includes('youtu.be') ? 'Embedded Track 🎵' : displayTitle}
                  </Badge>
                );
              })()}
              {entry.isAnonymous && (
                <Badge variant="secondary" className="rounded-full">🎭 Anonymous</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-4 leading-snug">{entry.title}</h1>

            {/* Content */}
            <div className={`text-sm leading-relaxed whitespace-pre-line text-foreground/90 ${fontClass}`}>
              {entry.content}
            </div>

            {/* Music Embed */}
            {(() => {
              const parts = (entry.musicMood || '').split('|');
              const url = parts.length > 1 ? parts[1] : parts[0];
              
              const spotifyTrackMatch = url.match(/(?:https?:\/\/)?open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
              if (spotifyTrackMatch) {
                return (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border bg-card shadow-sm">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${spotifyTrackMatch[1]}`}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                );
              }
              const spotifyPlaylistMatch = url.match(/(?:https?:\/\/)?open\.spotify\.com\/(playlist|album)\/([a-zA-Z0-9]+)/);
              if (spotifyPlaylistMatch) {
                return (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border bg-card shadow-sm">
                    <iframe
                      src={`https://open.spotify.com/embed/${spotifyPlaylistMatch[1]}/${spotifyPlaylistMatch[2]}`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                );
              }
              const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
              if (youtubeMatch) {
                return (
                  <div className="mt-4 rounded-xl overflow-hidden border border-border bg-card shadow-sm">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
                      width="100%"
                      height="315"
                      frameBorder="0"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                );
              }
              return null;
            })()}

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border/50">
                {entry.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="rounded-full text-xs">#{tag}</Badge>
                ))}
              </div>
            )}

            {/* Reactions */}
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {['heart', 'hug', 'inspiring', 'relatable'].map(type => {
                  const rt = { heart: '💜', hug: '🫂', inspiring: '✨', relatable: '🦋' }[type];
                  const reaction = entry.reactions.find(r => r.type === type);
                  return (
                    <button
                      key={type}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all hover:scale-110 ${
                        userReactions[type] ? 'bg-primary/15 scale-105' : 'hover:bg-muted'
                      }`}
                      onClick={() => handleReaction(type)}
                    >
                      <span>{rt}</span>
                      {reaction && <span className="text-xs text-muted-foreground">{reaction._count}</span>}
                    </button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-1.5"
                onClick={() => setShowComments(!showComments)}
              >
                💬 {comments.length} comments
              </Button>
            </div>

            {/* Comments section */}
            <AnimatePresence>
              {showComments && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    {comments.map((c: any) => (
                      <div key={c.id} className="flex gap-2.5 animate-bloom-in">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-medium text-primary shrink-0 mt-0.5">
                          {(c.author?.displayName || c.author?.name || '?')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 bg-muted/50 rounded-xl px-3 py-2">
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium">{c.author?.displayName || c.author?.name}</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const username = c.author?.displayName || c.author?.name;
                                setNewComment(`@${username} `);
                                document.getElementById('comment-input')?.focus();
                              }}
                              className="text-[10px] text-primary/70 hover:text-primary hover:underline font-semibold transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                          <p className="text-sm">{c.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment input */}
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2 italic">{kindnessPrompt}</p>
                    <div className="flex gap-2">
                      <Input
                        id="comment-input"
                        placeholder="Write a supportive comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleComment()}
                        className="rounded-xl"
                      />
                      <Button size="icon" className="bloom-btn rounded-xl shrink-0" onClick={handleComment} disabled={postingComment || !newComment.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      )}
    </div>
  );
}
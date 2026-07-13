'use client';

import { useState } from 'react';
import { useAppStore, MOODS, REACTION_TYPES, type JournalEntryData } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Clock, Eye, EyeOff, MessageCircle, MoreHorizontal, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  entry: JournalEntryData;
  index: number;
  onClick: () => void;
}

export default function EntryCard({ entry, index, onClick }: Props) {
  const { currentUser, setShowReportModal, setReportTargetEntryId, setSelectedEntryId, setCurrentView } = useAppStore();
  const [showFull, setShowFull] = useState(false);
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>({});

  const mood = MOODS.find(m => m.id === entry.mood);
  const preview = entry.content.length > 200 && !showFull ? entry.content.slice(0, 200) + '...' : entry.content;
  const timeAgo = getTimeAgo(entry.createdAt);

  const handleReaction = async (type: string) => {
    if (!currentUser) return;
    const isReacted = userReactions[type];
    setUserReactions(prev => ({ ...prev, [type]: !isReacted }));
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: currentUser.id, entryId: entry.id, type }),
      });
    } catch {}
  };

  const handleReport = () => {
    setReportTargetEntryId(entry.id);
    setShowReportModal(true);
  };

  const fontClass = entry.fontStyle === 'handwriting' ? 'font-handwriting text-lg' : entry.fontStyle === 'serif' ? 'font-journal-serif' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card className="bloom-card border-0 overflow-hidden cursor-pointer" onClick={onClick}>
        {/* Content warnings banner */}
        {entry.contentWarnings.length > 0 && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs text-amber-700">
              Content Warning: {entry.contentWarnings.join(', ')}
            </span>
          </div>
        )}

        <div className="p-4 md:p-5">
          {/* Author */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                {entry.author.avatarUrl ? '📷' : (entry.author.displayName || entry.author.name || '?')[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium">{entry.author.displayName || entry.author.name}</span>
                  {entry.author.pronouns !== 'prefer not to say' && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-full">
                      {entry.author.pronouns}
                    </Badge>
                  )}
                  {entry.isAnonymous && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-full">
                      🎭 Anonymous
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {timeAgo}
                  {entry.visibility === 'private' && <EyeOff className="w-3 h-3" />}
                </div>
              </div>
            </div>
            {entry.author.id !== currentUser?.id && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={e => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e: any) => { e.stopPropagation(); handleReport(); }}>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mood */}
          <div className="flex items-center gap-2 mb-2">
            {mood && (
              <Badge variant="secondary" className={`rounded-full text-xs gap-1 ${mood.colorClass}`}>
                <span>{mood.icon}</span> {mood.label}
              </Badge>
            )}
            {entry.musicMood && (
              <Badge variant="secondary" className="rounded-full text-xs gap-1">
                🎵 {entry.musicMood}
              </Badge>
            )}
          </div>

          {/* Title & Content */}
          <h3 className="font-semibold text-base mb-1.5 leading-snug">{entry.title}</h3>
          <div className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-line ${fontClass}`}>
            {preview}
          </div>
          {entry.content.length > 200 && !showFull && (
            <button className="text-xs text-primary mt-1 hover:underline" onClick={e => { e.stopPropagation(); setShowFull(true); }}>
              Read more
            </button>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {entry.tags.slice(0, 4).map(tag => (
                <Badge key={tag} variant="outline" className="text-[10px] rounded-full px-2 py-0">
                  #{tag}
                </Badge>
              ))}
              {entry.tags.length > 4 && (
                <Badge variant="outline" className="text-[10px] rounded-full px-2 py-0">
                  +{entry.tags.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Footer: Reactions & Comments */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1">
              {REACTION_TYPES.map(rt => {
                const reaction = entry.reactions.find(r => r.type === rt.id);
                return (
                  <button
                    key={rt.id}
                    className={`inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-xs transition-all hover:scale-110 ${
                      userReactions[rt.id] ? 'bg-primary/15 scale-105' : 'hover:bg-muted'
                    }`}
                    onClick={e => { e.stopPropagation(); handleReaction(rt.id); }}
                  >
                    <span className="text-sm">{rt.icon}</span>
                    {reaction && reaction._count > 0 && (
                      <span className="text-muted-foreground">{reaction._count}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-muted-foreground hover:bg-muted transition-all"
              onClick={e => { e.stopPropagation(); setSelectedEntryId(entry.id); setCurrentView('entry'); }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {entry.commentCount}
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
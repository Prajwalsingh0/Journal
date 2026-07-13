'use client';

import { useAppStore, TOPICS, VIBE_TAGS } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Users, Hash } from 'lucide-react';

export default function ExploreView() {
  const { setCurrentView, setFeedFilter, feedEntries } = useAppStore();

  const handleTopicClick = (topicId: string) => {
    // Set filter and navigate to feed
    setFeedFilter('all');
    setCurrentView('feed');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-2xl">🧭</span> Explore
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Discover communities and topics</p>
      </div>

      {/* Topics Grid */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Supportive Spaces</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TOPICS.map((topic, i) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="bloom-card border-0 p-4 cursor-pointer hover:scale-[1.01] transition-transform"
                onClick={() => handleTopicClick(topic.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                    {topic.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm">{topic.label}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">A safe space to share and connect</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Community</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Trending Tags</h2>
        </div>
        <Card className="bloom-card border-0 p-4">
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer rounded-full text-sm px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    setFeedFilter('all');
                    setCurrentView('feed');
                  }}
                >
                  <Hash className="w-3 h-3 mr-1" />
                  {tag.label.replace('#', '')}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Community Guidelines */}
      <Card className="bloom-card border-0 p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          💜 Community Guidelines
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✨ <strong className="text-foreground">Be kind</strong> — Treat everyone with respect and empathy</p>
          <p>🛡️ <strong className="text-foreground">Be safe</strong> — Use content warnings for sensitive topics</p>
          <p>🌸 <strong className="text-foreground">Be authentic</strong> — Share your truth, but respect others&apos; privacy</p>
          <p>💪 <strong className="text-foreground">Be supportive</strong> — Uplift others, celebrate growth</p>
          <p>🚫 <strong className="text-foreground">No hate</strong> — Bullying, harassment, and hate are never okay</p>
        </div>
      </Card>
    </div>
  );
}
'use client';

import { useAppStore } from '@/stores/store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Globe, Heart, MessageCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const CRISIS_RESOURCES = [
  { name: 'Crisis Text Line', desc: 'Text HOME to 741741', contact: 'Text HOME to 741741', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-green-100 text-green-700' },
  { name: 'National Suicide Prevention', desc: 'Call or text 988', contact: '988 Suicide & Crisis Lifeline', icon: <Phone className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700' },
  { name: 'The Trevor Project', desc: 'LGBTQ+ youth support', contact: '1-866-488-7386', icon: <Heart className="w-5 h-5" />, color: 'bg-purple-100 text-purple-700' },
  { name: 'SAMHSA Helpline', desc: 'Substance abuse & mental health', contact: '1-800-662-4357', icon: <Phone className="w-5 h-5" />, color: 'bg-orange-100 text-orange-700' },
  { name: 'NAMI HelpLine', desc: 'Mental health support', contact: '1-800-950-6264', icon: <MessageCircle className="w-5 h-5" />, color: 'bg-pink-100 text-pink-700' },
  { name: 'International Resources', desc: 'Find help worldwide', contact: 'findahelpline.com', icon: <Globe className="w-5 h-5" />, color: 'bg-teal-100 text-teal-700' },
];

const SELF_CARE_TIPS = [
  { emoji: '🫁', text: 'Take 5 deep breaths. In for 4, hold for 4, out for 6.' },
  { emoji: '💧', text: 'Drink a glass of water. Your body needs it.' },
  { emoji: '🌿', text: 'Step outside for a minute. Fresh air helps.' },
  { emoji: '🎵', text: 'Listen to your favorite comforting song.' },
  { emoji: '✍️', text: 'Write down 3 things you\'re grateful for right now.' },
  { emoji: '📞', text: 'Reach out to someone you trust. You don\'t have to do this alone.' },
];

export default function CrisisView() {
  const { setCurrentView } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setCurrentView('feed')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Crisis Resources & Support</h1>
      </div>

      {/* Supportive message */}
      <Card className="p-5 mb-4 bloom-card border-0 bg-gradient-to-r from-primary/5 via-pink-500/5 to-purple-500/5">
        <div className="text-center">
          <p className="text-3xl mb-2">💜</p>
          <h2 className="font-semibold text-lg mb-2">You are not alone</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whatever you&apos;re going through, there are people who care and want to help. 
            Reaching out is a sign of strength, not weakness. You matter.
          </p>
        </div>
      </Card>

      {/* Quick grounding */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-green-500" />
          <h2 className="font-semibold">Quick Grounding Exercise</h2>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground"><strong className="text-foreground">5 things</strong> you can see</p>
          <p className="text-muted-foreground"><strong className="text-foreground">4 things</strong> you can touch</p>
          <p className="text-muted-foreground"><strong className="text-foreground">3 things</strong> you can hear</p>
          <p className="text-muted-foreground"><strong className="text-foreground">2 things</strong> you can smell</p>
          <p className="text-muted-foreground"><strong className="text-foreground">1 thing</strong> you can taste</p>
        </div>
      </Card>

      {/* Self-care tips */}
      <Card className="p-4 mb-4 bloom-card border-0">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-5 h-5 text-pink-500" />
          <h2 className="font-semibold">Gentle Self-Care Right Now</h2>
        </div>
        <div className="space-y-2">
          {SELF_CARE_TIPS.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors"
            >
              <span className="text-lg">{tip.emoji}</span>
              <p className="text-sm">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Helplines */}
      <div className="mb-4">
        <h2 className="font-semibold mb-3">Helplines & Resources</h2>
        <div className="space-y-2">
          {CRISIS_RESOURCES.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bloom-card border-0 p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                    <Badge variant="secondary" className="mt-1 rounded-full text-xs">{r.contact}</Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom message */}
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          If you or someone you know is in immediate danger, please call <strong>911</strong> or your local emergency services.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          You are valued. You are loved. You deserve help. 💜
        </p>
      </div>
    </div>
  );
}
'use client';

import { useAppStore } from '@/stores/store';
import { MOODS, TOPICS } from '@/stores/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Shield, Heart, PenTool, Users, Star } from 'lucide-react';

const FEATURES = [
  { icon: <PenTool className="w-6 h-6" />, title: 'Beautiful Journals', desc: 'Express yourself with fonts, colors, moods, and creative tools designed just for you.' },
  { icon: <Users className="w-6 h-6" />, title: 'Safe Community', desc: 'Connect with others who get it. Share, support, and grow together in moderated spaces.' },
  { icon: <Shield className="w-6 h-6" />, title: 'Your Privacy Matters', desc: 'Anonymous posting, content warnings, and robust safety features to protect you.' },
  { icon: <Heart className="w-6 h-6" />, title: 'Supportive Reactions', desc: 'Express care with hearts, hugs, and kind words — no toxicity allowed.' },
  { icon: <Star className="w-6 h-6" />, title: 'Track Your Growth', desc: 'Mood tracking, writing streaks, and reflections to see how far you\'ve come.' },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Aesthetic Themes', desc: 'Choose from pastels, dark mode, earthy tones, and dreamy gradients.' },
];

export default function LandingPage() {
  const { setShowAuthModal, setAuthModalMode } = useAppStore();

  return (
    <div className="min-h-screen bloom-gradient">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-bloom-lavender/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-bloom-peach/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-bloom-mint/10 blur-3xl" />
        </div>

        <nav className="relative z-10 max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌸</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              Bloom
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => setAuthModalMode('login') || setShowAuthModal(true)}>
              Sign in
            </Button>
            <Button size="sm" className="bloom-btn rounded-full px-5" onClick={() => setAuthModalMode('signup') || setShowAuthModal(true)}>
              Join Bloom
            </Button>
          </div>
        </nav>

        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-28 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              A safe space to grow
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your thoughts deserve a{' '}
              <span className="bg-gradient-to-r from-primary via-pink-400 to-purple-400 bg-clip-text text-transparent">
                beautiful home
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Bloom is a journaling community where you can express yourself freely, 
              connect with others who understand, and track your personal growth — all in a 
              safe, supportive space designed just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bloom-btn rounded-full px-8 text-base" onClick={() => setAuthModalMode('signup') || setShowAuthModal(true)}>
                Start your journal ✨
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base" onClick={() => setAuthModalMode('login') || setShowAuthModal(true)}>
                I have an account
              </Button>
            </div>
          </motion.div>

          {/* Decorative mood bubbles */}
          <div className="mt-12 flex justify-center gap-3 flex-wrap">
            {MOODS.slice(0, 8).map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.1, type: 'spring' }}
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-xl bloom-card cursor-default"
              >
                {m.icon}
              </motion.div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Bloom?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">More than a journal — it&apos;s your safe corner of the internet</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full bloom-card border-0 bg-card/80 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find your community</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Explore topics that matter to you</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {TOPICS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="cursor-pointer"
              onClick={() => setAuthModalMode('signup') || setShowAuthModal(true)}
            >
              <Card className="p-4 text-center bloom-card border-0 hover:scale-[1.02] transition-transform">
                <div className="text-3xl mb-2">{t.icon}</div>
                <p className="font-medium text-sm">{t.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to bloom?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Join thousands of young women who are journaling, growing, and supporting each other every day.
          </p>
          <Button size="lg" className="bloom-btn rounded-full px-10 text-base" onClick={() => setAuthModalMode('signup') || setShowAuthModal(true)}>
            Create your free account 🌸
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🌸</span>
            <span className="font-medium text-foreground">Bloom Journal</span>
            <span>· Your safe space to grow</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Community Guidelines</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Crisis Resources</span>
          </div>
          <p className="text-xs">Made with 💜 for you</p>
        </div>
      </footer>
    </div>
  );
}
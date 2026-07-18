'use client';

import { useState, useRef } from 'react';
import { useAppStore, MOODS, TOPICS } from '@/stores/store';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const { setShowAuthModal, setAuthModalMode } = useAppStore();

  // Mouse drag scroll state for Topics section
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast factor
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="min-h-screen">
      {/* ===== NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
              Bloom
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-full text-sm" onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}>
              Sign in
            </Button>
            <Button size="sm" className="bloom-btn rounded-full px-5 text-sm" onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}>
              Join free
            </Button>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-14">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] right-[5%] w-[340px] h-[340px] rounded-full bg-bloom-lavender/25 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 15, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-bloom-peach/25 blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, 25, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-bloom-mint/15 blur-[120px]"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Tagline pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/8 border border-primary/15 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Your safe space to grow
            </motion.div>

            {/* Headline */}
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-extrabold leading-[1.08] tracking-tight mb-6">
              <span className="block">Write your heart out.</span>
              <span className="block mt-1 bg-gradient-to-r from-primary via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Watch yourself bloom.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
              A journaling community built for you — express freely, track your moods, 
              connect with kind people, and grow at your own pace.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="bloom-btn rounded-full px-10 text-base h-12" onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}>
                  Start journaling — it&apos;s free
                </Button>
              </motion.div>
              <Button size="lg" variant="ghost" className="rounded-full px-8 text-base text-muted-foreground" onClick={() => { setAuthModalMode('login'); setShowAuthModal(true); }}>
                I already have an account
              </Button>
            </div>
          </motion.div>

          {/* Floating mood ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-pink-400/10 to-purple-400/20 blur-2xl scale-110" />
              <div className="relative flex items-center justify-center w-[180px] h-[180px] md:w-[240px] md:h-[240px]">
                {MOODS.slice(0, 8).map((m, i) => {
                  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                  const r = i % 2 === 0 ? 38 : 42; // slight variation for organic feel
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + i * 0.08, type: 'spring', stiffness: 200, damping: 15 }}
                      className="absolute w-10 h-10 md:w-12 md:h-12 rounded-full bg-card border border-border/60 flex items-center justify-center text-lg md:text-xl shadow-sm cursor-default"
                      style={{
                        left: `calc(50% + ${Math.cos(angle) * r}% - 20px)`,
                        top: `calc(50% + ${Math.sin(angle) * r}% - 20px)`,
                      }}
                    >
                      {m.icon}
                    </motion.div>
                  );
                })}
                {/* Center bloom */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: 'spring', stiffness: 150 }}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center text-2xl md:text-3xl shadow-lg"
                >
                  🌸
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT FEELS — Editorial Cards ===== */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">What makes it different</p>
            <h2 className="text-3xl md:text-4xl font-bold">Not just another journaling app.</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1 — Big feature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="md:row-span-2 relative rounded-3xl overflow-hidden p-8 md:p-10 bg-gradient-to-br from-primary/8 via-pink-500/5 to-purple-500/8 border border-primary/10 group"
            >
              <div className="text-5xl mb-5">✍️</div>
              <h3 className="text-2xl font-bold mb-3">Your words, your style</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pick your mood, choose a font that feels right — clean, classic, or handwriting. 
                Add vibe tags, share what music you&apos;re feeling. Every entry is a little piece of you.
              </p>
              {/* Mini mock entry */}
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-5 border border-border/40 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-xs">🌸</div>
                  <span className="text-xs font-medium">your_bloom_name</span>
                  <span className="text-[10px] text-muted-foreground">· today</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-handwriting text-base">
                  Today I finally understood that growth isn&apos;t about being perfect — it&apos;s about showing up, even when it&apos;s hard...
                </p>
                <div className="flex gap-1.5 mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary">#growth</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-bloom-peach/30 text-pink-600">#selflove</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-bloom-mint/30 text-emerald-600">#healing</span>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="relative rounded-3xl overflow-hidden p-7 bg-gradient-to-br from-bloom-lavender/15 via-bloom-powder/10 to-bloom-lavender/5 border border-bloom-lavender/20"
            >
              <div className="text-4xl mb-4">💜🫂✨🦋</div>
              <h3 className="text-lg font-bold mb-2">Reactions, not likes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No follower counts. No popularity contest. Send hearts, hugs, and &quot;this inspired me&quot; — 
                because your feelings aren&apos;t content to be consumed.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="relative rounded-3xl overflow-hidden p-7 bg-gradient-to-br from-bloom-peach/15 via-bloom-gold/10 to-bloom-peach/5 border border-bloom-peach/20"
            >
              <div className="text-4xl mb-4">🌈</div>
              <h3 className="text-lg font-bold mb-2">Four aesthetic themes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pastel, dark mode, earthy, or dreamy — pick a vibe that matches your mood. 
                Switch anytime. It&apos;s your space.
              </p>
              <div className="flex gap-2 mt-4">
                {['bg-[#FDF8FF] border-bloom-lavender/40', 'bg-[#1A1028] border-purple-500/30', 'bg-[#FAF7F2] border-amber-300/40', 'bg-[#FFF5F7] border-pink-300/40'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-xl border-2 ${bg}`} title={['Pastel', 'Dark', 'Earthy', 'Dreamy'][i]} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 2 — 3 equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-bloom-mint/15 via-bloom-sage/10 to-bloom-mint/5 border border-bloom-mint/20"
            >
              <div className="text-3xl mb-3">🔥</div>
              <h3 className="font-bold mb-1.5">Writing streaks</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Build a daily habit with streak tracking. See your consistency grow day by day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-bloom-powder/15 via-bloom-lavender/10 to-bloom-powder/5 border border-bloom-powder/20"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold mb-1.5">Mood insights</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                See your emotional patterns over time. Understand yourself better, one entry at a time.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-bloom-rose/15 via-bloom-peach/10 to-bloom-rose/5 border border-bloom-rose/20"
            >
              <div className="text-3xl mb-3">🎭</div>
              <h3 className="font-bold mb-1.5">Post anonymously</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Share honestly without your name. Sometimes the deepest words come when no one&apos;s watching.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== TOPICS — Horizontal scroll ===== */}
      <section className="py-16 md:py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">Communities</p>
            <h2 className="text-3xl md:text-4xl font-bold">Find your people.</h2>
          </motion.div>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-3 overflow-x-auto md:grid md:grid-cols-4 md:overflow-x-visible pb-3 md:pb-0 snap-x snap-mandatory scrollbar-hide touch-pan-x select-none cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {TOPICS.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="cursor-pointer shrink-0 w-[160px] md:w-auto snap-start select-none"
                onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}
              >
                <div className="rounded-2xl p-5 bg-gradient-to-br from-card to-muted/30 border border-border/40 hover:border-primary/30 hover:shadow-md transition-all group">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{t.icon}</div>
                  <p className="font-semibold text-sm leading-snug">{t.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-16 md:py-20 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-2xl md:text-3xl font-medium leading-relaxed text-foreground/80 max-w-2xl mx-auto mb-8">
              &ldquo;Bloom is the only place online where I feel truly safe to be myself. 
              No judgment, no pressure — just honest words and kind people.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-pink-400/20 flex items-center justify-center text-sm">
                🌿
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">A real Bloomer</p>
                <p className="text-xs text-muted-foreground">Member since 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 md:py-28 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">🌱</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to bloom?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Your journal is waiting. Write your first entry in under a minute — no pressure, 
              no followers, just you.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="bloom-btn rounded-full px-12 text-base h-12" onClick={() => { setAuthModalMode('signup'); setShowAuthModal(true); }}>
                Create your free account
              </Button>
            </motion.div>
            <p className="text-xs text-muted-foreground mt-4">Free forever. No ads. Your data stays yours.</p>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border/50 py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🌸</span>
            <span className="font-medium text-foreground">Bloom</span>
            <span className="text-border">·</span>
            <span>Your safe space to grow</span>
          </div>
          <div className="flex gap-6 text-xs">
            <span className="hover:text-foreground cursor-pointer transition-colors">Community Guidelines</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
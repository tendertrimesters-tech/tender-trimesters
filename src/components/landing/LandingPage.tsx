"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Heart,
  Sparkles,
  Calendar,
  BookHeart,
  MessageCircleHeart,
  Camera,
  Bell,
  Users,
  Baby,
  Check,
  ArrowRight,
  Moon,
  Sun,
  Leaf,
  Star,
  ChevronRight,
} from "lucide-react";
import AmbientBackground from "../app/AmbientBackground";

type LandingPageProps = {
  onOpenApp: () => void;
};

export default function LandingPage({ onOpenApp }: LandingPageProps) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-cream relative">
      <AmbientBackground />
      <MilestoneTicker />
      <Nav onOpenAuth={() => setAuthOpen(true)} onOpenApp={onOpenApp} />
      <Hero onJoinWaitlist={() => setWaitlistOpen(true)} onOpenApp={onOpenApp} />
      <FreeVsPremium onUpgrade={() => setAuthOpen(true)} />
      <VisualShowcase />
      <SignatureFeatures />
      <Testimonials />
      <PremiumBundle onUpgrade={() => setAuthOpen(true)} />
      <WaitlistCTA onJoin={() => setWaitlistOpen(true)} />
      <Footer
        onPrivacy={() => setPrivacyOpen(true)}
        onTerms={() => setTermsOpen(true)}
      />

      <WaitlistDialog open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <AuthDialog
        open={authOpen}
        onOpenChange={setAuthOpen}
        mode={authMode}
        setMode={setAuthMode}
        onSuccess={onOpenApp}
      />
      <PrivacyDialog open={privacyOpen} onOpenChange={setPrivacyOpen} />
      <TermsDialog open={termsOpen} onOpenChange={setTermsOpen} />
    </div>
  );
}

/* ─────────────────────────── NAV ─────────────────────────── */

function Nav({ onOpenAuth, onOpenApp }: { onOpenAuth: () => void; onOpenApp: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream/80 border-b border-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo />
          <div>
            <div className="font-serif text-xl leading-none text-moss-deep">Tender Trimesters</div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">by Mommies Matter</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-foreground/70 hover:text-moss transition-colors">Features</a>
          <a href="#signature" className="text-foreground/70 hover:text-moss transition-colors">Keepsakes</a>
          <a href="#comparison" className="text-foreground/70 hover:text-moss transition-colors">Pricing</a>
          <a href="#testimonials" className="text-foreground/70 hover:text-moss transition-colors">Stories</a>
          <a href="#bundle" className="text-foreground/70 hover:text-moss transition-colors">Bundle</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onOpenAuth} className="hidden sm:flex">
            Sign in
          </Button>
          <Button size="sm" onClick={onOpenApp} className="bg-moss hover:bg-moss-deep">
            Open the App <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-moss flex items-center justify-center shadow-soft">
      <Leaf className="w-4 h-4 text-cream" />
    </div>
  );
}

/* ─────────────────────────── MILESTONE TICKER ─────────────────────────── */

function MilestoneTicker() {
  const items = [
    "Week 4 · Missed your period?",
    "Week 8 · First heartbeat",
    "Week 12 · End of trimester 1",
    "Week 16 · Bump makes its debut",
    "Week 20 · Halfway there",
    "Week 24 · Viability milestone",
    "Week 28 · Third trimester begins",
    "Week 36 · Early term approaching",
    "Week 40 · Due date",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-moss-deep text-cream py-2 overflow-hidden">
      <div className="flex gap-12 whitespace-nowrap animate-ticker">
        {doubled.map((item, i) => (
          <span key={i} className="text-xs tracking-wider font-medium flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-blush" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero({ onJoinWaitlist, onOpenApp }: { onJoinWaitlist: () => void; onOpenApp: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blush/40 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sage/40 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-blush/50 text-rose-gold px-3 py-1 rounded-full text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Your 24/7 pregnancy companion
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-moss-deep text-balance">
            Your pregnancy,<br />
            <span className="text-gradient-moss italic">one week</span> at a time.
          </h1>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed max-w-md">
            A nurturing weekly calendar, daily affirmations, a private journal, mood tracking, and Tempie — your AI companion who's there at 3am when you need her most.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={onOpenApp}
              className="bg-moss hover:bg-moss-deep text-cream px-7 h-12 rounded-full"
            >
              Open the App <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onJoinWaitlist}
              className="border-moss/30 text-moss-deep hover:bg-moss/5 px-7 h-12 rounded-full"
            >
              Join the waitlist
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-moss" />
              Free forever tier
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-moss" />
              Private &amp; secure
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-moss" />
              40 weeks of content
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      {/* Main phone-card */}
      <Card className="relative z-10 bg-card border-moss/15 shadow-soft rounded-[28px] overflow-hidden">
        <div className="bg-gradient-moss p-5 text-cream">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest opacity-80">
            <span>Week 16</span>
            <span>Second Trimester</span>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Baby className="w-8 h-8 text-blush" />
            <div>
              <div className="font-serif text-2xl leading-none">Avocado</div>
              <div className="text-xs opacity-70">About 4.6 inches long</div>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-blush/30 rounded-2xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-rose-gold mb-1">Today's Affirmation</div>
            <p className="font-script text-xl text-moss-deep">My changing body is beautiful.</p>
          </div>

          <div>
            <div className="text-xs font-semibold text-moss-deep mb-2 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" /> Best Friend Tip
            </div>
            <p className="text-sm text-foreground/75 leading-relaxed">
              Invest in 2-3 quality maternity basics. You'll live in them for months.
            </p>
          </div>

          <div className="flex items-center justify-between bg-sage/30 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <MessageCircleHeart className="w-4 h-4 text-moss" />
              <span className="text-xs font-medium text-moss-deep">Tempie's here</span>
            </div>
            <span className="text-[10px] text-muted-foreground">24/7 companion</span>
          </div>
        </div>
      </Card>

      {/* Floating affirmation chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="absolute -top-3 -right-3 z-20 bg-cream shadow-premium rounded-2xl px-4 py-2 border border-rose-gold/20"
      >
        <div className="font-script text-rose-gold text-lg">you've got this, mama</div>
      </motion.div>

      {/* Floating mood chip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute -bottom-4 -left-4 z-20 bg-cream shadow-soft rounded-2xl px-4 py-3 border border-moss/15"
      >
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Today's mood</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="text-sm font-medium text-moss-deep">Glowing</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── FREE VS PREMIUM ─────────────────────────── */

function FreeVsPremium({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <section id="comparison" className="py-20 md:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-terracotta mb-3">Choose your journey</div>
          <h2 className="font-serif text-4xl md:text-5xl text-moss-deep">Free, or fully held.</h2>
          <p className="mt-4 text-foreground/70">
            Start free, forever. When you're ready for the deeper layers — Tempie at 3am, partner access, bump photos, and the full Mommies Matter bundle — premium is a one-time $9.99.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <FreeCard />
          <PremiumCard onUpgrade={onUpgrade} />
        </div>
      </div>
    </section>
  );
}

function FreeCard() {
  const features = [
    "Weekly milestone calendar (40 weeks)",
    "Baby size tracker with fruit comparisons",
    "Daily affirmations",
    "Mood check-ins with simple trends",
    "Private journal (text + mood)",
    "Tempie AI chat — 5 messages / day",
  ];
  return (
    <Card className="bg-card border-moss/15 rounded-[28px] p-7 shadow-soft">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-serif text-3xl text-moss-deep">Free</h3>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Forever</div>
      </div>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-serif text-5xl text-moss-deep">$0</span>
      </div>
      <ul className="space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <div className="mt-0.5 w-5 h-5 rounded-full bg-moss/15 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-moss" />
            </div>
            <span className="text-sm text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-7 text-xs text-muted-foreground italic">
        No credit card. No trial expiration. Just here for you.
      </div>
    </Card>
  );
}

function PremiumCard({ onUpgrade }: { onUpgrade: () => void }) {
  const features = [
    "Everything in Free, plus:",
    "Tempie AI chat — unlimited, 24/7",
    "Bump photo gallery by week",
    "Custom appointment reminders",
    "Partner access (read-only journey view)",
    "Audio affirmations & meditations",
    "Letters from Baby (AI-written letters in baby's voice)",
    "Fear to Flame — AI-powered fear reframing",
    "Premium bundle: ebook + affirmations deck",
  ];
  return (
    <Card className="relative bg-gradient-to-br from-cream to-blush/20 border-rose-gold/30 rounded-[28px] p-7 shadow-premium">
      <div className="absolute -top-3 left-7 bg-gradient-premium text-cream text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
        Most loved
      </div>
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="font-serif text-3xl text-rose-gold">Premium</h3>
        <div className="text-xs uppercase tracking-widest text-rose-gold/70">One-time</div>
      </div>
      <div className="flex items-baseline gap-2 mb-6">
        <span className="font-serif text-5xl text-moss-deep">$9.99</span>
        <span className="text-sm text-muted-foreground line-through">$19.99</span>
      </div>
      <ul className="space-y-3">
        {features.map((f, i) => (
          <li key={f} className={`flex items-start gap-3 ${i === 0 ? "font-semibold text-moss-deep" : ""}`}>
            <div className="mt-0.5 w-5 h-5 rounded-full bg-rose-gold/20 flex items-center justify-center flex-shrink-0">
              <Star className="w-3 h-3 text-rose-gold fill-rose-gold" />
            </div>
            <span className={`text-sm ${i === 0 ? "text-moss-deep" : "text-foreground/80"}`}>{f}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onUpgrade}
        className="mt-7 w-full bg-gradient-premium text-cream hover:opacity-90 h-12 rounded-full"
      >
        Start free, upgrade anytime
      </Button>
      <div className="mt-3 text-center text-xs text-muted-foreground">
        Or $4.99/month if you prefer to spread it out
      </div>
    </Card>
  );
}

/* ─────────────────────────── VISUAL SHOWCASE ─────────────────────────── */

function VisualShowcase() {
  const items = [
    { icon: Calendar, label: "Weekly Milestones", desc: "40 weeks of baby's growth, your body, your emotions.", bg: "bg-sage/40", color: "text-moss-deep" },
    { icon: BookHeart, label: "Private Journal", desc: "Notes, moods, cravings, baby names — all in one place.", bg: "bg-blush/40", color: "text-rose-gold" },
    { icon: MessageCircleHeart, label: "Tempie Chat", desc: "Your AI companion — answering, soothing, celebrating.", bg: "bg-butter", color: "text-moss-deep" },
    { icon: Camera, label: "Bump Photos", desc: "Document every week. Watch your baby grow.", bg: "bg-lavender/40", color: "text-moss-deep" },
    { icon: Bell, label: "Appointment Reminders", desc: "OB visits, glucose tests, ultrasounds — never miss one.", bg: "bg-sage/40", color: "text-moss-deep" },
    { icon: Users, label: "Partner Access", desc: "Bring your person along. They see what you share.", bg: "bg-blush/40", color: "text-rose-gold" },
  ];
  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-cream to-butter/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-terracotta mb-3">What's inside</div>
          <h2 className="font-serif text-4xl md:text-5xl text-moss-deep">A sanctuary for every week.</h2>
          <p className="mt-4 text-foreground/70">
            Every feature designed with one question: does this make a mama feel more held?
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Card className={`${item.bg} border-transparent rounded-3xl p-6 h-full hover:shadow-soft transition-shadow`}>
                <div className="w-12 h-12 rounded-2xl bg-cream/60 flex items-center justify-center mb-4">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <h3 className={`font-serif text-xl mb-2 ${item.color}`}>{item.label}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SIGNATURE FEATURES ─────────────────────────── */

function SignatureFeatures() {
  const features = [
    { emoji: "💌", title: "Letters from Baby", desc: "Each week your baby writes you a tender letter in their own voice — a keepsake to hold forever.", accent: "bg-blush/30" },
    { emoji: "🔥", title: "Fear to Flame", desc: "Name a fear. Watch AI gently reframe it into courage. Track your growing bravery.", accent: "bg-terracotta/20" },
    { emoji: "📖", title: "My Mother's Mother", desc: "12 guided interview prompts that capture a generational keepsake you'll treasure.", accent: "bg-butter" },
    { emoji: "🌙", title: "DreamKeeper", desc: "Log your vivid pregnancy dreams. AI surfaces the recurring symbols and themes.", accent: "bg-lavender/20" },
    { emoji: "🌊", title: "Hormone Horoscope", desc: "A poetic, science-backed forecast of what your hormones are doing — and why you feel the way you do.", accent: "bg-sage/20" },
    { emoji: "🌱", title: "The Name Garden", desc: "Plant name ideas as seeds. Watch them grow. Track how your feelings shift week to week.", accent: "bg-sage/30" },
    { emoji: "⏳", title: "Memory Capsule", desc: "Seal letters, wishes, and promises now that unlock for your child on a future date you choose.", accent: "bg-lavender/30" },
    { emoji: "🎵", title: "Birth Playlist Composer", desc: "Build the soundtrack for labor by phase — early, active, pushing, first cry, golden hour.", accent: "bg-blush/20" },
    { emoji: "🤍", title: "Belly Bonding Rituals", desc: "A daily 60-second ritual — a phrase, a hand position, a breath — building your bond before birth.", accent: "bg-blush/30" },
  ];

  return (
    <section id="signature" className="py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="text-[10px] uppercase tracking-[0.2em] text-rose-gold font-semibold mb-2">Unlike any other pregnancy app</div>
          <h2 className="font-serif text-3xl sm:text-4xl text-moss-deep">Nine features you won't find anywhere else</h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-lg mx-auto">
            Every other pregnancy app gives you a calendar and a checklist. We give you a deeply personal, keepsake-driven experience that honors the emotional journey of becoming a mother.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.04 * i }}
            >
              <Card className="rounded-2xl p-5 h-full border-moss/10 hover:shadow-soft transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{f.emoji}</span>
                  <div>
                    <div className="font-serif text-base text-moss-deep">{f.title}</div>
                    <p className="text-xs text-foreground/70 leading-relaxed mt-1">{f.desc}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── TESTIMONIALS ─────────────────────────── */

function Testimonials() {
  const quotes = [
    {
      text: "It feels like a friend is checking in with me. The weekly tips feel personal — not clinical.",
      name: "First-time mom, week 22",
    },
    {
      text: "Tempie answered my 3am panic about whether my baby's kicks were normal. She didn't replace my OB, but she helped me breathe until morning.",
      name: "Mama of one, week 28",
    },
    {
      text: "I cried when I read the affirmation on week 16. 'My changing body is beautiful.' I needed that.",
      name: "Tender Trimesters mama",
    },
  ];
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-terracotta mb-3">Mama stories</div>
          <h2 className="font-serif text-4xl md:text-5xl text-moss-deep">You are not alone in this.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card border-moss/10 rounded-3xl p-6 h-full">
                <div className="font-script text-3xl text-rose-gold/40 mb-2 leading-none">"</div>
                <p className="text-foreground/80 leading-relaxed text-[15px] italic">{q.text}</p>
                <div className="mt-5 pt-5 border-t border-border/40 text-xs text-muted-foreground">
                  — {q.name}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── PREMIUM BUNDLE ─────────────────────────── */

function PremiumBundle({ onUpgrade }: { onUpgrade: () => void }) {
  const includes = [
    { title: "Mommies Matter Ebook", desc: "Helena-Ann's full guide — 17 chapters covering epidural decisions, feeding, NICU, postpartum healing, and more.", icon: BookHeart },
    { title: "Affirmation Card Deck", desc: "40 printable affirmation cards — one per week of pregnancy. Print, frame, or pin to your mirror.", icon: Sparkles },
    { title: "First-Trimester Checklist", desc: "The survival guide for weeks 1-13: what to eat, what to ask your OB, what to skip.", icon: Check },
    { title: "Letters to Baby Templates", desc: "Writing prompts for each trimester. Document the journey you'll want to remember forever.", icon: Heart },
  ];
  return (
    <section id="bundle" className="py-20 md:py-28 bg-gradient-to-b from-cream to-blush/15">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Card className="bg-gradient-moss text-cream rounded-[36px] overflow-hidden shadow-premium">
          <div className="p-8 md:p-14">
            <div className="text-center mb-10">
              <div className="text-xs uppercase tracking-[0.2em] text-blush mb-3">Premium Bundle</div>
              <h2 className="font-serif text-4xl md:text-5xl">Everything mama needs, in one place.</h2>
              <p className="mt-4 text-cream/70 max-w-xl mx-auto">
                The full Mommies Matter digital library — bundled with the app for one price. No subscriptions required (though we offer one if you prefer).
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {includes.map((item) => (
                <div key={item.title} className="bg-cream/10 backdrop-blur-sm rounded-2xl p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blush/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blush" />
                  </div>
                  <div>
                    <div className="font-serif text-lg">{item.title}</div>
                    <div className="text-xs text-cream/70 mt-1 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-baseline gap-3 mb-6">
                <span className="text-cream/50 line-through text-lg">$29.99</span>
                <span className="font-serif text-6xl text-blush">$9.99</span>
                <span className="text-cream/60 text-sm">one-time</span>
              </div>
              <div>
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="bg-cream text-moss-deep hover:bg-blush px-10 h-14 rounded-full text-base"
                >
                  Get the Bundle <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 text-xs text-cream/60">
                Or included free with Premium monthly ($4.99/mo)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

/* ─────────────────────────── WAITLIST CTA ─────────────────────────── */

function WaitlistCTA({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="py-20 md:py-24 bg-moss-deep text-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Moon className="w-10 h-10 text-blush mx-auto mb-5" />
        <h2 className="font-serif text-4xl md:text-5xl leading-tight">
          The waitlist is open.<br />Be the first to hold this.
        </h2>
        <p className="mt-5 text-cream/70 max-w-lg mx-auto">
          Join 200+ mamas getting early access, free affirmation drops, and Helena-Ann's letters from the journey.
        </p>
        <Button
          onClick={onJoin}
          size="lg"
          className="mt-8 bg-blush text-moss-deep hover:bg-blush-deep px-10 h-14 rounded-full text-base"
        >
          Join the Waitlist <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */

function Footer({
  onPrivacy,
  onTerms,
}: {
  onPrivacy: () => void;
  onTerms: () => void;
}) {
  return (
    <footer className="bg-cream border-t border-border/40 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Logo />
            <div className="font-serif text-lg text-moss-deep">Tender Trimesters</div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A Mommies Matter product. Built with love by Helena-Ann Baker — mama, author, and your companion on this journey.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-moss-deep mb-3 font-semibold">The App</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="#features" className="hover:text-moss">Features</a></li>
            <li><a href="#comparison" className="hover:text-moss">Pricing</a></li>
            <li><a href="#bundle" className="hover:text-moss">Bundle</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-moss-deep mb-3 font-semibold">About</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="#testimonials" className="hover:text-moss">Mama Stories</a></li>
            <li><a href="mailto:hello@mommiesmatter.com?subject=Mommies%20Matter%20Book" className="hover:text-moss">Mommies Matter Book</a></li>
            <li><a href="mailto:hello@mommiesmatter.com" className="hover:text-moss">Contact</a></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-moss-deep mb-3 font-semibold">Legal</div>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li><a href="/privacy" className="hover:text-moss">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-moss">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 pt-6 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} Mommies Matter. All rights reserved.</div>
        <div className="font-script text-rose-gold text-base">made with love, mama</div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── DIALOGS ─────────────────────────── */

function WaitlistDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, source: "landing_dialog" }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
      toast.success("You're on the list, mama 💛");
    } catch {
      toast.error("Something went wrong. Try again?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(() => { setDone(false); setName(""); setEmail(""); }, 300); }}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        {done ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-blush/40 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-rose-gold fill-rose-gold" />
            </div>
            <h3 className="font-serif text-2xl text-moss-deep mb-2">Welcome, mama.</h3>
            <p className="text-sm text-foreground/70">
              You're on the list. Watch your inbox for a confirmation and Helena-Ann's first letter.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-moss-deep">Join the waitlist</DialogTitle>
              <DialogDescription>
                Be first to know when premium drops, get free affirmation cards, and hear from Helena-Ann.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="wl-name">Your name (optional)</Label>
                <Input id="wl-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mama" className="mt-1.5 rounded-xl" />
              </div>
              <div>
                <Label htmlFor="wl-email">Email</Label>
                <Input id="wl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1.5 rounded-xl" />
              </div>
              <Button onClick={submit} disabled={loading} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11">
                {loading ? "Adding you..." : "Join the waitlist"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No spam, ever. Just mama things.
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AuthDialog({
  open,
  onOpenChange,
  mode,
  setMode,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: "signin" | "signup";
  setMode: (m: "signin" | "signup") => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        mode,
        redirect: false,
      });
      if (!result || result.error) {
        throw new Error(result?.error || "Authentication failed");
      }
      toast.success(mode === "signup" ? "Welcome to Tender Trimesters 💛" : "Welcome back, mama");
      onOpenChange(false);
      // Force reload so SessionProvider picks up the new session
      setTimeout(() => window.location.reload(), 200);
    } catch (e: unknown) {
      const err = e as Error;
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setError(""); setName(""); setEmail(""); setPassword(""); } }}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">
            {mode === "signup" ? "Create your account" : "Welcome back, mama"}
          </DialogTitle>
          <DialogDescription>
            {mode === "signup"
              ? "Your private pregnancy journal starts here. Free forever."
              : "Sign in to continue your journey."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {mode === "signup" && (
            <div>
              <Label htmlFor="au-name">Your name</Label>
              <Input id="au-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Mama" className="mt-1.5 rounded-xl" />
            </div>
          )}
          <div>
            <Label htmlFor="au-email">Email</Label>
            <Input id="au-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="au-pw">Password</Label>
            <Input id="au-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className="mt-1.5 rounded-xl" />
          </div>
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <Button onClick={submit} disabled={loading} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11">
            {loading ? "One moment..." : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-moss hover:underline font-medium">Sign in</button>
              </>
            ) : (
              <>New here?{" "}
                <button onClick={() => setMode("signup")} className="text-moss hover:underline font-medium">Create an account</button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PrivacyDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[80vh] overflow-y-auto scroll-soft">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none text-foreground/80 space-y-3">
          <p><strong className="text-moss-deep">Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <p>Tender Trimesters (operated under Mommies Matter) is committed to protecting your privacy. This policy explains what we collect and how we use it.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">What we collect</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account info: name, email, password (hashed).</li>
            <li>Pregnancy profile: due date, baby name (optional), partner name (optional).</li>
            <li>Your content: journal entries, mood check-ins, photos you upload, chat messages with Tempie.</li>
            <li>Appointments you log (dates, types, notes).</li>
          </ul>
          <h4 className="font-serif text-lg text-moss-deep mt-4">How we use it</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>To personalize your weekly content and Tempie's responses.</li>
            <li>To display your data back to you (and to your partner if you generate a partner link).</li>
            <li>To send waitlist emails and product updates (you can opt out anytime).</li>
            <li>We never sell your data. We never share it with advertisers.</li>
          </ul>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Your rights</h4>
          <p>You can export or delete all your data at any time from Profile &gt; Settings. Email hello@mommiesmatter.com for help.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">AI chats</h4>
          <p>Conversations with Tempie are stored privately in your account so she can remember context. We do not use your chats to train external models.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Contact</h4>
          <p>Questions? Email hello@mommiesmatter.com.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TermsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[80vh] overflow-y-auto scroll-soft">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="prose prose-sm max-w-none text-foreground/80 space-y-3">
          <p><strong className="text-moss-deep">Last updated:</strong> {new Date().toLocaleDateString()}</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Not medical advice</h4>
          <p>Tender Trimesters and Tempie (the AI companion) are educational and emotional support tools only. They are NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult your OB-GYN, midwife, or other qualified health provider with any questions about your pregnancy.</p>
          <p>If you experience any of the following, call your provider immediately: heavy bleeding, severe abdominal pain, severe headache with vision changes, fever above 100.4°F, decreased fetal movement, or any other symptom that feels wrong. Trust your gut.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Your account</h4>
          <p>You are responsible for keeping your password secure. You must be 18 or older to create an account, or have parental consent.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Your content</h4>
          <p>You retain ownership of all journal entries, photos, and messages you create. By using the app, you grant us a limited license to store and display that content back to you (and to your partner if you generate a partner link).</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Premium purchases</h4>
          <p>One-time premium purchases ($9.99) are non-refundable after 14 days. Monthly subscriptions can be canceled anytime; you retain access until the end of your billing period.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Acceptable use</h4>
          <p>Don't harass other users in the community feed. Don't upload content that's illegal or violates others' privacy. We reserve the right to remove content or suspend accounts that violate these terms.</p>
          <h4 className="font-serif text-lg text-moss-deep mt-4">Changes</h4>
          <p>We may update these terms. We'll notify you by email for material changes.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

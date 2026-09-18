"use client";

import { useState, useEffect } from "react";
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
import TempieMascot, { TempieSignature } from "../app/TempieMascot";

type LandingPageProps = {
  onOpenApp: () => void;
};

export default function LandingPage({ onOpenApp }: LandingPageProps) {
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  // Show toast for ebook purchase success
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("ebook") === "success") {
        toast.success("Your ebook is on the way! Check your email for the download link. 📚💛");
        const url = new URL(window.location.href);
        url.searchParams.delete("ebook");
        window.history.replaceState({}, "", url.toString());
      }
    } catch {}
  }, []);

  // Convenience: open auth dialog (used by all CTAs)
  const openAuth = (mode: "signin" | "signup" = "signup") => {
    setMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-cream relative overflow-hidden">
      <AmbientBackground variant="editorial" />
      <MilestoneTicker />
      <Nav onOpenAuth={() => openAuth("signin")} onOpenApp={() => openAuth("signup")} />
      <Hero onJoinWaitlist={() => setWaitlistOpen(true)} onOpenApp={() => openAuth("signup")} />
      <EditorialPricing onUpgrade={() => openAuth("signup")} />
      <VisualShowcase />
      <SignatureFeatures onUpgrade={() => openAuth("signup")} />
      <FullBleedQuote />
      <Testimonials />
      <PremiumBundle onUpgrade={() => openAuth("signup")} />
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

/* ════════════════════════════════════════════════════════════════
   NAV — sticky, transparent, with vertical accent bar
   ════════════════════════════════════════════════════════════════ */

function Nav({ onOpenAuth, onOpenApp }: { onOpenAuth: () => void; onOpenApp: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-cream/85 border-b border-moss-deep/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="font-serif text-xl leading-none text-moss-deep tracking-tight">
              Tender Trimesters
            </div>
            <div className="text-[10px] tracking-[0.22em] uppercase text-terracotta mt-1 font-medium">
              by Mommies Matter
            </div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-10 text-sm">
          <a href="#features" className="text-foreground/70 hover:text-moss-deep transition-colors tracking-wide">Features</a>
          <a href="#signature" className="text-foreground/70 hover:text-moss-deep transition-colors tracking-wide">Keepsakes</a>
          <a href="#testimonials" className="text-foreground/70 hover:text-moss-deep transition-colors tracking-wide">Stories</a>
          <a href="#bundle" className="text-foreground/70 hover:text-moss-deep transition-colors tracking-wide">Bundle</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex text-sm text-moss-deep hover:text-terracotta transition-colors tracking-wide font-medium"
          >
            Sign in
          </button>
          <Button
            onClick={onOpenApp}
            className="bg-moss-deep hover:bg-moss text-cream rounded-full h-10 px-5 text-sm tracking-wide"
          >
            Open the App
            <ArrowRight className="ml-2 w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <div className="w-10 h-10 rounded-full bg-gradient-moss flex items-center justify-center shadow-soft ring-2 ring-moss-deep/20">
      <Leaf className="w-4 h-4 text-cream" />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MILESTONE TICKER — deep moss band with heartbeat on Week 8
   ════════════════════════════════════════════════════════════════ */

function MilestoneTicker() {
  const items = [
    { week: "Week 4", label: "Missed your period?", heartbeat: false },
    { week: "Week 8", label: "First heartbeat", heartbeat: true },
    { week: "Week 12", label: "End of trimester 1", heartbeat: false },
    { week: "Week 16", label: "Bump makes its debut", heartbeat: false },
    { week: "Week 20", label: "Halfway there", heartbeat: false },
    { week: "Week 24", label: "Viability milestone", heartbeat: false },
    { week: "Week 28", label: "Third trimester begins", heartbeat: false },
    { week: "Week 36", label: "Early term approaching", heartbeat: false },
    { week: "Week 40", label: "Due date", heartbeat: false },
  ];
  const doubled = [...items, ...items];
  return (
    <div className="bg-moss-deep text-cream py-2.5 overflow-hidden border-b border-cream/10">
      <div className="flex gap-12 whitespace-nowrap animate-ticker">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-xs tracking-[0.15em] font-medium flex items-center gap-2 uppercase"
          >
            <Sparkles className={`w-3 h-3 ${item.heartbeat ? "text-blush animate-heartbeat" : "text-butter/70"}`} />
            <span className="text-butter">{item.week}</span>
            <span className="text-cream/60">·</span>
            <span className="text-cream/85">{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   HERO — asymmetric editorial, big display serif, visible image
   ════════════════════════════════════════════════════════════════ */

function Hero({ onJoinWaitlist, onOpenApp }: { onJoinWaitlist: () => void; onOpenApp: () => void }) {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">
      {/* Background image — actually visible now */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/belly-love.jpg"
          alt=""
          className="absolute right-0 top-0 w-full md:w-3/5 h-full object-cover opacity-40"
        />
        {/* Deep moss gradient overlay from left → right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, #F4EAD5 0%, #F4EAD5 30%, rgba(244,234,213,0.85) 50%, rgba(45,63,35,0.3) 80%, rgba(45,63,35,0.5) 100%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 md:py-32 grid md:grid-cols-12 gap-8 items-center w-full">
        {/* ── Left: Editorial text (cols 1-7) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7 accent-bar-left"
        >
          <div className="eyebrow text-terracotta mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-terracotta" />
            Your 24/7 pregnancy companion
          </div>

          <h1 className="display-xl text-moss-deep text-balance">
            Your pregnancy,
            <br />
            <span
              className="font-script text-terracotta"
              style={{ fontSize: "0.85em", fontWeight: 400 }}
            >
              one week
            </span>{" "}
            at a time.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-foreground/75 leading-relaxed max-w-xl text-pretty">
            A nurturing weekly calendar, daily affirmations, a private journal, mood tracking, and{" "}
            <span className="font-serif italic text-moss-deep">Tempie</span> — your AI companion
            who's there at 3am when you need her most.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Button
              onClick={onOpenApp}
              className="bg-moss-deep hover:bg-moss text-cream px-8 h-14 rounded-full text-base tracking-wide group"
            >
              Begin your 40 weeks
              <ArrowRight className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <button
              onClick={onJoinWaitlist}
              className="text-moss-deep hover:text-terracotta transition-colors text-base tracking-wide underline decoration-terracotta/40 underline-offset-4 decoration-2"
            >
              or join the waitlist
            </button>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground tracking-wide">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-moss" strokeWidth={3} />
              <span>Free forever tier</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-moss" strokeWidth={3} />
              <span>Private &amp; secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-moss" strokeWidth={3} />
              <span>40 weeks of content</span>
            </div>
          </div>
        </motion.div>

        {/* ── Right: Hero card (cols 8-12) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-5 relative"
        >
          <HeroCard />
        </motion.div>
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative max-w-sm mx-auto">
      {/* Main phone-card — deeper colors, more contrast */}
      <Card className="relative z-10 bg-card border-moss-deep/20 card-floating rounded-[32px] overflow-hidden">
        {/* Header — deep moss with real imagery visible */}
        <div className="bg-gradient-moss-deep p-6 text-cream relative overflow-hidden">
          <img
            src="/images/baby-hands.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-butter/80">
              <span>Week 16</span>
              <span>Second Trimester</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              {/* Watercolor avocado SVG instead of lucide icon */}
              <div className="w-16 h-16 relative">
                <WatercolorFruit fruit="avocado" />
              </div>
              <div>
                <div className="font-serif text-3xl leading-none">Avocado</div>
                <div className="text-xs opacity-80 mt-1">About 4.6 inches long</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 bg-card">
          {/* Affirmation — letterpress feel */}
          <div className="bg-blush/20 rounded-2xl p-5 border border-blush/20">
            <div className="eyebrow text-rose-gold mb-2">Today's Affirmation</div>
            <p className="font-script text-2xl text-moss-deep leading-tight">
              My changing body is beautiful.
            </p>
          </div>

          {/* Best friend tip */}
          <div className="accent-bar-moss">
            <div className="eyebrow text-moss-deep mb-2 flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" /> Best Friend Tip
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Invest in 2-3 quality maternity basics. You'll live in them for months.
            </p>
          </div>

          {/* Tempie chip — with mascot */}
          <div className="flex items-center justify-between bg-moss-deep/5 rounded-2xl p-4 border border-moss-deep/10">
            <div className="flex items-center gap-3">
              <TempieMascot size="sm" state="listening" />
              <div>
                <div className="text-sm font-medium text-moss-deep">Tempie's here</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  24/7 companion
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating affirmation sticker — script font, rotated */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -8 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="absolute -top-6 -right-6 z-20 bg-cream card-floating rounded-2xl px-5 py-3 border border-rose-gold/20"
      >
        <div className="font-script text-rose-gold text-xl">you've got this, mama</div>
      </motion.div>

      {/* Floating mood chip — bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        className="absolute -bottom-6 -left-6 z-20 bg-cream card-floating rounded-2xl px-4 py-3 border border-moss-deep/15"
      >
        <div className="eyebrow text-muted-foreground mb-1.5">Today's mood</div>
        <div className="flex items-center gap-2">
          {/* Mood constellation — 5 dots, today's enlarged */}
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blush/40" />
            <div className="w-2 h-2 rounded-full bg-butter/60" />
            <div className="w-4 h-4 rounded-full bg-blush ring-2 ring-blush/30" />
            <div className="w-2 h-2 rounded-full bg-lavender/50" />
            <div className="w-2 h-2 rounded-full bg-sage/50" />
          </div>
          <span className="text-sm font-medium text-moss-deep ml-1">Glowing</span>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * WatercolorFruit — inline SVG placeholder for the 40-week series.
 * Will be replaced with actual watercolor PNGs in /public/watercolors/.
 * For now, generates a tasteful geometric fruit shape per week.
 */
function WatercolorFruit({ fruit, size = 64 }: { fruit: string; size?: number }) {
  // Generate a soft watercolor-style blob per fruit type
  const fruitColors: Record<string, [string, string, string]> = {
    avocado: ["#7CB374", "#5A7A48", "#2D3F23"],
    lemon: ["#FFD98C", "#E8B860", "#A8821A"],
    poppyseed: ["#722F37", "#4A1F25", "#2D1418"],
    coconut: ["#DDC9A0", "#A88E5C", "#5A4A30"],
    papaya: ["#E89098", "#C56A75", "#A8455D"],
    watermelon: ["#E89098", "#7CB374", "#2D3F23"],
    // Add more fruits as needed for each week
  };
  const [c1, c2, c3] = fruitColors[fruit] || fruitColors.avocado;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size }}
    >
      {/* Watercolor blob — soft radial gradient */}
      <defs>
        <radialGradient id={`grad-${fruit}`} cx="40%" cy="40%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
          <stop offset="60%" stopColor={c2} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c3} stopOpacity="0.5" />
        </radialGradient>
        <filter id={`blur-${fruit}`}>
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      {/* Main body */}
      <ellipse cx="32" cy="34" rx="22" ry="26" fill={`url(#grad-${fruit})`} filter={`url(#blur-${fruit})`} />
      {/* Highlight */}
      <ellipse cx="26" cy="26" rx="6" ry="8" fill={c1} fillOpacity="0.5" />
      {/* Stem */}
      <path d="M32 8 L32 14" stroke={c3} strokeWidth="1.5" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M32 10 Q36 6 40 8 Q38 12 32 12" fill={c1} fillOpacity="0.7" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════
   EDITORIAL PRICING — one-liner replaces SaaS table
   ════════════════════════════════════════════════════════════════ */

function EditorialPricing({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <section id="comparison" className="py-32 md:py-40 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="eyebrow text-terracotta mb-6">Choose your journey</div>

          <p className="display-md text-moss-deep text-balance leading-tight">
            <span className="text-foreground/60">Free,</span>{" "}
            <span className="italic">forever.</span>
            <br />
            <span className="text-foreground/60">And when you're ready to be fully held,</span>
            <br />
            <span className="text-gradient-rose">$9.99 once.</span>
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onUpgrade}
              className="bg-moss-deep hover:bg-moss text-cream px-10 h-14 rounded-full text-base tracking-wide group"
            >
              Begin free, upgrade anytime
              <ArrowRight className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <span className="text-sm text-muted-foreground tracking-wide">
              or $4.99/month if you prefer to spread it out
            </span>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
            <div className="accent-bar-left">
              <div className="eyebrow text-moss-deep mb-2">Free</div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                40-week calendar, affirmations, mood, journal, 5 Tempie messages a day. Forever.
              </p>
            </div>
            <div className="accent-bar-rose">
              <div className="eyebrow text-rose-gold mb-2">Premium</div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Unlimited Tempie, bump photos, partner access, audio meditations, all 9 keepsakes.
              </p>
            </div>
            <div className="accent-bar-moss">
              <div className="eyebrow text-terracotta mb-2">Bundle</div>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Ebook + affirmation deck + first-trimester checklist + letter templates. $9.99.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   VISUAL SHOWCASE — asymmetric editorial grid
   ════════════════════════════════════════════════════════════════ */

function VisualShowcase() {
  const items = [
    { icon: Calendar, label: "Weekly Milestones", desc: "40 weeks of baby's growth, your body, your emotions.", image: "/images/calendar-nature.jpg", span: "lg:col-span-2 lg:row-span-2" },
    { icon: BookHeart, label: "Private Journal", desc: "Notes, moods, cravings, baby names — all in one place.", image: "/images/journal-writing.jpg", span: "" },
    { icon: MessageCircleHeart, label: "Tempie Chat", desc: "Your AI companion — answering, soothing, celebrating.", image: "/images/soft-pink.jpg", span: "" },
    { icon: Camera, label: "Bump Photos", desc: "Document every week. Watch your baby grow.", image: "/images/belly-love.jpg", span: "lg:col-span-2" },
    { icon: Bell, label: "Appointment Reminders", desc: "OB visits, glucose tests, ultrasounds — never miss one.", image: "/images/botanical-soft.jpg", span: "" },
    { icon: Users, label: "Partner Access", desc: "Bring your person along. They see what you share.", image: "/images/partner-couple.jpg", span: "" },
  ];
  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-transparent via-butter/10 to-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mb-16"
        >
          <div className="eyebrow text-terracotta mb-4">What's inside</div>
          <h2 className="display-md text-moss-deep text-balance leading-tight">
            A sanctuary for every week.
          </h2>
          <p className="mt-6 text-lg text-foreground/70 leading-relaxed max-w-xl">
            Every feature designed with one question: does this make a mama feel more held?
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[220px]">
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className={item.span}
            >
              <Card className="relative h-full rounded-3xl overflow-hidden border-moss-deep/10 group hover:shadow-premium transition-all duration-500 hover:-translate-y-1">
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-moss-deep/85 via-moss-deep/20 to-transparent" />
                <div className="relative z-10 h-full p-6 flex flex-col justify-end text-cream">
                  <div className="w-12 h-12 rounded-2xl bg-cream/15 backdrop-blur-sm flex items-center justify-center mb-3 border border-cream/20">
                    <item.icon className="w-5 h-5 text-butter" />
                  </div>
                  <h3 className="font-serif text-2xl mb-1.5 leading-tight">{item.label}</h3>
                  <p className="text-sm text-cream/75 leading-relaxed">{item.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   SIGNATURE FEATURES — 3 hero full-bleed + 6 secondary grid
   ════════════════════════════════════════════════════════════════ */

function SignatureFeatures({ onUpgrade }: { onUpgrade: () => void }) {
  const heroFeatures = [
    {
      title: "Letters from Baby",
      desc: "Each week your baby writes you a tender letter in their own voice — a keepsake to hold forever.",
      quote: "Dear mama, today I grew fingernails. You grew brave.",
      accent: "bg-blush/15",
      textColor: "text-rose-gold",
      side: "left",
    },
    {
      title: "Fear to Flame",
      desc: "Name a fear. Watch AI gently reframe it into courage. Track your growing bravery week by week.",
      quote: "What felt like a storm at week 12 became a steady rain by week 20.",
      accent: "bg-terracotta/15",
      textColor: "text-terracotta",
      side: "right",
    },
    {
      title: "Memory Capsule",
      desc: "Seal letters, wishes, and promises now that unlock for your child on a future date you choose.",
      quote: "For your 18th birthday, from the mama I was at week 24.",
      accent: "bg-lavender/15",
      textColor: "text-lavender",
      side: "left",
    },
  ];

  const secondaryFeatures = [
    { title: "My Mother's Mother", desc: "12 guided interview prompts that capture a generational keepsake." },
    { title: "DreamKeeper", desc: "Log your vivid pregnancy dreams. AI surfaces the recurring symbols and themes." },
    { title: "Hormone Horoscope", desc: "A poetic, science-backed forecast of what your hormones are doing." },
    { title: "The Name Garden", desc: "Plant name ideas as seeds. Watch them grow. Track how your feelings shift." },
    { title: "Birth Playlist Composer", desc: "Build the soundtrack for labor by phase — early, active, pushing, golden hour." },
    { title: "Belly Bonding Rituals", desc: "A daily 60-second ritual — a phrase, a hand position, a breath." },
  ];

  return (
    <section id="signature" className="relative">
      {/* Hero features — full-bleed editorial */}
      {heroFeatures.map((f, i) => (
        <HeroFeatureBlock key={f.title} feature={f} index={i} />
      ))}

      {/* Secondary features — quieter grid */}
      <div className="py-20 md:py-28 bg-cream">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mb-12"
          >
            <div className="eyebrow text-rose-gold mb-4">And six more keepsakes</div>
            <h3 className="display-md text-moss-deep leading-tight">
              The full sanctuary.
            </h3>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {secondaryFeatures.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="rounded-2xl p-6 h-full border-moss-deep/10 hover:border-moss-deep/30 transition-all hover:-translate-y-0.5 duration-300 bg-card">
                  <h4 className="font-serif text-xl text-moss-deep mb-2">{f.title}</h4>
                  <p className="text-sm text-foreground/70 leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button
              onClick={onUpgrade}
              className="bg-gradient-premium text-cream hover:opacity-90 px-10 h-14 rounded-full text-base tracking-wide group"
            >
              Unlock all nine
              <ArrowRight className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroFeatureBlock({
  feature,
  index,
}: {
  feature: { title: string; desc: string; quote: string; accent: string; textColor: string; side: string };
  index: number;
}) {
  const isLeft = feature.side === "left";
  return (
    <div className={`relative py-24 md:py-36 ${feature.accent} overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={isLeft ? "md:order-1" : "md:order-2"}
        >
          <div className="eyebrow text-terracotta mb-4">
            Keepsake {String(index + 1).padStart(2, "0")}
          </div>
          <h3 className={`display-md ${feature.textColor} mb-6 leading-tight`}>
            {feature.title}
          </h3>
          <p className="text-lg text-foreground/75 leading-relaxed mb-8 max-w-md">
            {feature.desc}
          </p>
          <div className="accent-bar-left">
            <p className="font-serif italic text-xl text-moss-deep leading-snug">
              &ldquo;{feature.quote}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Visual side — large watercolor placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`relative h-80 md:h-96 ${isLeft ? "md:order-2" : "md:order-1"}`}
        >
          <div className="absolute inset-0 rounded-3xl bg-card/40 backdrop-blur-sm border border-cream/30 overflow-hidden">
            {/* Soft watercolor wash inside the frame */}
            <div className="absolute inset-0 opacity-60 animate-drift-slow"
              style={{
                background: `radial-gradient(circle at ${isLeft ? "70% 30%" : "30% 70%}, var(--cream-deep) 0%, transparent 70%)`,
              }}
            />
            {/* Decorative botanical */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 opacity-50 animate-drift">
              <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 200C100 200 40 160 40 100C40 50 70 20 100 20C130 20 160 50 160 100C160 160 100 200 100 200Z"
                  fill={feature.textColor === "text-rose-gold" ? "#E89098" : feature.textColor === "text-terracotta" ? "#B85A38" : "#9F7BC4"}
                  fillOpacity="0.3"
                />
                <path d="M100 200V20" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" className={feature.textColor} />
              </svg>
            </div>
            {/* Script quote */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
              <p className="font-script text-3xl text-moss-deep/70 text-center leading-tight">
                {feature.title}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   FULL BLEED QUOTE — the signature keepsake moment
   ════════════════════════════════════════════════════════════════ */

function FullBleedQuote() {
  return (
    <section className="relative py-32 md:py-48 bg-moss-deep text-cream overflow-hidden">
      {/* Soft botanical drifting in background */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-butter rounded-full blur-3xl opacity-40 animate-drift-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blush rounded-full blur-3xl opacity-30 animate-drift" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <Moon className="w-12 h-12 text-butter mx-auto mb-8 animate-breathe-slow" />
          <p className="display-lg text-cream text-balance leading-tight">
            <span className="italic">She is becoming a mother.</span>
            <br />
            <span className="text-butter">We are keeping every week.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   TESTIMONIALS — letter-style with script signature
   ════════════════════════════════════════════════════════════════ */

function Testimonials() {
  const quotes = [
    {
      text: "It feels like a friend is checking in with me. The weekly tips feel personal — not clinical.",
      name: "First-time mom",
      detail: "Week 22",
    },
    {
      text: "Tempie answered my 3am panic about whether my baby's kicks were normal. She didn't replace my OB, but she helped me breathe until morning.",
      name: "Mama of one",
      detail: "Week 28",
    },
    {
      text: "I cried when I read the affirmation on week 16. 'My changing body is beautiful.' I needed that.",
      name: "Tender Trimesters mama",
      detail: "Week 16",
    },
  ];
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <div className="eyebrow text-terracotta mb-4">Mama stories</div>
          <h2 className="display-md text-moss-deep leading-tight">
            You are not alone in this.
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-card paper-grain rounded-3xl p-8 h-full border-moss-deep/10 card-pressed relative overflow-hidden">
                <div className="font-script text-7xl text-rose-gold/15 absolute top-2 left-4 leading-none">
                  &ldquo;
                </div>
                <div className="relative z-10">
                  <p className="font-serif italic text-lg text-moss-deep leading-relaxed mb-6">
                    {q.text}
                  </p>
                  <div className="pt-4 border-t border-moss-deep/10">
                    <div className="font-script text-2xl text-rose-gold leading-none">
                      {q.name}
                    </div>
                    <div className="eyebrow text-muted-foreground mt-2">{q.detail}</div>
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

/* ════════════════════════════════════════════════════════════════
   PREMIUM BUNDLE — warm modernist treatment
   ════════════════════════════════════════════════════════════════ */

function PremiumBundle({ onUpgrade }: { onUpgrade: () => void }) {
  const includes = [
    { title: "Mommies Matter Ebook", desc: "Helena-Ann's full guide — 17 chapters covering epidural decisions, feeding, NICU, postpartum healing, and more.", icon: BookHeart },
    { title: "Affirmation Card Deck", desc: "40 printable affirmation cards — one per week of pregnancy. Print, frame, or pin to your mirror.", icon: Sparkles },
    { title: "First-Trimester Checklist", desc: "The survival guide for weeks 1-13: what to eat, what to ask your OB, what to skip.", icon: Check },
    { title: "Letters to Baby Templates", desc: "Writing prompts for each trimester. Document the journey you'll want to remember forever.", icon: Heart },
  ];
  return (
    <section id="bundle" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Card className="bg-gradient-moss-deep text-cream rounded-[36px] overflow-hidden card-floating border border-cream/10">
          <div className="p-8 md:p-14">
            <div className="max-w-2xl mb-12">
              <div className="eyebrow text-butter mb-4">Premium Bundle</div>
              <h2 className="display-md text-cream leading-tight">
                Everything mama needs, in one place.
              </h2>
              <p className="mt-6 text-cream/70 text-lg leading-relaxed">
                The full Mommies Matter digital library — bundled with the app for one price.
                No subscriptions required (though we offer one if you prefer).
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {includes.map((item) => (
                <div
                  key={item.title}
                  className="bg-cream/5 backdrop-blur-sm rounded-2xl p-6 flex gap-4 border border-cream/10 hover:bg-cream/10 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-butter/15 flex items-center justify-center flex-shrink-0 border border-butter/20">
                    <item.icon className="w-5 h-5 text-butter" />
                  </div>
                  <div>
                    <div className="font-serif text-xl text-cream">{item.title}</div>
                    <div className="text-sm text-cream/70 mt-1 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-8 border-t border-cream/10">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-cream/40 line-through text-lg">$29.99</span>
                  <span className="font-serif text-6xl text-butter">$9.99</span>
                  <span className="text-cream/60 text-sm">one-time</span>
                </div>
                <div className="text-xs text-cream/50 mt-2">
                  Or included free with Premium monthly ($4.99/mo)
                </div>
              </div>
              <Button
                onClick={onUpgrade}
                className="bg-butter text-moss-deep hover:bg-cream px-10 h-14 rounded-full text-base tracking-wide group"
              >
                Get the Bundle
                <ArrowRight className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t border-cream/10">
              <EbookStandalone />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function EbookStandalone() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    if (!email || !email.includes("@")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ebook-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Something went wrong");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Try again?");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4">
      <div className="eyebrow text-cream/50">Or get just the ebook</div>
      <div className="flex items-center gap-2 max-w-sm">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuy()}
          className="bg-cream/10 border border-cream/20 rounded-full px-4 py-2.5 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-butter/40 flex-1 min-w-0"
        />
        <Button
          onClick={handleBuy}
          disabled={loading || !email.includes("@")}
          size="sm"
          className="bg-butter/20 hover:bg-butter/30 text-cream rounded-full px-5 h-10 text-sm whitespace-nowrap"
        >
          {loading ? "..." : "Buy Ebook"}
        </Button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   WAITLIST CTA — full-bleed moss sanctuary
   ════════════════════════════════════════════════════════════════ */

function WaitlistCTA({ onJoin }: { onJoin: () => void }) {
  return (
    <section className="py-32 md:py-40 bg-moss-deep text-cream relative overflow-hidden">
      {/* Soft moon glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-butter rounded-full blur-3xl opacity-20 animate-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blush rounded-full blur-3xl opacity-15 animate-drift" />

      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <Moon className="w-14 h-14 text-butter mx-auto mb-8 animate-breathe-slow" />
          <h2 className="display-md text-cream leading-tight mb-6">
            The waitlist is open.
            <br />
            <span className="italic text-butter">Be the first to hold this.</span>
          </h2>
          <p className="text-cream/70 text-lg leading-relaxed max-w-xl mx-auto mb-10">
            Join 200+ mamas getting early access, free affirmation drops, and Helena-Ann's
            letters from the journey.
          </p>
          <Button
            onClick={onJoin}
            className="bg-butter text-moss-deep hover:bg-cream px-10 h-14 rounded-full text-base tracking-wide group"
          >
            Join the Waitlist
            <ArrowRight className="ml-2.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════
   FOOTER
   ════════════════════════════════════════════════════════════════ */

function Footer({
  onPrivacy,
  onTerms,
}: {
  onPrivacy: () => void;
  onTerms: () => void;
}) {
  return (
    <footer className="bg-cream border-t border-moss-deep/15 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Logo />
            <div>
              <div className="font-serif text-xl text-moss-deep">Tender Trimesters</div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-terracotta mt-1">by Mommies Matter</div>
            </div>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed max-w-md">
            A Mommies Matter product. Built with love by Helena-Ann Baker — mama, author,
            and your companion on this journey.
          </p>
        </div>
        <div>
          <div className="eyebrow text-moss-deep mb-4">The App</div>
          <ul className="space-y-2.5 text-sm text-foreground/70">
            <li><a href="#features" className="hover:text-terracotta transition-colors">Features</a></li>
            <li><a href="#comparison" className="hover:text-terracotta transition-colors">Pricing</a></li>
            <li><a href="#bundle" className="hover:text-terracotta transition-colors">Bundle</a></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-moss-deep mb-4">About</div>
          <ul className="space-y-2.5 text-sm text-foreground/70">
            <li><a href="#testimonials" className="hover:text-terracotta transition-colors">Mama Stories</a></li>
            <li><a href="mailto:hello@mommiesmatter.com?subject=Mommies%20Matter%20Book" className="hover:text-terracotta transition-colors">Mommies Matter Book</a></li>
            <li><a href="mailto:hello@mommiesmatter.com" className="hover:text-terracotta transition-colors">Contact</a></li>
            <li><button onClick={onPrivacy} className="hover:text-terracotta transition-colors">Privacy Policy</button></li>
            <li><button onClick={onTerms} className="hover:text-terracotta transition-colors">Terms of Service</button></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-12 pt-6 border-t border-moss-deep/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} Mommies Matter. All rights reserved.</div>
        <div className="font-script text-rose-gold text-lg">made with love, mama</div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════════════════
   DIALOGS (preserved from original — minor visual polish only)
   ════════════════════════════════════════════════════════════════ */

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
      <DialogContent className="bg-card rounded-3xl max-w-md border border-moss-deep/15">
        {done ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-blush/30 mx-auto flex items-center justify-center mb-4 animate-breathe">
              <Heart className="w-7 h-7 text-rose-gold fill-rose-gold" />
            </div>
            <h3 className="font-serif text-3xl text-moss-deep mb-3">Welcome, mama.</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
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
              <Button onClick={submit} disabled={loading} className="w-full bg-moss-deep hover:bg-moss rounded-full h-11">
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
      <DialogContent className="bg-card rounded-3xl max-w-md border border-moss-deep/15">
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
          <Button onClick={submit} disabled={loading} className="w-full bg-moss-deep hover:bg-moss rounded-full h-11">
            {loading ? "One moment..." : mode === "signup" ? "Create account" : "Sign in"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="text-terracotta hover:underline font-medium">Sign in</button>
              </>
            ) : (
              <>New here?{" "}
                <button onClick={() => setMode("signup")} className="text-terracotta hover:underline font-medium">Create an account</button>
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
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[80vh] overflow-y-auto border border-moss-deep/15">
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
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[80vh] overflow-y-auto border border-moss-deep/15">
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

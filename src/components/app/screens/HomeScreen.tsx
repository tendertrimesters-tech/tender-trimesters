"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calcWeek, trimesterOf, useProfile } from "@/components/providers";
import type { AppView } from "../AppShell";
import { Baby, Sparkles, Calendar as CalIcon, ArrowRight, Plus, MessageCircleHeart, Users, Flower2 } from "lucide-react";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

type Mood = "glowing" | "calm" | "tired" | "anxious" | "teary" | "grateful" | "nauseous" | "energized";

const MOODS: { value: Mood; emoji: string; label: string; bg: string }[] = [
  { value: "glowing", emoji: "🌸", label: "Glowing", bg: "bg-blush/40" },
  { value: "calm", emoji: "🌿", label: "Calm", bg: "bg-sage/40" },
  { value: "tired", emoji: "🌙", label: "Tired", bg: "bg-butter" },
  { value: "anxious", emoji: "💭", label: "Anxious", bg: "bg-lavender/40" },
  { value: "teary", emoji: "💧", label: "Teary", bg: "bg-blush/30" },
  { value: "grateful", emoji: "💛", label: "Grateful", bg: "bg-butter" },
  { value: "nauseous", emoji: "🍃", label: "Nauseous", bg: "bg-sage/30" },
  { value: "energized", emoji: "✨", label: "Energized", bg: "bg-blush/40" },
];

/* ─── Decorative Botanical SVGs ─── */
function BotanicalLeaf({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C20 0 2 20 2 38C2 50 10 58 20 58C30 58 38 50 38 38C38 20 20 0 20 0Z" fill="currentColor" />
      <line x1="20" y1="10" x2="20" y2="56" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="20" y1="22" x2="12" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="32" x2="28" y2="40" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function BotanicalSprig({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="20" rx="12" ry="16" fill="currentColor" />
      <ellipse cx="35" cy="18" rx="10" ry="14" fill="currentColor" transform="rotate(15 35 18)" />
      <ellipse cx="50" cy="22" rx="8" ry="12" fill="currentColor" transform="rotate(-10 50 22)" />
      <line x1="15" y1="20" x2="50" y2="22" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

function BotanicalDots({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5" cy="10" r="3" fill="currentColor" />
      <circle cx="20" cy="5" r="2" fill="currentColor" />
      <circle cx="35" cy="12" r="2.5" fill="currentColor" />
      <circle cx="50" cy="7" r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function HomeScreen({ onNavigate, onNavigateToMore }: { onNavigate: (v: AppView) => void; onNavigateToMore: (featureId?: string) => void }) {
  const { profile } = useProfile();
  const [weekData, setWeekData] = useState<any>(null);
  const [loadingWeek, setLoadingWeek] = useState(true);
  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [upcomingAppts, setUpcomingAppts] = useState<any[]>([]);

  const week = calcWeek(profile?.dueDate);
  const trimester = trimesterOf(week);

  useEffect(() => {
    if (!week) {
      setLoadingWeek(false);
      return;
    }
    fetch(`/api/weekly-content?week=${week}`)
      .then((r) => r.json())
      .then((d) => setWeekData(d.week))
      .finally(() => setLoadingWeek(false));
  }, [week]);

  useEffect(() => {
    fetch("/api/mood").then((r) => r.json()).then((d) => {
      // Find today's mood
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEntry = d.entries?.find((e: any) => {
        const ed = new Date(e.createdAt);
        ed.setHours(0, 0, 0, 0);
        return ed.getTime() === today.getTime();
      });
      if (todayEntry) setTodayMood(todayEntry.mood);
    });
    fetch("/api/journal").then((r) => r.json()).then((d) => setRecentEntries(d.entries?.slice(0, 3) || []));
    fetch("/api/appointments").then((r) => r.json()).then((d) => {
      const now = new Date();
      setUpcomingAppts((d.appointments || []).filter((a: any) => new Date(a.date) >= now && !a.completed).slice(0, 3));
    });
  }, []);

  async function saveMood(mood: Mood) {
    setTodayMood(mood);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, week }),
      });
    } catch {
      // silent fail
    }
  }

  return (
    <div className="space-y-6">
      {/* ═══════ Week tracker hero ═══════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="rounded-3xl overflow-hidden relative min-h-[220px] animate-shimmer-border shadow-premium">
          {/* Background image at 35% opacity */}
          <img
            src="/images/hero-pregnant.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
          />
          {/* Gradient overlay from moss-deep to moss */}
          <div className="absolute inset-0 bg-gradient-to-br from-moss-deep/90 via-moss-deep/75 to-moss/70" />
          {/* Content */}
          <div className="relative p-6 sm:p-7 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-blush mb-1">
                    {trimester ? `Trimester ${trimester}` : "Welcome"}
                  </div>
                  <div className="font-serif text-4xl">
                    {week ? `Week ${week}` : "Welcome, mama"}
                  </div>
                  <div className="text-sm text-cream/70 mt-1">
                    {week ? `${40 - week} weeks until your due date` : "Set your due date to begin"}
                  </div>
                </div>
                {week && (
                  <div className="w-16 h-16 rounded-full bg-cream/15 backdrop-blur-sm flex items-center justify-center">
                    <Baby className="w-7 h-7 text-blush" />
                  </div>
                )}
              </div>

              {weekData && (
                <div className="bg-cream/15 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-blush mb-1">Baby this week</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl">{weekData.babySize}</span>
                    <span className="text-xs text-cream/70">{weekData.babyLengthCm}cm · {weekData.babyWeightG}g</span>
                  </div>
                  <p className="text-xs text-cream/80 mt-2 leading-relaxed line-clamp-2">{weekData.babySizeDesc}</p>
                </div>
              )}
            </div>

            <Button
              onClick={() => onNavigate("calendar")}
              variant="secondary"
              className="mt-4 bg-cream/15 hover:bg-cream/25 text-cream rounded-full h-9 text-xs self-start"
            >
              View this week <ArrowRight className="ml-1.5 w-3 h-3" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* ── Decorative botanical: leaf ── */}
      <div className="relative h-0">
        <BotanicalLeaf className="absolute -top-2 right-4 w-5 h-8 text-moss opacity-[0.12] -rotate-12" />
        <BotanicalDots className="absolute -top-1 left-8 w-8 h-3 text-rose-gold opacity-[0.12]" />
      </div>

      {/* ═══════ Today's affirmation ═══════ */}
      {weekData && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="rounded-3xl p-6 shadow-soft border-rose-gold/20 overflow-hidden relative">
            {/* Subtle flowers background */}
            <img
              src="/images/flowers-rose.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-[0.15] pointer-events-none"
            />
            {/* Gradient blush overlay */}
            <div className="absolute inset-0 bg-gradient-blush" />
            {/* Content */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-rose-gold" />
                <div className="text-[10px] uppercase tracking-widest text-rose-gold font-semibold">Today's Affirmation</div>
              </div>
              <p className="font-script text-2xl text-moss-deep leading-snug">
                {weekData.affirmation}
              </p>
              {/* Decorative SVG flower accent */}
              <svg className="absolute -right-2 -top-1 w-12 h-12 text-rose-gold/20" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="5" fill="currentColor" />
                <ellipse cx="24" cy="12" rx="5" ry="10" fill="currentColor" />
                <ellipse cx="24" cy="36" rx="5" ry="10" fill="currentColor" />
                <ellipse cx="12" cy="24" rx="10" ry="5" fill="currentColor" />
                <ellipse cx="36" cy="24" rx="10" ry="5" fill="currentColor" />
                <ellipse cx="15" cy="15" rx="5" ry="10" fill="currentColor" transform="rotate(45 15 15)" />
                <ellipse cx="33" cy="15" rx="5" ry="10" fill="currentColor" transform="rotate(-45 33 15)" />
                <ellipse cx="15" cy="33" rx="5" ry="10" fill="currentColor" transform="rotate(-45 15 33)" />
                <ellipse cx="33" cy="33" rx="5" ry="10" fill="currentColor" transform="rotate(45 33 33)" />
              </svg>
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── Decorative botanical: sprig ── */}
      <div className="relative h-0">
        <BotanicalSprig className="absolute -top-1 left-2 w-10 h-7 text-rose-gold opacity-[0.12] rotate-6" />
      </div>

      {/* ═══════ Mood check-in ═══════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="bg-card border-moss/15 rounded-3xl p-6 overflow-hidden relative">
          {/* Subtle warm background */}
          <img
            src="/images/warm-hands.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-[0.10] pointer-events-none"
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">How are you today?</div>
                <div className="font-serif text-xl text-moss-deep">{todayMood ? "Checked in" : "Mood check-in"}</div>
              </div>
              {todayMood && (
                <Button variant="ghost" size="sm" onClick={() => onNavigate("journal")} className="text-moss text-xs">
                  History <ArrowRight className="ml-1 w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => saveMood(m.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 py-3 rounded-2xl transition-all duration-200",
                    m.bg,
                    todayMood === m.value
                      ? "ring-2 ring-moss ring-offset-2 ring-offset-card scale-105 shadow-soft"
                      : "hover:scale-110 hover:shadow-soft"
                  )}
                >
                  <span className="text-[28px] leading-none">{m.emoji}</span>
                  <span className="text-[10px] font-medium text-moss-deep">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ── Decorative botanical: dots ── */}
      <div className="relative h-0">
        <BotanicalDots className="absolute -top-1 right-6 w-10 h-4 text-moss opacity-[0.12]" />
        <BotanicalLeaf className="absolute -top-3 left-12 w-4 h-6 text-moss opacity-[0.12] rotate-[20deg]" />
      </div>

      {/* ═══════ Quick actions grid ═══════ */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={CalIcon}
          title="Appointments"
          desc={upcomingAppts.length > 0 ? `${upcomingAppts.length} upcoming` : "Track your OB visits"}
          accent="bg-sage/30"
          color="text-moss-deep"
          onClick={() => onNavigate("calendar")}
          bgImage="/images/calendar-nature.jpg"
          gradientFrom="from-moss-deep/80"
          gradientTo="to-sage/60"
        />
        <QuickAction
          icon={MessageCircleHeart}
          title="Talk to Tempie"
          desc="Your 24/7 AI companion"
          accent="bg-blush/30"
          color="text-rose-gold"
          onClick={() => onNavigate("tempie")}
          highlight
          bgImage="/images/soft-pink.jpg"
          gradientFrom="from-rose-gold/70"
          gradientTo="to-blush/50"
        />
        <QuickAction
          icon={Users}
          title="The Village"
          desc="Share with other mamas"
          accent="bg-sage/30"
          color="text-moss-deep"
          onClick={() => onNavigate("community")}
          bgImage="/images/community-women.jpg"
          gradientFrom="from-moss-deep/75"
          gradientTo="to-sage/50"
        />
        <QuickAction
          icon={Flower2}
          title="Meditate"
          desc="Sensual guided journeys"
          accent="bg-lavender/20"
          color="text-moss-deep"
          onClick={() => onNavigate("meditation")}
          bgImage="/images/meditation-calm.jpg"
          gradientFrom="from-lavender/70"
          gradientTo="to-sage/40"
        />
      </div>

      {/* ── Decorative botanical: sprig ── */}
      <div className="relative h-0">
        <BotanicalSprig className="absolute -top-2 right-3 w-9 h-6 text-moss opacity-[0.12] -rotate-3" />
      </div>

      {/* ═══════ Signature keepsakes grid ═══════ */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="font-serif text-lg text-moss-deep">Your keepsakes</div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("more")} className="text-xs text-moss">
            All <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <KeepsakeCard emoji="💌" title="Baby Letters" accent="bg-blush/20" image="/images/letters.webp" onClick={() => onNavigateToMore("letters")} />
          <KeepsakeCard emoji="🔥" title="Fear to Flame" accent="bg-terracotta/15" image="/images/fear.webp" onClick={() => onNavigateToMore("fear")} />
          <KeepsakeCard emoji="🤍" title="Belly Bonding" accent="bg-sage/20" image="/images/belly.webp" onClick={() => onNavigateToMore("rituals")} />
          <KeepsakeCard emoji="📖" title="Mother's Mother" accent="bg-butter" image="/images/mother.webp" onClick={() => onNavigateToMore("mother-story")} />
          <KeepsakeCard emoji="🌙" title="DreamKeeper" accent="bg-lavender/20" image="/images/dreams.webp" onClick={() => onNavigateToMore("dreams")} />
          <KeepsakeCard emoji="🌱" title="Name Garden" accent="bg-sage/25" image="/images/garden.webp" onClick={() => onNavigateToMore("garden")} />
          <KeepsakeCard emoji="⏳" title="Time Capsule" accent="bg-lavender/25" image="/images/capsule.webp" onClick={() => onNavigateToMore("capsule")} />
          <KeepsakeCard emoji="🎵" title="Birth Playlist" accent="bg-blush/25" image="/images/playlist.webp" onClick={() => onNavigateToMore("playlist")} />
          <KeepsakeCard emoji="🌊" title="Hormones" accent="bg-sage/15" image="/images/hormone.webp" onClick={() => onNavigateToMore("hormone")} />
        </div>
      </motion.div>

      {/* ── Decorative botanical: leaf + dots ── */}
      <div className="relative h-0">
        <BotanicalLeaf className="absolute -top-2 right-10 w-5 h-7 text-rose-gold opacity-[0.12] rotate-6" />
        <BotanicalDots className="absolute -top-1 left-4 w-7 h-3 text-moss opacity-[0.12]" />
      </div>

      {/* ═══════ Upcoming appointments ═══════ */}
      {upcomingAppts.length > 0 && (
        <Card className="bg-card border-moss/15 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="font-serif text-lg text-moss-deep">Upcoming</div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("calendar")} className="text-xs text-moss">
              All <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingAppts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-xl bg-sage/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] uppercase text-moss-deep font-semibold">{format(new Date(a.date), "MMM")}</span>
                  <span className="text-sm font-bold text-moss-deep leading-none">{format(new Date(a.date), "d")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-moss-deep truncate">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(a.date), "EEEE, h:mm a")}
                    {a.location && ` · ${a.location}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ═══════ Recent journal entries ═══════ */}
      <Card className="bg-card border-moss/15 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-serif text-lg text-moss-deep">Recent journal</div>
          <Button variant="ghost" size="sm" onClick={() => onNavigate("journal")} className="text-xs text-moss">
            All <ArrowRight className="ml-1 w-3 h-3" />
          </Button>
        </div>
        {recentEntries.length === 0 ? (
          <button
            onClick={() => onNavigate("journal")}
            className="w-full text-left py-6 px-4 rounded-2xl bg-gradient-blush border border-dashed border-rose-gold/30 hover:bg-blush/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                <Plus className="w-4 h-4 text-rose-gold" />
              </div>
              <div>
                <div className="text-sm font-medium text-moss-deep">Write your first entry</div>
                <div className="text-xs text-muted-foreground">A letter to baby, a moment, a feeling...</div>
              </div>
            </div>
          </button>
        ) : (
          <div className="space-y-3">
            {recentEntries.map((e) => (
              <button
                key={e.id}
                onClick={() => onNavigate("journal")}
                className="w-full text-left p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {e.mood && (
                    <div className="text-xl">{MOODS.find((m) => m.value === e.mood)?.emoji}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    {e.title && <div className="text-sm font-medium text-moss-deep truncate">{e.title}</div>}
                    <div className="text-xs text-foreground/70 line-clamp-2 mt-0.5">{e.body}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                      {e.week ? ` · Week ${e.week}` : ""}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* ── Final decorative botanical: sprig ── */}
      <div className="relative h-0 mb-2">
        <BotanicalSprig className="absolute -top-1 left-6 w-8 h-5 text-rose-gold opacity-[0.12] -rotate-6" />
        <BotanicalLeaf className="absolute -top-2 right-8 w-4 h-6 text-moss opacity-[0.12] rotate-12" />
      </div>
    </div>
  );
}

function KeepsakeCard({ emoji, title, accent, image, onClick }: { emoji: string; title: string; accent: string; image?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left">
      <div className={cn("rounded-2xl h-full transition-all hover:shadow-soft border border-transparent hover:border-moss/10 overflow-hidden relative", accent)}>
        {image && (
          <div className="relative h-24">
            <Image src={image} alt={title} width={200} height={120} className="w-full h-full object-cover opacity-70" />
            {/* Gradient from bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            {/* Emoji floats over image */}
            <span className="absolute bottom-2 left-3 text-2xl drop-shadow-md">{emoji}</span>
          </div>
        )}
        <div className="p-3 pt-2">
          {!image && <div className="text-lg mb-0.5">{emoji}</div>}
          <div className="text-[11px] font-medium text-moss-deep leading-tight">{title}</div>
        </div>
      </div>
    </button>
  );
}

function QuickAction({ icon: Icon, title, desc, accent, color, onClick, highlight, bgImage, gradientFrom, gradientTo }: {
  icon: any;
  title: string;
  desc: string;
  accent: string;
  color: string;
  onClick: () => void;
  highlight?: boolean;
  bgImage?: string;
  gradientFrom?: string;
  gradientTo?: string;
}) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className={cn(
        "rounded-3xl h-full border-transparent hover:shadow-premium transition-all duration-300 overflow-hidden relative min-h-[160px] group",
        highlight && "ring-1 ring-rose-gold/40"
      )}>
        {/* Background image at ~30% opacity */}
        {bgImage && (
          <img
            src={bgImage}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-[0.30] transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Colored gradient overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br",
          gradientFrom || "from-card/90",
          gradientTo || "to-card/70"
        )} />
        {/* Content at bottom */}
        <div className="relative p-5 min-h-[160px] flex flex-col justify-between">
          {/* Glassmorphic icon circle */}
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg">
            <Icon className={cn("w-5 h-5", highlight ? "text-cream" : "text-cream")} />
          </div>
          {/* Text at bottom */}
          <div>
            <div className="font-serif text-lg text-cream drop-shadow-sm">{title}</div>
            <div className="text-xs text-cream/70 mt-0.5">{desc}</div>
          </div>
        </div>
      </Card>
    </button>
  );
}
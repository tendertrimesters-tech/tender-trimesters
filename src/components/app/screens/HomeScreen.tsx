"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calcWeek, trimesterOf, useProfile } from "@/components/providers";
import type { AppView } from "../AppShell";
import { Baby, Heart, Sparkles, BookHeart, Calendar as CalIcon, ArrowRight, Plus, MessageCircleHeart, Users, Flower2, Crown, Image as ImageIcon } from "lucide-react";
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
      {/* Week tracker hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="bg-gradient-moss text-cream rounded-3xl overflow-hidden shadow-soft relative">
          <Image src="/images/hero.webp" alt="" fill className="absolute inset-0 object-cover opacity-20 mix-blend-overlay pointer-events-none" />
          <div className="relative p-6 sm:p-7">
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

            <Button
              onClick={() => onNavigate("calendar")}
              variant="secondary"
              className="mt-4 bg-cream/15 hover:bg-cream/25 text-cream rounded-full h-9 text-xs"
            >
              View this week <ArrowRight className="ml-1.5 w-3 h-3" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Today's affirmation */}
      {weekData && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="bg-gradient-blush border-rose-gold/20 rounded-3xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-rose-gold" />
              <div className="text-[10px] uppercase tracking-widest text-rose-gold font-semibold">Today's Affirmation</div>
            </div>
            <p className="font-script text-2xl text-moss-deep leading-snug">
              {weekData.affirmation}
            </p>
          </Card>
        </motion.div>
      )}

      {/* Mood check-in */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="bg-card border-moss/15 rounded-3xl p-6">
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
                  "flex flex-col items-center gap-1 py-2.5 rounded-2xl transition-all",
                  m.bg,
                  todayMood === m.value ? "ring-2 ring-moss ring-offset-2 ring-offset-card scale-105" : "hover:scale-105"
                )}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] font-medium text-moss-deep">{m.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Quick actions grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={CalIcon}
          title="Appointments"
          desc={upcomingAppts.length > 0 ? `${upcomingAppts.length} upcoming` : "Track your OB visits"}
          accent="bg-sage/30"
          color="text-moss-deep"
          onClick={() => onNavigate("calendar")}
        />
        <QuickAction
          icon={MessageCircleHeart}
          title="Talk to Tempie"
          desc="Your 24/7 AI companion"
          accent="bg-blush/30"
          color="text-rose-gold"
          onClick={() => onNavigate("tempie")}
          highlight
          image="/images/letters.webp"
        />
        <QuickAction
          icon={Users}
          title="The Village"
          desc="Share with other mamas"
          accent="bg-sage/30"
          color="text-moss-deep"
          onClick={() => onNavigate("community")}
        />
        <QuickAction
          icon={Flower2}
          title="Meditate"
          desc="Sensual guided journeys"
          accent="bg-lavender/20"
          color="text-moss-deep"
          onClick={() => onNavigate("meditation")}
          image="/images/meditation.webp"
        />
      </div>

      {/* Signature keepsakes grid */}
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

      {/* Upcoming appointments */}
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

      {/* Recent journal entries */}
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
    </div>
  );
}

function KeepsakeCard({ emoji, title, accent, image, onClick }: { emoji: string; title: string; accent: string; image?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left">
      <div className={cn("rounded-2xl h-full transition-all hover:shadow-soft border border-transparent hover:border-moss/10 overflow-hidden relative", accent)}>
        {image && <Image src={image} alt={title} width={160} height={100} className="w-full h-20 object-cover opacity-60" />}
        <div className="p-3 pt-2">
          <div className="text-lg mb-0.5">{emoji}</div>
          <div className="text-[11px] font-medium text-moss-deep leading-tight">{title}</div>
        </div>
      </div>
    </button>
  );
}

function QuickAction({ icon: Icon, title, desc, accent, color, onClick, highlight, image }: { icon: any; title: string; desc: string; accent: string; color: string; onClick: () => void; highlight?: boolean; image?: string }) {
  return (
    <button onClick={onClick} className="text-left">
      <Card className={cn("rounded-3xl h-full border-transparent hover:shadow-soft transition-shadow overflow-hidden relative", accent, highlight && "ring-1 ring-rose-gold/30")}>
        {image && <Image src={image} alt={title} width={300} height={150} className="w-full h-28 object-cover opacity-40 absolute inset-0" />}
        <div className={cn("relative p-5", image && "bg-gradient-to-t from-black/20 to-transparent min-h-[140px] flex flex-col justify-end")}>
          <div className={cn("w-10 h-10 rounded-xl bg-cream/60 flex items-center justify-center mb-3", image && "bg-cream/80")}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div className="font-serif text-lg text-moss-deep">{title}</div>
          <div className="text-xs text-foreground/60 mt-1">{desc}</div>
        </div>
      </Card>
    </button>
  );
}

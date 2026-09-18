"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { calcWeek, trimesterOf, useProfile } from "@/components/providers";
import type { AppView } from "../AppShell";
import { Sparkles, Calendar as CalIcon, Plus, MessageCircleHeart, Leaf } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import TempieMascot from "../TempieMascot";

type Mood = "glowing" | "calm" | "tired" | "anxious" | "teary" | "grateful" | "nauseous" | "energized";

const MOODS: { value: Mood; color: string; label: string }[] = [
  { value: "glowing", color: "#E89098", label: "Glowing" },
  { value: "calm", color: "#7CB374", label: "Calm" },
  { value: "tired", color: "#FFD98C", label: "Tired" },
  { value: "anxious", color: "#9F7BC4", label: "Anxious" },
  { value: "teary", color: "#C56A75", label: "Teary" },
  { value: "grateful", color: "#B85A38", label: "Grateful" },
  { value: "nauseous", color: "#A8821A", label: "Nauseous" },
  { value: "energized", color: "#A8455D", label: "Energized" },
];

/* ─── Watercolor baby-size fruit (placeholder for 40-week series) ─── */
function WatercolorBaby({ week, size = 120 }: { week: number; size?: number }) {
  // Map week to a fruit/veg + color palette
  const fruitMap: Record<number, { name: string; colors: [string, string, string]; shape: "round" | "oval" | "long" | "cluster" }> = {
    4: { name: "Poppy Seed", colors: ["#722F37", "#4A1F25", "#2D1418"], shape: "round" },
    8: { name: "Raspberry", colors: ["#E89098", "#C56A75", "#A8455D"], shape: "cluster" },
    12: { name: "Lime", colors: ["#7CB374", "#5A7A48", "#2D3F23"], shape: "round" },
    16: { name: "Avocado", colors: ["#7CB374", "#5A7A48", "#2D3F23"], shape: "oval" },
    20: { name: "Banana", colors: ["#FFD98C", "#E8B860", "#A8821A"], shape: "long" },
    24: { name: "Corn Cob", colors: ["#FFD98C", "#7CB374", "#5A7A48"], shape: "long" },
    28: { name: "Eggplant", colors: ["#9F7BC4", "#7B5BA4", "#4A3070"], shape: "oval" },
    32: { name: "Coconut", colors: ["#DDC9A0", "#A88E5C", "#5A4A30"], shape: "round" },
    36: { name: "Papaya", colors: ["#E89098", "#B85A38", "#722F37"], shape: "long" },
    40: { name: "Pumpkin", colors: ["#B85A38", "#A8455D", "#722F37"], shape: "round" },
  };
  const closestWeek = Object.keys(fruitMap).map(Number).reduce((prev, curr) =>
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  const fruit = fruitMap[closestWeek] || fruitMap[16];
  const [c1, c2, c3] = fruit.colors;
  const gradId = `baby-grad-${week}`;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: size, height: size }}>
        <defs>
          <radialGradient id={gradId} cx="35%" cy="35%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.85" />
            <stop offset="55%" stopColor={c2} stopOpacity="0.7" />
            <stop offset="100%" stopColor={c3} stopOpacity="0.5" />
          </radialGradient>
          <filter id={`${gradId}-blur`}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Soft watercolor halo */}
        <circle cx="60" cy="60" r="55" fill={c1} fillOpacity="0.15" filter={`url(#${gradId}-blur)`} />

        {/* Main fruit body based on shape */}
        {fruit.shape === "round" && (
          <circle cx="60" cy="65" r="35" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
        )}
        {fruit.shape === "oval" && (
          <ellipse cx="60" cy="65" rx="28" ry="40" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
        )}
        {fruit.shape === "long" && (
          <path
            d="M 50 30 Q 70 35 75 60 Q 80 85 60 95 Q 40 85 45 60 Q 50 35 50 30 Z"
            fill={`url(#${gradId})`}
            filter={`url(#${gradId}-blur)`}
          />
        )}
        {fruit.shape === "cluster" && (
          <>
            <circle cx="55" cy="55" r="15" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
            <circle cx="68" cy="50" r="13" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
            <circle cx="55" cy="72" r="14" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
            <circle cx="70" cy="72" r="12" fill={`url(#${gradId})`} filter={`url(#${gradId}-blur)`} />
          </>
        )}

        {/* Highlight */}
        <ellipse cx="48" cy="48" rx="8" ry="12" fill={c1} fillOpacity="0.55" />

        {/* Stem + leaf */}
        <path d="M60 28 L60 36" stroke={c3} strokeWidth="2" strokeLinecap="round" />
        <path d="M60 32 Q 72 28 76 34 Q 70 40 60 38" fill="#5A7A48" fillOpacity="0.7" />
      </svg>
    </div>
  );
}

/* ─── 40-week progress ribbon ─── */
function WeekRibbon({ currentWeek }: { currentWeek: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector(`[data-week="${currentWeek}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [currentWeek]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-1"
      >
        {Array.from({ length: 40 }, (_, i) => {
          const w = i + 1;
          const isActive = w === currentWeek;
          const isPast = w < currentWeek;
          const isTrimester1 = w <= 13;
          const isTrimester2 = w > 13 && w <= 27;
          return (
            <div
              key={w}
              data-week={w}
              className={cn(
                "flex flex-col items-center gap-1 transition-all flex-shrink-0",
                isActive && "scale-110"
              )}
            >
              <div
                className={cn(
                  "relative rounded-full transition-all",
                  isActive
                    ? "w-4 h-4 bg-rose-gold ring-2 ring-rose-gold/30 shadow-md"
                    : isPast
                    ? "w-2.5 h-2.5 bg-moss"
                    : "w-2 h-2 bg-moss-deep/20"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-rose-gold animate-breathe" />
                )}
              </div>
              {(w === 1 || w % 4 === 0 || isActive) && (
                <span
                  className={cn(
                    "text-[10px] tracking-wide transition-colors",
                    isActive ? "text-rose-gold font-semibold" : "text-muted-foreground"
                  )}
                >
                  {w}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Trimester labels */}
      <div className="flex justify-between mt-1 px-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">
        <span>T1</span>
        <span>T2</span>
        <span>T3</span>
      </div>
    </div>
  );
}

/* ─── Mood constellation ─── */
function MoodConstellation({
  todayMood,
  onPick,
}: {
  todayMood: Mood | null;
  onPick: (m: Mood) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      {MOODS.map((m) => {
        const isActive = todayMood === m.value;
        return (
          <button
            key={m.value}
            onClick={() => onPick(m.value)}
            className="group flex flex-col items-center gap-1.5 transition-transform hover:scale-110"
            title={m.label}
          >
            <div
              className={cn(
                "rounded-full transition-all",
                isActive ? "w-9 h-9 ring-2 ring-cream shadow-md scale-110" : "w-6 h-6 group-hover:w-7 group-hover:h-7"
              )}
              style={{
                background: m.color,
                opacity: isActive ? 1 : todayMood ? 0.4 : 0.7,
              }}
            />
            {isActive && (
              <span className="text-[10px] tracking-wide font-medium" style={{ color: m.color }}>
                {m.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function HomeScreen({
  onNavigate,
  onNavigateToMore,
}: {
  onNavigate: (v: AppView) => void;
  onNavigateToMore: (featureId?: string) => void;
}) {
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

  if (loadingWeek) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <TempieMascot size="lg" state="thinking" className="mx-auto" />
          <div className="font-serif text-moss-deep mt-4">Loading your week…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 max-w-3xl mx-auto">
      {/* ═══════ Week hero — editorial layout ═══════ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="rounded-[32px] overflow-hidden border-moss-deep/15 card-floating bg-card">
          {/* Header — deep moss with watercolor */}
          <div className="bg-gradient-moss-deep text-cream p-6 md:p-8 relative overflow-hidden">
            <div className="flex items-start justify-between gap-6">
              <div className="accent-bar-left flex-1">
                <div className="eyebrow text-butter mb-2">Week {week} · Trimester {trimester}</div>
                <h1 className="display-md text-cream leading-tight">
                  {weekData?.babySize || "Growing"}
                </h1>
                <p className="text-cream/70 text-sm mt-2 leading-relaxed">
                  {weekData?.babySizeDesc || "Your baby is growing every day."}
                </p>
                {weekData?.babyLengthCm && (
                  <div className="mt-3 flex items-center gap-4 text-xs text-cream/60 tracking-wide">
                    <span>{weekData.babyLengthCm} cm long</span>
                    <span>·</span>
                    <span>{weekData.babyWeightG} g</span>
                  </div>
                )}
              </div>
              {/* Watercolor baby illustration */}
              <div className="flex-shrink-0 animate-breathe-slow">
                <WatercolorBaby week={week} size={120} />
              </div>
            </div>
          </div>

          {/* Progress ribbon */}
          <div className="bg-card px-6 py-4 border-b border-moss-deep/10">
            <WeekRibbon currentWeek={week} />
          </div>

          {/* Affirmation */}
          {weekData?.affirmation && (
            <div className="p-6 md:p-8 bg-blush/15 border-b border-moss-deep/10">
              <div className="eyebrow text-rose-gold mb-3">Today's affirmation</div>
              <p className="font-script text-3xl md:text-4xl text-moss-deep leading-tight">
                {weekData.affirmation}
              </p>
            </div>
          )}

          {/* Body changes + tips */}
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
            {weekData?.bodyChanges && (
              <div className="accent-bar-moss">
                <div className="eyebrow text-moss-deep mb-2 flex items-center gap-2">
                  <Leaf className="w-3 h-3" /> Your body
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {weekData.bodyChanges}
                </p>
              </div>
            )}
            {weekData?.bestFriendTip && (
              <div className="accent-bar-rose">
                <div className="eyebrow text-rose-gold mb-2">Best friend tip</div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {weekData.bestFriendTip}
                </p>
              </div>
            )}
          </div>

          {weekData?.selfCare && (
            <div className="px-6 md:px-8 pb-6 md:pb-8">
              <div className="bg-sage/10 rounded-2xl p-5 border border-sage/20">
                <div className="eyebrow text-moss mb-3">Self-care this week</div>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {weekData.selfCare}
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ═══════ Mood constellation ═══════ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <Card className="rounded-3xl p-6 md:p-8 bg-card border-moss-deep/10 card-pressed">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="eyebrow text-terracotta mb-1">Today's mood</div>
              <h3 className="font-serif text-2xl text-moss-deep">How are you, mama?</h3>
            </div>
            {todayMood && (
              <span className="font-script text-2xl text-rose-gold">
                {MOODS.find((m) => m.value === todayMood)?.label}
              </span>
            )}
          </div>
          <MoodConstellation todayMood={todayMood} onPick={saveMood} />
        </Card>
      </motion.div>

      {/* ═══════ Quick actions ═══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickAction
          icon={<MessageCircleHeart className="w-5 h-5" />}
          label="Tempie"
          onClick={() => onNavigate("tempie")}
        />
        <QuickAction
          icon={<Plus className="w-5 h-5" />}
          label="Journal"
          onClick={() => onNavigate("journal")}
        />
        <QuickAction
          icon={<CalIcon className="w-5 h-5" />}
          label="Calendar"
          onClick={() => onNavigate("calendar")}
        />
        <QuickAction
          icon={<Sparkles className="w-5 h-5" />}
          label="Keepsakes"
          onClick={() => onNavigate("more")}
        />
      </div>

      {/* ═══════ Recent journal entries ═══════ */}
      {recentEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="eyebrow text-terracotta mb-1">From your journal</div>
              <h3 className="font-serif text-2xl text-moss-deep">Recent thoughts</h3>
            </div>
            <button
              onClick={() => onNavigate("journal")}
              className="text-sm text-terracotta hover:underline tracking-wide"
            >
              All entries →
            </button>
          </div>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => onNavigate("journal")}
                className="block w-full text-left"
              >
                <Card className="rounded-2xl p-5 bg-card border-moss-deep/10 hover:border-moss-deep/30 transition-all hover:-translate-y-0.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 tracking-wide">
                    <span>{format(new Date(entry.createdAt), "MMM d")}</span>
                    {entry.mood && (
                      <>
                        <span>·</span>
                        <span className="capitalize">{entry.mood}</span>
                      </>
                    )}
                    {entry.week && (
                      <>
                        <span>·</span>
                        <span>Week {entry.week}</span>
                      </>
                    )}
                  </div>
                  {entry.title && (
                    <div className="font-serif text-lg text-moss-deep mb-1">{entry.title}</div>
                  )}
                  <p className="text-sm text-foreground/75 leading-relaxed line-clamp-2">
                    {entry.body}
                  </p>
                </Card>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════ Upcoming appointments ═══════ */}
      {upcomingAppts.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="eyebrow text-terracotta mb-1">Coming up</div>
              <h3 className="font-serif text-2xl text-moss-deep">Appointments</h3>
            </div>
            <button
              onClick={() => onNavigate("calendar")}
              className="text-sm text-terracotta hover:underline tracking-wide"
            >
              Calendar →
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppts.map((appt) => (
              <Card key={appt.id} className="rounded-2xl p-5 bg-card border-moss-deep/10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-serif text-lg text-moss-deep">{appt.title}</div>
                    {appt.location && (
                      <div className="text-xs text-muted-foreground mt-1">{appt.location}</div>
                    )}
                    {appt.notes && (
                      <p className="text-sm text-foreground/70 mt-2 line-clamp-1">{appt.notes}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-serif text-xl text-terracotta">
                      {format(new Date(appt.date), "MMM d")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(appt.date), "h:mm a")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* ═══════ Floating Tempie mascot — anchored bottom right ═══════ */}
      <button
        onClick={() => onNavigate("tempie")}
        className="fixed bottom-24 right-6 z-30 group"
        title="Talk to Tempie"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-butter/30 blur-xl animate-glow scale-150" />
          <div className="relative bg-card rounded-full p-3 shadow-premium border border-moss-deep/15 group-hover:scale-105 transition-transform">
            <TempieMascot size="md" state="listening" />
          </div>
          <div className="absolute -top-1 -right-1 bg-rose-gold text-cream text-[10px] font-medium px-2 py-0.5 rounded-full">
            24/7
          </div>
        </div>
      </button>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="group">
      <Card className="rounded-2xl p-4 bg-card border-moss-deep/10 hover:border-moss-deep/30 transition-all hover:-translate-y-0.5 hover:shadow-premium">
        <div className="w-10 h-10 rounded-xl bg-moss-deep/8 flex items-center justify-center text-moss-deep mb-2 group-hover:bg-moss-deep/15 transition-colors">
          {icon}
        </div>
        <div className="text-sm font-medium text-moss-deep tracking-wide">{label}</div>
      </Card>
    </button>
  );
}

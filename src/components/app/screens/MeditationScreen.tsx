"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile, calcWeek, trimesterOf } from "@/components/providers";
import { toast } from "sonner";
import {
  Flower2,
  Play,
  Pause,
  X,
  ChevronLeft,
  Lock,
  Clock,
  Heart,
  Wind,
  Sparkles,
  BookOpen,
  Crown,
} from "lucide-react";
import {
  MEDITATIONS,
  MEDITATION_CATEGORIES,
  type Meditation,
  type MeditationBeat,
} from "@/data/meditations";

type SubView = "library" | "player" | "journal";

// ─── Helpers ────────────────────────────────────────────────────────

/** Calculate total seconds of a meditation from its beats */
function totalSeconds(m: Meditation): number {
  let t = 0;
  for (const b of m.beats) {
    if (b.type === "pause" && b.pauseSeconds) t += b.pauseSeconds;
    if (b.type === "speak" && b.text) {
      // ~130 words per minute = ~0.462 seconds per word
      t += Math.ceil((b.text.split(/\s+/).length * 60) / 130);
    }
    if (b.type === "breath" && b.text) {
      t += Math.ceil((b.text.split(/\s+/).length * 60) / 130);
    }
    if (b.type === "affirmation" && b.text) {
      // Affirmations are read more slowly with pauses
      t += Math.ceil((b.text.split(/\s+/).length * 60) / 100) + 3;
    }
  }
  return t;
}

/** Approximate seconds for a single beat */
function beatDuration(b: MeditationBeat): number {
  if (b.type === "pause" && b.pauseSeconds) return b.pauseSeconds;
  if (b.type === "speak" && b.text) return Math.ceil((b.text.split(/\s+/).length * 60) / 130);
  if (b.type === "breath" && b.text) return Math.ceil((b.text.split(/\s+/).length * 60) / 130);
  if (b.type === "affirmation" && b.text) return Math.ceil((b.text.split(/\s+/).length * 60) / 100) + 3;
  return 0;
}

/** Format seconds as m:ss */
function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Category icon + gradient */
function categoryStyle(cat: string) {
  const map: Record<string, { icon: typeof Flower2; gradient: string; bg: string }> = {
    "first-trimester": { icon: Sparkles, gradient: "from-pink-200/80 to-rose-100/80", bg: "bg-pink-50" },
    "second-trimester": { icon: Heart, gradient: "from-emerald-200/80 to-green-100/80", bg: "bg-emerald-50" },
    "third-trimester": { icon: Wind, gradient: "from-amber-200/80 to-orange-100/80", bg: "bg-amber-50" },
    "birth-prep": { icon: Flower2, gradient: "from-purple-200/80 to-violet-100/80", bg: "bg-purple-50" },
    postpartum: { icon: BookOpen, gradient: "from-blue-200/80 to-indigo-100/80", bg: "bg-blue-50" },
  };
  return map[cat] || map["first-trimester"];
}

// ─── Main Screen ────────────────────────────────────────────────────

export default function MeditationScreen() {
  const { profile } = useProfile();
  const isPremium = !!profile?.isPremium;
  const week = calcWeek(profile?.dueDate);
  const trimester = trimesterOf(week);

  const [subView, setSubView] = useState<SubView>("library");
  const [activeMeditation, setActiveMeditation] = useState<Meditation | null>(null);
  const [sessionHistory, setSessionHistory] = useState<Record<string, boolean>>({});
  const [favIds, setFavIds] = useState<Set<string>>(new Set());

  // Load session history from API
  useEffect(() => {
    fetch("/api/meditation")
      .then((r) => r.json())
      .then((d) => {
        const completed: Record<string, boolean> = {};
        (d.sessions || []).forEach((s: any) => {
          completed[s.meditationId] = true;
        });
        setSessionHistory(completed);
      })
      .catch(() => {});
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("meditation-favorites");
      if (saved) setFavIds(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("meditation-favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  // Suggest meditations based on current trimester
  const suggested = MEDITATIONS.filter((m) => {
    if (trimester === 1) return m.category === "first-trimester" || m.category === "second-trimester";
    if (trimester === 2) return m.category === "second-trimester" || m.category === "third-trimester";
    if (trimester === 3) return m.category === "third-trimester" || m.category === "birth-prep";
    return true;
  });

  function openMeditation(m: Meditation) {
    if (!isPremium) {
      toast("Unlock all 8 meditations with Premium 💛", {
        description: "Head to your Profile to upgrade.",
        action: { label: "Later", onClick: () => {} },
      });
      return;
    }
    setActiveMeditation(m);
    setSubView("player");
  }

  // ─── LIBRARY VIEW ─────────────────────────────────────────────────

  if (subView === "library") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-premium flex items-center justify-center shadow-premium">
              <Flower2 className="w-5 h-5 text-cream" />
            </div>
            <div>
              <div className="font-serif text-xl text-moss-deep leading-none">
                Audio Meditations
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-rose-gold" />
                {isPremium ? "Premium · 8 guided practices" : "Premium feature · Unlock to access"}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured / suggested based on trimester */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {week ? `Recommended for week ${week}` : "All practices"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggested.map((m, i) => (
              <MeditationCard
                key={m.id}
                meditation={m}
                index={i}
                isPremium={isPremium}
                isCompleted={!!sessionHistory[m.id]}
                isFavorite={favIds.has(m.id)}
                onPlay={() => openMeditation(m)}
                onToggleFavorite={() => toggleFavorite(m.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* All meditations by category */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-5"
        >
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            All meditations
          </div>
          {Object.entries(MEDITATION_CATEGORIES).map(([catKey, catValue]) => {
            const cat = catValue as { label: string; description: string; accent: string };
            const meds = MEDITATIONS.filter((m) => m.category === catKey);
            const style = categoryStyle(catKey);
            const Icon = style.icon;
            return (
              <div key={catKey} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className={cn("w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center", style.gradient)}>
                    <Icon className="w-3 h-3 text-foreground/70" />
                  </div>
                  <span className="text-sm font-medium text-moss-deep">{cat.label}</span>
                  <span className="text-[10px] text-muted-foreground ml-1">{meds.length} practices</span>
                </div>
                <div className="space-y-2 pl-2">
                  {meds.map((m, i) => (
                    <MeditationCard
                      key={m.id}
                      meditation={m}
                      index={i}
                      isPremium={isPremium}
                      isCompleted={!!sessionHistory[m.id]}
                      isFavorite={favIds.has(m.id)}
                      onPlay={() => openMeditation(m)}
                      onToggleFavorite={() => toggleFavorite(m.id)}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    );
  }

  // ─── PLAYER VIEW ─────────────────────────────────────────────────

  if (subView === "player" && activeMeditation) {
    return (
      <MeditationPlayer
        meditation={activeMeditation}
        onClose={() => setSubView("library")}
        onJournal={() => setSubView("journal")}
        onCompleted={(medId, durSec) => {
          setSessionHistory((prev) => ({ ...prev, [medId]: true }));
          // Log session to API
          fetch("/api/meditation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ meditationId: medId, durationSec: durSec, completed: true }),
          }).catch(() => {});
        }}
      />
    );
  }

  // ─── JOURNAL VIEW ───────────────────────────────────────────────

  if (subView === "journal" && activeMeditation) {
    return (
      <JournalView
        meditation={activeMeditation}
        onClose={() => setSubView("library")}
      />
    );
  }

  return null;
}

// ─── Meditation Card ────────────────────────────────────────────────

function MeditationCard({
  meditation,
  index,
  isPremium,
  isCompleted,
  isFavorite,
  onPlay,
  onToggleFavorite,
  compact = false,
}: {
  meditation: Meditation;
  index: number;
  isPremium: boolean;
  isCompleted: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onToggleFavorite: () => void;
  compact?: boolean;
}) {
  const style = categoryStyle(meditation.category);
  const total = totalSeconds(meditation);

  if (compact) {
    return (
      <Card
        className={cn(
          "bg-card border-border/40 rounded-2xl p-3 cursor-pointer transition-all hover:shadow-soft group",
          !isPremium && "opacity-60"
        )}
        onClick={onPlay}
      >
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", style.gradient)}>
            {isPremium ? (
              <Play className="w-4 h-4 text-foreground/70 ml-0.5" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-foreground/50" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-moss-deep truncate">{meditation.title}</div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{meditation.durationMinutes} min</span>
              {isCompleted && <span className="text-moss">✓ Done</span>}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className="p-1.5 rounded-full hover:bg-blush/40 transition-colors"
          >
            <Heart className={cn("w-3.5 h-3.5", isFavorite ? "fill-rose-gold text-rose-gold" : "text-muted-foreground/40")} />
          </button>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-border/40 rounded-3xl cursor-pointer transition-all hover:shadow-soft group",
          !isPremium && "opacity-60"
        )}
        onClick={onPlay}
      >
        {/* Gradient header */}
        <div className={cn("h-24 bg-gradient-to-br relative", style.gradient)}>
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "w-14 h-14 rounded-full bg-cream/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
            )}>
              {isPremium ? (
                <Play className="w-6 h-6 text-moss-deep ml-1" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground/60" />
              )}
            </div>
          </div>
          {/* Favorite */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-cream/50 backdrop-blur-sm hover:bg-cream/80 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isFavorite ? "fill-rose-gold text-rose-gold" : "text-foreground/40")} />
          </button>
        </div>

        <div className="p-4 pt-3">
          <div className="text-sm font-serif font-medium text-moss-deep">{meditation.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5 italic">{meditation.subtitle}</div>
          <div className="flex items-center gap-3 mt-2.5 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{meditation.durationMinutes} min</span>
            <span className={cn("px-2 py-0.5 rounded-full", style.bg)}>{meditation.category.replace("-", " ")}</span>
            {isCompleted && <span className="text-moss font-medium">✓ Completed</span>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Immersive Player ──────────────────────────────────────────────

function MeditationPlayer({
  meditation,
  onClose,
  onJournal,
  onCompleted,
}: {
  meditation: Meditation;
  onClose: () => void;
  onJournal: () => void;
  onCompleted: (medId: string, durSec: number) => void;
}) {
  const total = totalSeconds(meditation);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"idle" | "in" | "hold" | "out">("idle");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate current beat index from elapsed time
  let cumTime = 0;
  let currentBeatIndex = 0;
  for (let i = 0; i < meditation.beats.length; i++) {
    cumTime += beatDuration(meditation.beats[i]);
    if (elapsed < cumTime) {
      currentBeatIndex = i;
      break;
    }
    if (i === meditation.beats.length - 1) currentBeatIndex = i;
  }
  const currentBeat = meditation.beats[currentBeatIndex];
  const progress = total > 0 ? Math.min(elapsed / total, 1) : 0;

  // Timer
  useEffect(() => {
    if (playing && !finished) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= total) {
            setPlaying(false);
            setFinished(true);
            onCompleted(meditation.id, total);
            toast.success("Beautiful practice, mama. 🌿");
            return total;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, finished, total, meditation.id, onCompleted]);

  // Breathing animation synced to breath beats
  useEffect(() => {
    if (currentBeat?.type === "breath" && playing) {
      if (currentBeat.breath === "in") setBreathPhase("in");
      else if (currentBeat.breath === "hold") setBreathPhase("hold");
      else if (currentBeat.breath === "out") setBreathPhase("out");
    } else if (currentBeat?.type !== "breath") {
      setBreathPhase("idle");
    }
  }, [currentBeatIndex, currentBeat, playing]);

  function togglePlay() {
    if (finished) {
      setElapsed(0);
      setFinished(false);
      setPlaying(true);
    } else {
      setPlaying(!playing);
    }
  }

  // Breathing circle animation scale
  const breathScale =
    breathPhase === "in" ? "scale-100" :
    breathPhase === "hold" ? "scale-100" :
    breathPhase === "out" ? "scale-75" :
    "scale-90";

  const style = categoryStyle(meditation.category);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-cream flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-deep/50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-moss-deep" />
        </button>
        <div className="text-xs text-muted-foreground font-medium">{meditation.title}</div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-deep/50 transition-colors">
          <X className="w-5 h-5 text-moss-deep" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBeatIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-sm mx-auto"
          >
            {/* Breathing circle */}
            {currentBeat?.type === "breath" ? (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={cn(
                  "w-40 h-40 rounded-full bg-gradient-to-br flex items-center justify-center transition-transform duration-[4000ms] ease-in-out",
                  style.gradient,
                  breathScale
                )}>
                  <div className="text-center">
                    <Wind className="w-6 h-6 text-foreground/60 mx-auto mb-1" />
                    <div className="text-sm font-medium text-foreground/70">
                      {currentBeat.breath === "in" && "Breathe in"}
                      {currentBeat.breath === "hold" && "Hold"}
                      {currentBeat.breath === "out" && "Breathe out"}
                    </div>
                  </div>
                </div>
                {currentBeat.text && (
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {currentBeat.text}
                  </p>
                )}
              </div>
            ) : currentBeat?.type === "affirmation" ? (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={cn(
                  "w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center",
                  "from-blush/80 to-rose-100/80"
                )}>
                  <Sparkles className="w-6 h-6 text-rose-gold" />
                </div>
                <p className="font-script text-xl text-rose-gold leading-relaxed">
                  &ldquo;{currentBeat.text}&rdquo;
                </p>
              </div>
            ) : currentBeat?.type === "pause" ? (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={cn(
                  "w-28 h-28 rounded-full flex items-center justify-center transition-transform duration-[2000ms]",
                  "bg-cream-deep/40"
                )}>
                  <div className="w-3 h-3 rounded-full bg-moss/30 animate-pulse-soft" />
                </div>
                <p className="text-xs text-muted-foreground/60 tracking-wider">
                  {currentBeat.pauseSeconds}s pause
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={cn(
                  "w-32 h-32 rounded-full bg-gradient-to-br flex items-center justify-center",
                  style.gradient,
                  "opacity-60"
                )}>
                  <Flower2 className="w-8 h-8 text-foreground/40" />
                </div>
              </div>
            )}

            {/* Spoken text */}
            {currentBeat?.type === "speak" && currentBeat.text && (
              <motion.p
                key={`text-${currentBeatIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="font-serif text-lg text-moss-deep leading-relaxed"
              >
                {currentBeat.text}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="px-6 pb-8 pt-4 space-y-4">
        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-cream-deep rounded-full overflow-hidden">
            <motion.div
              className={cn("h-full rounded-full bg-gradient-to-r", style.gradient)}
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{fmtTime(elapsed)}</span>
            <span>{fmtTime(total)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <button
            onClick={togglePlay}
            className={cn(
              "w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg transition-all active:scale-95",
              style.gradient
            )}
          >
            {playing ? (
              <Pause className="w-7 h-7 text-moss-deep" />
            ) : (
              <Play className="w-7 h-7 text-moss-deep ml-1" />
            )}
          </button>

          {finished && (
            <Button
              onClick={onJournal}
              className="rounded-full bg-gradient-blush text-moss-deep hover:opacity-90"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Journal
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Journal View ────────────────────────────────────────────────────

function JournalView({
  meditation,
  onClose,
}: {
  meditation: Meditation;
  onClose: () => void;
}) {
  const [note, setNote] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={onClose} className="p-2 rounded-full hover:bg-cream-deep/50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-moss-deep" />
        </button>
        <div>
          <div className="font-serif text-xl text-moss-deep">After Practice</div>
          <div className="text-[10px] text-muted-foreground">{meditation.title}</div>
        </div>
      </div>

      {/* Journal prompt */}
      <Card className="bg-gradient-blush border-rose-gold/15 rounded-3xl p-6">
        <div className="text-[10px] uppercase tracking-widest text-rose-gold font-semibold mb-2">
          Journal Prompt
        </div>
        <p className="font-serif text-base text-moss-deep leading-relaxed italic">
          {meditation.journalPrompt}
        </p>
      </Card>

      {/* Writing area */}
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your reflection here... this is just for you, mama."
          className="w-full min-h-[200px] bg-card border-border/40 rounded-3xl p-5 text-sm text-foreground leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-rose-gold/30 placeholder:text-muted-foreground/40"
        />
        <div className="text-[10px] text-muted-foreground text-center">
          Your reflections are saved locally on your device.
        </div>
      </div>

      <Button
        onClick={() => {
          // Save to localStorage keyed by meditation id
          const key = `meditation-journal-${meditation.id}`;
          const existing = JSON.parse(localStorage.getItem(key) || "[]");
          existing.push({ text: note, date: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(existing));
          toast.success("Journal entry saved 💛");
          onClose();
        }}
        className="w-full rounded-full bg-gradient-premium hover:opacity-90 text-cream"
        disabled={!note.trim()}
      >
        Save Reflection
      </Button>
    </div>
  );
}

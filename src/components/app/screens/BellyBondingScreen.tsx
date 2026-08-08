"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProfile, calcWeek } from "@/components/providers";
import { BELLY_RITUALS, type BellyRitual } from "@/data/signature-features";
import { Heart, Play, CheckCircle, Flame, Volume2, VolumeX, Hand, Wind } from "lucide-react";

export default function BellyBondingScreen() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate) ?? 1;
  const ritual: BellyRitual =
    BELLY_RITUALS.find((r) => r.week === currentWeek) || BELLY_RITUALS[0];

  const [completed, setCompleted] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [showPast, setShowPast] = useState(false);

  const loadStreak = useCallback(() => {
    fetch("/api/rituals")
      .then((r) => r.json())
      .then((d) => {
        const weeks = new Set((d.rituals || []).map((r: any) => r.week));
        setStreakCount(weeks.size);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  const handleComplete = async () => {
    try {
      await fetch("/api/rituals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          week: ritual.week,
          phrase: ritual.phrase,
          gesture: ritual.gesture,
          breath: ritual.breath,
        }),
      });
      setCompleted(true);
      loadStreak();
    } catch {
      // silent
    }
  };

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(ritual.phrase);
      utterance.rate = 0.85;
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  const pastRituals = BELLY_RITUALS.filter(
    (r) => r.week < currentWeek
  ).slice(-4);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-serif text-2xl text-moss-deep">Belly Bonding</h1>
        <p className="text-sm text-muted-foreground mt-1">
          60 seconds with your baby, every day
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-3xl p-6 bg-gradient-blush border-0">
          <p className="text-[10px] uppercase tracking-widest text-rose-gold font-medium">
            Week {ritual.week} Ritual
          </p>

          <p className="font-script text-xl text-moss-deep leading-relaxed my-4">
            {ritual.phrase}
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Hand className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Your hands
                </span>
              </div>
              <p className="text-sm text-foreground/80">{ritual.gesture}</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Wind className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Your breath
                </span>
              </div>
              <p className="text-sm text-foreground/80">{ritual.breath}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-5">
            <Button
              onClick={handleComplete}
              disabled={completed}
              className={cn(
                "rounded-full",
                completed
                  ? "bg-sage/30 text-moss-deep"
                  : "bg-moss text-cream"
              )}
            >
              {completed ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Completed
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1.5" />
                  Complete ritual
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={toggleSpeech}
            >
              {speaking ? (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Volume2 className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <p className="text-xs text-muted-foreground">Your bonding journey</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-sage/20 rounded-full h-2">
            <div
              className="bg-moss rounded-full h-2 transition-all duration-500"
              style={{ width: `${(streakCount / 40) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-moss-deep">
            {streakCount}/40 weeks
          </span>
        </div>
      </motion.div>

      {pastRituals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="ghost"
            className="text-xs text-muted-foreground p-0 h-auto"
            onClick={() => setShowPast(!showPast)}
          >
            {showPast ? "Hide" : "View"} previous rituals
          </Button>
          {showPast && (
            <div className="mt-2 space-y-2">
              {pastRituals.map((r) => (
                <Card
                  key={r.week}
                  className="rounded-2xl p-4 bg-card border-moss/15 shadow-soft"
                >
                  <p className="text-[10px] uppercase tracking-widest text-rose-gold font-medium">
                    Week {r.week}
                  </p>
                  <p className="text-sm text-foreground/80 mt-1">
                    {r.phrase.slice(0, 50)}
                    {r.phrase.length > 50 ? "..." : ""}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

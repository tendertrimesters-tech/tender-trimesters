"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, calcWeek } from "@/components/providers";
import { Baby as BabyIcon, Sparkles, BookOpen } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { format } from "date-fns";
import { toast } from "sonner";

interface Letter {
  id: string;
  week: number;
  letter: string;
  createdAt: string;
}

export default function LettersFromBabyScreen() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [generating, setGenerating] = useState(false);
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);
  const babyName = profile?.babyName;

  const loadLetters = useCallback(() => {
    setLoading(true);
    fetch("/api/baby-letters")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setLetters(d.letters || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    loadLetters();
  }, [loadLetters]);

  const hasCurrentWeekLetter = currentWeek
    ? letters.some((l) => l.week === currentWeek)
    : false;

  const generateLetter = async () => {
    if (!currentWeek) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/baby-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ week: currentWeek, babyName: babyName || null }),
      });
      if (!res.ok) throw new Error();
      toast.success("Letter arrived!");
      loadLetters();
    } catch {
      toast.error("Failed to generate letter");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-moss-deep">
          Letters from {babyName || "Baby"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Love letters from your little one, week by week
        </p>
      </div>

      {/* Generate CTA for current week */}
      {!hasCurrentWeekLetter && currentWeek && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl p-5 bg-gradient-blush">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-rose-gold" />
              <span className="font-serif text-lg text-moss-deep">
                This week&apos;s letter is waiting
              </span>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              Tap below and {babyName || "your baby"} will write to you
            </p>
            <Button
              onClick={generateLetter}
              disabled={generating}
              className="bg-rose-gold text-cream hover:bg-rose-gold/90 rounded-full"
            >
              {generating ? (
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <BookOpen className="w-4 h-4 mr-2" />
              )}
              {generating ? "Writing..." : "Read this week's letter"}
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
          <BookOpen className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">Couldn't load letters</div>
          <Button onClick={loadLetters} variant="outline" className="mt-4 rounded-full">Retry</Button>
        </Card>
      )}

      {/* Letters list — reverse chronological */}
      {!loading && !error && letters.length > 0 && (
        <div className="space-y-3">
          {[...letters].reverse().map((letter) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-card border-moss/15 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-sage/30 rounded-full text-[10px] px-2 py-0.5 text-moss-deep font-medium">
                    Week {letter.week}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(letter.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap mt-3">
                  {letter.letter}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && letters.length === 0 && !hasCurrentWeekLetter && (
        <EmptyState
          icon={<BabyIcon className="w-7 h-7 text-muted-foreground/30" />}
          title="No letters yet"
          description="Generate your first letter to hear from your little one."
        />
      )}

      {/* Keepsake note */}
      {letters.length > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          These letters compile into a lifelong keepsake. Come back each week.
        </p>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, calcWeek } from "@/components/providers";
import { cn } from "@/lib/utils";
import { getHormoneInsight, HORMONE_INSIGHTS } from "@/data/signature-features";
import type { HormoneInsight } from "@/data/signature-features";
import { Activity, Heart, Lightbulb, Waves } from "lucide-react";

export default function HormoneHoroscopeScreen() {
  const [selected, setSelected] = useState<HormoneInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);

  // Try to fetch from API, fall back to static data
  useEffect(() => {
    if (!currentWeek) return;

    const fallback = getHormoneInsight(currentWeek);

    fetch(`/api/hormone-horoscope?week=${currentWeek}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        const insight: HormoneInsight = {
          weekRange: [data.weekRange?.[0] ?? currentWeek, data.weekRange?.[1] ?? currentWeek],
          title: data.title,
          dominantHormones: data.dominantHormones || [],
          body: data.body,
          heart: data.heart,
          tip: data.tip,
        };
        setSelected(insight);
      })
      .catch(() => {
        // API failed — fall back to static data
        if (fallback) setSelected(fallback);
      })
      .finally(() => setLoading(false));
  }, [currentWeek]);

  const isCurrentWeek = (insight: HormoneInsight) =>
    currentWeek != null &&
    currentWeek >= insight.weekRange[0] &&
    currentWeek <= insight.weekRange[1];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-moss-deep">
          Hormone Horoscope
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          What your body&apos;s chemistry is doing this week
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-64 rounded-3xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-36 h-24 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        </div>
      )}

      {/* Main insight */}
      {!loading && selected && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl overflow-hidden">
            {/* Gradient header */}
            <div className="bg-gradient-moss p-5">
              <h2 className="font-serif text-2xl text-cream">{selected.title}</h2>
              <p className="text-xs text-cream/60 mt-1">
                Weeks {selected.weekRange[0]}–{selected.weekRange[1]}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selected.dominantHormones.map((h) => (
                  <span
                    key={h}
                    className="bg-cream/15 text-cream/80 rounded-full px-2 py-0.5 text-[10px]"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Your Body */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Your Body
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {selected.body}
                </p>
              </div>

              {/* Your Heart */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                    Your Heart
                  </span>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {selected.heart}
                </p>
              </div>

              {/* Gentle Tip */}
              <div className="bg-sage/15 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb className="w-3.5 h-3.5 text-moss-deep" />
                  <span className="text-[10px] uppercase tracking-widest text-moss-deep font-medium">
                    Gentle Tip
                  </span>
                </div>
                <p className="text-sm text-moss-deep leading-relaxed">
                  {selected.tip}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* No insight */}
      {!loading && !selected && (
        <div className="text-center py-10">
          <Waves className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-serif text-lg text-muted-foreground">
            Not available for this week yet.
          </p>
        </div>
      )}

      {/* Other weeks — horizontal scrollable row */}
      {!loading && (
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-3">
            Browse all weeks
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {HORMONE_INSIGHTS.map((insight) => (
              <button
                key={insight.title}
                onClick={() => setSelected(insight)}
                className="flex-shrink-0 w-36"
              >
                <Card
                  className={cn(
                    "rounded-2xl p-3 border-moss/15 transition-all text-left",
                    isCurrentWeek(insight) && "ring-2 ring-moss",
                    selected?.title === insight.title &&
                      !isCurrentWeek(insight) &&
                      "ring-1 ring-moss/40"
                  )}
                >
                  <p className="text-[10px] text-muted-foreground">
                    Weeks {insight.weekRange[0]}–{insight.weekRange[1]}
                  </p>
                  <p className="font-serif text-sm text-moss-deep mt-1 line-clamp-1">
                    {insight.title}
                  </p>
                </Card>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

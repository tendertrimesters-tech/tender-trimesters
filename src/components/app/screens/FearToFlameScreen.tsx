"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useProfile, calcWeek } from "@/components/providers";
import { FEAR_CATEGORIES, FEAR_STAGE_LABELS } from "@/data/signature-features";
import { Flame, Sparkles, Plus, ChevronRight, RefreshCw, Trash2 } from "lucide-react";

type FearEntry = {
  id: string;
  fear: string;
  reframed: string | null;
  action: string | null;
  stage: string;
  week: number | null;
};

const STAGE_BORDER: Record<string, string> = {
  ember: "border-l-orange-400",
  spark: "border-l-yellow-400",
  flame: "border-l-rose-gold",
};

export default function FearToFlameScreen() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate) ?? 1;

  const [entries, setEntries] = useState<FearEntry[]>([]);
  const [newFear, setNewFear] = useState("");
  const [category, setCategory] = useState<string>(FEAR_CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [reframingId, setReframingId] = useState<string | null>(null);

  const loadEntries = useCallback(() => {
    fetch("/api/fear-entries")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async () => {
    if (!newFear.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/fear-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fear: newFear, week: currentWeek }),
      });
      setNewFear("");
      loadEntries();
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatch = async (id: string, action: string) => {
    if (action === "reframe") setReframingId(id);
    try {
      await fetch("/api/fear-entries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      loadEntries();
    } catch {
      // silent
    } finally {
      setReframingId(null);
    }
  };

  const stageInfo = (stage: string) =>
    FEAR_STAGE_LABELS[stage] || { label: stage, emoji: "", color: "text-muted-foreground" };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl text-moss-deep">Fear to Flame</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Watch your fears transform into courage
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="rounded-3xl p-5 bg-card border-moss/15 shadow-soft">
          <Textarea
            rows={2}
            placeholder="What are you afraid of, mama? Name it gently."
            value={newFear}
            onChange={(e) => setNewFear(e.target.value)}
            className="resize-none"
          />
          <div className="flex items-center gap-2 mt-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="text-xs rounded-full border border-moss/20 px-3 py-1.5 bg-background text-foreground"
            >
              {FEAR_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !newFear.trim()}
              className="bg-rose-gold/90 text-cream rounded-full ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Transform
            </Button>
          </div>
        </Card>
      </motion.div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12 space-y-3"
        >
          <Flame className="w-12 h-12 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Every fear you name is a fear you can face.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Start by naming one above.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {entries.map((entry) => {
            const info = stageInfo(entry.stage);
            return (
              <Card
                key={entry.id}
                className={cn(
                  "rounded-2xl p-5 bg-card border-moss/15 shadow-soft border-l-4",
                  STAGE_BORDER[entry.stage] || ""
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        entry.stage === "ember" && "bg-orange-100 text-orange-700",
                        entry.stage === "spark" && "bg-yellow-100 text-yellow-700",
                        entry.stage === "flame" && "bg-rose-gold/20 text-rose-gold"
                      )}
                    >
                      {info.emoji} {info.label}
                    </span>
                    {entry.week && (
                      <span className="text-[10px] text-muted-foreground">
                        Wk {entry.week}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handlePatch(entry.id, "delete")}
                    className="text-muted-foreground/50 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-sm text-foreground/85 leading-relaxed">
                  {entry.fear}
                </p>

                {entry.stage === "ember" && (
                  <div className="mt-3">
                    {reframingId === entry.id ? (
                      <span className="inline-flex items-center gap-1 text-xs text-orange-500">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Reframing…
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePatch(entry.id, "reframe")}
                        className="text-xs bg-orange-100 text-orange-700 rounded-full px-3 py-1 hover:bg-orange-200 transition-colors"
                      >
                        Reframe
                      </button>
                    )}
                  </div>
                )}

                {entry.stage === "spark" && entry.reframed && (
                  <>
                    <p className="text-sm text-foreground/80 italic mt-2 bg-sage/20 rounded-xl p-3 leading-relaxed">
                      {entry.reframed}
                    </p>
                    {entry.action && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        {entry.action}
                      </p>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={() => handlePatch(entry.id, "flame")}
                        className="text-xs bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 hover:bg-yellow-200 transition-colors"
                      >
                        I&rsquo;ve grown from this
                      </button>
                    </div>
                  </>
                )}

                {entry.stage === "flame" && entry.reframed && (
                  <>
                    <p className="text-sm text-foreground/80 italic mt-2 bg-sage/20 rounded-xl p-3 leading-relaxed">
                      {entry.reframed}
                    </p>
                    <p className="text-xs text-rose-gold font-medium mt-2">
                      🔥 This fear became your strength
                    </p>
                  </>
                )}
              </Card>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProfile, calcWeek } from "@/components/providers";
import { FEAR_CATEGORIES, FEAR_STAGE_LABELS } from "@/data/signature-features";
import { Flame, Sparkles, RefreshCw, Trash2 } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FearEntry = {
  id: string;
  fear: string;
  reframed: string | null;
  action: string | null;
  stage: string;
  week: number | null;
  category?: string;
};

const STAGE_BORDER: Record<string, string> = {
  ember: "border-l-orange-400",
  spark: "border-l-yellow-400",
  flame: "border-l-amber-500",
};

export default function FearToFlameScreen() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate) ?? 1;

  const [entries, setEntries] = useState<FearEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newFear, setNewFear] = useState("");
  const [category, setCategory] = useState<string>(FEAR_CATEGORIES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [reframingId, setReframingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadEntries = useCallback(() => {
    setLoading(true);
    fetch("/api/fear-entries")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setEntries(d.entries || []);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleSubmit = async () => {
    if (!newFear.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/fear-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fear: newFear, week: currentWeek, category }),
      });
      if (!res.ok) throw new Error();
      setNewFear("");
      loadEntries();
    } catch {
      toast.error("Failed to save fear");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatch = async (id: string, action: string) => {
    if (action === "reframe") setReframingId(id);
    try {
      const res = await fetch("/api/fear-entries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      if (!res.ok) throw new Error();
      loadEntries();
    } catch {
      if (action === "reframe") toast.error("Reframing failed. Try again?");
    } finally {
      setReframingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch("/api/fear-entries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId, action: "delete" }),
      });
      if (!res.ok) throw new Error();
      toast.success("Fear removed");
      loadEntries();
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteId(null);
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
            className="resize-none rounded-xl"
          />
          <div className="flex items-center gap-2 mt-3">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-auto rounded-full text-xs border-moss/20 px-3 py-1.5 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FEAR_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : error ? (
        <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
          <Flame className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">Couldn&apos;t load your fears</div>
          <Button onClick={loadEntries} variant="outline" className="mt-4 rounded-full">Retry</Button>
        </Card>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Flame className="w-7 h-7 text-rose-gold/40" />}
          title="Every fear you name is a fear you can face"
          description="Start by naming one above."
        />
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
                        entry.stage === "flame" && "bg-amber-100 text-amber-700"
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
                    onClick={() => setDeleteId(entry.id)}
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
                        Reframing...
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
                        I&apos;ve grown from this
                      </button>
                    </div>
                  </>
                )}

                {entry.stage === "flame" && entry.reframed && (
                  <>
                    <p className="text-sm text-foreground/80 italic mt-2 bg-sage/20 rounded-xl p-3 leading-relaxed">
                      {entry.reframed}
                    </p>
                    <p className="text-xs text-amber-600 font-medium mt-2">
                      This fear became your strength
                    </p>
                  </>
                )}
              </Card>
            );
          })}
        </motion.div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Delete this fear?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
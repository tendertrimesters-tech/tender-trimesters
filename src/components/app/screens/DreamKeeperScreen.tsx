"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, calcWeek } from "@/components/providers";
import { cn } from "@/lib/utils";
import { DREAM_MOODS } from "@/data/signature-features";
import { Moon, Plus, Sparkles, Trash2, Tag, Lightbulb } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { formatDistanceToNow } from "date-fns";
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

type DreamMood = (typeof DREAM_MOODS)[number];

interface DreamEntry {
  id: string;
  title: string | null;
  body: string;
  week: number | null;
  mood: string | null;
  symbols: string | null;
  themes: string | null;
  interpretation: string | null;
  createdAt: string;
}

export default function DreamKeeperScreen() {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedMood, setSelectedMood] = useState<DreamMood | "">("");
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);

  const loadEntries = useCallback(() => {
    setLoading(true);
    fetch("/api/dream-entries")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setEntries(d.entries || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleLogDream = async () => {
    if (!body.trim()) {
      toast.error("Describe your dream first");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/dream-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          body: body.trim(),
          mood: selectedMood || null,
          week: currentWeek,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Dream logged — analyzing symbols");
      setTitle("");
      setBody("");
      setSelectedMood("");
      loadEntries();
    } catch {
      toast.error("Failed to log dream");
    } finally {
      setSaving(false);
    }
  };

  const toggleMood = (mood: DreamMood) => {
    setSelectedMood(selectedMood === mood ? "" : mood);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl text-moss-deep">DreamKeeper</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Your pregnancy dreams are trying to tell you something
        </p>
      </div>

      {/* Add Dream Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-3xl p-5">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give this dream a title..."
            className="mb-3 rounded-xl"
          />
          <Textarea
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you dream? The weirder the better..."
            className="rounded-xl resize-none"
          />

          {/* Mood selector */}
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {DREAM_MOODS.map((mood) => (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition-all capitalize",
                  selectedMood === mood
                    ? "bg-lavender/30 text-moss-deep ring-1 ring-lavender/50"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {mood}
              </button>
            ))}
          </div>

          <Button
            onClick={handleLogDream}
            disabled={saving || !body.trim()}
            className="w-full bg-moss text-cream hover:bg-moss-deep rounded-full"
          >
            {saving ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                Analyzing symbols...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Log dream
              </>
            )}
          </Button>
        </Card>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
          <Moon className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">Couldn&apos;t load your dreams</div>
          <Button onClick={loadEntries} variant="outline" className="mt-4 rounded-full">Retry</Button>
        </Card>
      )}

      {/* Dream entries */}
      {!loading && !error && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <DreamCard key={entry.id} entry={entry} onChange={loadEntries} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <EmptyState
          icon={<Moon className="w-7 h-7 text-muted-foreground/30" />}
          title="Pregnancy dreams are vivid and wild"
          description="Start capturing yours."
        />
      )}
    </div>
  );
}

function DreamCard({
  entry,
  onChange,
}: {
  entry: DreamEntry;
  onChange: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  let symbols: string[] = [];
  let themes: string[] = [];
  try {
    if (entry.symbols) symbols = JSON.parse(entry.symbols);
  } catch { /* ignore */ }
  try {
    if (entry.themes) themes = JSON.parse(entry.themes);
  } catch { /* ignore */ }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/dream-entries?id=${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Dream deleted");
      onChange();
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteOpen(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-card border-moss/15 rounded-2xl p-5 relative">
          {/* Delete button top right */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground/60" />
          </button>

          {/* Title */}
          <h3 className="font-serif text-base text-moss-deep pr-8">
            {entry.title || "Untitled dream"}
          </h3>

          {/* Body */}
          <p
            className={cn(
              "text-sm text-foreground/80 leading-relaxed mt-2 whitespace-pre-wrap cursor-pointer",
              !expanded && "line-clamp-3"
            )}
            onClick={() => setExpanded(!expanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(!expanded); } }}
          >
            {entry.body}
          </p>
          {entry.body.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-moss hover:underline mt-1"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}

          {/* Symbols row */}
          {symbols.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <Tag className="w-3 h-3 text-moss-deep/60" />
              {symbols.map((s, i) => (
                <span
                  key={i}
                  className="bg-butter rounded-full px-2 py-0.5 text-[10px] font-medium text-moss-deep"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Themes row */}
          {themes.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Lightbulb className="w-3 h-3 text-rose-gold/80" />
              {themes.map((t, i) => (
                <span key={i} className="text-xs text-rose-gold">
                  {t}{i < themes.length - 1 && ","}
                </span>
              ))}
            </div>
          )}

          {/* AI Interpretation */}
          {entry.interpretation && (
            <div className="mt-3 bg-lavender/15 rounded-xl p-3 border-l-2 border-lavender/40">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3 h-3 text-lavender" />
                <span className="text-[10px] uppercase tracking-widest text-lavender font-medium">Dream whisper</span>
              </div>
              <p className="text-sm text-foreground/80 italic leading-relaxed">{entry.interpretation}</p>
            </div>
          )}

          {/* Mood badge */}
          {entry.mood && (
            <span className="inline-block mt-2 bg-blush/25 text-rose-gold rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize">
              {entry.mood}
            </span>
          )}

          {/* Date + week */}
          <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
            <span>{formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}</span>
            {entry.week && (
              <>
                <span>·</span>
                <span className="uppercase tracking-wider text-rose-gold font-semibold">
                  Week {entry.week}
                </span>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Delete this dream?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="rounded-full bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
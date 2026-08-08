"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MATERNAL_PROMPTS, type MaternalPrompt } from "@/data/signature-features";
import { BookOpen, ChevronRight, CheckCircle2, PenLine } from "lucide-react";

type SavedStory = { id: string; promptIndex: number; response: string };

export default function MotherStoryScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [saving, setSaving] = useState(false);

  const prompt: MaternalPrompt = MATERNAL_PROMPTS[currentIndex];
  const completed = savedStories.length === 12;

  const savedMap = new Map(savedStories.map((s) => [s.promptIndex, s.response]));

  const loadStories = useCallback(() => {
    fetch("/api/maternal-stories")
      .then((r) => r.json())
      .then((d) => {
        const stories: SavedStory[] = (d.stories || []).map((s: any) => ({
          id: s.id,
          promptIndex: s.promptIndex,
          response: s.response,
        }));
        setSavedStories(stories);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  useEffect(() => {
    const existing = savedStories.find((s) => s.promptIndex === currentIndex);
    setResponse(existing?.response || "");
  }, [currentIndex, savedStories]);

  const handleSave = async () => {
    if (!response.trim()) return;
    setSaving(true);
    try {
      const existing = savedStories.find((s) => s.promptIndex === currentIndex);
      if (existing) {
        await fetch("/api/maternal-stories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: existing.id, response }),
        });
      } else {
        await fetch("/api/maternal-stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promptIndex: currentIndex, response }),
        });
      }
      await loadStories();
      if (currentIndex < 11) setCurrentIndex(currentIndex + 1);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    if (currentIndex < 11) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-2xl text-moss-deep">My Mother&rsquo;s Mother</h1>
        <p className="text-sm text-muted-foreground mt-1">
          12 questions to capture a generational keepsake
        </p>
      </motion.div>

      {completed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-3xl p-6 bg-blush/30 border-moss/15 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-moss-deep" />
              <p className="font-serif text-lg text-moss-deep">
                Your maternal story is complete!
              </p>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">
              This is a gift that will outlive you.
            </p>
          </Card>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Prompt {currentIndex + 1} of 12
          </p>
          <p className="text-xs text-muted-foreground">
            {savedStories.length}/12 answered
          </p>
        </div>
        <div className="bg-sage/20 rounded-full h-2">
          <div
            className="bg-moss rounded-full h-2 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / 12) * 100}%` }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Card className="rounded-3xl p-6 bg-card border-moss/15 shadow-soft">
          <h2 className="font-serif text-xl text-moss-deep">{prompt.title}</h2>
          <p className="text-sm text-foreground/85 leading-relaxed my-4">
            {prompt.prompt}
          </p>
          {prompt.followUp && (
            <p className="text-xs text-muted-foreground italic mt-3">
              Follow-up: {prompt.followUp}
            </p>
          )}

          <Textarea
            rows={6}
            placeholder="Take your time... there's no rush"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="resize-none mt-4"
          />

          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !response.trim()}
              className="bg-moss text-cream rounded-full"
            >
              {saving ? "Saving…" : "Save & continue"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground rounded-full"
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex gap-2 justify-center flex-wrap">
          {MATERNAL_PROMPTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors",
                savedMap.has(i)
                  ? "bg-moss text-cream"
                  : i === currentIndex
                    ? "bg-sage/30 text-moss-deep ring-2 ring-moss/30"
                    : "bg-muted/40 text-muted-foreground"
              )}
            >
              {savedMap.has(i) ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                i + 1
              )}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

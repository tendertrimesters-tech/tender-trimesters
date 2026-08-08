"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { calcWeek, useProfile } from "@/components/providers";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/app/EmptyState";

// ── Types ──────────────────────────────────────────────────────────────

type Comment = {
  id: string;
  body: string;
  user: { name: string };
  createdAt: string;
};

type Post = {
  id: string;
  body: string;
  mood: string | null;
  week: number | null;
  hugs: number;
  createdAt: string;
  user: { name: string };
  comments: Comment[];
};

// ── Mood options ───────────────────────────────────────────────────────

const QUICK_MOODS: { emoji: string; label: string }[] = [
  { emoji: "🤍", label: "neutral" },
  { emoji: "🌸", label: "glowing" },
  { emoji: "🌿", label: "calm" },
  { emoji: "💭", label: "anxious" },
];

// ── Animation ──────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// ── Component ──────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [localHugs, setLocalHugs] = useState<Record<string, number>>({});

  // ── Fetch posts ─────────────────────────────────────────────────────

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/community");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch community posts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ── Submit new post ──────────────────────────────────────────────────

  const handlePost = async () => {
    const trimmed = newPostText.trim();
    if (!trimmed) return;

    setNewPostText("");
    setSelectedMood(null);

    // Optimistic
    const optimistic: Post = {
      id: `temp-${Date.now()}`,
      body: trimmed,
      mood: selectedMood,
      week: currentWeek,
      hugs: 0,
      createdAt: new Date().toISOString(),
      user: { name: profile?.name ?? "You" },
      comments: [],
    };
    setPosts((prev) => [optimistic, ...prev]);

    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          mood: selectedMood || null,
          week: currentWeek || null,
        }),
      });
      if (res.ok) fetchPosts();
    } catch {
      // keep optimistic on failure
    }
  };

  // ── Hug a post ───────────────────────────────────────────────────────

  const handleHug = async (id: string) => {
    setLocalHugs((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

    try {
      await fetch("/api/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "hug" }),
      });
    } catch {
      setLocalHugs((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 1) - 1) }));
    }
  };

  // ── Add comment ─────────────────────────────────────────────────────

  const handleComment = async (postId: string) => {
    const text = (commentInputs[postId] ?? "").trim();
    if (!text) return;

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

    // Optimistic comment
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `temp-c-${Date.now()}`,
                  body: text,
                  user: { name: profile?.name ?? "You" },
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p
      )
    );

    try {
      await fetch("/api/community", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, action: "comment", comment: text }),
      });
      fetchPosts();
    } catch {
      // keep optimistic
    }
  };

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <motion.div {...fadeUp}>
        <h1 className="font-serif text-2xl text-moss-deep">The Village</h1>
        <p className="text-xs text-muted-foreground mt-1">
          You&apos;re not alone in this, mama
        </p>
      </motion.div>

      {/* Post Composer */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <Card className="rounded-3xl bg-card border-moss/15 shadow-soft p-5">
          <textarea
            rows={4}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share what's on your heart, mama..."
            className={cn(
              "w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground",
              "focus:outline-none"
            )}
          />

          {/* Quick mood row */}
          <div className="flex items-center gap-2 mt-3 mb-4">
            {QUICK_MOODS.map((m) => {
              const active = selectedMood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(active ? null : m.label)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-all",
                    active
                      ? "bg-blush/30 ring-1 ring-rose-gold/30"
                      : "bg-sage/30 hover:bg-sage/50"
                  )}
                >
                  <span className="text-sm">{m.emoji}</span>
                  <span className="text-muted-foreground">{m.label}</span>
                </button>
              );
            })}
          </div>

          <Button
            onClick={handlePost}
            disabled={!newPostText.trim()}
            className="bg-moss text-cream rounded-full hover:bg-moss/90"
          >
            Share with the village
          </Button>
        </Card>
      </motion.div>

      {/* Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-moss border-t-transparent" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="The village is quiet right now"
            description="Be the first to share."
          />
        ) : (
          posts.map((post, idx) => {
            const extraHugs = localHugs[post.id] ?? 0;
            return (
              <motion.div
                key={post.id}
                {...fadeUp}
                transition={{ delay: 0.03 * idx }}
              >
                <Card className="rounded-2xl bg-card border-moss/15 shadow-soft p-5">
                  {/* Post header */}
                  <div className="flex items-center flex-wrap gap-1 mb-1">
                    <span className="font-medium text-moss-deep text-sm">
                      {post.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    {post.week && (
                      <span className="text-[10px] bg-sage/30 text-moss-deep rounded-full px-2 py-0.5">
                        Week {post.week}
                      </span>
                    )}
                  </div>

                  {/* Mood emoji */}
                  {post.mood && (
                    <div className="text-2xl mb-2">
                      {QUICK_MOODS.find((m) => m.label === post.mood)?.emoji ?? post.mood}
                    </div>
                  )}

                  {/* Body */}
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {post.body}
                  </p>

                  {/* Hug action */}
                  <button
                    type="button"
                    onClick={() => handleHug(post.id)}
                    className="text-xs text-muted-foreground hover:text-rose-gold transition-colors mt-3 flex items-center gap-1"
                  >
                    🤗 {post.hugs + extraHugs}
                  </button>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-moss/10 pt-3">
                      {post.comments.map((c) => (
                        <div key={c.id} className="text-xs text-foreground/70">
                          <span className="font-medium text-moss-deep">
                            {c.user.name}
                          </span>{" "}
                          {c.body}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment input */}
                  <div className="mt-3">
                    <input
                      type="text"
                      value={commentInputs[post.id] ?? ""}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleComment(post.id);
                        }
                      }}
                      placeholder="Send love..."
                      className={cn(
                        "w-full rounded-full bg-sage/20 px-4 py-2 text-xs",
                        "placeholder:text-muted-foreground focus:outline-none",
                        "focus:ring-1 focus:ring-moss/30"
                      )}
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

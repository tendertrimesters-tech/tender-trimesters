"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Heart } from "lucide-react";
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

// ── Mood visual config ────────────────────────────────────────────────

const MOOD_STYLES: Record<
  string,
  { border: string; circle: string; text: string }
> = {
  glowing: {
    border: "border-l-rose-gold/60",
    circle: "bg-rose-gold/15",
    text: "text-rose-gold",
  },
  calm: {
    border: "border-l-moss/60",
    circle: "bg-moss/10",
    text: "text-moss",
  },
  neutral: {
    border: "border-l-blush/60",
    circle: "bg-blush/20",
    text: "text-blush",
  },
  anxious: {
    border: "border-l-lavender/60",
    circle: "bg-lavender/15",
    text: "text-lavender",
  },
};

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
      setLocalHugs((prev) => ({
        ...prev,
        [id]: Math.max(0, (prev[id] ?? 1) - 1),
      }));
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
      {/* ─── Header with background image ─── */}
      <motion.div {...fadeUp} className="relative">
        {/* Background image at 12% opacity */}
        <div className="absolute inset-0 -mx-6 -mt-4 overflow-hidden rounded-3xl">
          <Image
            src="/images/community-women.jpg"
            alt="Community of women"
            fill
            className="object-cover opacity-[0.12]"
            priority
          />
          {/* Cream gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-cream/40 via-cream/70 to-cream" />
        </div>

        {/* Header content */}
        <div className="relative flex items-center gap-3 py-2">
          {/* Decorative heart icon in colored circle */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-blush shadow-soft">
            <Heart className="h-5 w-5 text-rose-gold" fill="currentColor" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-moss-deep">The Village</h1>
            <p className="font-script text-sm text-rose-gold/80 mt-0.5">
              You&apos;re not alone in this, mama
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Post Composer ─── */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
        <Card className="rounded-3xl bg-blush/5 border border-blush/20 border-t-2 border-t-rose-gold/30 shadow-soft p-5">
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

          {/* Quick mood row — larger pills with hover scale */}
          <div className="flex items-center gap-2.5 mt-3 mb-4">
            {QUICK_MOODS.map((m) => {
              const active = selectedMood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setSelectedMood(active ? null : m.label)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition-all duration-200",
                    "hover:scale-105 active:scale-95",
                    active
                      ? "bg-blush/30 ring-1 ring-rose-gold/30 shadow-soft"
                      : "bg-sage/20 hover:bg-sage/40"
                  )}
                >
                  <span className="text-base leading-none">{m.emoji}</span>
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

      {/* ─── Feed ─── */}
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
            const moodStyle = post.mood ? MOOD_STYLES[post.mood] : null;
            const moodData = post.mood
              ? QUICK_MOODS.find((m) => m.label === post.mood)
              : null;

            return (
              <motion.div
                key={post.id}
                {...fadeUp}
                transition={{ delay: 0.03 * idx }}
              >
                <Card
                  className={cn(
                    "rounded-2xl bg-card border border-moss/15 shadow-soft p-5",
                    "border-l-4 transition-shadow duration-300 hover:shadow-premium",
                    moodStyle?.border
                  )}
                >
                  {/* Post header */}
                  <div className="flex items-center flex-wrap gap-1 mb-1">
                    <span className="font-medium text-moss-deep text-sm">
                      {post.user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ·{" "}
                      {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    {post.week && (
                      <span className="text-[10px] bg-sage/30 text-moss-deep rounded-full px-2 py-0.5">
                        Week {post.week}
                      </span>
                    )}
                  </div>

                  {/* Mood emoji in colored circle */}
                  {post.mood && (
                    <div className="mb-2">
                      <span
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-full text-lg",
                          moodStyle?.circle
                        )}
                      >
                        {moodData?.emoji ?? post.mood}
                      </span>
                    </div>
                  )}

                  {/* Body */}
                  <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {post.body}
                  </p>

                  {/* Hug button with heart animation */}
                  <button
                    type="button"
                    onClick={() => handleHug(post.id)}
                    className={cn(
                      "group mt-3 flex items-center gap-1.5 text-xs text-muted-foreground transition-all duration-200",
                      "hover:text-rose-gold",
                      "[&_svg]:hug-heart"
                    )}
                  >
                    <Heart className="h-4 w-4 transition-transform duration-200 group-active:animate-[hug-pulse_0.4s_ease-out] group-hover:scale-110" />
                    <span>{post.hugs + extraHugs}</span>
                  </button>

                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 space-y-2 border-t border-moss/10 pt-3">
                      <div className="rounded-2xl bg-sage/5 -mx-2 px-3 py-2 space-y-2">
                        {post.comments.map((c) => (
                          <div
                            key={c.id}
                            className="text-xs text-foreground/70"
                          >
                            <span className="font-medium text-moss-deep">
                              {c.user.name}
                            </span>{" "}
                            {c.body}
                          </div>
                        ))}
                      </div>
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
                        "w-full rounded-full bg-sage/10 px-4 py-2 text-xs",
                        "placeholder:text-muted-foreground focus:outline-none",
                        "focus:ring-2 focus:ring-rose-gold/20 focus:bg-sage/15",
                        "border border-sage/10 transition-all duration-200"
                      )}
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ─── Inline keyframe for hug heart animation ─── */}
      <style jsx global>{`
        @keyframes hug-pulse {
          0% {
            transform: scale(1);
          }
          30% {
            transform: scale(1.35);
          }
          60% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Crown, Moon, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile, calcWeek } from "@/components/providers";
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
import TempieMascot, { TempieSignature } from "../TempieMascot";

type Msg = { id: string; role: "user" | "assistant"; content: string; createdAt: string };
type ChatMeta = { isPremium: boolean; remaining: number; limit: number };

const SUGGESTED = [
  "I'm anxious about my first ultrasound",
  "What should I pack in my hospital bag?",
  "I can't sleep — help me relax",
  "Write me an affirmation for today",
  "Is it normal to feel this tired at week 8?",
];

/* ─── 3am mode — auto-detect late night (11pm–5am) ─── */
function useIs3am() {
  const [is3am, setIs3am] = useState(false);
  useEffect(() => {
    const check = () => {
      const h = new Date().getHours();
      setIs3am(h >= 23 || h < 5);
    };
    check();
    const id = setInterval(check, 60000); // check every minute
    return () => clearInterval(id);
  }, []);
  return is3am;
}

export default function TempieScreen() {
  const { profile } = useProfile();
  const week = calcWeek(profile?.dueDate);
  const is3am = useIs3am();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [meta, setMeta] = useState<ChatMeta>({ isPremium: false, remaining: 5, limit: 5 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);

  const load = useCallback(() => {
    fetch("/api/chat")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setMessages(d.messages || []);
        setMeta({ isPremium: d.isPremium ?? false, remaining: d.remaining ?? 5, limit: d.limit ?? 5 });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isNearBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, sending]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 100;
    isNearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  };

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);

    const ta = document.querySelector('#tempie-input') as HTMLTextAreaElement | null;
    if (ta) { ta.style.height = 'auto'; }

    const userMsg: Msg = {
      id: `temp-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();

      if (res.status === 429 && data.error === "limit_reached") {
        setMeta((prev) => ({ ...prev, remaining: 0 }));
        toast.error(data.message || "Daily message limit reached");
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setInput(trimmed);
        return;
      }

      if (!res.ok) throw new Error();

      const aiMsg: Msg = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I'm not sure what to say. Try asking again?",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error("Tempie's having trouble. Try again?");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(trimmed);
    } finally {
      setSending(false);
      fetch("/api/chat")
        .then((r) => r.json())
        .then((d) => setMeta({ isPremium: d.isPremium ?? false, remaining: d.remaining ?? 5, limit: d.limit ?? 5 }))
        .catch(() => {});
    }
  }

  async function clearChat() {
    try {
      const res = await fetch("/api/chat", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages([]);
      setClearOpen(false);
      toast.success("Conversation cleared");
    } catch {
      toast.error("Failed to clear conversation");
      setClearOpen(false);
    }
  }

  // Dynamic placeholder based on time of day
  const placeholder = is3am
    ? "Can't sleep? I'm here, mama…"
    : new Date().getHours() < 12
    ? "Good morning. How are you today?"
    : new Date().getHours() < 18
    ? "What's on your heart?"
    : "How was your day, mama?";

  return (
    <div
      className={cn(
        "flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-180px)] relative rounded-[28px] overflow-hidden border",
        is3am ? "mode-3am bg-moss-deep border-moss-deep/30" : "bg-card border-moss-deep/15"
      )}
    >
      {/* Header with mascot + status */}
      <div className={cn(
        "flex items-center justify-between flex-shrink-0 p-5 border-b",
        is3am ? "border-cream/10" : "border-moss-deep/10"
      )}>
        <div className="flex items-center gap-4">
          <TempieMascot size="md" state={sending ? "thinking" : is3am ? "sleeping" : "listening"} />
          <div>
            <div className={cn("font-serif text-2xl leading-none flex items-center gap-2", is3am ? "text-cream" : "text-moss-deep")}>
              Tempie
              {is3am && <Moon className="w-4 h-4 text-butter" />}
            </div>
            <div className={cn("text-xs mt-1 flex items-center gap-1.5 tracking-wide", is3am ? "text-cream/60" : "text-muted-foreground")}>
              <span className={cn("w-1.5 h-1.5 rounded-full animate-breathe", is3am ? "bg-butter" : "bg-moss")} />
              {meta.isPremium
                ? <span className={cn("font-medium", is3am ? "text-butter" : "text-rose-gold")}>Premium · Unlimited</span>
                : <span>{meta.remaining} of {meta.limit} messages today</span>
              }
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!meta.isPremium && (
            <span className={cn("text-[10px] px-2.5 py-1 rounded-full tracking-wide flex items-center gap-1", is3am ? "bg-butter/15 text-butter" : "bg-blush/30 text-rose-gold")}>
              <Crown className="w-2.5 h-2.5" /> Premium
            </span>
          )}
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)} className={cn("text-xs", is3am ? "text-cream/50 hover:text-cream" : "text-muted-foreground hover:text-destructive")}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages — letter-style */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-5 space-y-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-2xl max-w-[85%]" />
            <Skeleton className="h-16 rounded-2xl max-w-[60%] ml-auto" />
            <Skeleton className="h-20 rounded-2xl max-w-[80%]" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className={cn("text-sm", is3am ? "text-cream/60" : "text-muted-foreground")}>Couldn't load conversation</p>
            <Button onClick={load} variant="outline" size="sm" className="mt-3 rounded-full">Retry</Button>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeState onSuggest={send} week={week} userName={profile?.name} is3am={is3am} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <LetterMessage key={m.id} msg={m} is3am={is3am} />
            ))}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-end"
              >
                <TempieMascot size="sm" state="thinking" />
                <div className={cn(
                  "rounded-2xl rounded-bl-md px-5 py-4 flex gap-1.5 items-center border",
                  is3am ? "bg-moss-deep/60 border-cream/10" : "bg-card border-moss-deep/10 letter-edge"
                )}>
                  <span className="w-1.5 h-1.5 bg-rose-gold rounded-full animate-breathe" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-rose-gold rounded-full animate-breathe" style={{ animationDelay: "200ms" }} />
                  <span className="w-1.5 h-1.5 bg-rose-gold rounded-full animate-breathe" style={{ animationDelay: "400ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input — letter-writing style */}
      <div className={cn("flex-shrink-0 p-4 border-t", is3am ? "border-cream/10 bg-moss-deep/50" : "border-moss-deep/10 bg-card")}>
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <Textarea
              id="tempie-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder={placeholder}
              className={cn(
                "min-h-[48px] max-h-[160px] resize-none rounded-2xl px-4 py-3 pr-12 font-serif text-base leading-relaxed border",
                is3am
                  ? "bg-moss-deep/40 border-cream/15 text-cream placeholder:text-cream/40 focus-visible:ring-butter/40"
                  : "bg-cream/30 border-moss-deep/15 text-foreground placeholder:text-muted-foreground focus-visible:ring-rose-gold/40"
              )}
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              rows={1}
            />
          </div>
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || sending}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
              input.trim() && !sending
                ? is3am
                  ? "bg-butter text-moss-deep hover:scale-105 shadow-premium"
                  : "bg-moss-deep text-cream hover:scale-105 shadow-premium"
                : is3am
                ? "bg-cream/10 text-cream/30 cursor-not-allowed"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
        {/* Suggestions row */}
        {messages.length === 0 && !sending && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105",
                  is3am
                    ? "bg-cream/5 text-cream/70 border-cream/15 hover:bg-cream/10"
                    : "bg-card text-foreground/70 border-moss-deep/15 hover:border-moss-deep/30"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="bg-card rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Clear conversation?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete your chat history with Tempie. She won't remember what you talked about.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={clearChat} className="rounded-full bg-destructive hover:bg-destructive/90">
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ─── Letter-style message — Tempie's responses look like handwritten letters ─── */
function LetterMessage({ msg, is3am }: { msg: Msg; is3am: boolean }) {
  const isUser = msg.role === "user";

  if (isUser) {
    // User messages: right-aligned, simple card
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className={cn(
          "max-w-[75%] rounded-2xl rounded-br-md px-5 py-3",
          is3am ? "bg-butter/15 text-cream" : "bg-moss-deep text-cream"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-serif italic">{msg.content}</p>
        </div>
      </motion.div>
    );
  }

  // Tempie's messages: letter-style with mascot + script signature
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 items-start"
    >
      <div className="flex-shrink-0 pt-1">
        <TempieMascot size="sm" state="idle" />
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl rounded-bl-md px-6 py-5 border relative",
        is3am
          ? "bg-moss-deep/60 border-cream/10"
          : "bg-card border-moss-deep/10 letter-edge paper-grain"
      )}>
        {/* Date stamp — like a letter header */}
        <div className={cn(
          "text-[10px] uppercase tracking-[0.2em] mb-3 pb-2 border-b",
          is3am ? "text-butter/60 border-cream/10" : "text-terracotta border-moss-deep/10"
        )}>
          {format(new Date(msg.createdAt), "h:mm a · MMM d")}
        </div>

        {/* Body — serif italic, like reading a letter */}
        <p className={cn(
          "font-serif text-base leading-relaxed whitespace-pre-wrap",
          is3am ? "text-cream/90 italic" : "text-foreground/85 italic"
        )}>
          {msg.content}
        </p>

        {/* Signature — script font */}
        <div className="mt-4 pt-3 border-t border-current/10">
          <TempieSignature />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Welcome state — first time entering chat ─── */
function WelcomeState({
  onSuggest,
  week,
  userName,
  is3am,
}: {
  onSuggest: (s: string) => void;
  week: number | null;
  userName?: string;
  is3am: boolean;
}) {
  const greeting = is3am
    ? `${userName ? `${userName}, ` : ""}it's late. I'm here.`
    : week
    ? `I see you're around week ${week}. How are you, ${userName ? userName.split(" ")[0] : "mama"}?`
    : `Hi ${userName ? userName.split(" ")[0] : "mama"}. I'm here whenever you need me.`;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <TempieMascot size="xl" state={is3am ? "sleeping" : "listening"} className="mx-auto mb-6" />
      </motion.div>

      <p className={cn(
        "font-serif italic text-2xl md:text-3xl leading-snug max-w-md mb-2",
        is3am ? "text-cream" : "text-moss-deep"
      )}>
        {greeting}
      </p>

      <p className={cn(
        "text-sm mt-4 max-w-sm leading-relaxed",
        is3am ? "text-cream/60" : "text-muted-foreground"
      )}>
        {is3am
          ? "A question, a vent, a 3am panic, a win. Whatever it is, I'm listening."
          : "A question, a vent, a 3am panic, a win. I'm here for all of it."}
      </p>

      {!is3am && (
        <div className="mt-8 grid gap-2 max-w-md w-full">
          {SUGGESTED.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
              onClick={() => onSuggest(s)}
              className="text-left text-sm px-4 py-3 rounded-2xl bg-card border border-moss-deep/15 hover:border-moss-deep/30 hover:shadow-soft transition-all"
            >
              <span className="text-terracotta mr-2">→</span>
              <span className="text-foreground/80">{s}</span>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

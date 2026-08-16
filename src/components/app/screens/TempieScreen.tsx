"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Trash2, Leaf, Crown, Lock } from "lucide-react";
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

type Msg = { id: string; role: "user" | "assistant"; content: string; createdAt: string };

type ChatMeta = { isPremium: boolean; remaining: number; limit: number };

const SUGGESTED = [
  "I'm anxious about my first ultrasound",
  "What should I pack in my hospital bag?",
  "I can't sleep — help me relax",
  "Write me an affirmation for today",
  "Is it normal to feel this tired at week 8?",
];

export default function TempieScreen() {
  const { profile } = useProfile();
  const week = calcWeek(profile?.dueDate);
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

  // Only auto-scroll if user is already near the bottom
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

    // Reset textarea height
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

      // Handle rate limit
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
      // Refresh remaining count after each message
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

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-180px)] relative">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-premium flex items-center justify-center shadow-premium animate-shimmer-border">
            <Leaf className="w-5 h-5 text-cream" />
          </div>
          <div>
            <div className="font-serif text-xl text-moss-deep leading-none">Tempie</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse-soft" />
              {meta.isPremium
                ? <span className="font-medium text-rose-gold">Premium · Unlimited</span>
                : `Online · ${meta.remaining} of ${meta.limit} free messages today`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!meta.isPremium && (
            <span className="text-[9px] bg-blush/40 text-rose-gold px-2 py-0.5 rounded-full">
              <Crown className="w-2.5 h-2.5 inline mr-0.5" />Premium
            </span>
          )}
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)} className="text-xs text-muted-foreground hover:text-destructive">
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto scroll-soft pr-1 -mr-1 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl max-w-[80%]" />
            <Skeleton className="h-20 rounded-2xl max-w-[80%] ml-auto" />
            <Skeleton className="h-16 rounded-2xl max-w-[80%]" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Couldn't load conversation</p>
            <Button onClick={load} variant="outline" size="sm" className="mt-3 rounded-full">Retry</Button>
          </div>
        ) : messages.length === 0 ? (
          <WelcomeState onSuggest={send} week={week} userName={profile?.name} />
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <MessageBubble key={m.id} msg={m} isLast={i === messages.length - 1} />
            ))}
            {sending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2 items-end"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-premium flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-3 h-3 text-cream" />
                </div>
                <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        {!meta.isPremium && meta.remaining <= 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 bg-gradient-premium text-cream rounded-2xl p-4 text-center"
          >
            <Crown className="w-6 h-6 mx-auto mb-2" />
            <div className="font-serif text-lg">You've used all 5 free messages today</div>
            <div className="text-xs text-cream/80 mt-1">Upgrade to Premium for unlimited Tempie access — plus all 11 signature features</div>
            <Button
              onClick={() => { window.location.hash = "profile"; window.location.reload(); }}
              className="mt-3 bg-cream text-rose-gold hover:bg-cream/90 rounded-full text-sm"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" /> Upgrade to Premium
            </Button>
          </motion.div>
        )}
        <Card className="bg-card border-moss/15 rounded-3xl p-2 flex gap-2 items-end">
          <Textarea
            id="tempie-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = Math.min(el.scrollHeight, 128) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Talk to Tempie..."
            className="border-0 resize-none min-h-[44px] max-h-32 bg-transparent focus-visible:ring-0 text-sm"
            rows={1}
          />
          <Button
            onClick={() => send(input)}
            disabled={!input.trim() || sending || (!meta.isPremium && meta.remaining <= 0)}
            size="icon"
            className="bg-gradient-premium hover:opacity-90 rounded-full h-9 w-9 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </Card>
        <div className="text-[10px] text-muted-foreground text-center mt-2">
          {!meta.isPremium
            ? `${meta.remaining} free messages remaining today · Tempie is AI support, not a doctor.`
            : "Tempie is AI support, not a doctor. For medical concerns, always call your OB."}
        </div>
      </div>

      <AlertDialog open={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Clear conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Tempie won't remember what you've talked about. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearChat} className="rounded-full bg-destructive hover:bg-destructive/90">
              Clear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MessageBubble({ msg, isLast }: { msg: Msg; isLast: boolean }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex gap-2 items-end", isUser ? "justify-end" : "justify-start")}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-premium flex items-center justify-center flex-shrink-0 mb-1">
          <Leaf className="w-3 h-3 text-cream" />
        </div>
      )}
      <div className={cn(
        "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
        isUser
          ? "bg-moss text-cream rounded-br-md"
          : "bg-card border border-border/40 text-foreground rounded-bl-md"
      )}>
        {msg.content}
        {isLast && !isUser && (
          <div className="text-[9px] text-muted-foreground mt-2 pt-2 border-t border-border/30">
            {format(new Date(msg.createdAt), "h:mm a")}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function WelcomeState({ onSuggest, week, userName }: { onSuggest: (text: string) => void; week: number | null; userName?: string | null }) {
  const firstName = userName?.split(" ")[0] || "mama";
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-end">
        <div className="w-7 h-7 rounded-full bg-gradient-premium flex items-center justify-center flex-shrink-0">
          <Leaf className="w-3 h-3 text-cream" />
        </div>
        <div className="bg-gradient-to-br from-card to-blush/10 border border-rose-gold/15 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] shadow-soft">
          <p className="text-sm font-medium text-moss-deep leading-relaxed">
            Hi {firstName}. I'm Tempie.
          </p>
          <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
            I'm here for whatever you need — a question, a vent, a 3am panic, a win you want to share.
            {week && ` I see you're around week ${week}. How are you holding up?`}
          </p>
        </div>
      </motion.div>

      <div className="space-y-2.5 pl-9">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Try asking</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((s, i) => (
            <motion.button
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              onClick={() => onSuggest(s)}
              className="text-xs text-moss-deep bg-blush/25 hover:bg-blush/40 border border-rose-gold/15 hover:border-rose-gold/30 px-3 py-2 rounded-full transition-all hover:shadow-soft hover:-translate-y-0.5"
            >
              {s}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
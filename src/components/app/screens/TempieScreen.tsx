"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Trash2, Leaf } from "lucide-react";
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
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const load = () => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        setMessages(d.messages || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput("");
    setSending(true);

    // Optimistic: add user message
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
      if (!res.ok) throw new Error();
      const data = await res.json();
      const aiMsg: Msg = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      toast.error("Tempie's having trouble. Try again?");
      // Remove optimistic user message
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  }

  async function clearChat() {
    await fetch("/api/chat", { method: "DELETE" });
    setMessages([]);
    setClearOpen(false);
    toast.success("Conversation cleared");
  }

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-220px)] md:h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-premium flex items-center justify-center shadow-premium">
            <Leaf className="w-5 h-5 text-cream" />
          </div>
          <div>
            <div className="font-serif text-xl text-moss-deep leading-none">Tempie</div>
            <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-moss animate-pulse-soft" />
              Online · Your 24/7 companion
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setClearOpen(true)} className="text-xs text-muted-foreground hover:text-destructive">
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-soft pr-1 -mr-1 space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl max-w-[80%]" />
            <Skeleton className="h-20 rounded-2xl max-w-[80%] ml-auto" />
            <Skeleton className="h-16 rounded-2xl max-w-[80%]" />
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
        <Card className="bg-card border-moss/15 rounded-3xl p-2 flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
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
            disabled={!input.trim() || sending}
            size="icon"
            className="bg-gradient-premium hover:opacity-90 rounded-full h-9 w-9 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </Card>
        <div className="text-[10px] text-muted-foreground text-center mt-2">
          Tempie is AI support, not a doctor. For medical concerns, always call your OB.
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
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-end">
        <div className="w-7 h-7 rounded-full bg-gradient-premium flex items-center justify-center flex-shrink-0">
          <Leaf className="w-3 h-3 text-cream" />
        </div>
        <div className="bg-card border border-border/40 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
          <p className="text-sm text-foreground leading-relaxed">
            Hi {firstName}. I'm Tempie. 💛
          </p>
          <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
            I'm here for whatever you need — a question, a vent, a 3am panic, a win you want to share.
            {week && ` I see you're around week ${week}. How are you holding up?`}
          </p>
        </div>
      </motion.div>

      <div className="space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold pl-9">Try asking</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED.map((s) => (
            <button
              key={s}
              onClick={() => onSuggest(s)}
              className="text-xs text-moss-deep bg-blush/30 hover:bg-blush/50 border border-rose-gold/20 px-3 py-1.5 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

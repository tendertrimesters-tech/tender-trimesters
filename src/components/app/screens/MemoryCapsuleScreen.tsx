"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { CAPSULE_TYPES, CAPSULE_UNLOCK_OPTIONS } from "@/data/signature-features";
import { Lock, Unlock, Mail, Star, Handshake, Camera, Plus, Trash2, Calendar } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface CapsuleItem {
  id: string;
  type: string;
  title: string;
  body: string | null;
  unlockDate: string;
  unlocked: boolean;
}

export default function MemoryCapsuleScreen() {
  const [items, setItems] = useState<CapsuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [unlockOption, setUnlockOption] = useState(0);
  const [sealing, setSealing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/capsule-items")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const getUnlockDate = (yearsFromNow: number) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearsFromNow);
    return d.toISOString();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const sealCapsule = async () => {
    if (!type) { toast.error("Choose a capsule type"); return; }
    if (!title.trim()) { toast.error("Give your memory a title"); return; }
    setSealing(true);
    try {
      const opt = CAPSULE_UNLOCK_OPTIONS[unlockOption];
      const unlockDate = getUnlockDate(opt.yearsFromNow);
      const res = await fetch("/api/capsule-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, body: body.trim() || null, unlockDate }),
      });
      if (!res.ok) throw new Error();
      toast.success("Memory sealed!");
      setType(""); setTitle(""); setBody(""); setUnlockOption(0);
      load();
    } catch {
      toast.error("Failed to seal");
    } finally {
      setSealing(false);
    }
  };

  const deleteItem = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/capsule-items?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Memory removed");
      load();
    } catch {
      toast.error("Failed to remove");
    }
    setDeleteId(null);
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case "letter": return <Mail className="w-4 h-4 text-rose-gold" />;
      case "wish": return <Star className="w-4 h-4 text-rose-gold" />;
      case "promise": return <Handshake className="w-4 h-4 text-rose-gold" />;
      case "photo_memory": return <Camera className="w-4 h-4 text-rose-gold" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const sealed = items.filter((i) => !i.unlocked);
  const opened = items.filter((i) => i.unlocked);
  const selectedOpt = CAPSULE_UNLOCK_OPTIONS[unlockOption];

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">Memory Capsule</div>
        <div className="text-xs text-muted-foreground mt-1">Seal memories for your child to open someday</div>
      </motion.div>

      {/* Create capsule */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="rounded-3xl p-5 bg-card border-moss/15 shadow-soft">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-4 h-4 text-moss" />
            <span className="text-sm font-medium text-moss-deep">Create capsule</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-2">Type</div>
              <div className="grid grid-cols-2 gap-2">
                {CAPSULE_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(type === t.id ? "" : t.id)}
                    className={cn(
                      "rounded-2xl p-3 text-left transition-all border-2",
                      type === t.id ? "border-moss bg-sage/15" : "border-transparent bg-muted/30 hover:bg-muted/50",
                    )}
                  >
                    <div className="text-lg mb-1">{t.emoji}</div>
                    <div className="text-sm font-medium text-moss-deep">{t.label}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <Input
              placeholder="A title for this memory..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl"
            />
            <Textarea
              rows={3}
              placeholder="Write your letter, wish, or promise..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="rounded-xl resize-none"
            />
            <div>
              <div className="text-xs text-muted-foreground mb-2">When should it unlock?</div>
              <Select value={String(unlockOption)} onValueChange={(v) => setUnlockOption(Number(v))}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAPSULE_UNLOCK_OPTIONS.map((opt, i) => (
                    <SelectItem key={i} value={String(i)}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedOpt && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  Opens {formatDate(getUnlockDate(selectedOpt.yearsFromNow))}
                </div>
              )}
            </div>
            <Button
              onClick={sealCapsule}
              disabled={sealing}
              className="w-full bg-moss hover:bg-moss-deep text-cream rounded-full"
            >
              {sealing ? "Sealing..." : "Seal it"}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Couldn't load capsules</p>
          <Button onClick={load} variant="outline" size="sm" className="mt-2 rounded-full">Retry</Button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          icon={<Lock className="w-7 h-7 text-rose-gold/40" />}
          title="Your time capsule is empty"
          description="Seal your first memory."
        />
      )}

      {/* Sealed */}
      {!loading && sealed.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-moss-deep">Sealed</span>
          </div>
          <div className="space-y-3">
            {sealed.map((item) => {
              const capsuleType = CAPSULE_TYPES.find((t) => t.id === item.type);
              return (
                <Card key={item.id} className="rounded-2xl p-4 bg-card border-moss/15">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {capsuleType && <span className="text-sm">{capsuleType.emoji}</span>}
                        <div className="font-serif text-base text-moss-deep truncate">{item.title}</div>
                      </div>
                      {item.unlockDate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Opens {formatDate(item.unlockDate)}
                        </div>
                      )}
                      {/* Don't show body for sealed capsules — it's a secret! */}
                    </div>
                    <button onClick={() => setDeleteId(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Opened */}
      {!loading && opened.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-3">
            <Unlock className="w-4 h-4 text-moss" />
            <span className="text-sm font-medium text-moss-deep">Opened</span>
          </div>
          <div className="space-y-3">
            {opened.map((item) => {
              const capsuleType = CAPSULE_TYPES.find((t) => t.id === item.type);
              return (
                <Card key={item.id} className="rounded-2xl p-4 bg-sage/15 border-moss/15">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getTypeIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {capsuleType && <span className="text-sm">{capsuleType.emoji}</span>}
                        <div className="font-serif text-base text-moss-deep">{item.title}</div>
                      </div>
                      <div className="text-xs text-moss font-medium mt-1">Opened</div>
                      {item.body && (
                        <p className="text-sm text-foreground/80 mt-2 whitespace-pre-wrap leading-relaxed">{item.body}</p>
                      )}
                    </div>
                    <button onClick={() => setDeleteId(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Delete this memory?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteItem} className="rounded-full bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
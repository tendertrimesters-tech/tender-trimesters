"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { calcWeek, useProfile } from "@/components/providers";
import { Plus, BookHeart, Trash2, Camera, X, Feather } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type Mood = "glowing" | "calm" | "tired" | "anxious" | "teary" | "grateful" | "nauseous" | "energized";

interface JournalEntry {
  id: string;
  title?: string;
  body: string;
  mood?: Mood;
  week?: number;
  craving?: string;
  babyName?: string;
  photoUrl?: string;
  createdAt: string;
}

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "glowing", emoji: "🌸", label: "Glowing" },
  { value: "calm", emoji: "🌿", label: "Calm" },
  { value: "tired", emoji: "🌙", label: "Tired" },
  { value: "anxious", emoji: "💭", label: "Anxious" },
  { value: "teary", emoji: "💧", label: "Teary" },
  { value: "grateful", emoji: "💛", label: "Grateful" },
  { value: "nauseous", emoji: "🍃", label: "Nauseous" },
  { value: "energized", emoji: "✨", label: "Energized" },
];

const MOOD_BORDER: Record<Mood, string> = {
  glowing: "border-l-rose-gold",
  calm: "border-l-sage",
  tired: "border-l-lavender",
  anxious: "border-l-blush",
  teary: "border-l-ink/20",
  grateful: "border-l-butter",
  nauseous: "border-l-terracotta",
  energized: "border-l-moss",
};

const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB

export default function JournalScreen() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const { profile } = useProfile();
  const week = calcWeek(profile?.dueDate);

  const load = useCallback(() => {
    fetch("/api/journal")
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

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {/* ── Header with decorative image banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        {/* Background image at 15% opacity */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/journal-writing.jpg"
            alt=""
            fill
            className="object-cover opacity-[0.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cream/70 via-cream/85 to-cream/95" />
        </div>

        <div className="relative flex items-center justify-between p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-gradient-blush shadow-soft">
              <Feather className="w-5 h-5 text-rose-gold" />
            </div>
            <div>
              <div className="font-serif text-2xl text-moss-deep tracking-tight">Journal</div>
              {!loading && (
                <div className="text-xs text-muted-foreground mt-0.5">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
                  <span className="text-rose-gold">·</span> private to you
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-moss hover:bg-moss-deep rounded-full h-9 shadow-soft hover:shadow-premium transition-shadow"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
      ) : error ? (
        <Card className="bg-card border-dashed border-destructive/30 rounded-2xl p-8 text-center">
          <BookHeart className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">Couldn't load your journal</div>
          <Button onClick={load} variant="outline" className="mt-4 rounded-full">Retry</Button>
        </Card>
      ) : entries.length === 0 ? (
        /* ── Beautiful empty state ── */
        <Card className="relative overflow-hidden rounded-2xl border-dashed border-border">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/watercolor-wash.jpg"
              alt=""
              fill
              className="object-cover opacity-[0.12]"
            />
          </div>
          <div className="relative p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-blush shadow-soft flex items-center justify-center mx-auto mb-5">
              <BookHeart className="w-10 h-10 text-rose-gold" />
            </div>
            <div className="font-script text-2xl text-moss-deep">Your journal is empty</div>
            <div className="font-serif text-sm text-muted-foreground mt-3 max-w-sm mx-auto leading-relaxed">
              This is your space. Letters to baby, midnight thoughts, cravings, fears, joys. Whatever you need to put down.
            </div>
            <Button
              onClick={() => setAddOpen(true)}
              className="mt-6 bg-moss hover:bg-moss-deep rounded-full shadow-soft hover:shadow-premium transition-shadow"
            >
              Write your first entry
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => (
            <JournalCard key={e.id} entry={e} onChange={load} />
          ))}
        </div>
      )}

      <NewEntryDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultWeek={week}
        onAdded={load}
      />
    </div>
  );
}

function JournalCard({ entry, onChange }: { entry: JournalEntry; onChange: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const mood = MOODS.find((m) => m.value === entry.mood);

  async function remove() {
    try {
      const res = await fetch(`/api/journal?id=${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Entry deleted");
      onChange();
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card
          className={cn(
            "rounded-2xl p-5 bg-card border-moss/15 border-l-4",
            "hover:shadow-soft transition-shadow duration-300",
            entry.mood && MOOD_BORDER[entry.mood],
          )}
        >
          <div className="flex items-start gap-3">
            {mood && (
              <div className="flex-shrink-0 text-3xl mt-0.5 drop-shadow-sm" role="img" aria-label={mood.label}>
                {mood.emoji}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                {entry.title && <div className="font-serif text-lg text-moss-deep">{entry.title}</div>}
                <div className="text-[10px] text-muted-foreground ml-auto whitespace-nowrap">
                  {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                </div>
              </div>
              {entry.week && (
                <div className="text-[10px] uppercase tracking-wider text-rose-gold font-semibold mt-0.5">Week {entry.week}</div>
              )}
              <p className={cn("text-sm text-foreground/80 mt-2 leading-relaxed whitespace-pre-wrap", !expanded && "line-clamp-3")}>
                {entry.body}
              </p>
              {entry.body.length > 200 && (
                <button onClick={() => setExpanded(!expanded)} className="text-xs text-moss hover:underline mt-1">
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
              {(entry.craving || entry.babyName || entry.photoUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.craving && (
                    <div className="text-[10px] bg-butter text-terracotta px-2 py-1 rounded-full">
                      Craving: {entry.craving}
                    </div>
                  )}
                  {entry.babyName && (
                    <div className="text-[10px] bg-blush/40 text-rose-gold px-2 py-1 rounded-full">
                      Baby: {entry.babyName}
                    </div>
                  )}
                </div>
              )}
              {entry.photoUrl && (
                <div className="mt-3 rounded-2xl overflow-hidden">
                  <img
                    src={entry.photoUrl}
                    alt="Journal photo"
                    className="w-full max-h-64 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(true)} className="h-7 text-xs text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone. Your words will be gone forever.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="rounded-full bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function NewEntryDialog({
  open,
  onOpenChange,
  defaultWeek,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  defaultWeek: number | null;
  onAdded: () => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood | "">("");
  const [week, setWeek] = useState<number | "">(defaultWeek || "");
  const [craving, setCraving] = useState("");
  const [babyName, setBabyName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);

  function reset() {
    setTitle(""); setBody(""); setMood(""); setWeek(defaultWeek || ""); setCraving(""); setBabyName(""); setPhotoUrl("");
  }

  // Reset form when dialog opens
  useEffect(() => {
    if (open) reset();
  }, [open]);

  async function upload(file: File) {
    if (file.size > MAX_PHOTO_SIZE) {
      toast.error("Photo is too large (max 10MB)");
      return;
    }
    if (uploadingRef.current) return;
    uploadingRef.current = true;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPhotoUrl(data.url);
      toast.success("Photo added");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      uploadingRef.current = false;
    }
  }

  async function submit() {
    if (!body.trim()) {
      toast.error("Write something first");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim() || null,
          body: body.trim(),
          mood: mood || null,
          week: week || null,
          craving: craving.trim() || null,
          babyName: babyName.trim() || null,
          photoUrl: photoUrl || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Server error (${res.status})`);
      }
      toast.success("Entry saved");
      reset();
      onOpenChange(false);
      onAdded();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      console.error("Journal save failed:", msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTimeout(reset, 300); }}>
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[90vh] overflow-y-auto scroll-soft p-0">
        {/* Dialog header with subtle botanical background */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 pointer-events-none">
            <Image
              src="/images/botanical-soft.jpg"
              alt=""
              fill
              className="object-cover opacity-[0.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-cream/60 to-transparent" />
          </div>
          <DialogHeader className="relative p-6 pb-0">
            <DialogTitle className="font-serif text-2xl text-moss-deep">New journal entry</DialogTitle>
            <DialogDescription className="mt-1">Whatever's on your heart, mama.</DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 p-6 pt-4">
          <div>
            <Label>How are you feeling?</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(mood === m.value ? "" : m.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200",
                    mood === m.value
                      ? "bg-blush/50 ring-2 ring-rose-gold shadow-soft scale-[1.04]"
                      : "bg-muted/40 hover:bg-muted hover:scale-[1.02] hover:shadow-soft",
                  )}
                >
                  <span className="text-3xl leading-none drop-shadow-sm">{m.emoji}</span>
                  <span className="text-[10px] text-moss-deep font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="je-title">Title (optional)</Label>
            <Input id="je-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="A note to baby, a moment..." className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="je-body">Your thoughts</Label>
            <Textarea id="je-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Dear baby today..." className="mt-1.5 rounded-xl min-h-[140px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="je-week">Week</Label>
              <Input id="je-week" type="number" min={1} max={40} value={week} onChange={(e) => setWeek(e.target.value ? Number(e.target.value) : "")} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="je-craving">Craving (optional)</Label>
              <Input id="je-craving" value={craving} onChange={(e) => setCraving(e.target.value)} placeholder="Pickles + ice cream" className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <div>
            <Label htmlFor="je-baby">Baby name note (optional)</Label>
            <Input id="je-baby" value={babyName} onChange={(e) => setBabyName(e.target.value)} placeholder="Thinking of naming..." className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label>Photo (optional)</Label>
            <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
            {photoUrl ? (
              <div className="mt-2 relative rounded-2xl overflow-hidden">
                <img src={photoUrl} alt="Uploaded photo" className="w-full max-h-48 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; setPhotoUrl(""); }} />
                <button onClick={() => setPhotoUrl("")} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-cream/90 flex items-center justify-center">
                  <X className="w-4 h-4 text-moss-deep" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="mt-2 w-full py-6 rounded-2xl border-2 border-dashed border-border hover:border-moss/30 hover:bg-muted/30 transition-colors flex flex-col items-center gap-1"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{uploading ? "Uploading..." : "Add a photo"}</span>
              </button>
            )}
          </div>
          <Button onClick={submit} disabled={saving} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11 shadow-soft hover:shadow-premium transition-shadow">
            {saving ? "Saving..." : "Save entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
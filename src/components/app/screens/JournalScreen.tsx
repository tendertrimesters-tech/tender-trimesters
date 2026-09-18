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
import { Plus, BookHeart, Trash2, Camera, X, Feather, Leaf } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

const MOODS: { value: Mood; emoji: string; label: string; color: string }[] = [
  { value: "glowing", emoji: "🌸", label: "Glowing", color: "#E89098" },
  { value: "calm", emoji: "🌿", label: "Calm", color: "#7CB374" },
  { value: "tired", emoji: "🌙", label: "Tired", color: "#9F7BC4" },
  { value: "anxious", emoji: "💭", label: "Anxious", color: "#A8455D" },
  { value: "teary", emoji: "💧", label: "Teary", color: "#C56A75" },
  { value: "grateful", emoji: "💛", label: "Grateful", color: "#FFD98C" },
  { value: "nauseous", emoji: "🍃", label: "Nauseous", color: "#B85A38" },
  { value: "energized", emoji: "✨", label: "Energized", color: "#5A7A48" },
];

/* ─── Margin watercolor illustration per mood ─── */
function MarginWatercolor({ mood, size = 40 }: { mood?: Mood; size?: number }) {
  if (!mood) return null;
  const m = MOODS.find((x) => x.value === mood);
  if (!m) return null;
  return (
    <svg viewBox="0 0 40 40" fill="none" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`mw-${mood}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={m.color} stopOpacity="0.7" />
          <stop offset="100%" stopColor={m.color} stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill={`url(#mw-${mood})`} />
      {/* Tiny leaf shape in mood color */}
      <path
        d="M20 30C20 30 14 25 14 18C14 13 17 10 20 10C23 10 26 13 26 18C26 25 20 30 20 30Z"
        fill={m.color}
        fillOpacity="0.5"
      />
    </svg>
  );
}

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

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

  // Group entries by trimester for chapter-divider effect
  const grouped = entries.reduce((acc: { label: string; items: JournalEntry[] }[], entry) => {
    const w = entry.week || 0;
    const label = w <= 13 ? "First Trimester" : w <= 27 ? "Second Trimester" : w <= 40 ? "Third Trimester" : "Other";
    const existing = acc.find((g) => g.label === label);
    if (existing) existing.items.push(entry);
    else acc.push({ label, items: [entry] });
    return acc;
  }, []);

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-24">
      {/* ═══════ Header — diary spine feel ═══════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[28px] bg-card border border-moss-deep/15 card-floating"
      >
        <div className="flex">
          {/* Vertical moss spine — the diary signature element */}
          <div className="spine-moss w-12 md:w-14 flex-shrink-0 flex flex-col items-center justify-center py-6 text-cream">
            <div
              className="text-[10px] tracking-[0.3em] uppercase text-butter/80 whitespace-nowrap"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {week ? `Week ${week}` : "Journal"}
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 md:p-8 paper-laid relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="eyebrow text-terracotta mb-2">Your journal</div>
                <h1 className="display-md text-moss-deep leading-tight">Sanctuary pages</h1>
                {!loading && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {entries.length} {entries.length === 1 ? "entry" : "entries"} · private to you
                  </p>
                )}
              </div>
              <Button
                onClick={() => setAddOpen(true)}
                className="bg-moss-deep hover:bg-moss text-cream rounded-full h-12 px-5 group"
              >
                <Plus className="w-4 h-4 mr-1.5 transition-transform group-hover:rotate-90" />
                New
              </Button>
            </div>
          </div>
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
        /* ── Beautiful empty state — like an unopened diary ── */
        <Card className="relative overflow-hidden rounded-[28px] border border-moss-deep/15 paper-laid">
          <div className="flex">
            <div className="spine-moss w-12 md:w-14 flex-shrink-0" />
            <div className="flex-1 p-10 md:p-14 text-center relative">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="w-24 h-24 rounded-full bg-gradient-blush shadow-premium flex items-center justify-center mx-auto mb-6 animate-breathe"
              >
                <Feather className="w-12 h-12 text-rose-gold" />
              </motion.div>
              <div className="font-script text-3xl text-moss-deep">Your story starts here.</div>
              <p className="font-serif italic text-base text-muted-foreground mt-4 max-w-md mx-auto leading-relaxed">
                Letters to baby, midnight thoughts, cravings, fears, joys.
                Whatever you need to put down, mama.
              </p>
              <Button
                onClick={() => setAddOpen(true)}
                className="mt-8 bg-moss-deep hover:bg-moss text-cream rounded-full h-12 px-8 group"
              >
                Write your first entry
                <Feather className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {grouped.map((group, gi) => (
            <div key={group.label}>
              {/* ── Chapter divider page ── */}
              <div className="relative my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-moss-deep/15" />
                <div className="text-center">
                  <div className="eyebrow text-terracotta">Chapter</div>
                  <div className="font-serif italic text-xl text-moss-deep">{group.label}</div>
                </div>
                <div className="flex-1 h-px bg-moss-deep/15" />
              </div>

              {/* ── Entries in this chapter ── */}
              <div className="space-y-4">
                {group.items.map((entry) => (
                  <JournalDiaryPage key={entry.id} entry={entry} onChange={load} />
                ))}
              </div>
            </div>
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

/* ─── Journal entry as a diary page with margin watercolor ─── */
function JournalDiaryPage({ entry, onChange }: { entry: JournalEntry; onChange: () => void }) {
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
        <Card className="rounded-[24px] overflow-hidden border border-moss-deep/15 card-floating bg-card">
          <div className="flex">
            {/* Spine with week number */}
            <div className="spine-moss w-10 md:w-12 flex-shrink-0 flex flex-col items-center justify-center py-5 text-cream">
              <div
                className="text-[10px] tracking-[0.3em] uppercase text-butter/80"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {entry.week ? `W${entry.week}` : "·"}
              </div>
            </div>

            {/* Body with paper texture */}
            <div className="flex-1 p-6 paper-laid relative">
              {/* Margin watercolor — top-right */}
              {mood && (
                <div className="absolute top-3 right-3 opacity-80">
                  <MarginWatercolor mood={entry.mood} size={36} />
                </div>
              )}

              <div className="flex items-start justify-between gap-3 mb-3 pr-10">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-terracotta font-medium">
                    {format(new Date(entry.createdAt), "EEEE, MMMM d")}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 tracking-wide">
                    {formatDistanceToNow(new Date(entry.createdAt), { addSuffix: true })}
                    {mood && <span className="ml-2 text-rose-gold">· {mood.label}</span>}
                  </div>
                </div>
              </div>

              {entry.title && (
                <h3 className="font-serif italic text-2xl text-moss-deep mb-3 leading-tight">
                  {entry.title}
                </h3>
              )}

              <p
                className={cn(
                  "font-serif text-base text-foreground/85 leading-relaxed whitespace-pre-wrap",
                  !expanded && "line-clamp-4"
                )}
                style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
              >
                {entry.body}
              </p>

              {entry.body.length > 240 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-terracotta hover:underline mt-2 tracking-wide"
                >
                  {expanded ? "← Show less" : "Read more →"}
                </button>
              )}

              {(entry.craving || entry.babyName || entry.photoUrl) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.craving && (
                    <div className="text-[11px] bg-butter/30 text-terracotta px-3 py-1.5 rounded-full border border-butter/40 tracking-wide">
                      Craving: {entry.craving}
                    </div>
                  )}
                  {entry.babyName && (
                    <div className="text-[11px] bg-blush/30 text-rose-gold px-3 py-1.5 rounded-full border border-blush/40 tracking-wide">
                      Baby: {entry.babyName}
                    </div>
                  )}
                </div>
              )}

              {entry.photoUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden border border-moss-deep/10">
                  <img
                    src={entry.photoUrl}
                    alt="Journal photo"
                    className="w-full max-h-72 object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}

              <div className="flex gap-2 mt-5 pt-4 border-t border-moss-deep/10">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteOpen(true)}
                  className="h-7 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
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
            <AlertDialogCancel className="rounded-full">Keep it</AlertDialogCancel>
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
      <DialogContent className="bg-card rounded-3xl max-w-lg max-h-[90vh] overflow-y-auto p-0 border border-moss-deep/15">
        {/* Header with diary spine */}
        <div className="flex">
          <div className="spine-moss w-10 flex-shrink-0 rounded-tl-3xl" />
          <div className="flex-1 paper-laid">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="font-serif italic text-2xl text-moss-deep">New entry</DialogTitle>
              <DialogDescription className="mt-1">Whatever's on your heart, mama.</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <div className="space-y-4 p-6 pt-4 paper-laid">
          <div>
            <Label>How are you feeling?</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(mood === m.value ? "" : m.value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all duration-200 border",
                    mood === m.value
                      ? "ring-2 ring-rose-gold shadow-soft scale-[1.04]"
                      : "border-moss-deep/10 hover:border-moss-deep/30"
                  )}
                  style={mood === m.value ? { background: `${m.color}30` } : {}}
                >
                  <span className="text-2xl leading-none">{m.emoji}</span>
                  <span className="text-[10px] text-moss-deep font-medium tracking-wide">{m.label}</span>
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
            <Textarea
              id="je-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Dear baby today..."
              className="mt-1.5 rounded-xl min-h-[160px] font-serif italic text-base"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            />
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
                className="mt-2 w-full py-6 rounded-2xl border-2 border-dashed border-moss-deep/15 hover:border-moss-deep/30 hover:bg-muted/30 transition-colors flex flex-col items-center gap-1"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wide">{uploading ? "Uploading..." : "Add a photo"}</span>
              </button>
            )}
          </div>
          <Button onClick={submit} disabled={saving} className="w-full bg-moss-deep hover:bg-moss text-cream rounded-full h-12">
            {saving ? "Saving..." : "Save entry"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

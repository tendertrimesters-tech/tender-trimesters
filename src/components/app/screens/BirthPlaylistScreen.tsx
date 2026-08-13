"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PLAYLIST_PHASES, SONG_SUGGESTIONS } from "@/data/signature-features";
import { Music, Plus, Trash2, Sparkles, Music2, Search } from "lucide-react";
import EmptyState from "@/components/app/EmptyState";
import { cn } from "@/lib/utils";
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

interface PlaylistTrack {
  id: string;
  phase: string;
  title: string;
  artist: string | null;
}

export default function BirthPlaylistScreen() {
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePhase, setActivePhase] = useState(PLAYLIST_PHASES[0].id);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [addingCustom, setAddingCustom] = useState(false);

  const load = useCallback(() => {
    fetch("/api/playlist-tracks")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setTracks(d.tracks || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTrack = async (title: string, artist: string | null) => {
    // Prevent duplicates
    const exists = tracks.some(
      (t) => t.title.toLowerCase() === title.toLowerCase() && (t.artist || "").toLowerCase() === (artist || "").toLowerCase()
    );
    if (exists) {
      toast.error("Already in your playlist");
      return;
    }
    try {
      const res = await fetch("/api/playlist-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phase: activePhase, title, artist }),
      });
      if (!res.ok) throw new Error();
      toast.success("Added to playlist");
      load();
    } catch {
      toast.error("Failed to add");
    }
  };

  const deleteTrack = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/playlist-tracks?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Track removed");
      load();
    } catch {
      toast.error("Failed to remove");
    }
    setDeleteId(null);
  };

  const selectedPhase = PLAYLIST_PHASES.find((p) => p.id === activePhase);
  const suggestions = SONG_SUGGESTIONS[activePhase] || [];

  // Group saved tracks by phase
  const tracksByPhase: Record<string, PlaylistTrack[]> = {};
  tracks.forEach((t) => {
    if (!tracksByPhase[t.phase]) tracksByPhase[t.phase] = [];
    tracksByPhase[t.phase].push(t);
  });

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">Birth Playlist</div>
        <div className="text-xs text-muted-foreground mt-1">The soundtrack for your baby&apos;s arrival</div>
      </motion.div>

      {/* Phase tabs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PLAYLIST_PHASES.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                activePhase === phase.id
                  ? "bg-moss text-cream"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60",
              )}
            >
              {phase.icon} {phase.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Phase description */}
      {selectedPhase && (
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl p-4 bg-sage/15">
            <p className="text-sm text-foreground/80 leading-relaxed">{selectedPhase.description}</p>
          </Card>
        </motion.div>
      )}

      {/* Song suggestions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-rose-gold" />
          <span className="text-sm font-medium text-moss-deep">Suggestions for {selectedPhase?.label}</span>
        </div>
        {suggestions.length === 0 ? (
          <div className="text-sm text-muted-foreground">No suggestions loaded for this phase.</div>
        ) : (
          <div className="space-y-2">
            {suggestions.map((s) => {
              const isAdded = tracks.some(
                (t) => t.title.toLowerCase() === s.title.toLowerCase() && (t.artist || "").toLowerCase() === (s.artist || "").toLowerCase()
              );
              return (
                <Card key={`${s.title}-${s.artist}`} className="rounded-2xl p-3 bg-card border-moss/15">
                  <div className="flex items-center gap-3">
                    <Music2 className="w-4 h-4 text-rose-gold shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-moss-deep">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.artist}</div>
                      <div className="text-xs text-foreground/60 italic mt-1">{s.reason}</div>
                    </div>
                    <button
                      onClick={() => !isAdded && addTrack(s.title, s.artist)}
                      disabled={isAdded}
                      className={cn(
                        "shrink-0 text-xs rounded-full px-3 py-1 transition-colors",
                        isAdded
                          ? "bg-sage/30 text-moss-deep/50 cursor-default"
                          : "bg-moss/10 text-moss hover:bg-moss/20"
                      )}
                    >
                      {isAdded ? "Added" : <><Plus className="w-3 h-3 inline mr-1" />Add</>}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add your own song */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-moss" />
          <span className="text-sm font-medium text-moss-deep">Add your own song</span>
        </div>
        <Card className="rounded-2xl p-4 bg-card border-moss/15">
          <div className="space-y-2">
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Song title"
              className="rounded-xl text-sm"
            />
            <Input
              value={customArtist}
              onChange={(e) => setCustomArtist(e.target.value)}
              placeholder="Artist (optional)"
              className="rounded-xl text-sm"
            />
            <Button
              onClick={async () => {
                if (!customTitle.trim()) {
                  toast.error("Enter a song title");
                  return;
                }
                setAddingCustom(true);
                await addTrack(customTitle.trim(), customArtist.trim() || null);
                setCustomTitle("");
                setCustomArtist("");
                setAddingCustom(false);
              }}
              disabled={!customTitle.trim() || addingCustom}
              className="w-full bg-moss/10 text-moss hover:bg-moss/20 rounded-full text-sm"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add to {selectedPhase?.label}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* My playlist */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-moss" />
          <span className="text-sm font-medium text-moss-deep">My playlist</span>
          {!loading && tracks.length > 0 && (
            <span className="text-[10px] text-muted-foreground">({tracks.length} tracks)</span>
          )}
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : error ? (
          <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
            <Music className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
            <div className="font-serif text-lg text-moss-deep">Couldn&apos;t load your playlist</div>
            <Button onClick={load} variant="outline" className="mt-4 rounded-full">Retry</Button>
          </Card>
        ) : tracks.length === 0 ? (
          <EmptyState
            icon={<Music className="w-7 h-7 text-rose-gold/40" />}
            title="Your playlist is empty"
            description="Add songs above."
          />
        ) : (
          <div className="space-y-4">
            {PLAYLIST_PHASES.filter((p) => tracksByPhase[p.id]?.length).map((phase) => (
              <div key={phase.id}>
                <div className="text-xs font-medium text-moss-deep mb-2">
                  {phase.icon} {phase.label}
                </div>
                <div className="space-y-2">
                  {tracksByPhase[phase.id].map((track) => (
                    <Card key={track.id} className="rounded-xl p-3 bg-blush/10 border-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Music2 className="w-3 h-3 text-rose-gold shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-moss-deep truncate">{track.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setDeleteId(track.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <AlertDialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Remove this song?</AlertDialogTitle>
            <AlertDialogDescription>You can always add it back.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTrack} className="rounded-full bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
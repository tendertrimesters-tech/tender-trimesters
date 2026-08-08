'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PLAYLIST_PHASES, SONG_SUGGESTIONS } from '@/data/signature-features';
import { Music, Plus, Trash2, Sparkles, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function BirthPlaylistScreen() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState(PLAYLIST_PHASES[0].id);

  const load = () => {
    fetch('/api/playlist-tracks')
      .then((r) => r.json())
      .then((d) => {
        setTracks(d.tracks || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const addTrack = async (title: string, artist: string) => {
    try {
      await fetch('/api/playlist-tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: activePhase, title, artist }),
      });
      toast.success('Added to playlist 🎵');
      load();
    } catch {
      toast.error('Failed to add');
    }
  };

  const deleteTrack = async (id: string) => {
    await fetch(`/api/playlist-tracks?id=${id}`, { method: 'DELETE' });
    toast.success('Track removed');
    load();
  };

  const selectedPhase = PLAYLIST_PHASES.find((p) => p.id === activePhase);
  const suggestions = SONG_SUGGESTIONS[activePhase] || [];

  // Group saved tracks by phase
  const tracksByPhase: Record<string, any[]> = {};
  tracks.forEach((t) => {
    if (!tracksByPhase[t.phase]) tracksByPhase[t.phase] = [];
    tracksByPhase[t.phase].push(t);
  });

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">Birth Playlist</div>
        <div className="text-xs text-muted-foreground mt-1">The soundtrack for your baby's arrival</div>
      </motion.div>

      {/* Phase tabs */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PLAYLIST_PHASES.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors',
                activePhase === phase.id
                  ? 'bg-moss text-cream'
                  : 'bg-muted/40 text-muted-foreground hover:bg-muted/60',
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
            {suggestions.map((s, i) => (
              <Card key={i} className="rounded-2xl p-3 bg-card border-moss/15">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-rose-gold shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-moss-deep">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.artist}</div>
                    <div className="text-xs text-foreground/60 italic mt-1">{s.reason}</div>
                  </div>
                  <button
                    onClick={() => addTrack(s.title, s.artist)}
                    className="shrink-0 text-xs bg-moss/10 text-moss rounded-full px-3 py-1 hover:bg-moss/20 transition-colors"
                  >
                    <Plus className="w-3 h-3 inline mr-1" />Add
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      {/* My playlist */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-3">
          <Music className="w-4 h-4 text-moss" />
          <span className="text-sm font-medium text-moss-deep">My playlist</span>
        </div>
        {!loading && tracks.length === 0 ? (
          <div className="text-sm text-muted-foreground">Your playlist is empty. Add songs above.</div>
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
                          <Play className="w-3 h-3 text-rose-gold shrink-0" />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-moss-deep truncate">{track.title}</div>
                            <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTrack(track.id)}
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
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useProfile, calcWeek } from '@/components/providers';
import { NAME_SUGGESTIONS, NAME_THEMES, type NameTheme, type NameSuggestion } from '@/data/signature-features';
import { Sprout, TreePine, Plus, Search, Heart, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NameGardenScreen() {
  const [seeds, setSeeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [feeling, setFeeling] = useState('');
  const [activeTheme, setActiveTheme] = useState<NameTheme | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFeeling, setEditFeeling] = useState('');
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);

  const load = () => {
    fetch('/api/name-seeds')
      .then((r) => r.json())
      .then((d) => {
        setSeeds(d.seeds || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const plantSeed = async (name: string, feelingText: string) => {
    if (!name.trim()) {
      toast.error('Enter a name first');
      return;
    }
    try {
      await fetch('/api/name-seeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), feeling: feelingText.trim() || null, week: currentWeek }),
      });
      toast.success('🌱 Seed planted!');
      setNewName('');
      setFeeling('');
      load();
    } catch {
      toast.error('Failed to plant seed');
    }
  };

  const chooseSeed = async (id: string) => {
    await fetch('/api/name-seeds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, chosen: true }),
    });
    toast.success('Name chosen! ✨');
    load();
  };

  const updateFeeling = async (id: string) => {
    await fetch('/api/name-seeds', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, feeling: editFeeling.trim() || null }),
    });
    toast.success('Feeling updated');
    setEditingId(null);
    setEditFeeling('');
    load();
  };

  const deleteSeed = async (id: string) => {
    if (!confirm('Remove this name from your garden?')) return;
    await fetch(`/api/name-seeds?id=${id}`, { method: 'DELETE' });
    toast.success('Seed removed');
    load();
  };

  const filteredSuggestions = activeTheme
    ? NAME_SUGGESTIONS.filter((s: NameSuggestion) => s.theme === activeTheme)
    : [];

  const chosenSeed = seeds.find((s) => s.chosen);
  const otherSeeds = seeds.filter((s) => !s.chosen);

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">The Name Garden</div>
        <div className="text-xs text-muted-foreground mt-1">Plant names as seeds and watch them grow</div>
      </motion.div>

      {/* Plant a seed */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="rounded-3xl p-5 bg-card border-moss/15 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="w-4 h-4 text-moss" />
            <span className="text-sm font-medium text-moss-deep">Plant a seed</span>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Enter a name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="rounded-full"
              onKeyDown={(e) => e.key === 'Enter' && plantSeed(newName, feeling)}
            />
            <Textarea
              rows={1}
              placeholder="How does this name feel to you right now?"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="rounded-xl resize-none"
            />
            <Button
              onClick={() => plantSeed(newName, feeling)}
              className="bg-moss hover:bg-moss-deep text-cream rounded-full"
            >
              <Plus className="w-4 h-4 mr-1" /> Plant seed
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Theme browser */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-moss-deep">Browse by theme</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {NAME_THEMES.map((theme: NameTheme) => (
            <button
              key={theme}
              onClick={() => setActiveTheme(activeTheme === theme ? '' : theme)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                activeTheme === theme
                  ? 'bg-moss text-cream'
                  : 'bg-sage/20 text-moss-deep hover:bg-sage/40',
              )}
            >
              {theme}
            </button>
          ))}
        </div>
        {activeTheme && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filteredSuggestions.map((s: NameSuggestion) => (
              <button
                key={s.name}
                onClick={() => plantSeed(s.name, '')}
                className="bg-sage/20 text-moss-deep text-xs px-3 py-1.5 rounded-full hover:bg-sage/40 transition-colors"
              >
                <Heart className="w-3 h-3 inline mr-1 text-rose-gold" />
                {s.name}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* My garden */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 mb-3">
          <TreePine className="w-4 h-4 text-moss" />
          <span className="text-sm font-medium text-moss-deep">My garden</span>
        </div>

        {loading ? null : seeds.length === 0 ? (
          <Card className="bg-card border-dashed border-border rounded-3xl p-10 text-center">
            <Sprout className="w-10 h-10 text-rose-gold/40 mx-auto mb-3" />
            <div className="font-serif text-lg text-moss-deep">Your garden is empty</div>
            <div className="text-sm text-muted-foreground mt-1">Plant your first name seed.</div>
          </Card>
        ) : (
          <div className="space-y-3">
            {chosenSeed && (
              <Card className="rounded-2xl p-5 bg-gradient-blush border-rose-gold/30">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-rose-gold" />
                  <span className="text-xs font-medium text-rose-gold">The chosen name</span>
                </div>
                <div className="font-serif text-xl text-moss-deep">{chosenSeed.name}</div>
                {chosenSeed.feeling && (
                  <div className="text-xs text-foreground/70 italic mt-1">{chosenSeed.feeling}</div>
                )}
                {chosenSeed.week && (
                  <div className="text-[10px] text-muted-foreground mt-1">Planted week {chosenSeed.week}</div>
                )}
              </Card>
            )}
            {otherSeeds.map((seed) => (
              <Card key={seed.id} className="rounded-2xl p-4 bg-card border-moss/15">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-xl text-moss-deep">{seed.name}</div>
                    {editingId === seed.id ? (
                      <div className="mt-2 flex gap-2">
                        <input
                          value={editFeeling}
                          onChange={(e) => setEditFeeling(e.target.value)}
                          placeholder="Update feeling..."
                          className="flex-1 text-xs bg-muted/40 rounded-lg px-2 py-1 border-0 outline-none"
                          autoFocus
                          onKeyDown={(e) => e.key === 'Enter' && updateFeeling(seed.id)}
                        />
                        <button
                          onClick={() => updateFeeling(seed.id)}
                          className="text-xs text-moss font-medium hover:underline"
                        >Save</button>
                      </div>
                    ) : (
                      seed.feeling && (
                        <div className="text-xs text-foreground/70 italic mt-1">{seed.feeling}</div>
                      )
                    )}
                    {seed.week && (
                      <div className="text-[10px] text-muted-foreground mt-1">Planted week {seed.week}</div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteSeed(seed.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => chooseSeed(seed.id)}
                    className="text-xs bg-rose-gold/20 text-rose-gold rounded-full px-3 py-1 hover:bg-rose-gold/30 transition-colors"
                  >
                    Choose this name
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(seed.id);
                      setEditFeeling(seed.feeling || '');
                    }}
                    className="text-xs bg-muted/40 text-muted-foreground rounded-full px-3 py-1 hover:bg-muted/60 transition-colors"
                  >
                    Update feeling
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CAPSULE_TYPES, CAPSULE_UNLOCK_OPTIONS } from '@/data/signature-features';
import { Lock, Unlock, Mail, Star, Handshake, Camera, Plus, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function MemoryCapsuleScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [unlockOption, setUnlockOption] = useState(0);
  const [sealing, setSealing] = useState(false);

  const load = () => {
    fetch('/api/capsule-items')
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setLoading(false);
      });
  };

  useEffect(() => { load(); }, []);

  const getUnlockDate = (yearsFromNow: number) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + yearsFromNow);
    return d.toISOString();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const sealCapsule = async () => {
    if (!type) { toast.error('Choose a capsule type'); return; }
    if (!title.trim()) { toast.error('Give your memory a title'); return; }
    setSealing(true);
    try {
      const opt = CAPSULE_UNLOCK_OPTIONS[unlockOption];
      const unlockDate = getUnlockDate(opt.yearsFromNow);
      await fetch('/api/capsule-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title, body: body.trim() || null, unlockDate }),
      });
      toast.success('Memory sealed! \U0001f512');
      setType(''); setTitle(''); setBody(''); setUnlockOption(0);
      load();
    } catch {
      toast.error('Failed to seal');
    } finally {
      setSealing(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this memory? This cannot be undone.')) return;
    await fetch(`/api/capsule-items?id=${id}`, { method: 'DELETE' });
    toast.success('Memory removed');
    load();
  };

  const getTypeIcon = (t: string) => {
    switch (t) {
      case 'letter': return <Mail className="w-4 h-4 text-rose-gold" />;
      case 'wish': return <Star className="w-4 h-4 text-rose-gold" />;
      case 'promise': return <Handshake className="w-4 h-4 text-rose-gold" />;
      case 'photo_memory': return <Camera className="w-4 h-4 text-rose-gold" />;
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
                    onClick={() => setType(type === t.id ? '' : t.id)}
                    className={cn(
                      'rounded-2xl p-3 text-left transition-all border-2',
                      type === t.id ? 'border-moss bg-sage/15' : 'border-transparent bg-muted/30 hover:bg-muted/50',
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
              <select
                value={unlockOption}
                onChange={(e) => setUnlockOption(Number(e.target.value))}
                className="w-full rounded-xl border bg-card px-3 py-2 text-sm text-moss-deep"
              >
                {CAPSULE_UNLOCK_OPTIONS.map((opt, i) => (
                  <option key={i} value={i}>{opt.label}</option>
                ))}
              </select>
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
              {sealing ? 'Sealing...' : 'Seal it'}
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Sealed */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-moss-deep">Sealed</span>
        </div>
        {sealed.length === 0 && opened.length === 0 && !loading && (
          <Card className="bg-card border-dashed border-border rounded-3xl p-10 text-center">
            <Lock className="w-10 h-10 text-rose-gold/40 mx-auto mb-3" />
            <div className="font-serif text-lg text-moss-deep">Your time capsule is empty</div>
            <div className="text-sm text-muted-foreground mt-1">Seal your first memory.</div>
          </Card>
        )}
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
                    {item.body && (
                      <p className="text-sm text-foreground/70 mt-1.5 line-clamp-2">{item.body}</p>
                    )}
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Opened */}
      {opened.length > 0 && (
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
                    <button onClick={() => deleteItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { calcWeek, useProfile } from "@/components/providers";
import { Baby, Leaf, Heart, Sparkles, Calendar as CalIcon, Plus, Check, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

interface WeekContent {
  week: number;
  trimester: number;
  babySize: string;
  babyLengthCm: number;
  babyWeightG: number;
  milestone?: string;
  babySizeDesc: string;
  bodyChanges: string;
  emotionalChanges: string;
  bestFriendTip: string;
  selfCare: string;
  affirmation: string;
}

interface Appointment {
  id: string;
  title: string;
  date: string;
  type: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export default function CalendarScreen() {
  const [view, setView] = useState<"weeks" | "appointments">("weeks");
  return (
    <div className="space-y-5">
      <div className="flex gap-2 bg-muted/50 p-1 rounded-full">
        <button
          onClick={() => setView("weeks")}
          className={cn("flex-1 py-2 text-sm font-medium rounded-full transition-all", view === "weeks" ? "bg-card shadow-soft text-moss-deep" : "text-muted-foreground")}
        >
          Weekly Calendar
        </button>
        <button
          onClick={() => setView("appointments")}
          className={cn("flex-1 py-2 text-sm font-medium rounded-full transition-all", view === "appointments" ? "bg-card shadow-soft text-moss-deep" : "text-muted-foreground")}
        >
          Appointments
        </button>
      </div>

      {view === "weeks" ? <WeeksView /> : <AppointmentsView />}
    </div>
  );
}

function WeeksView() {
  const { profile } = useProfile();
  const currentWeek = calcWeek(profile?.dueDate);
  const [weeks, setWeeks] = useState<WeekContent[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(currentWeek);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    fetch("/api/weekly-content")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setWeeks(d.weeks || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-3xl" />)}</div>;
  }

  if (error) {
    return (
      <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
        <CalIcon className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
        <div className="font-serif text-lg text-moss-deep">Couldn't load calendar</div>
        <div className="text-xs text-muted-foreground mt-1">Check your connection and try again.</div>
        <Button onClick={load} variant="outline" className="mt-4 rounded-full">Retry</Button>
      </Card>
    );
  }

  if (weeks.length === 0) {
    return (
      <Card className="bg-card border-dashed border-border rounded-3xl p-8 text-center">
        <CalIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
        <div className="font-serif text-lg text-moss-deep">No weekly content yet</div>
        <div className="text-xs text-muted-foreground mt-1">Set your due date in your profile to see weekly updates.</div>
      </Card>
    );
  }

  const selected = weeks.find((w) => w.week === selectedWeek);
  const activeTrimester = selected ? selected.trimester : 1;

  return (
    <div className="space-y-4">
      {/* Trimester pills */}
      <div className="flex gap-2">
        {[1, 2, 3].map((t) => {
          const tWeeks = weeks.filter((w) => w.trimester === t);
          return (
            <button
              key={t}
              onClick={() => {
                const first = tWeeks[0];
                if (first) setSelectedWeek(first.week);
              }}
              className={cn(
                "flex-1 text-xs py-2 rounded-full transition-colors",
                activeTrimester === t
                  ? "bg-moss text-cream shadow-soft font-semibold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              )}
            >
              T{t}
              <span className="block text-[10px] opacity-70">Wks {t === 1 ? "1-13" : t === 2 ? "14-27" : "28-40"}</span>
            </button>
          );
        })}
      </div>

      {/* Week selector with scroll fade */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto scroll-soft pb-2 -mx-4 px-4">
          {weeks.map((w) => {
            const isCurrent = w.week === currentWeek;
            const isSelected = w.week === selectedWeek;
            const isPast = currentWeek && w.week < currentWeek;
            return (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={cn(
                  "flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center transition-all",
                  isSelected ? "bg-moss text-cream shadow-soft" : isCurrent ? "bg-blush text-moss-deep ring-2 ring-rose-gold" : isPast ? "bg-muted/40 text-muted-foreground" : "bg-card border border-border/40 text-foreground/70 hover:border-moss/30"
                )}
              >
                <span className="text-[9px] uppercase tracking-wider opacity-70">Wk</span>
                <span className="text-base font-serif font-semibold leading-none">{w.week}</span>
                {isCurrent && <span className="text-[8px] mt-0.5 text-rose-gold font-bold">NOW</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selected && <WeekDetail week={selected} isCurrent={selected.week === currentWeek} />}
    </div>
  );
}

function WeekDetail({ week, isCurrent }: { week: WeekContent; isCurrent: boolean }) {
  return (
    <motion.div
      key={week.week}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Header card */}
      <Card className="bg-gradient-moss text-cream rounded-3xl overflow-hidden shadow-soft">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blush mb-1">
                Week {week.week} · Trimester {week.trimester}
                {isCurrent && " · You are here"}
              </div>
              <div className="font-serif text-3xl">Your baby is a {week.babySize}</div>
              <div className="text-xs text-cream/70 mt-1">
                {week.babyLengthCm} cm long · {week.babyWeightG} g
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-cream/15 flex items-center justify-center flex-shrink-0">
              <Baby className="w-6 h-6 text-blush" />
            </div>
          </div>
          {week.milestone && (
            <div className="bg-blush/20 backdrop-blur-sm rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3 h-3 text-blush" />
              <span className="font-medium text-blush">{week.milestone}</span>
            </div>
          )}
          <p className="text-sm text-cream/80 mt-4 leading-relaxed">{week.babySizeDesc}</p>
        </div>
      </Card>

      {/* Body changes */}
      <DetailCard icon={Heart} title="Your body this week" body={week.bodyChanges} accent="bg-blush/30" iconColor="text-rose-gold" />

      {/* Emotional changes */}
      <DetailCard icon={Sparkles} title="What you might feel" body={week.emotionalChanges} accent="bg-lavender/40" iconColor="text-moss-deep" />

      {/* Best friend tip */}
      <Card className="bg-butter border-terracotta/20 rounded-3xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-terracotta/15 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-terracotta" />
          </div>
          <div className="text-[10px] uppercase tracking-widest text-terracotta font-semibold">Best friend tip</div>
        </div>
        <p className="text-sm text-moss-deep leading-relaxed">{week.bestFriendTip}</p>
      </Card>

      {/* Self-care checklist */}
      {week.selfCare && (
        <Card className="bg-card border-moss/15 rounded-3xl p-5">
          <div className="text-[10px] uppercase tracking-widest text-moss font-semibold mb-3">Self-care this week</div>
          <div className="space-y-2">
            {week.selfCare.split("\n").filter((s) => s.trim()).map((item, i) => (
              <SelfCareItem key={i} item={item.trim()} />
            ))}
          </div>
        </Card>
      )}

      {/* Affirmation */}
      {week.affirmation && (
        <Card className="bg-gradient-blush border-rose-gold/20 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-rose-gold" />
            <div className="text-[10px] uppercase tracking-widest text-rose-gold font-semibold">Affirmation</div>
          </div>
          <p className="font-script text-2xl text-moss-deep leading-snug">{week.affirmation}</p>
        </Card>
      )}
    </motion.div>
  );
}

function DetailCard({ icon: Icon, title, body, accent, iconColor }: { icon: LucideIcon; title: string; body: string; accent: string; iconColor: string }) {
  if (!body) return null;
  return (
    <Card className={cn("border-transparent rounded-3xl p-5", accent)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-cream/60 flex items-center justify-center">
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <div className="text-[10px] uppercase tracking-widest font-semibold text-moss-deep">{title}</div>
      </div>
      <p className="text-sm text-moss-deep/80 leading-relaxed">{body}</p>
    </Card>
  );
}

function SelfCareItem({ item }: { item: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => setDone(!done)}
      className="w-full flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-muted/40 transition-colors text-left"
    >
      <div className={cn(
        "w-5 h-5 rounded-md flex items-center justify-center transition-all flex-shrink-0",
        done ? "bg-moss text-cream" : "border-2 border-border"
      )}>
        {done && <Check className="w-3 h-3" />}
      </div>
      <span className={cn("text-sm", done ? "line-through text-muted-foreground" : "text-foreground/80")}>
        {item}
      </span>
    </button>
  );
}

/* ─────────────────────────── APPOINTMENTS ─────────────────────────── */

function AppointmentsView() {
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(() => {
    fetch("/api/appointments")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        setAppts(d.appointments || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, []);

  useEffect(() => { load(); }, [load]);

  const upcoming = appts.filter((a) => new Date(a.date) >= new Date() && !a.completed);
  const past = appts.filter((a) => new Date(a.date) < new Date() || a.completed).reverse();

  if (loading) {
    return <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>;
  }

  if (error) {
    return (
      <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
        <CalIcon className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
        <div className="font-serif text-lg text-moss-deep">Couldn't load appointments</div>
        <Button onClick={load} variant="outline" className="mt-4 rounded-full">Retry</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-serif text-2xl text-moss-deep">Appointments</div>
          <div className="text-xs text-muted-foreground">{upcoming.length} upcoming · {past.length} past</div>
        </div>
        <Button onClick={() => setAddOpen(true)} className="bg-moss hover:bg-moss-deep rounded-full h-9">
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Upcoming</div>
          {upcoming.map((a) => <ApptCard key={a.id} appt={a} onChange={load} />)}
        </div>
      )}
      {past.length > 0 && (
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold pt-2">Past</div>
          {past.map((a) => <ApptCard key={a.id} appt={a} onChange={load} />)}
        </div>
      )}
      {appts.length === 0 && (
        <Card className="bg-card border-dashed border-border rounded-3xl p-8 text-center">
          <CalIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">No appointments yet</div>
          <div className="text-xs text-muted-foreground mt-1">Add your first OB visit, ultrasound, or glucose test.</div>
        </Card>
      )}

      <AddAppointmentDialog open={addOpen} onOpenChange={setAddOpen} onAdded={load} />
    </div>
  );
}

function ApptCard({ appt, onChange }: { appt: Appointment; onChange: () => void }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const typeColors: Record<string, string> = {
    ob_visit: "bg-sage/40",
    ultrasound: "bg-blush/40",
    glucose_test: "bg-butter",
    lab: "bg-lavender/40",
    other: "bg-muted/40",
  };

  async function toggleComplete() {
    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: appt.id, completed: !appt.completed }),
      });
      if (!res.ok) throw new Error();
      onChange();
    } catch {
      toast.error("Failed to update");
    }
  }

  async function remove() {
    try {
      const res = await fetch(`/api/appointments?id=${appt.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Removed");
      onChange();
    } catch {
      toast.error("Failed to remove");
    }
    setDeleteOpen(false);
  }

  return (
    <>
      <Card className={cn("rounded-2xl p-4 border-transparent", typeColors[appt.type] || "bg-muted/40", appt.completed && "opacity-60")}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-cream/70 flex flex-col items-center justify-center flex-shrink-0">
            <span className="text-[9px] uppercase font-bold text-moss-deep">{format(new Date(appt.date), "MMM")}</span>
            <span className="text-base font-bold text-moss-deep leading-none">{format(new Date(appt.date), "d")}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className={cn("text-sm font-semibold text-moss-deep", appt.completed && "line-through")}>{appt.title}</div>
              <Badge variant="secondary" className="text-[9px] uppercase tracking-wider h-4 px-1.5">{appt.type.replaceAll("_", " ")}</Badge>
            </div>
            <div className="text-xs text-foreground/60 mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {format(new Date(appt.date), "EEEE, h:mm a")}
            </div>
            {appt.location && (
              <div className="text-xs text-foreground/60 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {appt.location}
              </div>
            )}
            {appt.notes && <div className="text-xs text-foreground/70 mt-2 italic">{appt.notes}</div>}
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" onClick={toggleComplete} className="h-7 text-xs">
                {appt.completed ? "Undo" : "Mark done"}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(true)} className="h-7 text-xs text-destructive hover:text-destructive">
                Remove
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-xl text-moss-deep">Delete this appointment?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
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

function AddAppointmentDialog({ open, onOpenChange, onAdded }: { open: boolean; onOpenChange: (v: boolean) => void; onAdded: () => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("ob_visit");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title || !date || !time) {
      toast.error("Title, date, and time required");
      return;
    }
    setSaving(true);
    try {
      const datetime = new Date(`${date}T${time}`);
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date: datetime.toISOString(), type, location, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success("Appointment added");
      setTitle(""); setDate(""); setTime(""); setType("ob_visit"); setLocation(""); setNotes("");
      onOpenChange(false);
      onAdded();
    } catch {
      toast.error("Failed to add");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">Add appointment</DialogTitle>
          <DialogDescription>Track OB visits, ultrasounds, tests, and more.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div>
            <Label htmlFor="ap-title">Title</Label>
            <Input id="ap-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="First prenatal visit" className="mt-1.5 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="ap-date">Date</Label>
              <Input id="ap-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
            <div>
              <Label htmlFor="ap-time">Time</Label>
              <Input id="ap-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1.5 rounded-xl" />
            </div>
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ob_visit">OB Visit</SelectItem>
                <SelectItem value="ultrasound">Ultrasound</SelectItem>
                <SelectItem value="glucose_test">Glucose Test</SelectItem>
                <SelectItem value="lab">Lab Work</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ap-loc">Location (optional)</Label>
            <Input id="ap-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dr. Smith's office" className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="ap-notes">Notes (optional)</Label>
            <Textarea id="ap-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Questions to ask..." className="mt-1.5 rounded-xl" rows={2} />
          </div>
          <Button onClick={submit} disabled={saving} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11">
            {saving ? "Adding..." : "Add appointment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

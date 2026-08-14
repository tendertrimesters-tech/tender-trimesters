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
import { Calendar as CalIcon, Plus, Clock, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Appointment {
  id: string;
  title: string;
  date: string;
  type: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export default function AppointmentsScreen() {
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

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">Appointments</div>
        <div className="text-xs text-muted-foreground mt-1">Track your OB visits and tests</div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
      ) : error ? (
        <Card className="bg-card border-dashed border-destructive/30 rounded-3xl p-8 text-center">
          <CalIcon className="w-10 h-10 text-destructive/40 mx-auto mb-3" />
          <div className="font-serif text-lg text-moss-deep">Couldn&apos;t load appointments</div>
          <Button onClick={load} variant="outline" className="mt-4 rounded-full">Retry</Button>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-end">
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
        </>
      )}
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
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
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
    const t = title.trim();
    if (!t) { toast.error("Please enter a title"); return; }
    if (!date) { toast.error("Please select a date"); return; }
    if (!time) { toast.error("Please select a time"); return; }
    setTitle(t);
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
            <Input id="ap-loc" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Dr. Smith&apos;s office" className="mt-1.5 rounded-xl" />
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

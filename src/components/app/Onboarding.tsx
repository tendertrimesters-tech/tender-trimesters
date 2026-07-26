"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Baby, Heart, Sparkles, Calendar as CalIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  onComplete: () => void;
  defaultName?: string;
};

export default function Onboarding({ onComplete, defaultName }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState(defaultName || "");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [babyName, setBabyName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish() {
    if (!dueDate) {
      toast.error("Please select your due date");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          dueDate: dueDate.toISOString(),
          babyName: babyName.trim() || undefined,
          partnerName: partnerName.trim() || undefined,
          onboarded: true,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Welcome to your journey, mama 💛");
      onComplete();
    } catch {
      toast.error("Something went wrong. Try again?");
    } finally {
      setSaving(false);
    }
  }

  const steps = [
    <StepWelcome key="0" name={name} setName={setName} onNext={() => setStep(1)} />,
    <StepDueDate key="1" dueDate={dueDate} setDueDate={setDueDate} onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <StepOptional key="2" babyName={babyName} setBabyName={setBabyName} partnerName={partnerName} setPartnerName={setPartnerName} onNext={() => setStep(3)} onBack={() => setStep(1)} />,
    <StepFinish key="3" name={name} dueDate={dueDate} babyName={babyName} partnerName={partnerName} onBack={() => setStep(2)} onFinish={finish} saving={saving} />,
  ];

  return (
    <div className="min-h-screen bg-gradient-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === step ? "w-8 bg-moss" : i < step ? "w-4 bg-moss/50" : "w-4 bg-border"
              )}
            />
          ))}
        </div>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {steps[step]}
        </motion.div>
      </div>
    </div>
  );
}

function StepWelcome({ name, setName, onNext }: { name: string; setName: (v: string) => void; onNext: () => void }) {
  return (
    <Card className="bg-card border-moss/15 rounded-[28px] p-8 shadow-soft">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-blush mx-auto flex items-center justify-center mb-4">
          <Heart className="w-7 h-7 text-rose-gold fill-rose-gold" />
        </div>
        <h2 className="font-serif text-3xl text-moss-deep">Welcome, mama.</h2>
        <p className="text-sm text-foreground/70 mt-2">
          Let's set up your journey. This takes about a minute.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="ob-name">What should we call you?</Label>
          <Input
            id="ob-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or nickname"
            className="mt-1.5 rounded-xl"
            autoFocus
          />
        </div>
        <Button onClick={onNext} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11">
          Continue <ChevronRight className="ml-1.5 w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}

function StepDueDate({ dueDate, setDueDate, onNext, onBack }: { dueDate: Date | undefined; setDueDate: (d: Date) => void; onNext: () => void; onBack: () => void }) {
  return (
    <Card className="bg-card border-moss/15 rounded-[28px] p-8 shadow-soft">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-sage/40 mx-auto flex items-center justify-center mb-4">
          <CalIcon className="w-7 h-7 text-moss-deep" />
        </div>
        <h2 className="font-serif text-3xl text-moss-deep">When are you due?</h2>
        <p className="text-sm text-foreground/70 mt-2">
          We'll calculate your current week and personalize everything.
        </p>
      </div>
      <div className="space-y-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal h-12 rounded-xl"
            >
              {dueDate ? format(dueDate, "EEEE, MMMM d, yyyy") : "Pick your due date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(d) => d && setDueDate(d)}
              initialFocus
              disabled={(date) => date > new Date(Date.now() + 280 * 24 * 60 * 60 * 1000)}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-muted-foreground text-center">
          Don't know yet? Estimate within a week — you can update it later.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={onNext} disabled={!dueDate} className="flex-1 bg-moss hover:bg-moss-deep rounded-full h-11">
            Continue <ChevronRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StepOptional({ babyName, setBabyName, partnerName, setPartnerName, onNext, onBack }: { babyName: string; setBabyName: (v: string) => void; partnerName: string; setPartnerName: (v: string) => void; onNext: () => void; onBack: () => void }) {
  return (
    <Card className="bg-card border-moss/15 rounded-[28px] p-8 shadow-soft">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-butter mx-auto flex items-center justify-center mb-4">
          <Baby className="w-7 h-7 text-terracotta" />
        </div>
        <h2 className="font-serif text-3xl text-moss-deep">A little more (optional)</h2>
        <p className="text-sm text-foreground/70 mt-2">
          Help Tempie know you better. Skip anything you'd rather not share.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="ob-baby">Baby's name (if chosen)</Label>
          <Input
            id="ob-baby"
            value={babyName}
            onChange={(e) => setBabyName(e.target.value)}
            placeholder="Coming soon..."
            className="mt-1.5 rounded-xl"
          />
        </div>
        <div>
          <Label htmlFor="ob-partner">Partner's name (if any)</Label>
          <Input
            id="ob-partner"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Partner name"
            className="mt-1.5 rounded-xl"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="rounded-full">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <Button onClick={onNext} className="flex-1 bg-moss hover:bg-moss-deep rounded-full h-11">
            Continue <ChevronRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StepFinish({ name, dueDate, babyName, partnerName, onBack, onFinish, saving }: { name: string; dueDate?: Date; babyName: string; partnerName: string; onBack: () => void; onFinish: () => void; saving: boolean }) {
  return (
    <Card className="bg-card border-moss/15 rounded-[28px] p-8 shadow-soft">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-moss mx-auto flex items-center justify-center mb-4">
          <Sparkles className="w-7 h-7 text-blush" />
        </div>
        <h2 className="font-serif text-3xl text-moss-deep">You're all set{name ? `, ${name}` : ""}.</h2>
        <p className="text-sm text-foreground/70 mt-2">
          Your Tender Trimesters journey begins now.
        </p>
      </div>
      <div className="bg-gradient-blush rounded-2xl p-4 mb-6 space-y-2 text-sm">
        {dueDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Due date</span>
            <span className="font-medium text-moss-deep">{format(dueDate, "MMM d, yyyy")}</span>
          </div>
        )}
        {babyName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Baby</span>
            <span className="font-medium text-moss-deep">{babyName}</span>
          </div>
        )}
        {partnerName && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Partner</span>
            <span className="font-medium text-moss-deep">{partnerName}</span>
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} disabled={saving} className="rounded-full">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button onClick={onFinish} disabled={saving} className="flex-1 bg-gradient-moss hover:opacity-90 rounded-full h-11">
          {saving ? "Setting up..." : "Enter the app"}
        </Button>
      </div>
    </Card>
  );
}

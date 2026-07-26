"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useProfile, calcWeek, trimesterOf } from "@/components/providers";
import { format } from "date-fns";
import { Baby, Calendar as CalIcon, Heart, Sparkles, Crown, Copy, Check, LogOut, ChevronRight, User, Users, Lock, Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfileScreen({ onSignOut }: { onSignOut: () => void }) {
  const { profile, refresh } = useProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!profile) {
    return <div className="text-center text-muted-foreground text-sm py-12">Loading your profile...</div>;
  }

  const week = calcWeek(profile.dueDate);
  const trimester = trimesterOf(week);

  const partnerLink = profile.partnerLinkToken
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/?partner=${profile.partnerLinkToken}`
    : null;

  async function copyPartnerLink() {
    if (!partnerLink) return;
    await navigator.clipboard.writeText(partnerLink);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 2000);
  }

  async function generatePartnerLink() {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerLinkToken: "generate" }),
    });
    if (res.ok) {
      await refresh();
      toast.success("Partner link created");
    }
  }

  return (
    <div className="space-y-5">
      {/* Profile header */}
      <Card className="bg-gradient-moss text-cream rounded-3xl overflow-hidden shadow-soft">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-blush/30 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-cream" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-serif text-2xl truncate">{profile.name || "Mama"}</div>
                {profile.isPremium && (
                  <Badge className="bg-blush text-rose-gold hover:bg-blush">
                    <Crown className="w-3 h-3 mr-1" /> Premium
                  </Badge>
                )}
              </div>
              <div className="text-xs text-cream/70 truncate">{profile.email}</div>
              {week && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  <div className="bg-cream/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                    <Baby className="w-3 h-3 inline mr-1" /> Week {week} · T{trimester}
                  </div>
                  {profile.dueDate && (
                    <div className="bg-cream/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                      <CalIcon className="w-3 h-3 inline mr-1" /> Due {format(new Date(profile.dueDate), "MMM d, yyyy")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Premium banner (if not premium) */}
      {!profile.isPremium && (
        <button onClick={() => setUpgradeOpen(true)} className="text-left w-full">
          <Card className="bg-gradient-premium text-cream rounded-3xl p-5 hover:opacity-95 transition-opacity shadow-premium">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cream/20 backdrop-blur-sm flex items-center justify-center">
                <Crown className="w-5 h-5 text-cream" />
              </div>
              <div className="flex-1">
                <div className="font-serif text-lg">Upgrade to Premium</div>
                <div className="text-xs text-cream/80">Unlimited Tempie · bump photos · partner access · bundle</div>
              </div>
              <ChevronRight className="w-4 h-4 text-cream/70" />
            </div>
          </Card>
        </button>
      )}

      {/* Quick info rows */}
      <Card className="bg-card border-moss/15 rounded-3xl divide-y divide-border/30">
        <InfoRow icon={User} label="Name" value={profile.name || "—"} />
        <InfoRow icon={CalIcon} label="Due date" value={profile.dueDate ? format(new Date(profile.dueDate), "MMM d, yyyy") : "—"} />
        {profile.babyName && <InfoRow icon={Baby} label="Baby" value={profile.babyName} />}
        {profile.partnerName && <InfoRow icon={Heart} label="Partner" value={profile.partnerName} />}
        <InfoRow icon={Crown} label="Plan" value={profile.isPremium ? `Premium (${profile.premiumTier === "monthly" ? "Monthly" : "One-time"})` : "Free"} />
      </Card>

      <Button onClick={() => setEditOpen(true)} variant="outline" className="w-full rounded-full h-11 border-moss/30">
        Edit profile
      </Button>

      {/* Partner access */}
      <Card className="bg-card border-moss/15 rounded-3xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-sage/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-moss-deep" />
          </div>
          <div>
            <div className="font-serif text-lg text-moss-deep">Partner access</div>
            <div className="text-xs text-muted-foreground">Share a read-only view of your journey</div>
          </div>
        </div>
        {partnerLink ? (
          <div className="space-y-2">
            <div className="bg-muted/40 rounded-xl p-3 text-xs text-foreground/70 break-all font-mono">
              {partnerLink}
            </div>
            <div className="flex gap-2">
              <Button onClick={copyPartnerLink} variant="outline" size="sm" className="rounded-full flex-1">
                {copied ? <><Check className="w-3.5 h-3.5 mr-1" /> Copied</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copy link</>}
              </Button>
              <Button onClick={() => setPartnerOpen(true)} size="sm" className="rounded-full bg-moss hover:bg-moss-deep">
                Preview
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={generatePartnerLink} variant="outline" size="sm" className="rounded-full w-full">
            Generate partner link
          </Button>
        )}
      </Card>

      {/* Sign out */}
      <Button onClick={onSignOut} variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5 rounded-full">
        <LogOut className="w-4 h-4 mr-2" /> Sign out
      </Button>

      <div className="text-center text-[10px] text-muted-foreground pt-2">
        Tender Trimesters · by Mommies Matter<br />
        Made with love by Helena-Ann Baker
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} onSaved={refresh} profile={profile} />
      <UpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} onUpgraded={refresh} />
      {partnerLink && <PartnerPreviewDialog open={partnerOpen} onOpenChange={setPartnerOpen} link={partnerLink} />}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-9 h-9 rounded-xl bg-muted/40 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-moss" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm text-moss-deep truncate">{value}</div>
      </div>
    </div>
  );
}

function EditProfileDialog({ open, onOpenChange, onSaved, profile }: { open: boolean; onOpenChange: (v: boolean) => void; onSaved: () => Promise<void>; profile: any }) {
  const [name, setName] = useState(profile?.name || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(profile?.dueDate ? new Date(profile.dueDate) : undefined);
  const [babyName, setBabyName] = useState(profile?.babyName || "");
  const [partnerName, setPartnerName] = useState(profile?.partnerName || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          dueDate: dueDate?.toISOString(),
          babyName: babyName.trim() || undefined,
          partnerName: partnerName.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      await onSaved();
      toast.success("Profile updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">Edit profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="pr-name">Name</Label>
            <Input id="pr-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label>Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1.5 h-10 rounded-xl">
                  {dueDate ? format(dueDate, "MMM d, yyyy") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dueDate} onSelect={(d) => d && setDueDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="pr-baby">Baby name (optional)</Label>
            <Input id="pr-baby" value={babyName} onChange={(e) => setBabyName(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="pr-partner">Partner name (optional)</Label>
            <Input id="pr-partner" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} className="mt-1.5 rounded-xl" />
          </div>
          <Button onClick={save} disabled={saving} className="w-full bg-moss hover:bg-moss-deep rounded-full h-11">
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UpgradeDialog({ open, onOpenChange, onUpgraded }: { open: boolean; onOpenChange: (v: boolean) => void; onUpgraded: () => Promise<void> }) {
  const [tier, setTier] = useState<"one_time" | "monthly">("one_time");
  const [processing, setProcessing] = useState(false);

  async function purchase() {
    setProcessing(true);
    try {
      // Mock purchase — in production, this would redirect to Stripe Checkout
      const res = await fetch("/api/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (!res.ok) throw new Error();
      await onUpgraded();
      toast.success(tier === "one_time" ? "Welcome to Premium 💛" : "You're Premium now 💛");
      onOpenChange(false);
    } catch {
      toast.error("Something went wrong. Try again?");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep flex items-center gap-2">
            <Crown className="w-5 h-5 text-rose-gold" /> Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            Unlock everything. No subscriptions required (though we offer one if you prefer).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <button
            onClick={() => setTier("one_time")}
            className={cn(
              "w-full p-4 rounded-2xl border-2 text-left transition-all",
              tier === "one_time" ? "border-rose-gold bg-blush/20" : "border-border hover:border-moss/30"
            )}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-serif text-lg text-moss-deep">One-time</div>
                <div className="text-xs text-muted-foreground">Pay once, keep forever</div>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl text-rose-gold">$9.99</span>
                <span className="text-xs text-muted-foreground line-through ml-1">$19.99</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {["Ebook", "Affirmation deck", "Letters templates", "All premium features"].map((f) => (
                <span key={f} className="text-[10px] bg-cream/60 text-moss-deep px-2 py-0.5 rounded-full">{f}</span>
              ))}
            </div>
          </button>

          <button
            onClick={() => setTier("monthly")}
            className={cn(
              "w-full p-4 rounded-2xl border-2 text-left transition-all",
              tier === "monthly" ? "border-rose-gold bg-blush/20" : "border-border hover:border-moss/30"
            )}
          >
            <div className="flex items-baseline justify-between">
              <div>
                <div className="font-serif text-lg text-moss-deep">Monthly</div>
                <div className="text-xs text-muted-foreground">Cancel anytime</div>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl text-rose-gold">$4.99</span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Same features, spread out. Includes everything in the bundle.
            </div>
          </button>

          <div className="bg-muted/30 rounded-xl p-3 text-xs text-muted-foreground flex gap-2">
            <Lock className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-moss-deep">Demo mode:</strong> Clicking "Continue" will activate premium instantly without payment (for testing). In production this will route through Stripe.
            </div>
          </div>

          <Button onClick={purchase} disabled={processing} className="w-full bg-gradient-premium hover:opacity-90 rounded-full h-12">
            {processing ? "Processing..." : `Continue with ${tier === "one_time" ? "$9.99 one-time" : "$4.99/month"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PartnerPreviewDialog({ open, onOpenChange, link }: { open: boolean; onOpenChange: (v: boolean) => void; link: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-moss-deep">What your partner sees</DialogTitle>
          <DialogDescription>
            When they open this link, they'll see a read-only view of your pregnancy — current week, this week's content, and upcoming appointments. They cannot edit anything or see your journal.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 bg-gradient-moss text-cream rounded-2xl p-4">
          <div className="text-[10px] uppercase tracking-widest text-blush mb-1">Partner view preview</div>
          <div className="font-serif text-xl">Week 16 · Avocado</div>
          <div className="text-xs text-cream/70 mt-1">Due Aug 12, 2026</div>
          <div className="mt-3 bg-cream/10 backdrop-blur-sm rounded-xl p-3 text-xs">
            <div className="text-blush font-semibold mb-1">Upcoming:</div>
            <div>Anatomy Scan · Jul 15</div>
            <div>OB Visit · Jul 28</div>
          </div>
        </div>
        <Button onClick={() => onOpenChange(false)} className="w-full bg-moss hover:bg-moss-deep rounded-full">
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}

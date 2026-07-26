"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Baby, Heart, Calendar as CalIcon, MapPin, Clock, Leaf, Sparkles, X } from "lucide-react";
import { format } from "date-fns";

type PartnerData = {
  mama: {
    name: string | null;
    dueDate: string | null;
    babyName: string | null;
    partnerName: string | null;
    week: number | null;
  };
  weeklyContent: any | null;
  upcomingAppts: any[];
};

export default function PartnerView({ token, onExit }: { token: string; onExit: () => void }) {
  const [data, setData] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/partner?token=${encodeURIComponent(token)}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-cream p-4 flex items-center justify-center">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-cream flex items-center justify-center p-4">
        <Card className="bg-card border-destructive/20 rounded-3xl p-8 max-w-md text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-4">
            <X className="w-6 h-6 text-destructive" />
          </div>
          <div className="font-serif text-2xl text-moss-deep">Link expired or invalid</div>
          <p className="text-sm text-muted-foreground mt-2">
            Ask your partner to generate a new link from their profile.
          </p>
          <Button onClick={onExit} className="mt-5 bg-moss hover:bg-moss-deep rounded-full">
            Back to home
          </Button>
        </Card>
      </div>
    );
  }

  const { mama, weeklyContent, upcomingAppts } = data;

  return (
    <div className="min-h-screen bg-gradient-cream">
      <header className="bg-moss-deep text-cream py-4">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-blush" />
            <div>
              <div className="font-serif text-lg leading-none">Tender Trimesters</div>
              <div className="text-[10px] opacity-70 mt-0.5">Partner view · read only</div>
            </div>
          </div>
          <Button onClick={onExit} variant="ghost" size="sm" className="text-cream hover:bg-cream/10">
            Exit
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Welcome / hero */}
        <Card className="bg-gradient-moss text-cream rounded-3xl overflow-hidden shadow-soft">
          <div className="p-6">
            <div className="text-[10px] uppercase tracking-widest text-blush mb-1">
              {mama.week ? `Week ${mama.week} of pregnancy` : "Pregnancy journey"}
            </div>
            <div className="font-serif text-3xl">
              {mama.name ? `${mama.name}'s journey` : "Your partner's journey"}
            </div>
            {mama.dueDate && (
              <div className="text-sm text-cream/80 mt-2 flex items-center gap-2">
                <CalIcon className="w-4 h-4" /> Due {format(new Date(mama.dueDate), "EEEE, MMMM d, yyyy")}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {mama.babyName && (
                <div className="bg-cream/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                  <Baby className="w-3 h-3 inline mr-1" /> Baby {mama.babyName}
                </div>
              )}
              {mama.partnerName && (
                <div className="bg-cream/15 backdrop-blur-sm rounded-full px-3 py-1 text-xs">
                  <Heart className="w-3 h-3 inline mr-1" /> {mama.partnerName}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* This week */}
        {weeklyContent && (
          <>
            <Card className="bg-card border-moss/15 rounded-3xl p-6">
              <div className="text-[10px] uppercase tracking-widest text-terracotta mb-1 font-semibold">This week</div>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blush/40 flex items-center justify-center">
                  <Baby className="w-6 h-6 text-rose-gold" />
                </div>
                <div>
                  <div className="font-serif text-2xl text-moss-deep">Baby is a {weeklyContent.babySize}</div>
                  <div className="text-xs text-muted-foreground">{weeklyContent.babyLengthCm}cm · {weeklyContent.babyWeightG}g</div>
                </div>
              </div>
              <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{weeklyContent.babySizeDesc}</p>
              {weeklyContent.milestone && (
                <div className="mt-3 inline-flex items-center gap-1.5 bg-butter text-terracotta text-xs font-semibold px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> {weeklyContent.milestone}
                </div>
              )}
            </Card>

            <Card className="bg-blush/30 border-rose-gold/20 rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-rose-gold" />
                <div className="text-[10px] uppercase tracking-widest text-rose-gold font-semibold">Today's affirmation for {mama.name?.split(" ")[0] || "mama"}</div>
              </div>
              <p className="font-script text-2xl text-moss-deep">{weeklyContent.affirmation}</p>
            </Card>

            <Card className="bg-butter border-terracotta/20 rounded-3xl p-5">
              <div className="text-[10px] uppercase tracking-widest text-terracotta font-semibold mb-2">Partner tip — how to support her</div>
              <p className="text-sm text-moss-deep leading-relaxed">{weeklyContent.bestFriendTip}</p>
            </Card>
          </>
        )}

        {/* Upcoming appointments */}
        {upcomingAppts.length > 0 && (
          <Card className="bg-card border-moss/15 rounded-3xl p-5">
            <div className="text-[10px] uppercase tracking-widest text-moss font-semibold mb-3">Upcoming appointments</div>
            <div className="space-y-3">
              {upcomingAppts.map((a) => (
                <div key={a.id} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-sage/30 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[10px] uppercase font-semibold text-moss-deep">{format(new Date(a.date), "MMM")}</span>
                    <span className="text-sm font-bold text-moss-deep leading-none">{format(new Date(a.date), "d")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-moss-deep">{a.title}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {format(new Date(a.date), "EEEE, h:mm a")}
                    </div>
                    {a.location && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {a.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="bg-card border-moss/15 rounded-3xl p-5">
          <div className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-moss-deep">This is a read-only view.</strong> You can see {mama.name?.split(" ")[0] || "your partner"}'s pregnancy progress, but you can't see her private journal or chat with Tempie. To support her, ask how she's feeling — and listen without trying to fix everything. 💛
          </div>
        </Card>
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useProfile } from "@/components/providers";
import {
  Heart, Brain, Camera, Lock, Users, CalendarDays, Baby, BookOpen,
  Flame, Moon, Activity, Sprout, TreePine, Music, Mail, Star,
  Compass, HandHeart, Sparkles, ChevronRight, Crown, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppView } from "../AppShell";

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  emoji: string;
  accent: string;
  premium?: boolean;
  badge?: string;
}

interface FeatureCollection {
  title: string;
  emoji: string;
  description: string;
  items: FeatureItem[];
}

const COLLECTIONS: FeatureCollection[] = [
  {
    title: "Keepsakes",
    emoji: "💌",
    description: "Treasures you'll keep forever",
    items: [
      { id: "letters", title: "Letters from Baby", description: "Love letters from your little one, week by week", icon: Mail, emoji: "💌", accent: "bg-blush/30", badge: "AI" },
      { id: "garden", title: "The Name Garden", description: "Plant name seeds and watch your feelings grow", icon: Sprout, emoji: "🌱", accent: "bg-sage/30" },
      { id: "capsule", title: "Memory Capsule", description: "Seal memories for your child to open someday", icon: Lock, emoji: "⏳", accent: "bg-lavender/30" },
      { id: "mother-story", title: "My Mother's Mother", description: "12 prompts to capture a generational keepsake", icon: BookOpen, emoji: "📖", accent: "bg-butter" },
    ],
  },
  {
    title: "Inner World",
    emoji: "🦋",
    description: "Your emotional landscape",
    items: [
      { id: "fear", title: "Fear to Flame", description: "Watch your fears transform into courage", icon: Flame, emoji: "🔥", accent: "bg-terracotta/20", badge: "AI" },
      { id: "dreams", title: "DreamKeeper", description: "Your pregnancy dreams are trying to tell you something", icon: Moon, emoji: "🌙", accent: "bg-lavender/20", badge: "AI" },
      { id: "hormone", title: "Hormone Horoscope", description: "What your body's chemistry is doing this week", icon: Activity, emoji: "🌊", accent: "bg-sage/20" },
    ],
  },
  {
    title: "Tracking",
    emoji: "📊",
    description: "Document your journey",
    items: [
      { id: "rituals", title: "Belly Bonding", description: "60-second rituals to connect with your baby", icon: Heart, emoji: "🤍", accent: "bg-blush/20" },
      { id: "bump-photos", title: "Bump Gallery", description: "Your beautiful growing story, week by week", icon: Camera, emoji: "📸", accent: "bg-sage/20", premium: true },
      { id: "playlist", title: "Birth Playlist", description: "The soundtrack for your baby's arrival", icon: Music, emoji: "🎵", accent: "bg-butter" },
    ],
  },
  {
    title: "Connection",
    emoji: "💝",
    description: "You're not alone",
    items: [
      { id: "community", title: "The Village", description: "Share, support, and hug other mamas", icon: Users, emoji: "🤝", accent: "bg-blush/30" },
      { id: "meditation", title: "Guided Meditations", description: "Sensual, flowing meditations for every trimester", icon: Brain, emoji: "🧘‍♀️", accent: "bg-sage/30", premium: true },
      { id: "appointments", title: "Appointments", description: "Track your OB visits and tests", icon: CalendarDays, emoji: "📅", accent: "bg-butter" },
    ],
  },
];

export default function MoreScreen({ onNavigate, initialFeature }: { onNavigate: (v: AppView) => void; initialFeature?: string }) {
  const { profile } = useProfile();
  const isPremium = profile?.isPremium;

  const [selectedFeature, setSelectedFeature] = useState<string | null>(initialFeature || null);

  // Handle deep-linked feature from home screen keepsakes
  useEffect(() => {
    if (initialFeature) {
      setSelectedFeature(initialFeature);
    }
  }, [initialFeature]);

  function handleFeatureClick(featureId: string) {
    // Map feature IDs to AppView or special navigation
    const viewMap: Record<string, AppView> = {
      "community": "community",
      "bump-photos": "bump-photos",
      "meditation": "meditation",
      "calendar": "calendar",
    };

    if (viewMap[featureId]) {
      onNavigate(viewMap[featureId]);
      return;
    }

    // For signature features rendered inside MoreScreen via sub-views
    setSelectedFeature(featureId);
  }

  function goBack() {
    setSelectedFeature(null);
  }

  // If a signature feature is selected, render it inline
  if (selectedFeature) {
    return <FeatureRenderer featureId={selectedFeature} onBack={goBack} />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-serif text-2xl text-moss-deep">More</div>
        <div className="text-xs text-muted-foreground mt-1">Everything in one place, mama</div>
      </motion.div>

      {/* Collections */}
      {COLLECTIONS.map((collection, ci) => (
        <motion.div
          key={collection.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 * ci }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{collection.emoji}</span>
            <div className="font-serif text-lg text-moss-deep">{collection.title}</div>
            <div className="text-xs text-muted-foreground">{collection.description}</div>
          </div>
          <div className="space-y-2">
            {collection.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleFeatureClick(item.id)}
                className="w-full text-left"
              >
                <Card className={cn(
                  "rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-soft",
                  "bg-card border-moss/10",
                  item.premium && !isPremium && "opacity-70"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    item.accent
                  )}>
                    <item.icon className="w-5 h-5 text-moss-deep" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-moss-deep">{item.title}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-rose-gold/15 text-rose-gold rounded-full px-1.5 py-0.5 font-semibold">{item.badge}</span>
                      )}
                      {item.premium && !isPremium && (
                        <Crown className="w-3 h-3 text-rose-gold" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                </Card>
              </button>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Dynamic feature renderer — lazy-loads signature feature screens
function FeatureRenderer({ featureId, onBack }: { featureId: string; onBack: () => void }) {
  const [Screen, setScreen] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setScreen(null);
    setError(false);

    const imports: Record<string, () => Promise<any>> = {
      "letters": () => import("./LettersFromBabyScreen"),
      "garden": () => import("./NameGardenScreen"),
      "capsule": () => import("./MemoryCapsuleScreen"),
      "mother-story": () => import("./MotherStoryScreen"),
      "fear": () => import("./FearToFlameScreen"),
      "dreams": () => import("./DreamKeeperScreen"),
      "hormone": () => import("./HormoneHoroscopeScreen"),
      "rituals": () => import("./BellyBondingScreen"),
      "playlist": () => import("./BirthPlaylistScreen"),
    };

    const loader = imports[featureId];
    if (!loader) {
      setError(true);
      return;
    }

    loader()
      .then((mod) => setScreen(() => mod.default))
      .catch(() => setError(true));
  }, [featureId]);

  if (error) {
    return (
      <div>
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-moss-deep transition-colors mb-4">
          <ArrowRight className="w-3 h-3 rotate-180" /> Back to More
        </button>
        <div className="text-center py-12 text-muted-foreground text-sm">This feature couldn't load. <button onClick={onBack} className="text-moss underline">Go back</button></div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-moss-deep transition-colors mb-4">
        <ArrowRight className="w-3 h-3 rotate-180" /> Back to More
      </button>
      {Screen ? <Screen /> : (
        <div className="flex items-center justify-center py-20">
          <Sparkles className="w-6 h-6 text-rose-gold animate-pulse" />
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, BookHeart, MessageCircleHeart, User, Leaf, Flower2, Grid3X3, Users, Camera } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import JournalScreen from "./screens/JournalScreen";
import TempieScreen from "./screens/TempieScreen";
import ProfileScreen from "./screens/ProfileScreen";
import MeditationScreen from "./screens/MeditationScreen";
import MoreScreen from "./screens/MoreScreen";
import CommunityScreen from "./screens/CommunityScreen";
import BumpPhotosScreen from "./screens/BumpPhotosScreen";
import { useAuth, useProfile } from "@/components/providers";

export type AppView = "home" | "calendar" | "journal" | "tempie" | "meditation" | "more" | "profile" | "community" | "bump-photos";

function PremiumSuccessHandler() {
  const searchParams = useSearchParams();
  const { refresh } = useProfile();
  useEffect(() => {
    const status = searchParams.get("premium");
    if (status === "success") {
      // Refresh profile so the new premium status is reflected in the UI.
      refresh().then(() => {
        toast.success("Welcome to Premium. Everything's unlocked. 💛");
      });
      // Clean the query string so the toast doesn't fire again on refresh.
      const url = new URL(window.location.href);
      url.searchParams.delete("premium");
      window.history.replaceState({}, "", url.toString());
    } else if (status === "cancelled") {
      toast.info("Checkout cancelled — no charge was made. You can try again anytime.");
      const url = new URL(window.location.href);
      url.searchParams.delete("premium");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, refresh]);
  return null;
}

export default function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [view, setView] = useState<AppView>("home");
  const { userName } = useAuth();

  // Listen for the ?premium=success redirect back from Stripe Checkout.
  // Wrapped in Suspense because useSearchParams() requires it during static rendering.

  return (
    <div className="min-h-screen bg-gradient-cream flex flex-col">
      <Suspense fallback={null}>
        <PremiumSuccessHandler />
      </Suspense>
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-cream/85 border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-moss flex items-center justify-center">
              <Leaf className="w-4 h-4 text-cream" />
            </div>
            <div className="font-serif text-lg text-moss-deep leading-none">Tender Trimesters</div>
          </div>
          <div className="text-xs text-muted-foreground">
            {userName ? `Hi, ${userName.split(" ")[0]}` : ""}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-32 md:pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {view === "home" && <HomeScreen onNavigate={setView} />}
            {view === "calendar" && <CalendarScreen />}
            {view === "journal" && <JournalScreen />}
            {view === "tempie" && <TempieScreen />}
            {view === "meditation" && <MeditationScreen />}
            {view === "community" && <CommunityScreen />}
            {view === "bump-photos" && <BumpPhotosScreen />}
            {view === "more" && <MoreScreen onNavigate={setView} />}
            {view === "profile" && <ProfileScreen onSignOut={onSignOut} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom nav (mobile-first, sticky on mobile, side on desktop) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-cream/95 backdrop-blur-md border-t border-border/40 md:hidden">
        <div className="grid grid-cols-6 gap-1 px-1 py-2 safe-area-inset-bottom">
          <NavButton active={view === "home"} onClick={() => setView("home")} icon={Home} label="Home" />
          <NavButton active={view === "calendar"} onClick={() => setView("calendar")} icon={Calendar} label="Calendar" />
          <NavButton active={view === "journal"} onClick={() => setView("journal")} icon={BookHeart} label="Journal" />
          <NavButton active={view === "tempie"} onClick={() => setView("tempie")} icon={MessageCircleHeart} label="Tempie" highlight />
          <NavButton active={view === "more"} onClick={() => setView("more")} icon={Grid3X3} label="More" />
          <NavButton active={view === "profile"} onClick={() => setView("profile")} icon={User} label="Profile" />
        </div>
      </nav>

      {/* Desktop side nav */}
      <nav className="hidden md:flex flex-col fixed right-6 top-1/2 -translate-y-1/2 gap-2 z-30">
        <DesktopNavButton active={view === "home"} onClick={() => setView("home")} icon={Home} label="Home" />
        <DesktopNavButton active={view === "calendar"} onClick={() => setView("calendar")} icon={Calendar} label="Calendar" />
        <DesktopNavButton active={view === "journal"} onClick={() => setView("journal")} icon={BookHeart} label="Journal" />
        <DesktopNavButton active={view === "tempie"} onClick={() => setView("tempie")} icon={MessageCircleHeart} label="Tempie" highlight />
        <DesktopNavButton active={view === "more"} onClick={() => setView("more")} icon={Grid3X3} label="More" />
        <DesktopNavButton active={view === "profile"} onClick={() => setView("profile")} icon={User} label="Profile" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon: Icon, label, highlight }: { active: boolean; onClick: () => void; icon: any; label: string; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 py-1.5 px-1 rounded-xl transition-all",
        active ? "text-moss" : "text-muted-foreground hover:text-moss-deep"
      )}
    >
      <div className={cn(
        "w-9 h-9 rounded-full flex items-center justify-center transition-all",
        active ? (highlight ? "bg-gradient-premium text-cream" : "bg-moss text-cream") : (highlight ? "bg-blush/40 text-rose-gold" : "bg-transparent")
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

function DesktopNavButton({ active, onClick, icon: Icon, label, highlight }: { active: boolean; onClick: () => void; icon: any; label: string; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-full transition-all",
        active ? "bg-moss text-cream shadow-soft" : "bg-cream/70 hover:bg-cream text-foreground/70 hover:text-moss-deep"
      )}
      title={label}
    >
      <div className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center",
        active ? "" : (highlight ? "text-rose-gold" : "")
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-medium hidden lg:inline">{label}</span>
    </button>
  );
}

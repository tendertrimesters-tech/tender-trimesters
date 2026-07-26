"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// Wrapper around next-auth SessionProvider for the app
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// Convenience hook to check session and trigger reloads when auth state changes
export function useAuth() {
  const { data: session, status } = useSession();
  return {
    session,
    status, // "loading" | "authenticated" | "unauthenticated"
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    userId: session?.user?.id,
    userName: session?.user?.name,
    userEmail: session?.user?.email,
  };
}

// Profile refresh context — so any component can trigger a profile refetch
type ProfileContextValue = {
  profile: any;
  loading: boolean;
  refresh: () => Promise<void>;
};
const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, userId } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!isAuthenticated) {
      setProfile(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
      }
    } catch (e) {
      console.error("Profile fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userId]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refresh }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}

// Calculate current pregnancy week from due date
export function calcWeek(dueDate: Date | string | null): number | null {
  if (!dueDate) return null;
  const due = typeof dueDate === "string" ? new Date(dueDate) : dueDate;
  // LMP-based: conception start = due date - 280 days (40 weeks)
  const start = new Date(due);
  start.setDate(start.getDate() - 280);
  const diffMs = Date.now() - start.getTime();
  if (diffMs < 0) return 1; // not yet started
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(40, Math.floor(diffDays / 7) + 1));
}

export function trimesterOf(week: number | null): 1 | 2 | 3 | null {
  if (!week) return null;
  if (week <= 13) return 1;
  if (week <= 27) return 2;
  return 3;
}

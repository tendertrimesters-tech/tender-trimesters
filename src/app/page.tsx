"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthProvider, ProfileProvider, useProfile } from "@/components/providers";
import LandingPage from "@/components/landing/LandingPage";
import Onboarding from "@/components/app/Onboarding";
import AppShell from "@/components/app/AppShell";
import PartnerView from "@/components/app/PartnerView";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProfileProvider>
          <RootRouter />
        </ProfileProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function RootRouter() {
  const { status } = useSession();
  const { profile, loading: profileLoading } = useProfile();
  const [partnerToken, setPartnerToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for partner view token in URL
    try {
      const params = new URLSearchParams(window.location.search);
      const p = params.get("partner");
      if (p) setPartnerToken(p);
    } catch (e) {
      // ignore
    }
  }, []);

  // Partner view (read-only, no auth required)
  if (partnerToken) {
    return <PartnerView token={partnerToken} onExit={() => {
      setPartnerToken(null);
      try { window.history.replaceState({}, "/", "/"); } catch {}
    }} />;
  }

  // Loading states — only show full loading on INITIAL load (when we have no profile yet)
  if (status === "loading") return <LoadingScreen />;
  if (status === "authenticated" && !profile && profileLoading) return <LoadingScreen />;
  // If authenticated but profile failed to load, retry by showing loading briefly
  if (status === "authenticated" && !profile) return <LoadingScreen />;

  if (status === "unauthenticated") {
    return <LandingPage onOpenApp={() => {
      try { window.scrollTo({ top: 0, behavior: "smooth" }); } catch {}
    }} />;
  }

  // Authenticated with profile
  if (profile && !profile.onboarded) {
    return <Onboarding onComplete={() => {
      window.location.reload();
    }} defaultName={profile.name || undefined} />;
  }

  return <AppShell onSignOut={() => signOut({ callbackUrl: "/" })} />;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-cream flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-moss flex items-center justify-center mb-4 animate-pulse-soft">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" stroke="#F5EFE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#F5EFE0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="font-serif text-xl text-moss-deep">Tender Trimesters</div>
        <div className="text-xs text-muted-foreground mt-1">Loading your sanctuary...</div>
      </div>
    </div>
  );
}

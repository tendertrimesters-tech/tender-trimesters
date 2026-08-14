"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🌿</div>
        <h1 className="font-serif text-2xl text-moss-deep">Something went sideways</h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-md">
          Don&rsquo;t worry, mama &mdash; this isn&rsquo;t on you. Our team has
          been notified. Try refreshing?
        </p>
        <button
          onClick={reset}
          className="inline-block mt-6 bg-moss text-cream px-6 py-2.5 rounded-full text-sm hover:bg-moss-deep transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

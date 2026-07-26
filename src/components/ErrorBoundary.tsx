"use client";

import React from "react";

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-cream flex items-center justify-center p-6">
          <div className="max-w-md bg-card border-2 border-destructive/30 rounded-3xl p-6 shadow-soft">
            <div className="font-serif text-2xl text-moss-deep mb-2">Something went wrong</div>
            <pre className="text-xs bg-muted/40 rounded-xl p-3 overflow-auto max-h-48 text-destructive whitespace-pre-wrap">
              {this.state.error?.message || "Unknown error"}
              {this.state.error?.stack ? "\n\n" + this.state.error.stack : ""}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-moss text-cream rounded-full px-5 py-2 text-sm"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

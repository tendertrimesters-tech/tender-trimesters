"use client";

import { useEffect, useRef } from "react";

/**
 * AmbientBackground — slow, organic, transparent floating shapes
 * that give the app a living, breathing feel.
 *
 * Uses CSS animations for zero JS overhead.
 * Shapes are large gradient blobs at very low opacity,
 * drifting slowly like underwater currents or clouds.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        fixed inset-0 pointer-events-none overflow-hidden -z-10
        [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_80%)]
      "
    >
      {/* Warm golden glow — top right */}
      <div className="ambient-blob blob-1" />
      {/* Rose pink wash — bottom left */}
      <div className="ambient-blob blob-2" />
      {/* Sage green breath — center left */}
      <div className="ambient-blob blob-3" />
      {/* Lavender whisper — top left */}
      <div className="ambient-blob blob-4" />
    </div>
  );
}

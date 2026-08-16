"use client";

/**
 * AmbientBackground — slow, transparent watercolor washes
 * with subtle botanical silhouettes drifting gently.
 *
 * Uses pure CSS animations for zero JS overhead.
 * The blobs are layered watercolor-like gradients at visible opacity,
 * creating a living, breathing background that feels organic.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        fixed inset-0 pointer-events-none overflow-hidden -z-10
        [mask-image:radial-gradient(ellipse_85%_85%_at_50%_50%,black_80%,transparent_100%)]
      "
    >
      {/* Primary watercolor washes */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />
      <div className="ambient-blob blob-4" />

      {/* Deep background layer — very slow, adds warmth and depth */}
      <div className="ambient-blob blob-5" />
      <div className="ambient-blob blob-6" />

      {/* Botanical silhouettes — gentle leaf/vine shapes */}
      <div className="botanical-shape botanical-1">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 180C100 180 40 140 40 90C40 50 70 20 100 20C130 20 160 50 160 90C160 140 100 180 100 180Z" fill="currentColor" className="text-moss-deep" />
          <path d="M100 180V20" stroke="currentColor" strokeWidth="1" className="text-moss-deep/50" />
          <path d="M100 80L60 50" stroke="currentColor" strokeWidth="0.8" className="text-moss-deep/30" />
          <path d="M100 60L140 35" stroke="currentColor" strokeWidth="0.8" className="text-moss-deep/30" />
          <path d="M100 110L55 85" stroke="currentColor" strokeWidth="0.8" className="text-moss-deep/30" />
          <path d="M100 100L145 75" stroke="currentColor" strokeWidth="0.8" className="text-moss-deep/30" />
        </svg>
      </div>

      <div className="botanical-shape botanical-2">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 150C80 150 20 110 20 65C20 30 45 10 80 10C115 10 140 30 140 65C140 110 80 150 80 150Z" fill="currentColor" className="text-rose-gold" />
          <path d="M80 150V10" stroke="currentColor" strokeWidth="1" className="text-rose-gold/40" />
          <path d="M80 60L40 30" stroke="currentColor" strokeWidth="0.7" className="text-rose-gold/25" />
          <path d="M80 45L120 20" stroke="currentColor" strokeWidth="0.7" className="text-rose-gold/25" />
          <path d="M80 95L35 70" stroke="currentColor" strokeWidth="0.7" className="text-rose-gold/25" />
        </svg>
      </div>

      <div className="botanical-shape botanical-3">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Small wildflower */}
          <circle cx="60" cy="40" r="12" fill="currentColor" className="text-lavender" />
          <circle cx="45" cy="55" r="10" fill="currentColor" className="text-blush" />
          <circle cx="75" cy="55" r="10" fill="currentColor" className="text-blush" />
          <circle cx="48" cy="70" r="9" fill="currentColor" className="text-lavender" />
          <circle cx="72" cy="70" r="9" fill="currentColor" className="text-lavender" />
          <circle cx="60" cy="58" r="6" fill="currentColor" className="text-butter" />
          <path d="M60 75V115" stroke="currentColor" strokeWidth="1.5" className="text-moss" />
          <path d="M60 90C55 85 45 88 42 95" stroke="currentColor" strokeWidth="1" className="text-moss/60" fill="none" />
        </svg>
      </div>
    </div>
  );
}

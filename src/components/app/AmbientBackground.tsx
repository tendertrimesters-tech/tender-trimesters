"use client";

/**
 * AmbientBackground — lush watercolor washes with bold botanical shapes
 * that float and drift. No masks, no blur on botanicals — they're meant to be seen.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
    >
      {/* Primary watercolor washes */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />
      <div className="ambient-blob blob-4" />

      {/* Deep background layer */}
      <div className="ambient-blob blob-5" />
      <div className="ambient-blob blob-6" />

      {/* ── Botanical 1: Large flowing leaf (bottom-right) ── */}
      <div className="botanical-shape botanical-1">
        <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main leaf body */}
          <path d="M160 290C160 290 50 230 50 140C50 70 95 20 160 20C225 20 270 70 270 140C270 230 160 290 160 290Z" fill="#6B8F5B" fillOpacity="0.35" />
          {/* Center vein */}
          <path d="M160 290V20" stroke="#6B8F5B" strokeWidth="2" strokeOpacity="0.5" />
          {/* Side veins */}
          <path d="M160 100L90 55" stroke="#6B8F5B" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 75L220 35" stroke="#6B8F5B" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 140L80 105" stroke="#6B8F5B" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 120L240 85" stroke="#6B8F5B" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 180L95 155" stroke="#6B8F5B" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M160 165L230 140" stroke="#6B8F5B" strokeWidth="1" strokeOpacity="0.2" />
          {/* Soft highlight */}
          <path d="M160 40C130 60 100 100 95 150C90 200 130 260 160 280" stroke="#98CC94" strokeWidth="1.5" strokeOpacity="0.2" fill="none" />
        </svg>
      </div>

      {/* ── Botanical 2: Rose-gold leaf (top-left) ── */}
      <div className="botanical-shape botanical-2">
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M130 240C130 240 30 180 30 100C30 40 70 10 130 10C190 10 230 40 230 100C230 180 130 240 130 240Z" fill="#BE5068" fillOpacity="0.25" />
          <path d="M130 240V10" stroke="#BE5068" strokeWidth="1.5" strokeOpacity="0.4" />
          <path d="M130 80L65 40" stroke="#BE5068" strokeWidth="1" strokeOpacity="0.25" />
          <path d="M130 55L190 25" stroke="#BE5068" strokeWidth="1" strokeOpacity="0.25" />
          <path d="M130 120L60 85" stroke="#BE5068" strokeWidth="1" strokeOpacity="0.2" />
          <path d="M130 100L200 70" stroke="#BE5068" strokeWidth="1" strokeOpacity="0.2" />
          {/* Inner glow */}
          <path d="M130 30C100 55 75 90 72 135C69 180 105 225 130 240" stroke="#F0A0AC" strokeWidth="1.2" strokeOpacity="0.2" fill="none" />
        </svg>
      </div>

      {/* ── Botanical 3: Wildflower (right side) ── */}
      <div className="botanical-shape botanical-3">
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Petals */}
          <ellipse cx="90" cy="55" rx="16" ry="22" fill="#BE90DC" fillOpacity="0.4" transform="rotate(-15 90 55)" />
          <ellipse cx="65" cy="75" rx="14" ry="20" fill="#F0A0AC" fillOpacity="0.35" transform="rotate(25 65 75)" />
          <ellipse cx="115" cy="75" rx="14" ry="20" fill="#F0A0AC" fillOpacity="0.35" transform="rotate(-25 115 75)" />
          <ellipse cx="72" cy="100" rx="13" ry="18" fill="#BE90DC" fillOpacity="0.3" transform="rotate(15 72 100)" />
          <ellipse cx="108" cy="100" rx="13" ry="18" fill="#BE90DC" fillOpacity="0.3" transform="rotate(-15 108 100)" />
          {/* Center */}
          <circle cx="90" cy="82" r="10" fill="#FFE2B0" fillOpacity="0.5" />
          <circle cx="90" cy="82" r="5" fill="#CA5C36" fillOpacity="0.3" />
          {/* Stem */}
          <path d="M90 105C88 130 85 155 88 175" stroke="#6B8F5B" strokeWidth="2" strokeOpacity="0.35" fill="none" />
          {/* Small leaf on stem */}
          <path d="M88 140C75 132 65 135 60 142C65 138 75 135 88 140Z" fill="#6B8F5B" fillOpacity="0.25" />
        </svg>
      </div>

      {/* ── Botanical 4: Lavender sprig (bottom-left) ── */}
      <div className="botanical-shape botanical-4">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main stem */}
          <path d="M100 190C100 190 95 120 100 60C105 20 100 10 100 10" stroke="#6B8F5B" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
          {/* Lavender buds */}
          <ellipse cx="100" cy="30" rx="8" ry="5" fill="#BE90DC" fillOpacity="0.4" />
          <ellipse cx="94" cy="42" rx="7" ry="4.5" fill="#BE90DC" fillOpacity="0.35" transform="rotate(-10 94 42)" />
          <ellipse cx="106" cy="42" rx="7" ry="4.5" fill="#BE90DC" fillOpacity="0.35" transform="rotate(10 106 42)" />
          <ellipse cx="93" cy="55" rx="6.5" ry="4" fill="#BE90DC" fillOpacity="0.3" transform="rotate(-12 93 55)" />
          <ellipse cx="107" cy="55" rx="6.5" ry="4" fill="#BE90DC" fillOpacity="0.3" transform="rotate(12 107 55)" />
          <ellipse cx="95" cy="67" rx="6" ry="3.5" fill="#BE90DC" fillOpacity="0.25" transform="rotate(-8 95 67)" />
          <ellipse cx="105" cy="67" rx="6" ry="3.5" fill="#BE90DC" fillOpacity="0.25" transform="rotate(8 105 67)" />
          {/* Small leaves */}
          <path d="M98 80C85 72 78 78 80 88C84 82 90 80 98 80Z" fill="#6B8F5B" fillOpacity="0.2" />
          <path d="M102 95C115 87 122 93 120 103C116 97 110 95 102 95Z" fill="#6B8F5B" fillOpacity="0.2" />
        </svg>
      </div>

      {/* ── Botanical 5: Small butter/gold circle burst (top-right) ── */}
      <div className="botanical-shape botanical-5">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Radiating petals */}
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.4" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.35" transform="rotate(45 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.35" transform="rotate(90 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.35" transform="rotate(135 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.3" transform="rotate(180 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.3" transform="rotate(225 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.3" transform="rotate(270 75 75)" />
          <ellipse cx="75" cy="35" rx="8" ry="18" fill="#FFE2B0" fillOpacity="0.3" transform="rotate(315 75 75)" />
          {/* Center */}
          <circle cx="75" cy="75" r="10" fill="#F0A0AC" fillOpacity="0.3" />
          <circle cx="75" cy="75" r="5" fill="#CA5C36" fillOpacity="0.2" />
        </svg>
      </div>
    </div>
  );
}

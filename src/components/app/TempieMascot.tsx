"use client";

/**
 * TempieMascot — the soul of Tender Trimesters
 *
 * Combines three elements (per user spec D):
 *   1. Watercolor botanical character (glowing sprout + small moon)
 *   2. Glowing ember presence behind (pulses when "thinking")
 *   3. Letter-style script signature for messages
 *
 * Sizes: sm (32px) | md (48px) | lg (72px) | xl (120px)
 * States: idle | listening | thinking | sleeping
 */

type MascotSize = "sm" | "md" | "lg" | "xl";
type MascotState = "idle" | "listening" | "thinking" | "sleeping";

const SIZE_MAP: Record<MascotSize, { box: number; sprout: number; moon: number; glow: number }> = {
  sm: { box: 32, sprout: 24, moon: 8, glow: 48 },
  md: { box: 48, sprout: 36, moon: 12, glow: 72 },
  lg: { box: 72, sprout: 54, moon: 18, glow: 108 },
  xl: { box: 120, sprout: 90, moon: 30, glow: 180 },
};

interface Props {
  size?: MascotSize;
  state?: MascotState;
  className?: string;
  showGlow?: boolean;
}

export default function TempieMascot({
  size = "md",
  state = "idle",
  className = "",
  showGlow = true,
}: Props) {
  const dims = SIZE_MAP[size];
  const isThinking = state === "thinking";
  const isSleeping = state === "sleeping";
  const isListening = state === "listening";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: dims.box, height: dims.box }}
    >
      {/* ── Layer 1: Glowing ember presence ──
          Always softly present, intensifies when thinking */}
      {showGlow && (
        <div
          className={`absolute inset-0 rounded-full ${
            isThinking ? "animate-glow" : ""
          }`}
          style={{
            width: dims.glow,
            height: dims.glow,
            left: `-${(dims.glow - dims.box) / 2}px`,
            top: `-${(dims.glow - dims.box) / 2}px`,
            background: isSleeping
              ? "radial-gradient(circle, #FFD98C 0%, transparent 70%)"
              : isThinking
              ? "radial-gradient(circle, #E89098 0%, #FFD98C 40%, transparent 70%)"
              : "radial-gradient(circle, #FFD98C 0%, transparent 70%)",
            opacity: isThinking ? 0.85 : isSleeping ? 0.4 : 0.55,
            filter: "blur(12px)",
          }}
        />
      )}

      {/* ── Layer 2: Small moon (top-right of sprout) ── */}
      <div
        className="absolute animate-breathe-slow"
        style={{
          width: dims.moon,
          height: dims.moon,
          top: 0,
          right: 0,
        }}
      >
        <svg viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Moon crescent — butter cream */}
          <path
            d="M22 15C22 18.866 18.866 22 15 22C11.134 22 8 18.866 8 15C8 11.134 11.134 8 15 8C16.5 8 17.5 8.5 18 9C15 9 13 11.5 13 15C13 18 15 21 18 21C19.5 21 21 20 22 19C22 17.5 22 16 22 15Z"
            fill="#FFD98C"
            fillOpacity="0.85"
          />
          {/* Tiny moon glow */}
          <circle cx="15" cy="15" r="14" fill="#FFD98C" fillOpacity="0.15" />
        </svg>
      </div>

      {/* ── Layer 3: Watercolor sprout (the main character) ── */}
      <div
        className={`relative ${isListening || isThinking ? "animate-breathe" : "animate-breathe-slow"}`}
        style={{ width: dims.sprout, height: dims.sprout }}
      >
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow halo behind sprout */}
          <circle cx="45" cy="50" r="40" fill="#FFD98C" fillOpacity="0.15" />
          <circle cx="45" cy="50" r="28" fill="#FFD98C" fillOpacity="0.2" />

          {/* Stem — deep moss */}
          <path
            d="M45 80C45 80 43 65 44 50C45 35 47 25 45 15"
            stroke="#2D3F23"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Two leaves (left + right) — watercolor style */}
          {/* Left leaf */}
          <path
            d="M44 55C30 52 22 45 22 38C22 32 28 30 36 36C42 40 44 47 44 55Z"
            fill="#5A7A48"
            fillOpacity="0.55"
          />
          <path
            d="M44 55C30 52 22 45 22 38C22 32 28 30 36 36C42 40 44 47 44 55Z"
            stroke="#2D3F23"
            strokeWidth="1"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Left leaf vein */}
          <path
            d="M40 48C36 44 32 42 28 40"
            stroke="#2D3F23"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Right leaf */}
          <path
            d="M46 50C58 48 65 42 65 36C65 30 60 28 53 32C48 35 46 42 46 50Z"
            fill="#7CB374"
            fillOpacity="0.55"
          />
          <path
            d="M46 50C58 48 65 42 65 36C65 30 60 28 53 32C48 35 46 42 46 50Z"
            stroke="#2D3F23"
            strokeWidth="1"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Right leaf vein */}
          <path
            d="M50 44C54 41 58 39 62 38"
            stroke="#2D3F23"
            strokeWidth="0.8"
            strokeOpacity="0.4"
          />

          {/* Top bud — small blush bloom (the "head" of the sprout) */}
          <circle cx="45" cy="15" r="8" fill="#E89098" fillOpacity="0.6" />
          <circle cx="45" cy="15" r="6" fill="#A8455D" fillOpacity="0.5" />
          <circle cx="44" cy="13" r="2.5" fill="#FFD98C" fillOpacity="0.8" />

          {/* Petals around bud */}
          <ellipse cx="45" cy="8" rx="4" ry="6" fill="#E89098" fillOpacity="0.5" />
          <ellipse cx="38" cy="13" rx="4" ry="5" fill="#E89098" fillOpacity="0.45" transform="rotate(-30 38 13)" />
          <ellipse cx="52" cy="13" rx="4" ry="5" fill="#E89098" fillOpacity="0.45" transform="rotate(30 52 13)" />

          {/* Soil base — dark warm anchor */}
          <ellipse cx="45" cy="80" rx="14" ry="3" fill="#2D3F23" fillOpacity="0.4" />
        </svg>
      </div>

      {/* ── Layer 4: State indicator dots ── */}
      {isThinking && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          <span
            className="w-1 h-1 rounded-full bg-rose-gold animate-breathe"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1 h-1 rounded-full bg-rose-gold animate-breathe"
            style={{ animationDelay: "200ms" }}
          />
          <span
            className="w-1 h-1 rounded-full bg-rose-gold animate-breathe"
            style={{ animationDelay: "400ms" }}
          />
        </div>
      )}

      {/* Sleeping "Z" indicator */}
      {isSleeping && (
        <div className="absolute -top-2 -right-2 text-xs font-serif text-butter opacity-70">
          z
        </div>
      )}
    </div>
  );
}

/**
 * TempieSignature — hand-drawn script signature for letter-style messages.
 * Use at the end of Tempie's responses.
 */
export function TempieSignature({ className = "" }: { className?: string }) {
  return (
    <div className={`font-script text-rose-gold text-2xl mt-3 ${className}`}>
      <svg
        viewBox="0 0 180 50"
        className="inline-block"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: "1em", width: "auto" }}
      >
        <path
          d="M5 35C5 35 15 15 25 20C35 25 25 40 35 35C45 30 50 15 60 20C70 25 65 35 75 32C85 29 90 18 95 22C100 26 95 35 105 33C115 31 120 20 125 24C130 28 128 36 138 34C148 32 155 22 162 28C168 32 170 38 175 35"
          stroke="#A8455D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Dot under signature */}
        <circle cx="178" cy="38" r="1.5" fill="#A8455D" />
      </svg>
    </div>
  );
}

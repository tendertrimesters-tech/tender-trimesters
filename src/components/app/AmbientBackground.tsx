"use client";

/**
 * AmbientBackground v2 — Warm Modernist
 *
 * Design philosophy:
 * - Deep moss anchors at the corners (not just floating pastels)
 * - Layered botanicals that compose with type, not just decorate
 * - One bold full-bleed moment per screen (botanical that anchors the eye)
 * - Soft breathing motion on every layer
 */

type Variant = "default" | "dawn" | "3am" | "editorial";

export default function AmbientBackground({ variant = "default" }: { variant?: Variant }) {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* ── Layer 1: Deep moss anchors (the dark spine of the page) ── */}
      <div
        className="absolute top-0 left-0 w-[40vw] h-[60vh] opacity-30 animate-drift-slow"
        style={{
          background: "radial-gradient(ellipse at top left, #2D3F23 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[50vw] h-[50vh] opacity-25 animate-drift"
        style={{
          background: "radial-gradient(ellipse at bottom right, #2D3F23 0%, transparent 65%)",
        }}
      />

      {/* ── Layer 2: Watercolor washes (warmer, more saturated) ── */}
      <div
        className="absolute top-[10%] right-[5%] w-[35vw] h-[35vw] opacity-40 animate-drift"
        style={{
          background: "radial-gradient(circle, #E89098 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute bottom-[15%] left-[10%] w-[40vw] h-[40vw] opacity-35 animate-drift-slow"
        style={{
          background: "radial-gradient(circle, #FFD98C 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] opacity-25 animate-drift"
        style={{
          background: "radial-gradient(circle, #7CB374 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Variant: dawn — warmer, more golden */}
      {variant === "dawn" && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(165deg, transparent 0%, #FFD98C 30%, #E89098 60%, transparent 100%)",
            filter: "blur(40px)",
          }}
        />
      )}

      {/* Variant: 3am — deep moss sanctuary */}
      {variant === "3am" && (
        <>
          <div className="absolute inset-0 bg-gradient-moss-deep opacity-90" />
          <div
            className="absolute top-1/4 left-1/3 w-[40vw] h-[40vw] opacity-30 animate-glow"
            style={{
              background: "radial-gradient(circle, #FFD98C 0%, transparent 70%)",
              filter: "blur(100px)",
            }}
          />
        </>
      )}

      {/* Variant: editorial — even bolder, for hero sections */}
      {variant === "editorial" && (
        <div
          className="absolute top-0 right-0 w-[60vw] h-[80vh] opacity-20"
          style={{
            background:
              "linear-gradient(225deg, #B85A38 0%, #A8455D 30%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      )}

      {/* ── Layer 3: Botanical silhouettes (drift gently, compose with type) ── */}

      {/* Botanical 1: Large flowing moss leaf (bottom-right, prominent) */}
      <div className="botanical-shape botanical-1 absolute bottom-[-8%] right-[-5%] w-[420px] h-[420px] animate-drift-slow">
        <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main leaf body — deeper moss */}
          <path
            d="M160 290C160 290 50 230 50 140C50 70 95 20 160 20C225 20 270 70 270 140C270 230 160 290 160 290Z"
            fill="#5A7A48"
            fillOpacity="0.4"
          />
          {/* Highlight — sage */}
          <path
            d="M160 280C160 280 70 220 70 145C70 80 105 40 160 40"
            fill="#7CB374"
            fillOpacity="0.3"
          />
          {/* Center vein */}
          <path d="M160 290V20" stroke="#2D3F23" strokeWidth="2" strokeOpacity="0.6" />
          {/* Side veins */}
          <path d="M160 100L90 55" stroke="#2D3F23" strokeWidth="1.2" strokeOpacity="0.4" />
          <path d="M160 75L220 35" stroke="#2D3F23" strokeWidth="1.2" strokeOpacity="0.4" />
          <path d="M160 140L80 105" stroke="#2D3F23" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 120L240 85" stroke="#2D3F23" strokeWidth="1.2" strokeOpacity="0.3" />
          <path d="M160 180L95 155" stroke="#2D3F23" strokeWidth="1" strokeOpacity="0.25" />
          <path d="M160 165L230 140" stroke="#2D3F23" strokeWidth="1" strokeOpacity="0.25" />
          {/* Soft inner highlight */}
          <path
            d="M160 40C130 60 100 100 95 150C90 200 130 260 160 280"
            stroke="#FFD98C"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            fill="none"
          />
        </svg>
      </div>

      {/* Botanical 2: Terracotta rose-gold leaf (top-left, smaller) */}
      <div className="botanical-shape botanical-2 absolute top-[-5%] left-[-3%] w-[260px] h-[260px] animate-drift">
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M130 240C130 240 30 180 30 100C30 40 70 10 130 10C190 10 230 40 230 100C230 180 130 240 130 240Z"
            fill="#A8455D"
            fillOpacity="0.3"
          />
          <path
            d="M130 240V10"
            stroke="#722F37"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <path d="M130 80L65 40" stroke="#722F37" strokeWidth="1" strokeOpacity="0.35" />
          <path d="M130 55L190 25" stroke="#722F37" strokeWidth="1" strokeOpacity="0.35" />
          <path d="M130 120L60 85" stroke="#722F37" strokeWidth="1" strokeOpacity="0.3" />
          <path d="M130 100L200 70" stroke="#722F37" strokeWidth="1" strokeOpacity="0.3" />
          {/* Inner glow — butter cream */}
          <path
            d="M130 30C100 55 75 90 72 135C69 180 105 225 130 240"
            stroke="#FFD98C"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            fill="none"
          />
        </svg>
      </div>

      {/* Botanical 3: Wildflower sprig (right side, mid-height) */}
      <div className="botanical-shape botanical-3 absolute top-[35%] right-[2%] w-[180px] h-[180px] animate-drift-slow">
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Petals — lavender + blush */}
          <ellipse cx="90" cy="55" rx="16" ry="22" fill="#9F7BC4" fillOpacity="0.45" transform="rotate(-15 90 55)" />
          <ellipse cx="65" cy="75" rx="14" ry="20" fill="#E89098" fillOpacity="0.4" transform="rotate(25 65 75)" />
          <ellipse cx="115" cy="75" rx="14" ry="20" fill="#E89098" fillOpacity="0.4" transform="rotate(-25 115 75)" />
          <ellipse cx="72" cy="100" rx="13" ry="18" fill="#9F7BC4" fillOpacity="0.35" transform="rotate(15 72 100)" />
          <ellipse cx="108" cy="100" rx="13" ry="18" fill="#9F7BC4" fillOpacity="0.35" transform="rotate(-15 108 100)" />
          {/* Center — butter */}
          <circle cx="90" cy="82" r="10" fill="#FFD98C" fillOpacity="0.6" />
          <circle cx="90" cy="82" r="5" fill="#B85A38" fillOpacity="0.4" />
          {/* Stem */}
          <path
            d="M90 105C88 130 85 155 88 175"
            stroke="#5A7A48"
            strokeWidth="2"
            strokeOpacity="0.5"
            fill="none"
          />
          {/* Small leaf on stem */}
          <path
            d="M88 140C75 132 65 135 60 142C65 138 75 135 88 140Z"
            fill="#5A7A48"
            fillOpacity="0.35"
          />
        </svg>
      </div>

      {/* Botanical 4: Lavender sprig (bottom-left, vertical) */}
      <div className="botanical-shape botanical-4 absolute bottom-[5%] left-[2%] w-[200px] h-[200px] animate-drift">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main stem */}
          <path
            d="M100 190C100 190 95 120 100 60C105 20 100 10 100 10"
            stroke="#5A7A48"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
          />
          {/* Lavender buds — clustered at top */}
          <ellipse cx="100" cy="25" rx="6" ry="10" fill="#9F7BC4" fillOpacity="0.5" />
          <ellipse cx="92" cy="35" rx="5" ry="9" fill="#9F7BC4" fillOpacity="0.45" />
          <ellipse cx="108" cy="35" rx="5" ry="9" fill="#9F7BC4" fillOpacity="0.45" />
          <ellipse cx="95" cy="48" rx="5" ry="8" fill="#9F7BC4" fillOpacity="0.4" />
          <ellipse cx="105" cy="48" rx="5" ry="8" fill="#9F7BC4" fillOpacity="0.4" />
          <ellipse cx="100" cy="60" rx="4" ry="7" fill="#9F7BC4" fillOpacity="0.35" />
          {/* Two small leaves on stem */}
          <path
            d="M100 110C85 105 75 110 70 118C78 112 88 110 100 115Z"
            fill="#5A7A48"
            fillOpacity="0.35"
          />
          <path
            d="M100 140C115 135 125 140 130 148C122 142 112 140 100 145Z"
            fill="#5A7A48"
            fillOpacity="0.3"
          />
        </svg>
      </div>

      {/* Botanical 5: Small fern frond (top-right corner) */}
      <div className="botanical-shape botanical-5 absolute top-[2%] right-[8%] w-[140px] h-[140px] animate-drift-slow">
        <svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M70 130C70 130 65 90 70 50"
            stroke="#5A7A48"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            fill="none"
          />
          {/* Fronds on alternating sides */}
          {[60, 70, 80, 90, 100, 110].map((y, i) => (
            <g key={i}>
              <path
                d={`M70 ${y} Q${50 - i * 2} ${y - 5} ${45 - i * 3} ${y - 12}`}
                stroke="#5A7A48"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                fill="none"
              />
              <path
                d={`M70 ${y + 5} Q${90 + i * 2} ${y} ${95 + i * 3} ${y - 7}`}
                stroke="#5A7A48"
                strokeWidth="1.2"
                strokeOpacity="0.4"
                fill="none"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* ── Layer 4: Subtle paper grain over everything ── */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.2 0 0 0 0.06 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

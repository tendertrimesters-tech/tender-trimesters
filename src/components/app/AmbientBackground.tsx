"use client";

// Delicate champagne-gold sparkle border along viewport edges.
// Above page section backgrounds (z-index: 1), below interactive content
// (positioned only at edges — doesn't visually overlap text/buttons).
// Respects prefers-reduced-motion via the .animate-twinkle class
// (already disabled in globals.css @media reduced-motion rule).

const CHAMPAGNE = "#D4B47C"; // warm soft champagne gold, complements brand

// Sparkles along the LEFT edge of viewport
const LEFT_EDGE = [
  { top: "4%",  size: 6, delay: "0s",   dur: "4s"   },
  { top: "11%", size: 4, delay: "1.2s", dur: "4.5s" },
  { top: "18%", size: 8, delay: "2.1s", dur: "3.5s" },
  { top: "26%", size: 5, delay: "0.6s", dur: "4.2s" },
  { top: "33%", size: 7, delay: "1.8s", dur: "3.8s" },
  { top: "41%", size: 4, delay: "0.3s", dur: "4.4s" },
  { top: "48%", size: 9, delay: "2.5s", dur: "3.6s" },
  { top: "55%", size: 5, delay: "1.5s", dur: "4.1s" },
  { top: "63%", size: 6, delay: "0.9s", dur: "3.9s" },
  { top: "71%", size: 8, delay: "2.2s", dur: "3.5s" },
  { top: "79%", size: 4, delay: "1.6s", dur: "4.3s" },
  { top: "87%", size: 7, delay: "0.4s", dur: "3.8s" },
  { top: "94%", size: 5, delay: "2.8s", dur: "4s"   },
];

// Sparkles along the RIGHT edge (offset pattern for natural asymmetry)
const RIGHT_EDGE = [
  { top: "7%",  size: 5, delay: "0.5s", dur: "4.1s" },
  { top: "14%", size: 7, delay: "1.8s", dur: "3.7s" },
  { top: "22%", size: 4, delay: "2.3s", dur: "4.3s" },
  { top: "30%", size: 8, delay: "0.2s", dur: "3.9s" },
  { top: "37%", size: 6, delay: "1.4s", dur: "4s"   },
  { top: "45%", size: 5, delay: "2.6s", dur: "3.6s" },
  { top: "52%", size: 9, delay: "0.8s", dur: "3.8s" },
  { top: "59%", size: 4, delay: "1.9s", dur: "4.4s" },
  { top: "67%", size: 7, delay: "2.4s", dur: "3.7s" },
  { top: "75%", size: 5, delay: "0.7s", dur: "4.2s" },
  { top: "83%", size: 6, delay: "1.3s", dur: "4s"   },
  { top: "91%", size: 8, delay: "2.7s", dur: "3.5s" },
];

// A few sparkles along the TOP edge
const TOP_EDGE = [
  { left: "12%", size: 4, delay: "0.3s", dur: "4s"   },
  { left: "28%", size: 6, delay: "1.5s", dur: "3.7s" },
  { left: "47%", size: 5, delay: "2.2s", dur: "4.2s" },
  { left: "68%", size: 7, delay: "0.9s", dur: "3.6s" },
  { left: "84%", size: 4, delay: "1.8s", dur: "4.1s" },
];

// A few sparkles along the BOTTOM edge
const BOTTOM_EDGE = [
  { left: "18%", size: 5, delay: "0.6s", dur: "3.9s" },
  { left: "38%", size: 7, delay: "2.1s", dur: "3.5s" },
  { left: "55%", size: 4, delay: "1.4s", dur: "4.3s" },
  { left: "76%", size: 6, delay: "2.5s", dur: "3.8s" },
];

function Sparkle({
  position,
  size,
  delay,
  dur,
}: {
  position: React.CSSProperties;
  size: number;
  delay: string;
  dur: string;
}) {
  return (
    <svg
      className="animate-twinkle"
      style={{
        ...position,
        position: "absolute",
        width: size,
        height: size,
        animationDelay: delay,
        animationDuration: dur,
        filter: "drop-shadow(0 0 3px rgba(212, 180, 124, 0.55))",
      }}
      viewBox="0 0 12 12"
    >
      <path d="M6 0l1.3 4.7L12 6 7.3 7.3 6 12 4.7 7.3 0 6l4.7-1.3z" fill={CHAMPAGNE} />
    </svg>
  );
}

export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {/* Left edge — sparkles at 4-22px from left */}
      {LEFT_EDGE.map((p, i) => (
        <Sparkle
          key={`l${i}`}
          position={{ top: p.top, left: `${4 + (i % 3) * 6}px` }}
          size={p.size}
          delay={p.delay}
          dur={p.dur}
        />
      ))}
      {/* Right edge — sparkles at 4-22px from right */}
      {RIGHT_EDGE.map((p, i) => (
        <Sparkle
          key={`r${i}`}
          position={{ top: p.top, right: `${4 + (i % 3) * 6}px` }}
          size={p.size}
          delay={p.delay}
          dur={p.dur}
        />
      ))}
      {/* Top edge — sparkles at 4-16px from top */}
      {TOP_EDGE.map((p, i) => (
        <Sparkle
          key={`t${i}`}
          position={{ left: p.left, top: `${4 + (i % 2) * 6}px` }}
          size={p.size}
          delay={p.delay}
          dur={p.dur}
        />
      ))}
      {/* Bottom edge — sparkles at 4-16px from bottom */}
      {BOTTOM_EDGE.map((p, i) => (
        <Sparkle
          key={`b${i}`}
          position={{ left: p.left, bottom: `${4 + (i % 2) * 6}px` }}
          size={p.size}
          delay={p.delay}
          dur={p.dur}
        />
      ))}
    </div>
  );
}

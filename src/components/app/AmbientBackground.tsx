"use client";

const SPARKLES = [
  { top: "10%", left: "8%", size: 12, delay: "0s" },
  { top: "20%", left: "45%", size: 9, delay: "1.5s" },
  { top: "40%", left: "75%", size: 11, delay: "0.8s" },
  { top: "60%", left: "12%", size: 8, delay: "2.2s" },
  { top: "75%", left: "60%", size: 10, delay: "1.1s" },
  { top: "85%", left: "30%", size: 9, delay: "0.4s" },
];

export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Very subtle sage wash at edges — barely visible */}
      <div className="absolute top-0 left-0 w-[40vw] h-[50vh] opacity-[0.07]" style={{ background: "radial-gradient(ellipse at top left, #8FA691, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[40vh] opacity-[0.06]" style={{ background: "radial-gradient(ellipse at bottom right, #C9827C, transparent 70%)" }} />
      {/* Subtle breathing glow */}
      <div className="absolute rounded-full animate-breathe" style={{ width: 280, height: 280, top: "15%", right: "12%", background: "radial-gradient(circle, rgba(198,161,91,0.08), transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute rounded-full animate-breathe" style={{ width: 220, height: 220, bottom: "18%", left: "10%", background: "radial-gradient(circle, rgba(143,166,145,0.1), transparent 70%)", filter: "blur(45px)", animationDelay: "3s" }} />
      {/* Gold sparkles — only 6, delicate */}
      {SPARKLES.map((p, i) => (
        <svg key={i} className="absolute animate-twinkle" style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }} viewBox="0 0 12 12">
          <path d="M6 0l1.3 4.7L12 6 7.3 7.3 6 12 4.7 7.3 0 6l4.7-1.3z" fill="#C6A15B" />
        </svg>
      ))}
    </div>
  );
}

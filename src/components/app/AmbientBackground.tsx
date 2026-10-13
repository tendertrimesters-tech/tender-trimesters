"use client";

// 50 gold + 15 rose-pink sparkles, two large breathing glow blobs (sage + rose-pink),
// plus subtle radial color washes. Used as the page-wide ambient layer behind hero.

const GOLD_SPARKLES = [
  {top:"3%",left:"5%",size:14,delay:"0s",drift:true},
  {top:"6%",left:"18%",size:8,delay:"1.2s",drift:false},
  {top:"9%",left:"32%",size:6,delay:"2.5s",drift:true},
  {top:"12%",left:"48%",size:10,delay:"0.5s",drift:false},
  {top:"15%",left:"62%",size:7,delay:"1.8s",drift:true},
  {top:"18%",left:"78%",size:12,delay:"0.9s",drift:false},
  {top:"21%",left:"8%",size:5,delay:"3s",drift:true},
  {top:"24%",left:"25%",size:9,delay:"1.5s",drift:false},
  {top:"27%",left:"42%",size:6,delay:"0.3s",drift:true},
  {top:"30%",left:"58%",size:11,delay:"2s",drift:false},
  {top:"33%",left:"73%",size:8,delay:"0.7s",drift:true},
  {top:"36%",left:"88%",size:5,delay:"3.5s",drift:false},
  {top:"39%",left:"12%",size:13,delay:"1.1s",drift:true},
  {top:"42%",left:"28%",size:7,delay:"2.2s",drift:false},
  {top:"45%",left:"45%",size:9,delay:"0.4s",drift:true},
  {top:"48%",left:"60%",size:6,delay:"1.6s",drift:false},
  {top:"51%",left:"75%",size:10,delay:"2.8s",drift:true},
  {top:"54%",left:"92%",size:5,delay:"0.6s",drift:false},
  {top:"57%",left:"15%",size:8,delay:"1.9s",drift:true},
  {top:"60%",left:"32%",size:7,delay:"3.2s",drift:false},
  {top:"63%",left:"50%",size:11,delay:"0.2s",drift:true},
  {top:"66%",left:"68%",size:6,delay:"2.6s",drift:false},
  {top:"69%",left:"82%",size:9,delay:"1.3s",drift:true},
  {top:"72%",left:"10%",size:5,delay:"0.8s",drift:false},
  {top:"75%",left:"28%",size:8,delay:"2.1s",drift:true},
  {top:"78%",left:"46%",size:6,delay:"1.4s",drift:false},
  {top:"81%",left:"64%",size:10,delay:"2.7s",drift:true},
  {top:"84%",left:"80%",size:5,delay:"0.3s",drift:false},
  {top:"87%",left:"18%",size:7,delay:"1.7s",drift:true},
  {top:"90%",left:"38%",size:9,delay:"3.1s",drift:false},
  {top:"7%",left:"72%",size:6,delay:"1.0s",drift:true},
  {top:"11%",left:"55%",size:8,delay:"2.3s",drift:false},
  {top:"14%",left:"38%",size:5,delay:"0.4s",drift:true},
  {top:"17%",left:"22%",size:11,delay:"2.9s",drift:false},
  {top:"20%",left:"5%",size:7,delay:"1.4s",drift:true},
  {top:"23%",left:"88%",size:6,delay:"0.5s",drift:false},
  {top:"26%",left:"68%",size:10,delay:"2.4s",drift:true},
  {top:"29%",left:"50%",size:5,delay:"1.8s",drift:false},
  {top:"32%",left:"30%",size:8,delay:"3.3s",drift:true},
  {top:"35%",left:"15%",size:7,delay:"0.9s",drift:false},
  {top:"38%",left:"95%",size:9,delay:"2.0s",drift:true},
  {top:"41%",left:"80%",size:6,delay:"1.2s",drift:false},
  {top:"44%",left:"65%",size:11,delay:"0.6s",drift:true},
  {top:"47%",left:"48%",size:5,delay:"2.5s",drift:false},
  {top:"50%",left:"30%",size:8,delay:"1.5s",drift:true},
  {top:"53%",left:"13%",size:7,delay:"3.4s",drift:false},
  {top:"56%",left:"85%",size:10,delay:"0.7s",drift:true},
  {top:"59%",left:"70%",size:6,delay:"2.8s",drift:false},
  {top:"62%",left:"55%",size:5,delay:"1.1s",drift:true},
  {top:"65%",left:"40%",size:9,delay:"2.2s",drift:false},
];

const PINK_SPARKLES = [
  {top:"10%",left:"15%",size:7,delay:"0.5s",drift:true},
  {top:"22%",left:"40%",size:5,delay:"1.8s",drift:false},
  {top:"31%",left:"68%",size:8,delay:"2.4s",drift:true},
  {top:"44%",left:"22%",size:6,delay:"0.9s",drift:false},
  {top:"55%",left:"82%",size:9,delay:"1.3s",drift:true},
  {top:"68%",left:"38%",size:5,delay:"2.1s",drift:false},
  {top:"76%",left:"65%",size:7,delay:"0.4s",drift:true},
  {top:"83%",left:"12%",size:6,delay:"2.7s",drift:false},
  {top:"16%",left:"85%",size:8,delay:"1.6s",drift:true},
  {top:"28%",left:"58%",size:5,delay:"0.7s",drift:false},
  {top:"40%",left:"92%",size:7,delay:"2.0s",drift:true},
  {top:"52%",left:"25%",size:6,delay:"1.1s",drift:false},
  {top:"64%",left:"78%",size:9,delay:"2.9s",drift:true},
  {top:"73%",left:"50%",size:5,delay:"0.3s",drift:false},
  {top:"87%",left:"72%",size:7,delay:"1.4s",drift:true},
];

const Sparkle = ({ top, left, size, delay, drift, color }: { top: string; left: string; size: number; delay: string; drift: boolean; color: string }) => (
  <svg
    className={`absolute ${drift ? "animate-twinkle" : "animate-twinkle"}`}
    style={{ top, left, width: size, height: size, animationDelay: delay }}
    viewBox="0 0 12 12"
  >
    <path d="M6 0l1.3 4.7L12 6 7.3 7.3 6 12 4.7 7.3 0 6l4.7-1.3z" fill={color} />
  </svg>
);

export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Color washes — sage top-left, rose-pink bottom-right */}
      <div className="absolute top-0 left-0 w-[40vw] h-[50vh] opacity-[0.10]" style={{ background: "radial-gradient(ellipse at top left, #8FA691, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[40vh] opacity-[0.12]" style={{ background: "radial-gradient(ellipse at bottom right, #C9827C, transparent 70%)" }} />

      {/* Breathing glow blobs — larger and more visible */}
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          width: 400,
          height: 400,
          bottom: "12%",
          left: "5%",
          background: "radial-gradient(circle, rgba(74,93,83,0.20), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          width: 380,
          height: 380,
          top: "10%",
          right: "8%",
          background: "radial-gradient(circle, rgba(201,130,124,0.25), transparent 70%)",
          filter: "blur(55px)",
          animationDelay: "3s",
        }}
      />

      {/* 50 gold sparkles */}
      {GOLD_SPARKLES.map((p, i) => (
        <Sparkle key={`g${i}`} {...p} color="#C6A15B" />
      ))}

      {/* 15 rose-pink sparkles mixed in */}
      {PINK_SPARKLES.map((p, i) => (
        <Sparkle key={`p${i}`} {...p} color="#C9827C" />
      ))}
    </div>
  );
}

"use client";

const SPARKLES = [
  {top:"5%",left:"3%",size:14,delay:"0s",drift:true},
  {top:"8%",left:"22%",size:8,delay:"1.2s",drift:false},
  {top:"12%",left:"8%",size:6,delay:"2.5s",drift:true},
  {top:"15%",left:"35%",size:10,delay:"0.5s",drift:false},
  {top:"18%",left:"52%",size:7,delay:"1.8s",drift:true},
  {top:"22%",left:"68%",size:12,delay:"0.9s",drift:false},
  {top:"25%",left:"15%",size:5,delay:"3s",drift:true},
  {top:"28%",left:"88%",size:9,delay:"1.5s",drift:false},
  {top:"32%",left:"42%",size:6,delay:"0.3s",drift:true},
  {top:"35%",left:"5%",size:11,delay:"2s",drift:false},
  {top:"38%",left:"72%",size:8,delay:"0.7s",drift:true},
  {top:"42%",left:"28%",size:5,delay:"3.5s",drift:false},
  {top:"45%",left:"55%",size:13,delay:"1.1s",drift:true},
  {top:"48%",left:"82%",size:7,delay:"2.2s",drift:false},
  {top:"52%",left:"12%",size:9,delay:"0.4s",drift:true},
  {top:"55%",left:"38%",size:6,delay:"1.6s",drift:false},
  {top:"58%",left:"65%",size:10,delay:"2.8s",drift:true},
  {top:"62%",left:"92%",size:5,delay:"0.6s",drift:false},
  {top:"65%",left:"18%",size:8,delay:"1.9s",drift:true},
  {top:"68%",left:"48%",size:7,delay:"3.2s",drift:false},
  {top:"72%",left:"75%",size:11,delay:"0.2s",drift:true},
  {top:"75%",left:"8%",size:6,delay:"2.6s",drift:false},
  {top:"78%",left:"32%",size:9,delay:"1.3s",drift:true},
  {top:"82%",left:"58%",size:5,delay:"0.8s",drift:false},
  {top:"85%",left:"85%",size:8,delay:"2.1s",drift:true},
];

export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute top-0 left-0 w-[40vw] h-[50vh] opacity-[0.07]" style={{ background: "radial-gradient(ellipse at top left, #8FA691, transparent 70%)" }} />
      <div className="absolute bottom-0 right-0 w-[35vw] h-[40vh] opacity-[0.06]" style={{ background: "radial-gradient(ellipse at bottom right, #C9827C, transparent 70%)" }} />
      <div className="absolute rounded-full animate-breathe" style={{ width: 280, height: 280, top: "15%", right: "12%", background: "radial-gradient(circle, rgba(198,161,91,0.08), transparent 70%)", filter: "blur(40px)" }} />
      <div className="absolute rounded-full animate-breathe" style={{ width: 220, height: 220, bottom: "18%", left: "10%", background: "radial-gradient(circle, rgba(143,166,145,0.1), transparent 70%)", filter: "blur(45px)", animationDelay: "3s" }} />
      {SPARKLES.map((p, i) => (
        <svg key={i} className={`absolute ${p.drift ? "animate-twinkle" : "animate-twinkle"}`} style={{ top: p.top, left: p.left, width: p.size, height: p.size, animationDelay: p.delay }} viewBox="0 0 12 12">
          <path d="M6 0l1.3 4.7L12 6 7.3 7.3 6 12 4.7 7.3 0 6l4.7-1.3z" fill="#C6A15B" />
        </svg>
      ))}
    </div>
  );
}

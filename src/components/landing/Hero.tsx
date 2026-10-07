"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { buttonClass } from "@/components/ui";
import { AttioMark, CsvMark, HighLevelMark, HubSpotMark, ManualMark } from "./BrandLogos";

// The contact sources the product supports (Help page + Integrations page).
const SOURCES = [
  { label: "HubSpot", Mark: HubSpotMark },
  { label: "GoHighLevel", Mark: HighLevelMark },
  { label: "Attio", Mark: AttioMark },
  { label: "CSV imports", Mark: CsvMark },
  { label: "manual entry", Mark: ManualMark },
];

function RotatingSource() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIndex((current) => (current + 1) % SOURCES.length), 2400);
    return () => clearInterval(timer);
  }, []);
  const source = SOURCES[index];
  return <span className="relative inline-flex h-[1.3em] items-center overflow-hidden align-bottom" aria-live="polite">
    <span key={source.label} className="word-in inline-flex items-center gap-[0.28em] whitespace-nowrap">
      <span className="grid size-[1.05em] place-items-center rounded-[0.28em] border border-line bg-surface p-[0.16em] shadow-[var(--shadow-card)]"><source.Mark className="size-full" /></span>
      <span className="font-accent text-brand-ink">{source.label}</span>
    </span>
  </span>;
}

// Full-bleed hero: animated wave background, headline, CTAs and a dashboard
// preview that slides up on load and straightens as the page scrolls.
export function Hero({ preview }: { preview: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const progress = Math.min(1, Math.max(0, 1 - (rect.top - viewport * 0.15) / (viewport * 0.7)));
      element.style.setProperty("--p", progress.toFixed(3));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(frame); };
  }, []);

  return <section className="relative px-2 pt-[76px] sm:px-3" id="top">
    <div className="relative isolate overflow-hidden rounded-[28px] border border-line bg-linear-to-b from-brand-50 via-surface to-surface pb-[22vw] sm:rounded-[36px] lg:pb-[260px]">
      {/* Drifting color fields */}
      <span className="drift pointer-events-none absolute -left-[10%] top-[30%] -z-10 size-[520px] rounded-full bg-brand-500/25 blur-[100px]" aria-hidden="true" />
      <span className="drift pointer-events-none absolute -right-[8%] top-[10%] -z-10 size-[460px] rounded-full bg-[#7be0b6]/30 blur-[100px] [animation-delay:-6s]" aria-hidden="true" />
      <span className="drift pointer-events-none absolute bottom-[-10%] left-[35%] -z-10 size-[420px] rounded-full bg-purple/20 blur-[110px] [animation-delay:-11s]" aria-hidden="true" />
      {/* Flowing wave lines */}
      <svg className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full opacity-70" viewBox="0 0 1440 600" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="hero-wave" x1="0" x2="1">
            <stop offset="0" stopColor="var(--brand-500)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-500)" stopOpacity="0.35" />
            <stop offset="1" stopColor="var(--brand-500)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="wave-slide">
          {[0, 1, 2, 3, 4, 5].map((line) => <path key={line} d={`M0 ${300 + line * 34} C 360 ${170 + line * 40}, 720 ${470 + line * 18}, 1440 ${300 + line * 34} S 2520 ${170 + line * 40}, 2880 ${300 + line * 34}`} fill="none" stroke="url(#hero-wave)" strokeWidth={1.4} />)}
        </g>
      </svg>

      <div className="mx-auto max-w-4xl px-5 pt-16 text-center sm:pt-24">
        <p className="rise inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 px-3.5 py-1.5 text-[13px] font-semibold text-navy backdrop-blur">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-good opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-good" /></span>
          Contact verification workspace
        </p>
        <h1 className="rise mt-6 text-[42px] font-semibold leading-[1.02] tracking-[-0.045em] text-navy [animation-delay:80ms] sm:text-6xl lg:text-[76px]">
          Know Who To Call<br /><span className="text-brand-ink">Before You Call</span>
        </h1>
        <p className="rise mt-5 text-2xl font-medium tracking-tight text-navy [animation-delay:160ms] sm:text-[34px]">
          Verify contacts from <RotatingSource />
        </p>
        <p className="rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted [animation-delay:240ms] sm:text-lg">
          Manage contacts, verification lists, call evidence, and connected CRM synchronization from one workspace.
        </p>
        <div className="rise mt-8 flex flex-wrap justify-center gap-3 [animation-delay:320ms]">
          <Link href="/signup" className={buttonClass("primary", "md", "h-12 rounded-full px-7 text-[15px]")}>Get started <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link href="/login" className={buttonClass("ghost", "md", "h-12 rounded-full bg-surface/70 px-7 text-[15px] backdrop-blur")}>Log in</Link>
        </div>
      </div>
    </div>

    <div ref={stage} className="relative z-10 mx-auto -mt-[18vw] max-w-6xl px-3 [perspective:1600px] sm:px-6 lg:-mt-[220px]" style={{ "--p": 0 } as CSSProperties}>
      <div className="window-up">
        <div className="origin-top transition-transform duration-100 will-change-transform" style={{ transform: "rotateX(calc((1 - var(--p)) * 14deg)) scale(calc(0.93 + var(--p) * 0.07))" }}>
          <div className="relative">
            <div className="rounded-[30px] border border-white/70 bg-white/35 p-2 shadow-[0_50px_100px_-40px_rgba(21,34,56,0.45)] backdrop-blur-xl sm:p-3 dark:border-white/10 dark:bg-white/[0.04]">{preview}</div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}

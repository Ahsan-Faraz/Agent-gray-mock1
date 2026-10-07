"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { LpButton } from "./LpButton";

// Black hero: grid, soft spotlight, two-tone headline and the connect-rate
// claim. The dashboard preview overlaps into the white section below and
// straightens as the page scrolls.
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

  return <section className="relative" id="top">
    <div className="lp-dark dark relative isolate overflow-hidden pb-[24vw] pt-[72px] lg:pb-[300px]">
      <div className="lp-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" aria-hidden="true" />
      {/* Spotlight and a large soft arc, like light across a curved surface */}
      <span className="pointer-events-none absolute left-1/2 top-[-30%] -z-10 h-[900px] w-[1400px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,255,255,0.13),transparent)]" aria-hidden="true" />
      <span className="drift pointer-events-none absolute -right-[20%] bottom-[-40%] -z-10 size-[900px] rounded-full border-[90px] border-white/[0.025]" aria-hidden="true" />
      <span className="drift pointer-events-none absolute left-[15%] top-[45%] -z-10 size-[380px] rounded-full bg-brand-500/20 blur-[120px] [animation-delay:-7s]" aria-hidden="true" />

      <div className="mx-auto max-w-5xl px-5 pt-16 text-center sm:pt-24">
        <p className="rise inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium text-white/80">
          <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-70" /><span className="relative inline-flex size-2 rounded-full bg-brand-500" /></span>
          Contact verification workspace
        </p>
        <h1 className="rise mt-7 text-[44px] font-medium leading-[1.02] tracking-[-0.045em] text-white [animation-delay:80ms] sm:text-7xl lg:text-[84px]">
          Know Who To Call<br /><span className="text-white/45">Before You Call</span>
        </h1>
        <p className="rise mt-6 text-2xl font-medium tracking-tight text-white [animation-delay:160ms] sm:text-[34px]">
          Increase your connect rate by <span className="text-brand-500">20-30%</span>
        </p>
        <p className="rise mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 [animation-delay:240ms] sm:text-lg">
          Manage contacts, verification lists, call evidence, and connected CRM synchronization from one workspace.
        </p>
        <div className="rise mt-9 flex flex-wrap justify-center gap-3 [animation-delay:320ms]">
          <LpButton href="/signup" onDark>Get started</LpButton>
          <LpButton href="/login" onDark variant="outline" arrow={false}>Log in</LpButton>
        </div>
      </div>
    </div>

    <div ref={stage} className="relative z-10 mx-auto -mt-[20vw] max-w-6xl px-3 [perspective:1600px] sm:px-6 lg:-mt-[250px]" style={{ "--p": 0 } as CSSProperties}>
      <div className="window-up">
        <div className="origin-top transition-transform duration-100 will-change-transform" style={{ transform: "rotateX(calc((1 - var(--p)) * 14deg)) scale(calc(0.93 + var(--p) * 0.07))" }}>
          <div className="rounded-[30px] border border-white/15 bg-white/[0.06] p-2 shadow-[0_60px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-3">{preview}</div>
        </div>
      </div>
    </div>
  </section>;
}

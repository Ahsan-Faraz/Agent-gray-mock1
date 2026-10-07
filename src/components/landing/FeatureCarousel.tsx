"use client";

import clsx from "clsx";
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Download, Globe2, Mic, ShieldCheck } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { CsvMark } from "./BrandLogos";

// Small illustrated panels, built from the same pieces as the app's UI.
function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("relative h-56 overflow-hidden rounded-2xl border border-line bg-linear-to-br from-brand-50 via-surface-2 to-surface p-4", className)} aria-hidden="true">{children}</div>;
}

const CARDS: Array<{ title: string; body: string; art: ReactNode }> = [
  {
    title: "Upload a CSV",
    body: "Headers may use phone, contact, or number. First and last name become the full name; city and state become location.",
    art: <Panel>
      <div className="float-y mx-auto w-[88%] rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 text-xs font-bold text-navy"><CsvMark className="h-5 w-4" />open-house-lakeview.csv</div>
        <div className="mt-3 grid grid-cols-3 gap-1.5 text-[10px]">
          {["first_name", "last_name", "phone", "Olivia", "Martinez", "+1 512…", "Liam", "Brown", "+1 303…"].map((cell, index) => <span key={index} className={clsx("truncate rounded-md px-1.5 py-1", index < 3 ? "bg-brand-50 font-semibold text-brand-ink" : "bg-surface-2 text-muted")}>{cell}</span>)}
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-4 h-2 overflow-hidden rounded-full bg-line"><span className="block h-full w-1/2 rounded-full bg-brand-500" style={{ animation: "sweep 2.4s ease-in-out infinite" }} /></div>
    </Panel>,
  },
  {
    title: "Timezone review",
    body: "Calls run between 09:00 and 20:00 in each receiver's timezone. Anything unclear waits for your confirmation.",
    art: <Panel>
      <div className="grid gap-2">
        {[["Olivia Johnson", "America/Chicago", "Resolved", "bg-good-soft text-good-ink"], ["Noah Davis", "America/Denver", "Resolved", "bg-good-soft text-good-ink"], ["Ava Wilson", "Choose a timezone", "Needs review", "bg-warn-soft text-warn-ink"]].map(([name, zone, state, tone], index) => <div key={name} className={clsx("flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-[var(--shadow-card)]", index === 2 && "float-y")}>
          <Globe2 size={15} className="shrink-0 text-brand-ink" />
          <span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold text-navy">{name}</span><span className="block text-[10px] text-muted">{zone}</span></span>
          <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold", tone)}>{state}</span>
        </div>)}
      </div>
    </Panel>,
  },
  {
    title: "Schedule list",
    body: "Start a list now or pick a weekday to run it. Sundays are closed.",
    art: <Panel>
      <div className="mx-auto w-[80%] rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 text-xs font-bold text-navy"><CalendarDays size={15} className="text-brand-ink" />October 2026</div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px]">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={index} className="font-semibold text-subtle">{day}</span>)}
          {Array.from({ length: 21 }, (_, index) => {
            const day = index + 4;
            return <span key={day} className={clsx("rounded-md py-1 tabular-nums", index % 7 === 0 ? "text-subtle line-through" : "text-ink", day === 7 && "bg-brand-500 font-bold text-white ring-4 ring-brand-100")}>{day}</span>;
          })}
        </div>
      </div>
      <span className="float-y absolute bottom-4 right-5 inline-flex items-center gap-1.5 rounded-full bg-purple-soft px-3 py-1 text-[11px] font-semibold text-purple-ink"><Clock3 size={12} />Scheduled</span>
    </Panel>,
  },
  {
    title: "Priority tiers",
    body: "Every processed contact is ranked so your team knows who to call first.",
    art: <Panel>
      <div className="grid gap-2">
        {[["P1 - Likely Answer", "bg-good-soft text-good-ink", "92%"], ["P2 - Likely Voicemail", "bg-purple-soft text-purple-ink", "70%"], ["P3 - Likely Unreachable", "bg-warn-soft text-warn-ink", "46%"], ["P4 - Others", "bg-neutral-soft text-neutral-ink", "24%"]].map(([label, tone, width], index) => <div key={label} className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2">
          <span className={clsx("w-36 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", tone)}>{label}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"><span className="block h-full rounded-full bg-brand-500 transition-all duration-700 group-hover:opacity-80" style={{ width, transitionDelay: `${index * 80}ms` }} /></span>
        </div>)}
      </div>
    </Panel>,
  },
  {
    title: "Call evidence",
    body: "Review calls, snapshots, and audit history for every contact you process.",
    art: <Panel>
      <div className="mx-auto w-[88%] rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-full bg-brand-500 text-white"><Mic size={15} /></span><span className="text-xs font-bold text-navy">Call attempt · Completed</span></div>
        <div className="mt-3 flex h-10 items-center gap-[3px]">
          {Array.from({ length: 36 }, (_, index) => <span key={index} className="w-full rounded-full bg-brand-500/70" style={{ height: `${30 + ((index * 37) % 70)}%`, animation: `bars ${0.9 + (index % 5) * 0.18}s ease-in-out ${index * 0.04}s infinite` }} />)}
        </div>
      </div>
      <div className="float-y absolute bottom-4 left-6 right-6 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-[11px]"><ShieldCheck size={14} className="text-good-ink" /><span className="font-semibold text-navy">Verified</span><span className="ml-auto tabular-nums text-muted">Confidence 94%</span></div>
    </Panel>,
  },
  {
    title: "Generate list report",
    body: "The downloaded report combines results and usage-based cost for the selected lists, with the CSV columns you choose.",
    art: <Panel>
      <div className="mx-auto grid w-[88%] gap-1.5">
        {["Contact Name", "Mobile Phone Number", "Priority / Classification", "Outcome Explanation"].map((column, index) => <span key={column} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-[11px] text-navy">
          <span className={clsx("grid size-4 place-items-center rounded border", index < 3 ? "border-brand-500 bg-brand-500 text-white" : "border-line-strong")}>{index < 3 && "✓"}</span>{column}
        </span>)}
      </div>
      <span className="float-y absolute bottom-4 right-5 inline-flex items-center gap-1.5 rounded-xl bg-linear-to-b from-[#3d69ef] to-[#2b55dd] px-3 py-2 text-[11px] font-semibold text-white shadow-[0_6px_16px_-6px_rgba(49,94,234,0.6)]"><Download size={13} />Generate report</span>
    </Panel>,
  },
];

// Horizontally scrolling cards with arrow controls (drag/swipe works natively).
export function FeatureCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const move = (direction: number) => {
    const element = track.current;
    if (!element) return;
    const card = element.querySelector("article");
    element.scrollBy({ left: direction * ((card?.clientWidth ?? 320) + 20), behavior: "smooth" });
  };
  return <div>
    <div className="mx-auto mb-6 flex max-w-7xl justify-end gap-2 px-4 sm:px-6">
      <button onClick={() => move(-1)} className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-navy transition hover:border-brand-500 hover:text-brand-ink" aria-label="Previous"><ArrowLeft size={18} aria-hidden="true" /></button>
      <button onClick={() => move(1)} className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-navy transition hover:border-brand-500 hover:text-brand-ink" aria-label="Next"><ArrowRight size={18} aria-hidden="true" /></button>
    </div>
    <div ref={track} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 [scrollbar-width:none] sm:px-6 xl:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
      {CARDS.map((card) => <article key={card.title} className="group lift w-[82vw] max-w-[360px] shrink-0 snap-start rounded-3xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]">
        {card.art}
        <div className="px-2 pb-3 pt-5">
          <h3 className="text-xl font-bold tracking-tight text-navy">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
        </div>
      </article>)}
    </div>
  </div>;
}

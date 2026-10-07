"use client";

import clsx from "clsx";
import { Check, Clock3, Download, FileClock, Loader2, PhoneCall, Search, Users } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Donut } from "@/components/premium";
import { StatusBadge } from "@/components/ui";
import { number, percent } from "@/lib/format";
import type { ContactList } from "@/lib/types";
import { AttioMark, CsvMark, HighLevelMark, HubSpotMark } from "./BrandLogos";

type Person = { name: string; phone: string; outcome: string };

const STEPS = [
  { title: "Bring in contacts", body: "Add contacts manually, import CSV, or sync a connected CRM from Integrations." },
  { title: "Create a list", body: "Create a list from durable contacts. Choose new contacts, or rerun processed ones." },
  { title: "Start the list", body: "Start the list and monitor its persisted progress. Each contact accepted for processing reserves one credit." },
  { title: "Review results", body: "Review calls, snapshots, and audit history, then send results back to your CRM." },
];

function Window({ title, icon, badge, children }: { title: string; icon: ReactNode; badge?: ReactNode; children: ReactNode }) {
  return <div className="pop-in w-full min-w-0 max-w-[440px] overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_60px_-28px_rgba(21,34,56,0.45)]">
    <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
      <span className="grid size-7 place-items-center rounded-lg bg-brand-50 text-brand-ink">{icon}</span>
      <span className="flex-1 truncate text-sm font-bold text-navy">{title}</span>
      {badge}
    </div>
    {children}
  </div>;
}

// Step 1: sources stream into the contacts store.
function ImportVisual({ contacts, people }: { contacts: number; people: Person[] }) {
  const sources = [HubSpotMark, HighLevelMark, AttioMark, CsvMark];
  return <div className="flex w-full max-w-[520px] items-center gap-1 sm:gap-2">
    <div className="grid shrink-0 gap-3">
      {sources.map((Mark, index) => <span key={index} className="pop-in grid size-10 place-items-center rounded-xl border border-line bg-surface p-2 shadow-[var(--shadow-card)] sm:size-14 sm:rounded-2xl sm:p-3" style={{ animationDelay: `${index * 90}ms` }}><Mark className="size-full" /></span>)}
    </div>
    <svg viewBox="0 0 80 260" className="h-[260px] w-6 shrink-0 sm:w-20" preserveAspectRatio="none" aria-hidden="true">
      {[32, 99, 166, 233].map((y) => <path key={y} d={`M0 ${y} C 45 ${y}, 35 130, 80 130`} fill="none" stroke="var(--brand-500)" strokeWidth="1.6" strokeDasharray="4 6" style={{ animation: "flow-dash 1.2s linear infinite" }} vectorEffect="non-scaling-stroke" />)}
    </svg>
    <Window title="Contacts" icon={<Users size={15} />}>
      <div className="px-4 pt-4">
        <strong className="block text-4xl font-bold tracking-tight tabular-nums text-navy">{number(contacts)}</strong>
        <span className="text-xs text-muted">durable contacts in your workspace</span>
      </div>
      <ul className="mt-3 border-t border-line">
        {people.slice(0, 4).map((person, index) => <li key={person.phone} className="pop-in flex items-center gap-3 border-b border-line px-4 py-2.5 text-xs last:border-0" style={{ animationDelay: `${300 + index * 140}ms` }}>
          <span className="grid size-7 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-ink">{person.name.split(" ").map((part) => part[0]).join("")}</span>
          <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-navy">{person.name}</span><span className="block tabular-nums text-muted">{person.phone}</span></span>
          <span className="hidden rounded-full bg-neutral-soft px-2 py-0.5 text-[10px] font-semibold text-neutral-ink sm:inline">Never processed</span>
        </li>)}
      </ul>
    </Window>
  </div>;
}

// Step 2: a list being assembled.
function ListVisual({ list, people }: { list: ContactList; people: Person[] }) {
  return <Window title="New list" icon={<FileClock size={15} />}>
    <div className="grid gap-3 p-4">
      <div>
        <span className="text-[11px] font-semibold text-muted">List name</span>
        <div className="mt-1 rounded-xl border border-brand-500 bg-surface px-3 py-2 text-sm font-semibold text-navy ring-4 ring-brand-500/10">{list.name}<span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-brand-500" /></div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <span className="rounded-xl border-2 border-brand-500 bg-brand-50 p-2.5"><strong className="block text-navy">New contacts</strong><span className="text-muted">No prior verification snapshot.</span></span>
        <span className="rounded-xl border border-line p-2.5"><strong className="block text-navy">Rerun processed</strong><span className="text-muted">Re-execute contacts with prior results.</span></span>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-xs text-subtle"><Search size={13} />Search contacts</div>
      <ul className="grid gap-1.5">
        {people.slice(0, 3).map((person, index) => <li key={person.phone} className="pop-in flex items-center gap-2.5 text-xs" style={{ animationDelay: `${200 + index * 160}ms` }}>
          <span className="grid size-4 place-items-center rounded bg-brand-500 text-white"><Check size={11} strokeWidth={3} /></span>
          <span className="flex-1 font-semibold text-navy">{person.name}</span>
          <span className="tabular-nums text-muted">{person.phone}</span>
        </li>)}
      </ul>
    </div>
    <div className="flex items-center justify-between border-t border-line bg-surface-2 px-4 py-3 text-xs">
      <span className="text-muted">Credits required</span>
      <strong className="text-base tabular-nums text-navy">{number(list.contact_count)}</strong>
    </div>
  </Window>;
}

// Step 3: a running list, calls resolving one by one.
function RunVisual({ list, people }: { list: ContactList; people: Person[] }) {
  return <Window title={list.name} icon={<PhoneCall size={15} />} badge={<span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-ink"><span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500" /><span className="relative inline-flex size-1.5 rounded-full bg-brand-500" /></span>Running</span>}>
    <div className="px-4 pt-4">
      <div className="flex justify-between text-xs"><span className="text-muted">Progress</span><span className="font-semibold text-navy">{number(list.contact_count)} contacts</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-100"><div className="h-full origin-left rounded-full bg-linear-to-r from-[#6b8ff6] to-brand-600" style={{ animation: "fill-x 4s cubic-bezier(0.4,0,0.2,1) infinite" }} /></div>
    </div>
    <ul className="mt-4 border-t border-line">
      {people.slice(0, 4).map((person, index) => <li key={person.phone} className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-xs last:border-0">
        <span className="min-w-0 flex-1"><span className="block truncate font-semibold text-navy">{person.name}</span><span className="block tabular-nums text-muted">{person.phone}</span></span>
        {index < 3
          ? <span className="pop-in" style={{ animationDelay: `${500 + index * 650}ms` }}><StatusBadge value={person.outcome} /></span>
          : <span className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,var(--brand-50),var(--brand-100),var(--brand-50))] bg-[length:200%_100%] px-2.5 py-1 text-[11px] font-semibold text-brand-ink" style={{ animation: "shimmer 1.6s linear infinite" }}><Loader2 size={11} className="animate-spin" />Running</span>}
      </li>)}
    </ul>
    <p className="flex items-center gap-2 border-t border-line bg-surface-2 px-4 py-3 text-[11px] text-muted"><Clock3 size={13} className="shrink-0 text-brand-ink" />Calls run between 09:00 and 20:00 in each receiver&apos;s timezone.</p>
  </Window>;
}

// Step 4: outcomes, evidence and the CRM hand-off.
function ResultsVisual({ list }: { list: ContactList }) {
  const segments = [
    { label: "Verified", value: list.verified_count, color: "var(--good)" },
    { label: "No engagement", value: list.no_engagement_count, color: "var(--warn)" },
    { label: "Wrong person", value: list.wrong_person_count, color: "var(--bad)" },
    { label: "Failures", value: list.failure_count, color: "var(--subtle)" },
  ];
  return <div className="relative w-full max-w-[440px]">
    <Window title="Results" icon={<Check size={15} />} badge={<StatusBadge value="completed" />}>
      <div className="flex items-center gap-5 p-4">
        <Donut size={116} stroke={12} segments={segments} center={<strong className="block text-2xl font-bold tabular-nums text-navy">{percent(list.verified_count, list.processed_count)}%</strong>} caption="Verified" />
        <ul className="grid flex-1 gap-2 text-xs">
          {segments.map((segment) => <li key={segment.label} className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: segment.color }} /><span className="flex-1 text-muted">{segment.label}</span><strong className="tabular-nums text-navy">{segment.value}</strong></li>)}
        </ul>
      </div>
      <ol className="grid gap-2.5 border-t border-line px-4 py-3.5 text-xs">
        {["Call attempt completed", "Verification snapshot saved", "Results exported to HubSpot"].map((event, index) => <li key={event} className="pop-in flex items-center gap-2.5" style={{ animationDelay: `${300 + index * 220}ms` }}>
          <span className="grid size-5 place-items-center rounded-full bg-good-soft text-good-ink"><Check size={11} strokeWidth={3} /></span>
          <span className="flex-1 text-navy">{event}</span>
        </li>)}
      </ol>
    </Window>
    <span className="float-y pop-in absolute -right-3 -top-5 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-navy shadow-[var(--shadow-pop)] [animation-delay:900ms] sm:-right-8"><HubSpotMark className="size-4" />Result export</span>
    <span className="float-y pop-in absolute -bottom-5 -left-3 inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-navy shadow-[var(--shadow-pop)] [animation-delay:1100ms] sm:-left-8"><Download size={14} className="text-brand-ink" />Generate list report</span>
  </div>;
}

export function HowItWorks({ contacts, list, people, cta }: { contacts: number; list: ContactList; people: Person[]; cta?: ReactNode }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLLIElement | null>>([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
      });
    }, { rootMargin: "-48% 0px -48% 0px" });
    refs.current.forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const visuals = [
    <ImportVisual key="import" contacts={contacts} people={people} />,
    <ListVisual key="list" list={list} people={people} />,
    <RunVisual key="run" list={list} people={people} />,
    <ResultsVisual key="results" list={list} />,
  ];

  return <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
    <div>
    <ol className="relative">
      {/* Progress rail */}
      <span className="absolute bottom-0 left-[23px] top-0 hidden w-[2px] rounded-full bg-line lg:block" aria-hidden="true">
        <span className="block w-full rounded-full bg-black transition-all duration-700" style={{ height: `${((active + 1) / STEPS.length) * 100}%` }} />
      </span>
      {STEPS.map((step, index) => {
        const on = index === active;
        return <li key={step.title} ref={(element) => { refs.current[index] = element; }} data-step={index} className="relative flex flex-col justify-center py-6 lg:min-h-[62vh] lg:py-0">
          <div className={clsx("flex gap-5 transition-all duration-500", on ? "opacity-100" : "lg:opacity-35")}>
            <span className={clsx("relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl text-lg font-bold transition-all duration-500", on ? "bg-black text-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)]" : "border border-line-strong bg-surface text-muted")}>{index + 1}</span>
            <div>
              <p className="text-sm font-medium text-subtle">Step {index + 1}</p>
              <h3 className="mt-1.5 text-2xl font-medium tracking-tight text-navy sm:text-3xl">{step.title}</h3>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">{step.body}</p>
            </div>
          </div>
          {/* Phones and tablets: the visual sits under its step. */}
          <div className="lp-dark dark lp-grid mt-6 grid place-items-center overflow-hidden rounded-3xl px-4 py-10 lg:hidden">{visuals[index]}</div>
        </li>;
      })}
    </ol>
    {cta && <div className="mt-4 flex justify-center lg:-mt-[18vh] lg:justify-start lg:pl-[68px]">{cta}</div>}
    </div>

    {/* Desktop: one pinned stage that swaps visuals as the steps scroll. */}
    <div className="hidden lg:block">
      <div className="lp-dark dark sticky top-[calc(50vh-280px)] h-[560px] overflow-hidden rounded-[32px] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]">
        <div className="lp-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" aria-hidden="true" />
        <span className="drift pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-brand-500/15 blur-[80px]" aria-hidden="true" />
        <span className="drift pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-white/[0.06] blur-[80px] [animation-delay:-7s]" aria-hidden="true" />
        <div className="absolute left-6 top-5 flex gap-1.5" aria-hidden="true">
          {STEPS.map((step, index) => <span key={step.title} className={clsx("h-1.5 rounded-full transition-all duration-500", index === active ? "w-8 bg-white" : "w-1.5 bg-white/25")} />)}
        </div>
        <div key={active} className="relative grid h-full place-items-center p-10" aria-hidden="true">{visuals[active]}</div>
      </div>
    </div>
  </div>;
}

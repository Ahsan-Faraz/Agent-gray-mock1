"use client";

import clsx from "clsx";
import { CircleCheck, CircleSlash, PhoneMissed } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui";
import { confidencePercent, humanize, number, priorityLabel } from "@/lib/format";
import type { ContactList, ListContact } from "@/lib/types";

const TABS = [
  { key: "verified", label: "Verified", icon: CircleCheck, color: "var(--good)", body: "See which contacts were confirmed at the number on file, with a confidence score for every result." },
  { key: "wrong_person", label: "Wrong person", icon: CircleSlash, color: "var(--bad)", body: "Catch numbers that reach someone else, so your team stops dialing the wrong people." },
  { key: "no_engagement", label: "No engagement", icon: PhoneMissed, color: "var(--warn)", body: "Find contacts that never picked up and include them again when you run the next list." },
] as const;

const DURATION = 5200;

// Auto-advancing outcome tabs; the active outcome's rows light up in the panel.
export function OutcomeTabs({ list, rows }: { list: ContactList; rows: ListContact[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setActive((current) => (current + 1) % TABS.length), DURATION);
    return () => clearTimeout(timer);
  }, [active, paused]);
  const tab = TABS[active];
  const counts: Record<string, number> = { verified: list.verified_count, wrong_person: list.wrong_person_count, no_engagement: list.no_engagement_count, failed: list.failure_count };
  const max = Math.max(...Object.values(counts));

  return <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="rounded-[28px] border border-white/25 bg-white/10 p-2 backdrop-blur-sm sm:p-3">
      <div className="grid gap-3 rounded-[22px] bg-surface p-3 sm:p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {/* Contacts in a processed list */}
        <div className="overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-navy">{list.name}</p>
              <p className="text-xs text-muted">{number(list.processed_count)} of {number(list.contact_count)} contacts processed</p>
            </div>
            <StatusBadge value={list.status} />
          </div>
          <ul>
            {rows.map((row) => {
              const on = row.sureconnect_outcome === tab.key;
              return <li key={row.execution_id} className={clsx("flex items-center gap-3 border-b border-line px-4 py-2.5 text-[13px] transition-all duration-500 last:border-0", on ? "bg-brand-50/60" : "opacity-45")}>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-navy">{row.contact_name}</span>
                  <span className="block text-xs tabular-nums text-muted">{row.phone_e164}</span>
                </span>
                <span className="hidden w-40 text-xs text-muted md:block">{priorityLabel(row.priority_tier)}</span>
                <span className="w-11 text-right text-xs font-semibold tabular-nums text-navy">{confidencePercent(row.confidence)}</span>
                <span className="w-28 text-right"><StatusBadge value={row.sureconnect_outcome} /></span>
              </li>;
            })}
          </ul>
        </div>
        {/* Outcome totals for the list */}
        <div className="flex flex-col rounded-2xl border border-line p-4 sm:p-5">
          <p className="text-sm font-bold text-navy">Results</p>
          <p className="text-xs text-muted">{list.name}</p>
          <div className="mt-5 flex items-end gap-2">
            <strong className="text-5xl font-bold tracking-tight tabular-nums text-navy" key={tab.key}><span className="word-in inline-block">{number(counts[tab.key])}</span></strong>
            <span className="mb-1.5 text-sm text-muted">{tab.label.toLowerCase()}</span>
          </div>
          <ul className="mt-6 grid gap-3.5">
            {Object.entries(counts).map(([key, value]) => <li key={key} className={clsx("transition-opacity duration-500", key === tab.key || "opacity-55")}>
              <div className="flex justify-between text-xs"><span className="font-semibold text-navy">{key === "failed" ? "Failures" : humanize(key)}</span><span className="tabular-nums text-muted">{number(value)}</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: TABS.find((item) => item.key === key)?.color ?? "var(--subtle)" }} />
              </div>
            </li>)}
          </ul>
        </div>
      </div>
    </div>

    <div className="mt-5 grid gap-3 md:grid-cols-3" role="tablist" aria-label="Outcomes">
      {TABS.map((item, index) => {
        const on = index === active;
        const Icon = item.icon;
        return <button key={item.key} role="tab" aria-selected={on} onClick={() => setActive(index)} className={clsx("relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300", on ? "border-white/60 bg-surface shadow-[var(--shadow-pop)]" : "border-white/20 bg-white/10 text-white hover:bg-white/15")}>
          <span className={clsx("flex items-center gap-2.5 text-xl font-bold tracking-tight", on ? "text-navy" : "text-white")}><Icon size={22} style={on ? { color: item.color } : undefined} aria-hidden="true" />{item.label}</span>
          <span className={clsx("mt-2 block text-sm leading-relaxed", on ? "text-muted" : "text-white/75")}>{item.body}</span>
          {on && <span key={`${active}-${paused}`} className="absolute inset-x-0 bottom-0 h-[3px] origin-left bg-brand-500" style={{ animation: paused ? "none" : `tab-progress ${DURATION}ms linear both` }} aria-hidden="true" />}
        </button>;
      })}
    </div>
  </div>;
}

import clsx from "clsx";
import { ContactRound, Layers3, LayoutDashboard, LifeBuoy, ListChecks, PhoneCall, Plug, Plus } from "lucide-react";
import { Donut } from "@/components/premium";
import { LogoMark } from "@/components/ui";
import { number, percent } from "@/lib/format";
import type { ContactList } from "@/lib/types";

const statusTone: Record<string, string> = {
  running: "bg-brand-50 text-brand-ink",
  scheduled: "bg-purple-soft text-purple-ink",
  completed: "bg-good-soft text-good-ink",
  cancelled: "bg-neutral-soft text-neutral-ink",
};

// A static, non-interactive replica of the real dashboard, framed in a browser
// window. Uses the same mock data the app shows.
export function ProductPreview({ lists, contacts, calls, className }: { lists: ContactList[]; contacts: number; calls: number; className?: string }) {
  const results = lists.reduce((sum, list) => ({
    verified: sum.verified + list.verified_count,
    noEngagement: sum.noEngagement + list.no_engagement_count,
    wrongPerson: sum.wrongPerson + list.wrong_person_count,
    failures: sum.failures + list.failure_count,
  }), { verified: 0, noEngagement: 0, wrongPerson: 0, failures: 0 });
  const processed = results.verified + results.noEngagement + results.wrongPerson + results.failures;
  const segments = [
    { label: "Verified", value: results.verified, color: "var(--good)" },
    { label: "No engagement", value: results.noEngagement, color: "var(--warn)" },
    { label: "Wrong person", value: results.wrongPerson, color: "var(--bad)" },
    { label: "Failures", value: results.failures, color: "var(--subtle)" },
  ];
  const running = lists.filter((list) => list.status === "running");
  const stats = [
    { label: "Contacts", value: contacts, icon: ContactRound },
    { label: "Lists", value: lists.length, icon: Layers3 },
    { label: "Call attempts", value: calls, icon: PhoneCall },
  ];

  return <div className={clsx("@container overflow-hidden rounded-[22px] border border-line-strong bg-surface shadow-[0_40px_80px_-30px_rgba(21,34,56,0.45)]", className)} aria-hidden="true" inert>
    <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-4 py-3">
      <span className="flex gap-1.5"><span className="size-3 rounded-full bg-[#ff5f57]" /><span className="size-3 rounded-full bg-[#febc2e]" /><span className="size-3 rounded-full bg-[#28c840]" /></span>
      <span className="mx-auto hidden w-full max-w-sm rounded-lg border border-line bg-surface px-3 py-1 text-center text-[11px] text-subtle @md:block">Agent Gray · Dashboard</span>
    </div>
    <div className="flex bg-canvas">
      <div className="hidden w-[78px] shrink-0 flex-col items-center gap-4 border-r border-line bg-surface py-4 @2xl:flex">
        <LogoMark size={34} />
        <span className="h-px w-8 bg-line" />
        {[LayoutDashboard, ListChecks, Plug].map((Icon, index) => <span key={index} className={clsx("grid size-9 place-items-center rounded-xl border", index === 0 ? "border-transparent bg-linear-to-b from-[#3d69ef] to-[#2448be] text-white" : "border-line text-nav")}><Icon size={16} /></span>)}
        <span className="grid size-9 place-items-center rounded-full border border-dashed border-brand-500 text-brand-ink"><Plus size={16} /></span>
        <span className="mt-auto grid size-9 place-items-center rounded-xl border border-line text-nav"><LifeBuoy size={16} /></span>
      </div>
      <div className="min-w-0 flex-1 p-4 @2xl:p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-bold tracking-tight text-navy @2xl:text-xl">Dashboard</p>
            <p className="text-xs text-muted">See what is running and what needs your attention.</p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-xl bg-linear-to-b from-[#3d69ef] to-[#2b55dd] px-3 py-2 text-xs font-semibold text-white @md:inline-flex"><Plus size={13} /> New list</span>
        </div>
        <div className="mt-4 grid gap-4 @3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="relative isolate overflow-hidden rounded-2xl bg-linear-to-br from-[#3a68f0] via-[#315eea] to-[#1d3c9e] p-4 text-white @2xl:p-5">
            <span className="absolute -right-12 -top-16 -z-10 size-44 rounded-full bg-white/10" />
            <p className="text-xs text-white/75">Workspace</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {stats.map(({ label, value, icon: Icon }) => <div key={label}>
                <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] text-white/80 @md:text-[11px]"><Icon size={12} className="hidden shrink-0 @md:block" />{label}</span>
                <strong className="mt-2 block text-lg font-bold tabular-nums @md:text-2xl @2xl:text-3xl">{number(value)}</strong>
              </div>)}
            </div>
            {running[0] && <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/12 px-3 py-2.5 ring-1 ring-white/15">
              <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7be0b6] opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-[#7be0b6]" /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold">{running[0].name}</span>
                <span className="mt-1 block h-1 overflow-hidden rounded-full bg-white/20"><span className="block h-full rounded-full bg-white" style={{ width: `${running[0].progress_percent}%` }} /></span>
              </span>
              <strong className="text-xs tabular-nums">{running[0].progress_percent}%</strong>
            </div>}
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <p className="text-sm font-bold text-navy">Results</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <Donut size={96} stroke={10} segments={segments} center={<strong className="block text-lg font-bold tabular-nums text-navy">{percent(results.verified, processed)}%</strong>} caption="Verified" />
              <ul className="grid min-w-[150px] flex-1 gap-1.5 text-[11px]">
                {segments.map((segment) => <li key={segment.label} className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: segment.color }} /><span className="flex-1 truncate text-muted">{segment.label}</span><strong className="tabular-nums text-navy">{number(segment.value)}</strong></li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
          <p className="border-b border-line px-4 py-3 text-sm font-bold text-navy">Lists</p>
          {lists.slice(0, 4).map((list) => <div key={list.id} className="flex items-center gap-3 border-b border-line px-4 py-2.5 text-xs last:border-0">
            <span className="min-w-0 flex-1 truncate font-semibold text-navy">{list.name}</span>
            <span className="hidden w-24 tabular-nums text-muted @md:block">{number(list.contact_count)} contacts</span>
            <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-line @xl:block"><span className="block h-full rounded-full bg-brand-500" style={{ width: `${list.progress_percent}%` }} /></span>
            <span className={clsx("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", statusTone[list.status])}>{list.status}</span>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}

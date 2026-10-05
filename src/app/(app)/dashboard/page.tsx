import clsx from "clsx";
import { ArrowRight, ContactRound, Layers3, PhoneCall, Plus } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { ReportButton } from "@/components/ReportButton";
import { ButtonLink, Card, EmptyState, PageHeader, Progress, StatusBadge, toneFor, td, th, type Tone } from "@/components/ui";
import { getCalls, getContacts, getLists } from "@/lib/api";
import { date, dateTime, humanize, initials, number } from "@/lib/format";

export const metadata = { title: "Dashboard · Agent Gray" };

const dotTone: Record<Tone, string> = { good: "bg-good", brand: "bg-brand-500", bad: "bg-bad", warn: "bg-warn", purple: "bg-purple", neutral: "bg-subtle" };
const tileTone = { brand: "bg-brand-50 text-brand-ink", purple: "bg-purple-soft text-purple-ink", good: "bg-good-soft text-good-ink" } as const;

function Metric({ label, value, detail, icon, tone, href }: { label: string; value: number; detail?: ReactNode; icon: ReactNode; tone: keyof typeof tileTone; href?: string }) {
  return <Card className="flex flex-col p-5">
    <div className="flex items-start justify-between gap-3">
      <span className={clsx("grid size-11 place-items-center rounded-xl", tileTone[tone])}>{icon}</span>
      {href && <Link href={href} aria-label={`View ${label.toLowerCase()}`} className="grid size-8 place-items-center rounded-full border border-line text-muted transition hover:border-brand-200 hover:text-brand-ink"><ArrowRight size={15} aria-hidden="true" /></Link>}
    </div>
    <span className="mt-4 text-[13px] font-medium text-muted">{label}</span>
    <strong className="mt-0.5 text-3xl font-bold tabular-nums tracking-tight text-navy">{number(value)}</strong>
    {detail && <span className="mt-2 border-t border-line pt-2.5 text-[13px] text-muted">{detail}</span>}
  </Card>;
}

export default async function DashboardPage() {
  const [lists, { calls, total: callTotal }, { totals }] = await Promise.all([getLists(), getCalls(), getContacts()]);
  const liveCalls = calls.filter((call) => call.telephony_provider && call.telephony_provider !== "simulated").slice(0, 6);
  const liveLists = lists.filter((list) => list.run_mode === "live").slice(0, 5);
  const running = lists.filter((list) => list.status === "running").length;
  const scheduled = lists.filter((list) => list.status === "scheduled").length;
  const callStatusCounts = Object.entries(liveCalls.reduce<Record<string, number>>((counts, call) => ({ ...counts, [call.call_status]: (counts[call.call_status] ?? 0) + 1 }), {}));

  return <>
    <PageHeader title="Dashboard" description="See what is running and what needs your attention." actions={<>
      <ReportButton lists={lists} />
      <ButtonLink href="/lists/new"><Plus size={16} aria-hidden="true" /> New list</ButtonLink>
    </>} />

    <div className="grid gap-4 lg:grid-cols-3">
      <Metric label="Contacts" value={totals.all} tone="brand" icon={<ContactRound size={20} aria-hidden="true" />} detail={<><strong className="text-ink">{number(totals.newContacts)}</strong> new · <strong className="text-ink">{number(totals.processed)}</strong> processed</>} />
      <Metric label="Lists" value={lists.length} tone="purple" href="/lists" icon={<Layers3 size={20} aria-hidden="true" />} detail={<><strong className="text-ink">{running}</strong> running · <strong className="text-ink">{scheduled}</strong> scheduled</>} />
      <Metric label="Call attempts" value={callTotal} tone="good" icon={<PhoneCall size={20} aria-hidden="true" />} detail={callStatusCounts.length ? <span className="flex flex-wrap gap-x-3 gap-y-1">{callStatusCounts.map(([status, count]) => <span key={status} className="inline-flex items-center gap-1.5"><span className={clsx("size-2 rounded-full", dotTone[toneFor(status)])} aria-hidden="true" />{humanize(status)} <strong className="text-ink">{count}</strong></span>)}</span> : undefined} />

      <Card className="overflow-hidden lg:col-span-2">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-bold text-navy">Recent calls</h2>
        </div>
        {liveCalls.length === 0 ? <EmptyState title="No calls yet" description="Live calls will appear here after a list creates call attempts." action={<ButtonLink size="sm" href="/lists/new">Create a list</ButtonLink>} /> : <>
          <ul className="divide-y divide-line sm:hidden">
            {liveCalls.map((call) => <li key={call.id} className="flex items-center gap-3 px-4 py-3.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-ink">{initials(call.contact_name || "?")}</span>
              <div className="min-w-0 flex-1"><strong className="block truncate text-sm text-navy">{call.contact_name || "Unknown contact"}</strong><span className="text-[13px] text-muted">{call.final_disposition ? humanize(call.final_disposition) : "—"}</span></div>
              <StatusBadge value={call.call_status} />
            </li>)}
          </ul>
          <div className="relative hidden overflow-x-auto sm:block">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line bg-canvas/60"><th className={th}>Contact</th><th className={th}>Status</th><th className={th}>Outcome</th><th className={`${th} text-right`}>Updated</th></tr></thead>
              <tbody>{liveCalls.map((call) => <tr key={call.id} className="border-b border-line last:border-0">
                <td className={td}><div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-ink">{initials(call.contact_name || "?")}</span>
                  <span className="min-w-0"><strong className="block whitespace-nowrap font-semibold text-navy">{call.contact_name || "Unknown contact"}</strong><small className="text-[13px] tabular-nums text-muted">{call.phone_e164 || "Phone unavailable"}</small></span>
                </div></td>
                <td className={td}><StatusBadge value={call.call_status} /></td>
                <td className={td}>{call.final_disposition ? <span className="inline-flex items-center gap-2"><span className={clsx("size-2 rounded-full", dotTone[toneFor(call.final_disposition)])} aria-hidden="true" />{humanize(call.final_disposition)}</span> : "—"}</td>
                <td className={`${td} whitespace-nowrap text-right text-muted`}>{dateTime(call.updated_at)}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </>}
      </Card>

      <Card className="flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-bold text-navy">Recent lists</h2>
          <ButtonLink href="/lists" variant="ghost" size="sm">View lists</ButtonLink>
        </div>
        {liveLists.length === 0 ? <EmptyState title="No live lists yet" description="Live lists will appear here after you create one." /> : <ul className="divide-y divide-line">
          {liveLists.map((list) => <li key={list.id}>
            <Link href={`/lists/${list.id}`} className="block px-5 py-3.5 transition hover:bg-nav-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><strong className="block truncate text-sm text-navy">{list.name || `List #${list.id}`}</strong><span className="text-xs text-muted">{number(list.contact_count)} contacts · Created {date(list.created_at)}</span></div>
                <StatusBadge value={list.status} />
              </div>
              <div className="mt-2.5 flex items-center gap-2.5"><Progress value={list.progress_percent} className="h-1.5 flex-1" /><span className="w-9 text-right text-xs font-semibold tabular-nums">{list.progress_percent}%</span></div>
            </Link>
          </li>)}
        </ul>}
      </Card>
    </div>
  </>;
}
